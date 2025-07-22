// Create a context menu item that appears when right-clicking on images
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tryOnGarment",
    title: "Try On This Garment & Download Images",
    contexts: ["image"]
  });
});

// Handle the context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tryOnGarment") {
    // Get the image URL from the context
    const garmentImageUrl = info.srcUrl;
    
    // Check if user has uploaded their photos
    chrome.storage.local.get(['userPhotos'], function(result) {
      if (!result.userPhotos || result.userPhotos.length === 0) {
        // If no user photos, open the popup to prompt for upload
        chrome.tabs.create({
          url: 'setup.html'
        });
      } else {
        // Process the try-on request
        processTryOnRequest(garmentImageUrl, result.userPhotos);
      }
    });
  }
});

// Function to process the try-on request
function processTryOnRequest(garmentImageUrl, userPhotos) {
  // Create a new tab to show the processing and results
  chrome.tabs.create({
    url: 'processing.html',
    active: true
  }, function(tab) {
    // Once the tab is created, we'll send the data to it
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        // Remove the listener to avoid multiple calls
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Send the data to the processing page
        chrome.tabs.sendMessage(tabId, {
          action: "processTryOn",
          garmentUrl: garmentImageUrl,
          userPhotos: userPhotos
        });
      }
    });
  });
} 