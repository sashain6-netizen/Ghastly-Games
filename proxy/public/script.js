// This connects the frontend search bar to the backend proxy engine
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const query = document.getElementById('search-query').value;
    
    // 1. If it's not a URL, make it a DuckDuckGo search
    let url = query.trim();
    if (!url.startsWith('http')) {
        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    }

    // 2. Send the URL through the 'uv' prefix we defined in server.js
    // Note: __uv$config is provided by the Ultraviolet scripts in your HTML
    if (typeof __uv$config !== 'undefined') {
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    } else {
        alert("Proxy engine is still loading. Try again in a second!");
    }
});