const toggleSwitch = document.getElementById('toggleSwitch');

// Initialize toggle state from storage
chrome.storage.local.get(['extensionEnabled'], (result) => {
  if (result.extensionEnabled) {
    toggleSwitch.classList.add('active');
  }
});

// Toggle the iframe on or off
toggleSwitch.addEventListener('click', () => {
  const isEnabled = toggleSwitch.classList.toggle('active');
  chrome.storage.local.set({ extensionEnabled: isEnabled });

  // Send a message to content.js to show/hide iframe
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: toggleIframe,
      args: [isEnabled]
    });
  });
});

// Function to toggle iframe visibility
function toggleIframe(isEnabled) {
  if (isEnabled) {
    window.dispatchEvent(new CustomEvent("showIframe"));
  } else {
    window.dispatchEvent(new CustomEvent("hideIframe"));
  }
}
