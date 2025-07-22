document.addEventListener('DOMContentLoaded', function() {
  const statusContainer = document.getElementById('statusContainer');
  const managePhotosButton = document.getElementById('managePhotos');
  
  // Check if user has uploaded photos
  chrome.storage.local.get(['userPhotos'], function(result) {
    if (result.userPhotos && result.userPhotos.length > 0) {
      // User has photos, show ready status
      statusContainer.innerHTML = `
        <div class="status ready">
          <strong>Ready to use!</strong> You have ${result.userPhotos.length} photo(s) uploaded.
        </div>
      `;
    } else {
      // User has no photos, show not ready status
      statusContainer.innerHTML = `
        <div class="status not-ready">
          <strong>Setup needed:</strong> Please upload your photos to use the virtual try-on feature.
        </div>
      `;
    }
  });
  
  // Handle manage photos button click
  managePhotosButton.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'setup.html'
    });
  });
}); 