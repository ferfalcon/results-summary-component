import '../styles/style.css';
import loadData from './asyn-fetch-json-data';
import printObjectData from './print-json-object';

const dataUrl = './data.json';

loadData(dataUrl)
.then (data => {
	printObjectData(data);
})


/**
// The target score from JSON data
const targetScore = 80; // Single target value for simplicity

// Function to animate from 0 to the target score
function animateScore(element, targetScore, duration) {
  let start = 0; // Start animation from 0
  const increment = Math.ceil(targetScore / (duration / 20)); // Increment step based on duration
  const interval = setInterval(() => {
    start += increment; // Increase by the calculated increment
    if (start >= targetScore) {
      start = targetScore; // Stop at the exact target score
      clearInterval(interval); // Clear the interval when done
    }
    element.textContent = start; // Update the displayed number
  }, 20); // 20 milliseconds interval for smoother animation
}

// Get the HTML element where the score is displayed
const scoreElement = document.getElementById('score');

// Start the animation for 250ms
animateScore(scoreElement, targetScore, 250);
*/