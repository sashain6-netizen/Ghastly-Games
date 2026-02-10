document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const query = document.getElementById('search-query').value;
    
    if (query.trim() !== "") {
        // Redirects to DuckDuckGo with the search parameter
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        window.location.href = searchUrl;
    }
});