<p>Total Likes: <span id="like-count">Loading...</span></p>
<button id="like-btn">❤️ Like</button>

<script>
  const btn = document.getElementById('like-btn');
  const display = document.getElementById('like-count');

  // Load the current count when the page opens
  fetch('/like').then(res => res.json()).then(data => {
    display.innerText = data.likes;
  });

  // Increment when clicked
  btn.onclick = async () => {
    btn.disabled = true; // Prevent double-clicking
    const res = await fetch('/like', { method: 'POST' });
    const data = await res.json();
    display.innerText = data.likes;
  };
</script>
