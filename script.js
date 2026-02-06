

const sites = [
    { name: "GameZone", url: "/games/" },
    { name: "Selenite", url: "https://development.churchinhuntsville.org" },
    { name: "Six Seven Games", url: "https://sixsevengames.pages.dev" },
    { name: "Duck Math", url: "https://ajdhbajhdsbashjbdhbawkjdbuyabidughauygediugweg8aw648676217.pages.dev" },
    { name: "Overcloaked", url: "https://room-32-toys.woodcraftgallery.com.np" },
    { name: "Nettleweb", url: "https://nettlewebiduha.pages.dev" },
    { name: "Watch Documentaries", url: "https://watchdocumentaries.com/games/" },
    { name: "Sigma Games", url: "http://kyeeldergroebe.us/" },
    { name: "Emupedia", url: "https://emupedia.net/beta/" },
    { name: "Ultimate Games", url: "https://media1.tenor.com/m/XbvDHnhj_YQAAAAd/bro-just-typing-shit-atm.gif" },
    { name: "Cool Math Games", url: "https://www.coolmathgames.com/" },
    { name: "Edugames", url: "https://edugames33.wixsite.com/edugames/games5" },
    { name: "Youtube Video Unblocker", url: "https://clipwise.com/" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
];

const grid = document.getElementById('link-grid');

sites.forEach(site => {
    const card = document.createElement('a');
    card.href = site.url;
    card.target = "_blank";
    card.className = 'link-card';
    card.innerHTML = `<span>${site.name}</span>`;
    grid.appendChild(card);
});

function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) return;

    // 1. Set the Image
    const adFiles = ["games/ads/ad1.png", "games/ads/ad2.png", "games/ads/ad3.png", "games/ads/ad4.png", "games/ads/ad5.png", "games/ads/ad6.png", "games/ads/ad7.png", "games/ads/ad8.png", "games/ads/ad9.png", "games/ads/ad10.png", "games/ads/ad11.png", "games/ads/ad12.png", "games/ads/ad13.png", "games/ads/ad14.png", "games/ads/ad15.png", "games/ads/ad16.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    // 2. Clear ALL previous positioning and classes
    // This is crucial so "top" doesn't fight with "bottom" from the last ad
    adPopup.style.top = 'auto';
    adPopup.style.bottom = 'auto';
    adPopup.style.left = 'auto';
    adPopup.style.right = 'auto';
    adPopup.classList.remove('slide-in-top', 'slide-in-bottom', 'slide-in-left', 'slide-in-right');

    // 3. Define Dimensions
    const adWidth = 300; 
    const adHeight = 200; // This should match your approx image height
    const maxLeft = window.innerWidth - adWidth;
    const maxTop = window.innerHeight - adHeight;

    // 4. Randomly pick an edge: 0=Top, 1=Right, 2=Bottom, 3=Left
    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) { 
        // --- TOP EDGE ---
        adPopup.style.top = '30px'; 
        // Randomize horizontal position
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-top');

    } else if (edge === 1) { 
        // --- RIGHT EDGE ---
        adPopup.style.right = '30px';
        // Randomize vertical position
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-right');

    } else if (edge === 2) { 
        // --- BOTTOM EDGE ---
        adPopup.style.bottom = '30px';
        // Randomize horizontal position
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-bottom');

    } else { 
        // --- LEFT EDGE ---
        adPopup.style.left = '30px';
        // Randomize vertical position
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-left');
    }

    // 5. Show the ad
    adPopup.style.display = 'block';
}

function closeAd() {
    const adPopup = document.getElementById('adPopup');
    if (adPopup) {
        adPopup.style.display = 'none';
        // Show again in 60 seconds
        setTimeout(showAdRandomly, 60000);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    showAdRandomly();
});

// This code shows the menu when the button is clicked, and hides it when it's not
const creditsButton = document.getElementById('credits-button');
const creditsMenu = document.getElementById('credits-menu');

creditsButton.addEventListener('click', function() {
    creditsMenu.style.display = (creditsMenu.style.display === 'none') ? 'block' : 'none';
    logsMenu.style.display = 'none';
    infoMenu.style.display = 'none';
});
const logsButton = document.getElementById('logs-button');
const logsMenu = document.getElementById('logs-menu');

logsButton.addEventListener('click', function() {
    logsMenu.style.display = (logsMenu.style.display === 'none') ? 'block' : 'none';
    creditsMenu.style.display = 'none';
    infoMenu.style.display = 'none';
});

const infoButton = document.getElementById('info-button');
const infoMenu = document.getElementById('info-menu');

