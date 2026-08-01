import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { validatesBrowserRenderReceipt } from "./validates-gallery-artifacts.js";

export async function capturesBrowserRenders({
  manifest,
  plan,
  outputDirectory,
  baseUrl,
  previewPolicy,
  cspPolicy,
  chromiumType = chromium,
}) {
  const previewItems = manifest.items.filter((item) => item.previewRoute !== null);
  const planItemByEntryPathId = new Map(plan.items.map((item) => [item.entryPathId, item]));
  const proofDirectory = path.join(path.resolve(outputDirectory), "browser-proof");
  await mkdir(proofDirectory, { recursive: true });
  if (previewItems.length === 0) return Object.freeze({ receipts: Object.freeze([]), emittedFiles: Object.freeze([]), browserAvailable: true });

  let browser;
  try {
    browser = await chromiumType.launch({ headless: true });
  } catch {
    const receipts = [];
    const emittedFiles = [];
    for (const item of previewItems) {
      const planItem = requiresPlanItem(item, planItemByEntryPathId);
      const receipt = buildsUnevaluatedReceipt({ manifest, plan, item, planItem, previewPolicy, cspPolicy });
      await validatesBrowserRenderReceipt(receipt);
      receipts.push(receipt);
      emittedFiles.push(await writesReceipt(proofDirectory, receipt));
    }
    return Object.freeze({ receipts: Object.freeze(receipts), emittedFiles: Object.freeze(emittedFiles), browserAvailable: false });
  }

  const receipts = [];
  const emittedFiles = [];
  try {
    for (const item of previewItems) {
      const planItem = requiresPlanItem(item, planItemByEntryPathId);
      const result = await capturesOneItem({
        browser,
        browserVersion: browser.version(),
        manifest,
        plan,
        item,
        planItem,
        proofDirectory,
        baseUrl,
        previewPolicy,
        cspPolicy,
      });
      await validatesBrowserRenderReceipt(result.receipt);
      receipts.push(result.receipt);
      emittedFiles.push(...result.emittedFiles);
      emittedFiles.push(await writesReceipt(proofDirectory, result.receipt));
    }
  } finally {
    await browser.close();
  }
  emittedFiles.sort((left, right) => left.path.localeCompare(right.path));
  return Object.freeze({ receipts: Object.freeze(receipts), emittedFiles: Object.freeze(emittedFiles), browserAvailable: true });
}

