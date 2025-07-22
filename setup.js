document.addEventListener('DOMContentLoaded', function() {
  const photoUpload = document.getElementById('photoUpload');
  const photoPreview = document.getElementById('photoPreview');
  const saveButton = document.getElementById('savePhotos');
  
  // Array to store the uploaded photos as base64 strings
  let uploadedPhotos = [];
  
  // Maximum number of photos allowed
  const MAX_PHOTOS = 2;
  
  // Load any existing photos
  chrome.storage.local.get(['userPhotos'], function(result) {
    if (result.userPhotos && result.userPhotos.length > 0) {
      uploadedPhotos = result.userPhotos;
      displayPhotos();
    }
  });
  
  // Handle file selection
  photoUpload.addEventListener('change', function(event) {
    const files = event.target.files;
    
    if (files.length > 0) {
      // Check if adding these files would exceed the limit
      if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
        alert(`You can only upload up to ${MAX_PHOTOS} photos. Please remove some photos first.`);
        return;
      }
      
      // Process each file
      Array.from(files).forEach(file => {
        if (!file.type.match('image.*')) {
          alert('Please select only image files.');
          return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Add the photo to our array
          uploadedPhotos.push(e.target.result);
          
          // Update the preview
          displayPhotos();
        };
        
        reader.readAsDataURL(file);
      });
    }
  });
  
  // Function to display the photos in the preview area
  function displayPhotos() {
    // Clear the preview area
    photoPreview.innerHTML = '';
    
    // Add each photo to the preview
    uploadedPhotos.forEach((photo, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      
      const img = document.createElement('img');
      img.src = photo;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'X';
      removeBtn.addEventListener('click', function() {
        removePhoto(index);
      });
      
      photoItem.appendChild(img);
      photoItem.appendChild(removeBtn);
      photoPreview.appendChild(photoItem);
    });
    
    // Update the file input
    photoUpload.value = '';
  }
  
  // Function to remove a photo
  function removePhoto(index) {
    uploadedPhotos.splice(index, 1);
    displayPhotos();
  }
  
  // Save the photos to chrome.storage
  saveButton.addEventListener('click', function() {
    if (uploadedPhotos.length === 0) {
      alert('Please upload at least one photo before saving.');
      return;
    }
    
    chrome.storage.local.set({userPhotos: uploadedPhotos}, function() {
      alert('Your photos have been saved! You can now try on garments from any website.');
      
      // Close the tab if it was opened by the extension
      chrome.tabs.getCurrent(function(tab) {
        if (tab) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  });
}); 