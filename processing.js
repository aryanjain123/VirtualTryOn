document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const loadingSection = document.getElementById('loadingSection');
  const imagesSection = document.getElementById('imagesSection');
  const errorSection = document.getElementById('errorSection');
  const resultSection = document.getElementById('resultSection');
  const testApiSection = document.getElementById('testApiSection');
  const errorMessage = document.getElementById('errorMessage');
  const userPhoto = document.getElementById('userPhoto');
  const garmentPhoto = document.getElementById('garmentPhoto');
  const resultPhoto = document.getElementById('resultPhoto');
  const downloadButton = document.getElementById('downloadButton');
  const tryAnotherButton = document.getElementById('tryAnotherButton');
  const downloadUserPhoto = document.getElementById('downloadUserPhoto');
  const downloadGarmentPhoto = document.getElementById('downloadGarmentPhoto');
  const downloadBothButton = document.getElementById('downloadBothButton');
  
  // Variables to store the data
  let garmentUrl = '';
  let userPhotoUrl = '';
  let resultImageUrl = '';
  
  // Set up message listener to receive data from background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "processTryOn") {
      garmentUrl = message.garmentUrl;
      userPhotoUrl = message.userPhotos[0]; // Use the first user photo
      
      // Start the try-on process
      startTryOn();
    }
  });
  
  // Function to start the try-on process
  function startTryOn() {
    // Show the loading section
    loadingSection.style.display = 'block';
    imagesSection.style.display = 'none';
    errorSection.style.display = 'none';
    resultSection.style.display = 'none';
    testApiSection.style.display = 'none';
    
    // Display the images
    userPhoto.src = userPhotoUrl;
    garmentPhoto.src = garmentUrl;
    
    // Call the fal.ai API
    callFalAIAPI(userPhotoUrl, garmentUrl)
      .then(result => {
        // Hide loading and show results
        loadingSection.style.display = 'none';
        imagesSection.style.display = 'flex';
        resultSection.style.display = 'block';
        testApiSection.style.display = 'block';
        
        // Display the result
        resultImageUrl = result.data.image_url;
        resultPhoto.src = resultImageUrl;
      })
      .catch(error => {
        // Hide loading and show error
        loadingSection.style.display = 'none';
        errorSection.style.display = 'block';
        errorMessage.textContent = 'Error: ' + error.message;
      });
  }
  
  // Function to call the fal.ai API
  async function callFalAIAPI(userPhotoUrl, garmentUrl) {
    try {
      // First create the prediction
      const createResponse = await fetch('https://rest.alpha.fal.ai/tokens/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': 'YOUR API KEY',
          'Content-Type': 'application/json',
          'x-fal-target-url': 'https://api.fal.ai/v1/models/fal-ai/leffa/virtual-tryon/infer',
          'Origin': chrome.runtime.getURL('')
        },
        body: JSON.stringify({
          allowed_apps: ["fal-ai/leffa/virtual-tryon"],
          input: {
            human_image_url: userPhotoUrl,
            garment_image_url: garmentUrl
          },
          logs: true
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.text();
        console.error('API Error Response:', errorData);
        throw new Error(`API request failed: ${createResponse.status}`);
      }

      const result = await createResponse.json();
      console.log('API Response:', result);
      
      // Check for the result image URL in different possible locations
      if (result.output && result.output.image_url) {
        return { data: { image_url: result.output.image_url } };
      } else if (result.data && result.data.output && result.data.output.image_url) {
        return { data: { image_url: result.data.output.image_url } };
      } else if (result.data && result.data.image_url) {
        return result;
      } else {
        console.error('Full API Response:', result);
        throw new Error('No result image URL found in response');
      }
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to process images: ' + error.message);
    }
  }
  
  // Download result button handler
  downloadButton.addEventListener('click', function() {
    if (resultImageUrl) {
      downloadImage(resultImageUrl, 'virtual-tryon-result.png');
    }
  });
  
  // Download user photo button handler
  downloadUserPhoto.addEventListener('click', function() {
    if (userPhotoUrl) {
      downloadImage(userPhotoUrl, 'user-photo.png');
    }
  });
  
  // Download garment photo button handler
  downloadGarmentPhoto.addEventListener('click', function() {
    if (garmentUrl) {
      downloadImage(garmentUrl, 'garment-photo.png');
    }
  });
  
  // Download both images button handler
  downloadBothButton.addEventListener('click', function() {
    if (userPhotoUrl && garmentUrl) {
      // Download user photo
      downloadImage(userPhotoUrl, 'user-photo.png');
      
      // Download garment photo after a short delay to avoid browser blocking multiple downloads
      setTimeout(() => {
        downloadImage(garmentUrl, 'garment-photo.png');
      }, 500);
    }
  });
  
  // Helper function to download an image
  function downloadImage(url, filename) {
    // Create a temporary link element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Try another button handler
  tryAnotherButton.addEventListener('click', function() {
    // Close this tab
    chrome.tabs.getCurrent(function(tab) {
      if (tab) {
        chrome.tabs.remove(tab.id);
      }
    });
  });
}); 