async function capturesOneItem({ browser, browserVersion, manifest, plan, item, planItem, proofDirectory, baseUrl, previewPolicy, cspPolicy }) {
  const viewport = previewPolicy.viewports[0];
  const timeoutMs = previewPolicy.timeoutMs;
  const startedAt = performance.now();
  const requestsAttempted = [];
  const requestKeys = new Set();
  const consoleErrors = [];
  const pageErrors = [];
  const emittedFiles = [];
  let navigationMs = null;
  let screenshotDigest = null;
  let ariaSnapshotDigest = null;
  let navigationResponse = null;
  let ariaSnapshot = null;
  let screenshot = null;
  let context;
  let page;

  try {
    const allowedOrigin = new URL(baseUrl).origin;
    const previewUrl = new URL(item.previewRoute, `${allowedOrigin}/`).href;
    context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      javaScriptEnabled: false,
      serviceWorkers: "block",
      acceptDownloads: false,
    });
    await context.clearPermissions();
    await context.route("**/*", async (route) => {
      const url = route.request().url();
      const allowed = safelyReadsOrigin(url) === allowedOrigin;
      recordsRequest(requestsAttempted, requestKeys, url, allowed ? "allowed" : "blocked");
      if (allowed) await route.continue();
      else await route.abort("blockedbyclient");
    });
    page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(redactsBrowserMessage(message.text()));
    });
    page.on("pageerror", (error) => pageErrors.push(redactsBrowserMessage(error.message)));

    const navigationStartedAt = performance.now();
    navigationResponse = await page.goto(previewUrl, { waitUntil: "load", timeout: timeoutMs });
    navigationMs = performance.now() - navigationStartedAt;

    const externalReferences = await page.locator("[src], [href], form[action]").evaluateAll((elements) => elements
      .flatMap((element) => ["src", "href", "action"].map((attribute) => element.getAttribute(attribute)).filter(Boolean))
      .map((value) => {
        try { return new URL(value, document.baseURI).href; } catch { return null; }
      })
      .filter((value) => value !== null && /^https?:/i.test(value) && new URL(value).origin !== location.origin));
    for (const url of externalReferences) recordsRequest(requestsAttempted, requestKeys, url, "blocked");

    const scriptElementCount = await page.locator("script").count();
    const hasBody = await page.locator("body").count() === 1;
    const formCount = await page.locator("form").count();
    let formSubmissionStayedPut = true;
    if (formCount > 0) {
      const beforeUrl = page.url();
      await page.locator("form").first().evaluate((form) => {
        try { form.requestSubmit(); } catch { /* sandbox/CSP rejection is the intended posture */ }
      });
      await page.waitForTimeout(50);
      formSubmissionStayedPut = page.url() === beforeUrl;
    }

    ariaSnapshot = await page.locator("body").ariaSnapshot({ timeout: timeoutMs });
    ariaSnapshotDigest = hashBytes(ariaSnapshot);
    screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
    screenshotDigest = hashBytes(screenshot);

    const artifactStem = shortHash(item.galleryItemId);
    const ariaPath = path.join(proofDirectory, `${artifactStem}.aria.yml`);
    const screenshotPath = path.join(proofDirectory, `${artifactStem}.png`);
    await writeFile(ariaPath, ariaSnapshot, "utf8");
    await writeFile(screenshotPath, screenshot);
    emittedFiles.push(buildsEmittedFile(proofDirectory, ariaPath, ariaSnapshot));
    emittedFiles.push(buildsEmittedFile(proofDirectory, screenshotPath, screenshot));

    const domAssertions = Object.freeze([
      Object.freeze({ assertion: "navigation-returned-http-200", passed: navigationResponse?.status() === 200 }),
      Object.freeze({ assertion: "document-has-one-body", passed: hasBody }),
      Object.freeze({ assertion: "materialized-document-has-no-script-elements", passed: scriptElementCount === 0 }),
      Object.freeze({ assertion: "preview-csp-denies-forms-and-enables-sandbox", passed: cspPolicy.includes("form-action 'none'") && cspPolicy.includes("sandbox") }),
      Object.freeze({ assertion: "form-submission-did-not-navigate", passed: formSubmissionStayedPut }),
      Object.freeze({ assertion: "external-document-references-recorded-as-blocked", passed: externalReferences.every((url) => requestsAttempted.some((request) => request.url === url && request.disposition === "blocked")) }),
    ]);
    const hasFailedAssertion = domAssertions.some((assertion) => !assertion.passed);
    const hasLimitations = planItem.reproductionDisposition === "PARTIAL_STATIC_REPRODUCTION"
      || requestsAttempted.some((request) => request.disposition === "blocked")
      || consoleErrors.length > 0;
    const verdict = hasFailedAssertion || pageErrors.length > 0
      ? "BLOCKED"
      : hasLimitations ? "RENDERED_WITH_LIMITATIONS" : "RENDERED_STATIC_VERIFIED";
    const receipt = buildsReceipt({
      manifest,
      plan,
      item,
      planItem,
      browserName: "chromium",
      browserVersion,
      viewport,
      cspPolicy,
      sandboxTokens: previewPolicy.sandboxTokens,
      requestsAttempted,
      consoleErrors,
      pageErrors,
      domAssertions,
      ariaSnapshotDigest,
      screenshotDigest,
      navigationMs,
      totalMs: performance.now() - startedAt,
      verdict,
    });
    return { receipt, emittedFiles };
  } catch (error) {
    const receipt = buildsReceipt({
      manifest,
      plan,
      item,
      planItem,
      browserName: "chromium",
      browserVersion,
      viewport,
      cspPolicy,
      sandboxTokens: previewPolicy.sandboxTokens,
      requestsAttempted,
      consoleErrors,
      pageErrors: [...pageErrors, redactsBrowserMessage(error.message)],
      domAssertions: [Object.freeze({ assertion: "browser-capture-completed", passed: false })],
      ariaSnapshotDigest,
      screenshotDigest,
      navigationMs,
      totalMs: performance.now() - startedAt,
      verdict: "BLOCKED",
    });
    return { receipt, emittedFiles };
  } finally {
    if (context !== undefined) await context.close();
  }
}

