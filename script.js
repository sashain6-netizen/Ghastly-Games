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

document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('message');

    // Send the data to your /signup function
    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        messageBox.style.color = "green";
        messageBox.innerText = "Success! Account created. Now you can log in.";
    } else {
        messageBox.style.color = "red";
        messageBox.innerText = "Error: " + result.error;
    }
});

document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageBox = document.getElementById('login-message');

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        messageBox.style.color = "#bc6ff1";
        messageBox.innerText = `Welcome back, ${result.user.email}! XP: ${result.user.xp}`;
        // You can now redirect them or unlock game features!
    } else {
        messageBox.style.color = "#ff4d4d";
        messageBox.innerText = result.error;
    }
});

function openAuth(type) {
    // Show the overlay
    document.getElementById('auth-overlay').style.display = 'flex';
    
    // Hide both forms first
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'none';
    
    // Show the one the user clicked
    if (type === 'signup') {
        document.getElementById('signup-form-container').style.display = 'block';
    } else {
        document.getElementById('login-form-container').style.display = 'block';
    }
}

function closeAuth(event) {
    document.getElementById('auth-overlay').style.display = 'none';
}
