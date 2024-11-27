let timerInterval;
let timeLeft = 25 * 60; // Timer starts at 25 minutes (in seconds)
let isPaused = true; // Initially the timer is paused

// Update the badge with the remaining time in minutes:seconds format
function updateBadge() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Set badge text and color
  if (!isPaused) {
    chrome.action.setBadgeText({ text: timeString });
    chrome.action.setBadgeBackgroundColor({ color: "#b80101" }); // Bright red color
    chrome.action.setBadgeTextColor({ color: "white" }); // White color for text
  } else {
    chrome.action.setBadgeText({ text: "➖" }); // Pause symbol when paused
    chrome.action.setBadgeBackgroundColor({ color: "#ffffff" }); // Default color when paused
    chrome.action.setBadgeTextColor({ color: "white" }); // White color for text
  }

  // When the timer reaches zero, show notification
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    showNotification();
  } else {
    timeLeft--;
  }
}

// Function to show a notification when the timer is up
function showNotification() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "assets/icon.png",
    title: "Pomodoro Complete!",
    message: "Click to restart or stop.",
    buttons: [{ title: "Restart" }, { title: "Stop" }],
    priority: 0,
  });
}

// Listen for click on notification buttons (restart or stop)
chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      restartPomodoro();
    } else if (buttonIndex === 1) {
      stopPomodoro();
    }
  }
);

// Restart the Pomodoro timer
function restartPomodoro() {
  timeLeft = 25 * 60; // Reset timer to 25 minutes
  updateBadge();
  timerInterval = setInterval(updateBadge, 1000);
}

// Stop the Pomodoro timer
function stopPomodoro() {
  clearInterval(timerInterval);
  timeLeft = 25 * 60; // Reset time left
  isPaused = true; // Mark the timer as paused
  chrome.action.setBadgeText({ text: "" }); // Clear the badge text when stopped
}

// Listen for clicks on the extension icon to start or pause the timer
chrome.action.onClicked.addListener(() => {
  if (isPaused) {
    // Start the timer if it's paused
    timerInterval = setInterval(updateBadge, 1000);
    isPaused = false;
  } else {
    // Pause the timer if it's running
    clearInterval(timerInterval);
    isPaused = true;
    updateBadge();
  }
});
