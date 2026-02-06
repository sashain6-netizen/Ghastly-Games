

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
const btn = document.getElementById('like-btn');
const display = document.getElementById('like-count');

// 1. Fetch count on load
if (btn && display) {
    fetch('/stats').then(res => res.json()).then(data => {
        display.innerText = data.likes;
        
        if (localStorage.getItem('hasLiked')) {
            btn.disabled = true;
            btn.innerHTML = `👍 Liked | <span id="like-count">${data.likes}</span>`;
        }
    }).catch(err => console.error("Stats failed to load:", err));

    // 2. Handle the click
    btn.onclick = async () => {
        if (localStorage.getItem('hasLiked')) return;
        
        btn.disabled = true; 
        try {
            const res = await fetch('/stats', { method: 'POST' });
            const data = await res.json();
            
            // Update the display inside the button
            btn.innerHTML = `👍 Liked | <span id="like-count">${data.likes}</span>`;
            localStorage.setItem('hasLiked', 'true');
        } catch (err) {
            console.error("Like failed:", err);
            btn.disabled = false;
        }
    };
}

// --- VIEW COUNT LOGIC ---
const viewCount = document.getElementById('view-count');
if (viewCount) {
    fetch('/stats').then(res => res.json()).then(data => {
        viewCount.innerText = data.views;
    }).catch(err => console.error("Stats failed to load:", err));
}

// Account creation and login

// --- NEW POPUP LOGIC ---

function openAuth(type) {
    document.getElementById('auth-overlay').style.display = 'flex';
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'none';
    
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
  const email = document.getElementById('reg-email').value; // Matches your HTML
  const password = document.getElementById('reg-password').value; // Matches your HTML
  const messageBox = document.getElementById('signup-msg');

  if (!messageBox) return;
  // Check if the email is in the correct format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Invalid email format.';
    return;
  }

  // Check if the email is already taken
  const existingEmail = await fetch('/check-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (existingEmail.ok) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Email already exists.';
    return;
  }

  messageBox.innerText = "Connecting...";

  const response = await fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();

  if (response.ok) {
    messageBox.style.color = "#bc6ff1";
    messageBox.innerText = "Success! Account created. Now log in!";
  } else {
    messageBox.style.color = "red";
    messageBox.innerText = result.error;
  }
}
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Handles user login by making a POST request to the server
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - A promise that resolves to the server's JSON response
 */
/*******  e1766418-4223-441f-8023-eb1f2a736c9e  *******/
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageBox = document.getElementById('login-msg');

    if (!messageBox) return;

    messageBox.innerText = "Verifying...";

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        messageBox.style.color = "#bc6ff1";
        messageBox.innerText = `Welcome back, ${result.user.email}!`;
        // Closes the popup after 1 second so they can see the success message
        setTimeout(() => closeAuth(), 1000);
    } else {
        messageBox.style.color = "red";
        messageBox.innerText = result.error;
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

const redis = require('redis');
const client = redis.createClient();

// When a user attempts to create an account
app.post('/signup', async (req, res) => {
  const userId = req.body.userId; 

  // Check if the user has created an account within the last 10 minutes
  const lastCreationTimestamp = await client.get(userId);
  if (lastCreationTimestamp && Date.now() - parseInt(lastCreationTimestamp) < 10 * 60 * 1000) {
    return res.status(400).json({ error: 'Please wait before creating another account.' });
  }

  // Store the current timestamp for the user
  await client.set(userId, Date.now(), 'EX', 10 * 60);

  res.status(201).json({ message: 'Account created successfully.' });
});