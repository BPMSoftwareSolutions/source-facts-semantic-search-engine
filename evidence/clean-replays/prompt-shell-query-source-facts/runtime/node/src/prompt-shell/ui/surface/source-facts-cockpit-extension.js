// @generated
// project-id: cognitive-codebase
// feature-id: prompt-shell.query-source-facts
// scenario-id: explore-selected-folder
// obligation-id: explore-selected-folder.obligation
// responsibility-id: source-facts-query-cockpit-extension.v1.module
// projection-profile-id: javascript-command-body.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:25fdf0e88d26e77986ec3db8cf224f82028827a6ed4ed2bef8c4477f814ff1ba
// lineage-sha256: sha256:b0a004b8dfed99da38f11ab530c123c01f2015333ccf6563802959b71714f259
// body-sha256: sha256:0d7ace27bff2e461d4bc149a6f20a0ab2fc930b91b4f8ed70a88c183e95e77f4
// artifact-provenance-sha256: sha256:12bddc17e8384939c098c0857a0bf17342ec6a7f31d1df94bbac55a99d276c70
//
import { api } from './api-client.js';
import { appendEntry, replacePendingEntry } from './transcript-view.js';
import { normalizeCommandResult, formatCommandReport } from './report-formatter.js';

const analyzeButton = document.querySelector('#analyzeSelectedFile');
const actions = document.querySelector('.file-viewer-actions');
const folderButton = document.createElement('button');
folderButton.id = 'exploreSelectedFolderWithSourceFacts';
folderButton.type = 'button';
folderButton.textContent = 'Explore folder';
actions.insertBefore(folderButton, document.querySelector('#closeFileViewer'));

function selectedPath() {
  return String(document.querySelector('#fileViewerPath')?.textContent || '').trim().replaceAll('\\', '/');
}

async function runSourceFacts(scopeKind, scopePath) {
  if (!scopePath) {
    appendEntry('error', 'No source scope selected', 'Choose a code file before running SourceFacts.', null, { typewriter: true, markdown: true });
    return undefined;
  }
  const prompt = String(document.querySelector('#promptInput')?.value || '').trim();
  const pending = appendEntry('pending', 'SourceFacts', scopeKind === 'file' ? 'Analyzing selected file...' : 'Exploring selected folder...');
  analyzeButton.disabled = true;
  folderButton.disabled = true;
  try {
    const options = { scopeKind, scopePath };
    if (prompt) options.prompt = prompt;
    const payload = await api('/api/run', { method: 'POST', body: JSON.stringify({ commandId: 'source-facts.query', options }) });
    const result = normalizeCommandResult('source-facts.query', payload.output, options);
    replacePendingEntry(pending, 'run', 'SourceFacts analysis', formatCommandReport(result), payload.output, { typewriter: true, markdown: true });
  } catch (error) {
    replacePendingEntry(pending, 'error', 'SourceFacts failed', error instanceof Error ? error.message : String(error), null, { typewriter: true, markdown: true });
  } finally {
    analyzeButton.disabled = false;
    folderButton.disabled = false;
  }
}

analyzeButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  void runSourceFacts('file', selectedPath());
}, { capture: true });

folderButton.addEventListener('click', () => {
  const path = selectedPath();
  const separator = path.lastIndexOf('/');
  void runSourceFacts('folder', separator >= 0 ? path.slice(0, separator) : '.');
});