function buildsUnevaluatedReceipt({ manifest, plan, item, planItem, previewPolicy, cspPolicy }) {
  return buildsReceipt({
    manifest,
    plan,
    item,
    planItem,
    browserName: null,
    browserVersion: null,
    viewport: previewPolicy.viewports[0] ?? null,
    cspPolicy,
    sandboxTokens: previewPolicy.sandboxTokens,
    requestsAttempted: [],
    consoleErrors: [],
    pageErrors: [],
    domAssertions: [Object.freeze({ assertion: "chromium-launchable", passed: false })],
    ariaSnapshotDigest: null,
    screenshotDigest: null,
    navigationMs: null,
    totalMs: null,
    verdict: "NOT_EVALUATED",
  });
}

function buildsReceipt({ manifest, plan, item, planItem, browserName, browserVersion, viewport, cspPolicy, sandboxTokens, requestsAttempted, consoleErrors, pageErrors, domAssertions, ariaSnapshotDigest, screenshotDigest, navigationMs, totalMs, verdict }) {
  const body = {
    receiptType: "browser-render-receipt.v1",
    manifestId: manifest.manifestId,
    planId: plan.planId,
    planItemId: planItem.itemId,
    galleryItemId: item.galleryItemId,
    previewRoute: item.previewRoute,
    browser: Object.freeze({ name: browserName, version: browserVersion }),
    os: `${os.platform()}-${os.release()}-${os.arch()}`,
    viewport: viewport === null ? null : Object.freeze({ width: viewport.width, height: viewport.height }),
    cspPolicy,
    sandboxTokens: Object.freeze([...(sandboxTokens ?? [])]),
    requestsAttempted: Object.freeze(requestsAttempted.map((request) => Object.freeze({ ...request }))),
    consoleErrors: Object.freeze([...consoleErrors]),
    pageErrors: Object.freeze([...pageErrors]),
    domAssertions: Object.freeze(domAssertions.map((assertion) => Object.freeze({ ...assertion }))),
    ariaSnapshotDigest,
    screenshotDigest,
    timings: Object.freeze({ navigationMs, totalMs }),
    verdict,
  };
  return Object.freeze({ ...body, receiptId: hashText(canonicalizesJson(body)) });
}

function requiresPlanItem(item, planItemByEntryPathId) {
  const planItem = planItemByEntryPathId.get(item.pathId);
  if (planItem === undefined || planItem.targetRoute !== item.previewRoute) {
    throw new Error(`Manifest item '${item.galleryItemId}' has no matching preview plan item.`);
  }
  return planItem;
}

function recordsRequest(requests, keys, url, disposition) {
  const key = `${disposition}\0${url}`;
  if (keys.has(key)) return;
  keys.add(key);
  requests.push(Object.freeze({ url, disposition }));
}

function safelyReadsOrigin(url) {
  try { return new URL(url).origin; } catch { return null; }
}

function redactsBrowserMessage(message) {
  return String(message)
    .replace(/[A-Za-z]:\\[^\s)]+/g, "[local-path]")
    .replace(/file:\/\/\/[^\s)]+/g, "[local-file]")
    .slice(0, 2_000);
}

async function writesReceipt(proofDirectory, receipt) {
  const receiptPath = path.join(proofDirectory, `${shortHash(receipt.galleryItemId)}.receipt.json`);
  const content = `${JSON.stringify(receipt, null, 2)}\n`;
  await writeFile(receiptPath, content, "utf8");
  return buildsEmittedFile(proofDirectory, receiptPath, content);
}

function buildsEmittedFile(proofDirectory, absolutePath, content) {
  return Object.freeze({
    path: `browser-proof/${path.relative(proofDirectory, absolutePath).replaceAll("\\", "/")}`,
    contentHash: hashBytes(content),
  });
}

function shortHash(prefixedHash) {
  return prefixedHash.replace("sha256:", "").slice(0, 16);
}

function hashText(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function hashBytes(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function canonicalizesJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalizesJson).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizesJson(value[key])}`).join(",")}}`;
}
