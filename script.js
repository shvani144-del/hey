// Channel poster data
const channelData = {
  "espn_hd": {
    "poster": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    "description": "Live Sports Coverage"
  },
  "bein_sports": {
    "poster": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    "description": "Arabic Sports Network"
  },
  "sky_sports": {
    "poster": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    "description": "Premier Sports Channel"
  }
};

let channels = [];
let currentChannel = null;

// Base64 decode with additional obfuscation
function dec(str) {
  try {
    return atob(str.split('').reverse().join(''));
  } catch(e) {
    return '';
  }
}

// Encode channel data
function encodeUrl(url) {
  return btoa(url).split('').reverse().join('');
}

// Load channels from JSON file
async function loadChannels() {
  try {
    const response = await fetch("channels.json");
    const rawChannels = await response.json();
    
    // Encode URLs before storing
    channels = rawChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      url: encodeUrl(ch.url)
    }));
    
    renderChannels();
  } catch (err) {
    console.error("Error loading channels:", err);
    document.getElementById("channels-grid").innerHTML = 
      '<div class="loading">Failed to load channels. Make sure channels.json is uploaded.</div>';
  }
}

// Render channel cards
function renderChannels() {
  const grid = document.getElementById("channels-grid");
  grid.innerHTML = '';

  channels.forEach((channel, index) => {
    const data = channelData[channel.id] || {
      poster: "https://images.unsplash.com/photo-1522159698025-071104988b28?w=800&q=80",
      description: "Live Sports"
    };

    const card = document.createElement("div");
    card.className = "channel-card";
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
      <div style="position: relative;">
        <img src="${data.poster}" alt="${channel.name}" class="channel-poster">
        <div class="channel-badge">🔴 LIVE</div>
      </div>
      <div class="channel-info">
        <div class="channel-name">${channel.name}</div>
        <button class="watch-btn" onclick="playChannel('${channel.id}')">
          ▶ Watch Now
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Play channel in fullscreen
function playChannel(channelId) {
  const channel = channels.find(c => c.id === channelId);
  if (!channel) return;

  currentChannel = channel;
  document.getElementById("player-title").textContent = channel.name;
  
  // Decode URL only when playing
  const decodedUrl = dec(channel.url);
  document.getElementById("stream-player").src = decodedUrl;
  document.getElementById("player-overlay").classList.add("active");
  document.body.style.overflow = 'hidden';
  
  // Clear decoded URL from memory after setting
  setTimeout(() => {
    if (window.decodedUrl) delete window.decodedUrl;
  }, 100);
}

// Close player
function closePlayer() {
  document.getElementById("player-overlay").classList.remove("active");
  document.getElementById("stream-player").src = '';
  document.body.style.overflow = 'auto';
  currentChannel = null;
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentChannel) {
    closePlayer();
  }
});

// Initialize
loadChannels();