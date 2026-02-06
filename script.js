// ==========================================
// 1. LINKS AND GRID GENERATION
// ==========================================
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
];

const grid = document.getElementById('link-grid');
if (grid) {
    sites.forEach(site => {
        const card = document.createElement('a');
        card.href = site.url;
        card.target = "_blank";
        card.className = 'link-card';
        card.innerHTML = `<span>${site.name}</span>`;
        grid.appendChild(card);
    });
}

// ==========================================
// 2. AD SYSTEM
// ==========================================
function showAdRandomly() {
    const adPopup = document.getElementById('adPopup');
    const adImage = document.getElementById('adImage');

    if (!adPopup || !adImage) return;

    const adFiles = ["games/ads/ad1.png", "games/ads/ad2.png", "games/ads/ad3.png", "games/ads/ad4.png", "games/ads/ad5.png", "games/ads/ad6.png", "games/ads/ad7.png", "games/ads/ad8.png", "games/ads/ad9.png", "games/ads/ad10.png", "games/ads/ad11.png", "games/ads/ad12.png", "games/ads/ad13.png", "games/ads/ad14.png", "games/ads/ad15.png", "games/ads/ad16.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    // Clear previous positions
    adPopup.style.top = 'auto';
    adPopup.style.bottom = 'auto';
    adPopup.style.left = 'auto';
    adPopup.style.right = 'auto';
    adPopup.classList.remove('slide-in-top', 'slide-in-bottom', 'slide-in-left', 'slide-in-right');

    const adWidth = 300; 
    const adHeight = 200; 
    const maxLeft = window.innerWidth - adWidth;
    const maxTop = window.innerHeight - adHeight;

    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) { 
        adPopup.style.top = '30px'; 
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-top');
    } else if (edge === 1) { 
        adPopup.style.right = '30px';
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-right');
    } else if (edge === 2) { 
        adPopup.style.bottom = '30px';
        adPopup.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        adPopup.classList.add('slide-in-bottom');
    } else { 
        adPopup.style.left = '30px';
        adPopup.style.top = Math.floor(Math.random() * maxTop) + 'px';
        adPopup.classList.add('slide-in-left');
    }
    adPopup.style.display = 'block';
}

function closeAd() {
    const adPopup = document.getElementById('adPopup');
    if (adPopup) {
        adPopup.style.display = 'none';
        setTimeout(showAdRandomly, 60000);
    }
}

// ==========================================
// 3. MENU NAVIGATION
// ==========================================
const creditsButton = document.getElementById('credits-button');
const creditsMenu = document.getElementById('credits-menu');
const logsButton = document.getElementById('logs-button');
const logsMenu = document.getElementById('logs-menu');
const infoButton = document.getElementById('info-button');
const infoMenu = document.getElementById('info-menu');

if (creditsButton) {
    creditsButton.addEventListener('click', function() {
        creditsMenu.style.display = (creditsMenu.style.display === 'none') ? 'block' : 'none';
        if (logsMenu) logsMenu.style.display = 'none';
        if (infoMenu) infoMenu.style.display = 'none';
    });
}
if (logsButton) {
    logsButton.addEventListener('click', function() {
        logsMenu.style.display = (logsMenu.style.display === 'none') ? 'block' : 'none';
        if (creditsMenu) creditsMenu.style.display = 'none';
        if (infoMenu) infoMenu.style.display = 'none';
    });
}
if (infoButton) {
    infoButton.addEventListener('click', function() {
        infoMenu.style.display = (infoMenu.style.display === 'none') ? 'block' : 'none';
        if (creditsMenu) creditsMenu.style.display = 'none';
        if (logsMenu) logsMenu.style.display = 'none';
    });
}

// ==========================================
// 4. LIKE BUTTON & STATS LOGIC
// ==========================================
const likeBtn = document.getElementById('like-btn');
const likeDisplay = document.getElementById('like-count');
const viewDisplay = document.getElementById('view-count');

async function updateStats(isClick = false) {
    try {
        const method = isClick ? 'POST' : 'GET';
        const res = await fetch('/stats', { method });
        const data = await res.json();

        if (likeDisplay) likeDisplay.innerText = data.likes;
        if (viewDisplay) viewDisplay.innerText = data.views;

        if (isClick && likeBtn) {
            likeBtn.disabled = true;
            likeBtn.innerHTML = `👍 Liked | <span id="like-count">${data.likes}</span>`;
            localStorage.setItem('hasLiked', 'true');
        }
    } catch (err) {
        console.error("Stats sync failed:", err);
    }
}