infoButton.addEventListener('click', function() {
    infoMenu.style.display = (infoMenu.style.display === 'none') ? 'block' : 'none';
    creditsMenu.style.display = 'none';
    logsMenu.style.display = 'none';
});

// --- LIKE BUTTON LOGIC ---
// --- COMBINED STATS LOGIC (D1 VERSION) ---
const likeBtn = document.getElementById('like-btn');
const likeDisplay = document.getElementById('like-count');
const viewDisplay = document.getElementById('view-count');

async function updateStats(isClick = false) {
    try {
        // If isClick is true, we POST (increment likes), otherwise GET (increment views)
        const method = isClick ? 'POST' : 'GET';
        const res = await fetch('/stats', { method });
        const data = await res.json();

        // Update both displays simultaneously with the fresh data from D1
        if (likeDisplay) likeDisplay.innerText = data.likes;
        if (viewDisplay) viewDisplay.innerText = data.views;

        // If this was a successful like click, update the button state
        if (isClick && likeBtn) {
            likeBtn.disabled = true;
            likeBtn.innerHTML = `👍 Liked | <span id="like-count">${data.likes}</span>`;
            localStorage.setItem('hasLiked', 'true');
        }
        
        // Handle initial button state on page load
        if (!isClick && localStorage.getItem('hasLiked') && likeBtn) {
            likeBtn.disabled = true;
            likeBtn.innerHTML = `👍 Liked | <span id="like-count">${data.likes}</span>`;
        }
    } catch (err) {
        console.error("Stats sync failed:", err);
    }
}

// 1. Run on page load: Increments view count and gets initial totals
document.addEventListener("DOMContentLoaded", () => {
    updateStats(false);
});

// 2. Handle the like button click
if (likeBtn) {
    likeBtn.onclick = () => {
        if (!localStorage.getItem('hasLiked')) {
            updateStats(true);
        }
    };
}

// Account creation and login

// --- NEW POPUP LOGIC ---

function openAuth(type) {
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'none';

    resetForm();
    
    if (type === 'signup') {
        document.getElementById('signup-form-container').style.display = 'block';
    } else {
        document.getElementById('login-form-container').style.display = 'block';
    }
}

function closeAuth(event) {
    // If an event is passed (clicking the overlay), check it. 
    // If no event (clicking the X), just close.
    if (event && event.target !== document.getElementById('auth-overlay')) return;
    document.getElementById('auth-overlay').style.display = 'none';
}

// These functions are what your HTML 'onclick' attributes are calling!

async function handleSignup() {
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');
  const messageBox = document.getElementById('signup-msg');
  const botCheck = document.getElementById('ghastly_verify');

  resetForm();

  if (botCheck && botCheck.value !== "") return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Frontend Validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Invalid email format.';
    return;
  }

  messageBox.style.color = "white"; // Reset color
  messageBox.innerText = "Connecting...";

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // We get the JSON data regardless of whether the response was "ok" or not
    const result = await response.json();

    if (response.ok) {
      messageBox.style.color = "#bc6ff1";
      messageBox.innerText = "Success! Now log in.";
    } else {
      // THIS IS THE KEY PART:
      // If the email exists, result.error will be "An account with this email already exists."
      messageBox.style.color = "red";
      messageBox.innerText = result.error || "An error occurred.";
    }
  } catch (err) {
    messageBox.style.color = "red";
    messageBox.innerText = "Server error. Try again later.";
  }
}
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageBox = document.getElementById('login-msg');

    // 1. Reset UI state
    messageBox.innerText = "Verifying...";
    messageBox.style.color = "#bc6ff1"; // Your theme color

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // --- SUCCESS LOGIC ---
            
            messageBox.innerText = `Welcome back!`;
            
            // A. Save email to browser (CRITICAL for the Reward Button)
            localStorage.setItem('user_email', result.user.email);

            // B. Update the Header (Hide Login / Show User)
            document.getElementById('logged-out-box').style.display = 'none';
            document.getElementById('logged-in-box').style.display = 'flex';
            document.getElementById('user-display').innerText = result.user.email;

            // C. Update the Golden Thumb Count immediately
            // (Assumes your backend sends 'g_bucks' in the response)
            const currentBucks = result.user.g_bucks !== undefined ? result.user.g_bucks : 0;
            document.getElementById('golden-count').innerText = currentBucks;

            // D. Close the popup after a short delay
            setTimeout(() => {
                closeAuth();
                // Clear the password field for security
                document.getElementById('login-password').value = ""; 
            }, 1000);

        } else {
            // --- ERROR LOGIC ---
            messageBox.style.color = "red";
            messageBox.innerText = result.error || "Login failed.";
        }
    } catch (error) {
        console.error(error);
        messageBox.style.color = "red";
        messageBox.innerText = "Server error. Please try again.";
    }
}

