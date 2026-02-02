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
    { name: "Ultimate Games", url: "https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713" },
    { name: "Cool Math Games", url: "https://www.coolmathgames.com/" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
    { name: "Unlinked (Click for Details)", url: "https://docs.google.com/forms/d/e/1FAIpQLSfa1r9xeF5WwPNJ6zd7eY7VkT8zWOLstNIr5DlseG4jpnIfzQ/viewform?usp=publish-editor" },
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
    const adFiles = ["ad1.png", "ad2.png", "ad3.png", "ad4.png", "ad5.png"];
    const randomIndex = Math.floor(Math.random() * adFiles.length);
    adImage.src = adFiles[randomIndex];

    // 2. Force the dimensions (Use your ad's actual size here)
    // This prevents the "0 height" bug if the image hasn't loaded yet
    const adWidth = 300; 
    const adHeight = 200; 

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const maxLeft = windowWidth - adWidth - 50; 
    const maxTop = windowHeight - adHeight - 50;

    const randomLeft = Math.floor(Math.random() * Math.max(0, maxLeft));
    const randomTop = Math.floor(Math.random() * Math.max(0, maxTop));

    adPopup.style.bottom = 'auto';
    adPopup.style.right = 'auto';

    // 5. Apply the new Random Positions
    adPopup.style.left = randomLeft + "px";
    adPopup.style.top = randomTop + "px";

    // 6. Show the ad
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
