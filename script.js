const button = document.getElementById('myButton');

button.addEventListener('click', () => {
    // Generate a random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = randomColor;
    console.log("Color changed to: " + randomColor);
});