// 1. Function to update the UI based on login status
function updateAuthUI() {
    const loggedOutBox = document.getElementById('logged-out-box');
    const loggedInBox = document.getElementById('logged-in-box');
    const userDisplay = document.getElementById('user-display');
    
    const savedUser = localStorage.getItem('ghastlyUser');

    if (savedUser) {
        loggedOutBox.style.display = 'none';
        loggedInBox.style.display = 'flex';
        userDisplay.innerText = `👻 ${savedUser}`;
    } else {
        loggedOutBox.style.display = 'flex';
        loggedInBox.style.display = 'none';
    }
}

// 2. Modify your existing handleLogin function to save the user
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageBox = document.getElementById('login-msg');

    messageBox.innerText = "Verifying...";

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // SUCCESS: Save the user to the browser's memory
            localStorage.setItem('ghastlyUser', result.user.email);
            messageBox.style.color = "#bc6ff1";
            messageBox.innerText = "Welcome back!";
            
            updateAuthUI(); // Refresh the buttons
            setTimeout(() => closeAuth(), 1000);
        } else {
            messageBox.style.color = "red";
            messageBox.innerText = result.error;
        }
    } catch (err) {
        messageBox.innerText = "Login failed.";
    }
}

// 3. Add a Logout function
function handleLogout() {
    localStorage.removeItem('ghastlyUser');
    updateAuthUI();
}

// 4. Run the check immediately when the page loads
document.addEventListener("DOMContentLoaded", function() {
    updateAuthUI();
    // ... your other existing code (showAdRandomly, etc) ...
});

function someFunction() {
    if (document.getElementById('ghastly_verify').value !== "") {
        return; // Bot detected, ignore the signup
    }
    // Rest of your code...
}

(() => {
    document.getElementById('signup-form').addEventListener('submit', (event) => {
        if (document.getElementById('ghastly_verify').value !== "") {
            event.preventDefault(); // Prevent the form from being submitted
            alert('Bot detected!'); // Display a message to the user
            return;
        }
    });
})();

function resetForm() {
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');
  const signupMessageBox = document.getElementById('signup-msg');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const loginMessageBox = document.getElementById('login-msg');

  emailInput.value = '';
  passwordInput.value = '';
  signupMessageBox.innerText = '';
  loginEmailInput.value = '';
  loginPasswordInput.value = '';
  loginMessageBox.innerText = '';
}

// --- GOLDEN THUMB LOGIC ---
const goldenBtn = document.getElementById("golden-thumb-btn");
const goldenState = document.getElementById("golden-state");
const goldenCount = document.getElementById("golden-count");

goldenBtn.addEventListener("click", async () => {
    const userEmail = localStorage.getItem("user_email");

    // 1. Check if logged in
    if (!userEmail) {
        alert("You must be logged in to claim a Golden Thumb!");
        return;
    }

    // 2. UI Feedback (prevent double clicking)
    goldenState.innerText = "Checking...";
    goldenBtn.disabled = true;

    try {
        // 3. Call the Backend
        const res = await fetch("/claim-daily", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await res.json();

        if (data.success) {
            // SUCCESS: Update the count and status
            goldenCount.innerText = data.new_balance;
            goldenState.innerText = "Claimed! ✅";
            
            // Optional: Reset text after a few seconds
            setTimeout(() => { goldenState.innerText = "Done"; }, 3000);
        } else {
            // FAILURE: Show the error message (e.g., "Come back in 4 hours")
            goldenState.innerText = "Wait ⏳";
            alert(data.message); 
        }

    } catch (err) {
        console.error(err);
        goldenState.innerText = "Error ❌";
    } finally {
        goldenBtn.disabled = false;
    }
});

// --- RUN ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if user is logged in
    const savedEmail = localStorage.getItem("user_email");
    const savedBalance = localStorage.getItem("golden_balance"); // We will save this below
    
    const countDisplay = document.getElementById("golden-count");
    const stateDisplay = document.getElementById("golden-state");

    if (savedEmail) {
        // User is logged in
        document.getElementById("user-display").innerText = savedEmail;
        document.getElementById("logged-out-box").style.display = 'none';
        document.getElementById("logged-in-box").style.display = 'flex';
        
        // Restore the Golden Thumb count
        if (countDisplay) {
            countDisplay.innerText = savedBalance || "0"; 
        }
        if (stateDisplay) {
            stateDisplay.innerText = "Ready";
        }
    } else {
        // User is NOT logged in
        if (countDisplay) countDisplay.innerText = "0";
        if (stateDisplay) stateDisplay.innerText = "Login First";
    }
});