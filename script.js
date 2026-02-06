

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
// ==========================================
// ACCOUNT, LOGIN & REWARD LOGIC
// ==========================================

// --- POPUP HANDLERS ---
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
    if (event && event.target !== document.getElementById('auth-overlay')) return;
    document.getElementById('auth-overlay').style.display = 'none';
}

function resetForm() {
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('signup-msg').innerText = '';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-msg').innerText = '';
}

// --- SIGNUP FUNCTION ---
async function handleSignup() {
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');
  const messageBox = document.getElementById('signup-msg');
  const botCheck = document.getElementById('ghastly_verify');

  if (botCheck && botCheck.value !== "") return; // Bot protection

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Invalid email format.';
    return;
  }

  messageBox.style.color = "white";
  messageBox.innerText = "Connecting...";

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      messageBox.style.color = "#bc6ff1";
      messageBox.innerText = "Success! Now log in.";
      resetForm(); // Optional: clear form
    } else {
      messageBox.style.color = "red";
      messageBox.innerText = result.error || "An error occurred.";
    }
  } catch (err) {
    messageBox.style.color = "red";
    messageBox.innerText = "Server error. Try again later.";
  }
}

// --- LOGIN FUNCTION (UNIFIED) ---
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageBox = document.getElementById('login-msg');

    messageBox.innerText = "Verifying...";
    messageBox.style.color = "#bc6ff1"; 

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // --- SUCCESS ---
            messageBox.innerText = `Welcome back!`;
            
            // 1. Save Identity and Balance
            localStorage.setItem('user_email', result.user.email);
            localStorage.setItem('golden_balance', result.user.g_bucks || 0);

            // 2. Update UI
            updateUIState(result.user.email, result.user.g_bucks || 0);

            // 3. Close Popup
            setTimeout(() => {
                closeAuth();
            }, 1000);

        } else {
            messageBox.style.color = "red";
            messageBox.innerText = result.error || "Login failed.";
        }
    } catch (error) {
        console.error(error);
        messageBox.style.color = "red";
        messageBox.innerText = "Server error.";
    }
}

// --- LOGOUT FUNCTION ---
function handleLogout() {
    // 1. Clear Data
    localStorage.removeItem('user_email');
    localStorage.removeItem('golden_balance');
    
    // 2. Reset UI
    document.getElementById('logged-out-box').style.display = 'flex';
    document.getElementById('logged-in-box').style.display = 'none';
    document.getElementById('user-display').innerText = "";
    
    // 3. Reset Golden Thumb
    document.getElementById('golden-count').innerText = "0";
    document.getElementById('golden-state').innerText = "Ready";
}

// --- HELPER TO UPDATE UI ---
function updateUIState(email, balance) {
    document.getElementById('logged-out-box').style.display = 'none';
    document.getElementById('logged-in-box').style.display = 'flex';
    document.getElementById('user-display').innerText = email;
    
    const countElement = document.getElementById('golden-count');
    if (countElement) countElement.innerText = balance;
}

// --- GOLDEN THUMB BUTTON LOGIC ---
const goldenBtn = document.getElementById("golden-thumb-btn");
const goldenState = document.getElementById("golden-state");
const goldenCount = document.getElementById("golden-count");

if (goldenBtn) {
    goldenBtn.addEventListener("click", async () => {
        const userEmail = localStorage.getItem("user_email");

        if (!userEmail) {
            alert("You must be logged in to claim a Golden Thumb!");
            return;
        }

        goldenState.innerText = "Checking...";
        goldenBtn.disabled = true;

        try {
            const res = await fetch("/claim-daily", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail })
            });

            const data = await res.json();

            if (data.success) {
                // Update Balance on Screen and in Memory
                goldenCount.innerText = data.new_balance;
                localStorage.setItem('golden_balance', data.new_balance);
                
                goldenState.innerText = "Claimed! ✅";
                setTimeout(() => { goldenState.innerText = "Done"; }, 3000);
            } else {
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
}

// --- PAGE LOAD INITIALIZATION ---
// This runs once when the website opens
document.addEventListener("DOMContentLoaded", function() {
    // 1. Show 
    if (typeof showAdRandomly === "function") showAdRandomly();
    
    // 2. Initial Stats (Likes/Views)
    if (typeof updateStats === "function") updateStats(false);

    // 3. Check Login Status
    const savedEmail = localStorage.getItem('user_email');
    const savedBalance = localStorage.getItem('golden_balance');

    if (savedEmail) {
        updateUIState(savedEmail, savedBalance || 0);
    }
});