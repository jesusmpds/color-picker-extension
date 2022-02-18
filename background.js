//Helper Funtions ------------------------------------------------
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function handleClickOnExtensionIcon() {
  let tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, { action: "setEyeDropper" });
}

// Chrome methods ----------------------------------------------------------------
chrome.action.onClicked.addListener(handleClickOnExtensionIcon);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ colorPickerActive: false });
});
