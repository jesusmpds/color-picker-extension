// Main event listener when user click on the extension Icon------
chrome.runtime.onMessage.addListener(handleColorPicking);

// Functions and event Handlers-----------------------------------
async function handleColorPicking(message, sender, sendResponse) {
  if (message.action === "setEyeDropper") {
    if (!window.EyeDropper) {
      alert("EyeDropper API is not supported on this platform");
    }

    const isActive = await chrome.storage.sync.get(["colorPickerActive"]);

    if (!isActive.colorPickerActive) {
      addPopup();
    } else {
      removePopup();
    }
  }
}

function setEyeDropper() {
  let eyeDropper = new EyeDropper();
  //Remove popup for opening EyeDropper
  removePopup();
  // Enter eyedropper mode
  eyeDropper
    .open()
    .then((colorSelectionResult) => {
      updateClipboard(colorSelectionResult.sRGBHex);
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateClipboard(newClip) {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(newClip).then(showAlert(newClip, "sucess"));
    }
  });
}

function showAlert(colorHex, successOrFailure) {
  // Get the snackbar DIV
  var divAlert = document.createElement("div");

  // Add the "show" class to DIV
  divAlert.id = "snackbar";
  divAlert.className = "show";
  divAlert.textContent =
    successOrFailure === "sucess"
      ? `Copied color:${colorHex} to clipboard successfully!`
      : `Error! Color copy unsuccessfull`;
  document.body.append(divAlert);
  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    divAlert.className = divAlert.className.replace("show", "");
  }, 4000);
}

function addPopup() {
  const overlay = `<div class="grayscale" id="overlay"></div>`;
  let img = chrome.runtime.getURL("/images/dropper_20px.png");
  const popup = `<div id="popup"><button id="colorPicker">Pick color from the page  <img src=${img} alt="dropper"></button></div>`;
  document.body.insertAdjacentHTML("beforeend", overlay);
  document.body.insertAdjacentHTML("beforeend", popup);
  chrome.storage.sync.set({ colorPickerActive: true });

  //Event listeners
  document.getElementById("overlay").addEventListener("click", removePopup);
  document
    .getElementById("colorPicker")
    .addEventListener("click", setEyeDropper);
}

function removePopup() {
  document.getElementById("popup").remove();
  document.getElementById("overlay").remove();
  chrome.storage.sync.set({ colorPickerActive: false });
}
