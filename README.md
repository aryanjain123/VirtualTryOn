# Virtual Try-On Chrome Extension

A Chrome extension that allows you to virtually try on garments from any website using your own photos.

## Features

- Upload your own photos to use for virtual try-on
- Right-click on any garment image on any website to try it on
- Uses AI to generate realistic try-on images
- Save the results to your computer

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension is now installed and ready to use

## Usage

### Initial Setup
1. Click on the extension icon in your toolbar
2. Click "Manage My Photos" to upload 1-2 photos of yourself
3. For best results, use full-body photos with good lighting and a neutral background

### Trying On Garments
1. Navigate to any website with garment images
2. Right-click on a garment image
3. Select "Try On This Garment" from the context menu
4. Wait for the AI to generate your try-on image
5. Download the result or try another garment

## Technical Details

This extension uses:
- Chrome Storage API to store your photos locally on your device
- Context Menus API to add the right-click option
- Replicate API to generate the try-on images

## Privacy

Your photos are stored locally on your device and are only sent to our AI model when you choose to try on a garment. We do not store your photos on our servers.