if (likeBtn) {
    likeBtn.onclick = () => {
        if (!localStorage.getItem('hasLiked')) {
            updateStats(true);
        }
    };
}

// ==========================================
// 5. ACCOUNT, LOGIN & REWARD LOGIC
// ==========================================

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
    if(document.getElementById('reg-email')) document.getElementById('reg-email').value = '';
    if(document.getElementById('reg-password')) document.getElementById('reg-password').value = '';
    if(document.getElementById('signup-msg')) document.getElementById('signup-msg').innerText = '';
    if(document.getElementById('login-email')) document.getElementById('login-email').value = '';
    if(document.getElementById('login-password')) document.getElementById('login-password').value = '';
    if(document.getElementById('login-msg')) document.getElementById('login-msg').innerText = '';
}

async function handleSignup() {
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');
  const messageBox = document.getElementById('signup-msg');
  const botCheck = document.getElementById('ghastly_verify');

  // 1. Bot Protection
  if (botCheck && botCheck.value !== "") return;

  // 2. Get Values
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // --- DEBUGGING: REMOVE THIS AFTER FIXING ---
  // This will show a popup telling you exactly what the code read.
  // If this says "Email is: [ ]", then the code isn't finding your text.
  alert(`Debug Check:\nEmail: [${email}]\nPassword length: ${password.length}`);
  // -------------------------------------------

  // 3. Simple Validation
  // If the email is shorter than 5 letters (a@b.c), it's definitely wrong.
  if (email.length < 5 || !email.includes('@') || !email.includes('.')) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Invalid email format (Needs @ and .)';
    return;
  }

  if (password.length < 8) {
    messageBox.style.color = "red";
    messageBox.innerText = 'Password must be at least 8 characters.';
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
      emailInput.value = '';
      passwordInput.value = '';
    } else {
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
            // SUCCESS
            messageBox.innerText = `Welcome back!`;
            
            // Save Identity and Balance
            localStorage.setItem('user_email', result.user.email);
            localStorage.setItem('golden_balance', result.user.g_bucks || 0);

            // Update UI
            updateUIState(result.user.email, result.user.g_bucks || 0);

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

function handleLogout() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('golden_balance');
    
    document.getElementById('logged-out-box').style.display = 'flex';
    document.getElementById('logged-in-box').style.display = 'none';
    document.getElementById('user-display').innerText = "";
    
    // Reset Golden Thumb
    const gCount = document.getElementById('golden-count');
    const gState = document.getElementById('golden-state');
    if(gCount) gCount.innerText = "0";
    if(gState) gState.innerText = "Ready";
}

function updateUIState(email, balance) {
    const loggedOutBox = document.getElementById('logged-out-box');
    const loggedInBox = document.getElementById('logged-in-box');
    
    if(loggedOutBox) loggedOutBox.style.display = 'none';
    if(loggedInBox) loggedInBox.style.display = 'flex';
    if(document.getElementById('user-display')) document.getElementById('user-display').innerText = email;
    
    const countElement = document.getElementById('golden-count');
    if (countElement) countElement.innerText = balance;
}

// ==========================================
// 6. GOLDEN THUMB BUTTON
// ==========================================
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

        if(goldenState) goldenState.innerText = "Checking...";
        goldenBtn.disabled = true;

        try {
            const res = await fetch("/claim-daily", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail })
            });

            const data = await res.json();

            if (data.success) {
                if(goldenCount) goldenCount.innerText = data.new_balance;
                localStorage.setItem('golden_balance', data.new_balance);
                
                if(goldenState) goldenState.innerText = "Claimed! ✅";
                setTimeout(() => { if(goldenState) goldenState.innerText = "Done"; }, 3000);
            } else {
                if(goldenState) goldenState.innerText = "Wait ⏳";
                alert(data.message); 
            }

        } catch (err) {
            console.error(err);
            if(goldenState) goldenState.innerText = "Error ❌";
        } finally {
            goldenBtn.disabled = false;
        }
    });
}

// ==========================================
// 7. INITIALIZATION (RUNS ON LOAD)
// ==========================================
// This checks everything just once when the page is ready
document.addEventListener("DOMContentLoaded", function() {
    // 1. Show Ads
    showAdRandomly();
    
    // 2. Initial Stats (Likes/Views)
    updateStats(false);
    
    // 3. Check Login Status
    const savedEmail = localStorage.getItem('user_email');
    const savedBalance = localStorage.getItem('golden_balance');

    if (savedEmail) {
        updateUIState(savedEmail, savedBalance || 0);
    }
    
    // 4. Update Button State if Liked
    if (localStorage.getItem('hasLiked') && likeBtn) {
        likeBtn.disabled = true;
    }
});