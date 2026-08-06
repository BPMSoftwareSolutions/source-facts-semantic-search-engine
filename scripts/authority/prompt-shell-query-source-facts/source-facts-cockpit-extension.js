let selectedFolder = null;

function element(id) {
  return document.getElementById(id);
}

function selectsSourceFacts(scopeKind, scopePath) {
  const commandSelect = element('commandSelect');
  const commandAvailable = [...commandSelect.options].some((option) => option.value === 'source-facts.query');
  if (!commandAvailable) throw new Error('source-facts.query is not present in the governed command catalog');
  commandSelect.value = 'source-facts.query';
  commandSelect.dispatchEvent(new Event('change', { bubbles: true }));
  element('commandOptionsInput').value = JSON.stringify({ scopeKind, scopePath }, null, 2);
  element('promptInput').value = `Expose execution mechanics and evidence-grounded technical debt for ${scopePath}.`;
  element('sendPrompt').click();
}

function installsFolderControl() {
  if (element('analyzeSelectedFolder')) return undefined;
  const button = document.createElement('button');
  button.id = 'analyzeSelectedFolder';
  button.type = 'button';
  button.disabled = true;
  button.textContent = 'Analyze selected folder with SourceFacts';
  document.querySelector('.codebase-search').insertAdjacentElement('afterend', button);
}

document.addEventListener('click', (event) => {
  const folderRow = event.target.closest('.tree-row[data-tree-kind="directory"]');
  if (folderRow) {
    selectedFolder = folderRow.dataset.path || folderRow.title || '.';
    const folderButton = element('analyzeSelectedFolder');
    folderButton.disabled = false;
    folderButton.textContent = `Analyze folder: ${selectedFolder}`;
  }

  if (event.target.closest('#analyzeSelectedFile')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const selectedPath = element('fileViewerPath').textContent.trim();
    if (selectedPath) selectsSourceFacts('file', selectedPath);
  }

  if (event.target.closest('#analyzeSelectedFolder')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (selectedFolder) selectsSourceFacts('folder', selectedFolder);
  }
}, true);

installsFolderControl();
