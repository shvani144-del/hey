// Load channel list from channels.json
fetch("channels.json")
  .then(response => response.json())
  .then(streams => {
    if (!streams || streams.length === 0) {
      document.getElementById("streams-list").innerText = "No channels available.";
      return;
    }

    const list = document.getElementById("streams-list");

    // Create buttons dynamically
    streams.forEach(stream => {
      const btn = document.createElement("button");
      btn.innerText = stream.name;
      btn.onclick = () => loadStream(stream.url);
      list.appendChild(btn);
    });

    // Auto-load first channel
    loadStream(streams[0].url);
  })
  .catch(err => {
    console.error("Error loading channels:", err);
    document.getElementById("streams-list").innerText = "Failed to load channels.";
  });

// Function to load into iframe
function loadStream(embedUrl) {
  document.getElementById("stream-player").src = embedUrl;
}
