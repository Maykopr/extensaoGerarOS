const integratorDomain = 'https://integrator6.giganet.psi.br/';
chrome.action.onClicked.addListener(async (tab) => {
  // Check if the current tab is on the integrator domain
  if (tab.url.startsWith(integratorDomain)) {
    // Insert the content script when the user turns the extension on
    await chrome.scripting.executeScript({
      files: ['./scripts/content.js'],
      target: { tabId: tab.id }
    });
  }
});
