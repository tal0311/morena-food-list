<template>
  <!-- Bug Logger Component with v-show instead of v-if -->
  <div v-show="visible" class="bug-logger-overlay">
    <button @click="logBug">Log Bug</button>
    <div v-if="bugLog.length > 0">
    <button @click="downloadCSV">Download CSV</button>
  </div>
  </div>

  <!-- Screenshot Canvas Display with v-show instead of v-if -->
  <div v-show="screenshotVisible" class="screenshot-container">
    <p>{{ description }}</p>
    <canvas ref="canvasRef" :id="`canvas-${uniqueId}`" width="600" height="400" @click="onCanvasClick"></canvas>
  </div>

  <!-- Button to download the CSV -->
 
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import html2canvas from 'html2canvas'; // Import html2canvas
import { v4 as uuidv4 } from 'uuid';  // For generating unique IDs
import { useRoute } from 'vue-router';

const route = useRoute();
const visible = ref(false);
const screenshotVisible = ref(false);
const screenshot = ref(null);
const description = ref('');
const canvasRef = ref(null);
const uniqueId = ref(uuidv4());  // Generate unique ID for the image and bug
const bugLog = ref(JSON.parse(localStorage.getItem('bugLog') || '[]')); // Load bug log from localStorage

let img = null; // Hold the image object to repaint the canvas

// Function to capture a screenshot using html2canvas
const captureScreenshot = () => {
  html2canvas(document.body).then((canvas) => {
    screenshot.value = canvas.toDataURL('image/png');
    console.log('Screenshot captured:', screenshot.value);

    // Show the screenshot canvas
    screenshotVisible.value = true;

    // Render the captured screenshot on the actual canvas element
    const canvasElement = canvasRef.value;
    if (!canvasElement) {
      console.error('Canvas element not found');
      return;
    }

    const context = canvasElement.getContext('2d');
    if (!context) {
      console.error('Failed to get canvas context');
      return;
    }

    // Set the canvas size to 600x400 and draw the screenshot image onto it
    canvasElement.width = 600;
    canvasElement.height = 400;

    img = new Image();
    img.src = screenshot.value;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
    };
  }).catch((error) => {
    console.error('Error capturing screenshot:', error);
  });
};

// Repaint canvas and draw circle using Promise
const repaintCanvasWithCircle = (x, y) => {
  return new Promise((resolve) => {
    const canvasElement = canvasRef.value;
    const context = canvasElement.getContext('2d');

    // Clear the canvas and repaint with the image
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    context.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

    // Draw the circle at the clicked position
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.stroke();

    // Resolve the promise after painting is completed
    resolve();
  });
};

// Handle canvas click to draw a circle and repaint the canvas
const onCanvasClick = (event) => {
  const canvasElement = canvasRef.value;

  // Calculate the position of the click relative to the canvas
  const rect = canvasElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Repaint the canvas and draw the circle, then prompt to save
  repaintCanvasWithCircle(x, y).then(() => {
    const saveConfirmation = confirm('Do you want to save the modified screenshot?');
    if (saveConfirmation) {
      downloadScreenshot();
      removeCanvasFromDOM();
    }
  });
};

// Log bug details and capture screenshot
const logBug = () => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  console.log(`Route: ${route.fullPath}`);
  console.log(`User Agent: ${userAgent}`);
  console.log(`Screen Size: ${screenWidth}x${screenHeight}`);

  // Prompt the user for a bug description
  const userDescription = prompt("Please enter the bug description:");
  if (userDescription) {
    description.value = `Description: ${userDescription}`;
  } else {
    description.value = "No description provided.";
  }

  // Capture the screenshot
  captureScreenshot();
};

// Function to download the screenshot when the user clicks on the canvas
const downloadScreenshot = () => {
  const canvasElement = canvasRef.value;
  const imageName = `bug-screenshot-${uniqueId.value}.png`;
  const downloadPath = `Downloads/${imageName}`;
  const link = document.createElement('a');
  link.href = canvasElement.toDataURL('image/png');
  link.download = imageName;
  link.click();

  // Log the bug with its ID and image path to the Downloads folder
  const bugEntry = {
    id: uniqueId.value,
    description: description.value,
    imagePath: downloadPath
  };
  bugLog.value.push(bugEntry);

  // Update localStorage with the new bug log
  localStorage.setItem('bugLog', JSON.stringify(bugLog.value));
};

// Function to generate and download the CSV file
const downloadCSV = () => {
  const csvContent = "data:text/csv;charset=utf-8,ID,Description,Image Path\n" +
    bugLog.value.map(bug => `${bug.id},${bug.description},${bug.imagePath}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "bug_log.csv");
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
};

// Function to remove the canvas from the DOM after the download
const removeCanvasFromDOM = () => {
  screenshotVisible.value = false;
  console.log('Canvas removed from DOM');
};

// Event listener for CTRL+B to toggle the bug logger visibility
const handleKeydown = (event) => {
  if (event.ctrlKey && (event.key === 'b' || event.key === 'B')) {
    event.preventDefault();  // Prevent default behavior of CTRL+B
    visible.value = !visible.value;
    console.log('Toggling visibility:', visible.value);
  }
};

// Register and unregister the keydown event listener
onMounted(() => {
  console.log('%cBug Logger mounted and listening for CTRL+B', 'font-weight: bold; color: lightgreen;');
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.bug-logger-overlay {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  background-color: white;
  padding: 10px;
  border: 1px solid black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.screenshot-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

canvas {
  border: 1px solid black;
  cursor: pointer;
}
</style>
