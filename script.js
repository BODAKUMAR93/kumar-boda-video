/*
  SETUP:
  1) Create a YouTube Data API v3 key in Google Cloud Console.
  2) Paste it below in API_KEY.
  3) Restrict the key to YouTube Data API v3 and your GitHub Pages website referrer.
  The API key is visible in browser code; restrictions are important.
*/
const API_KEY = "AIzaSyCIhdlwklUIrc1a8OK1eZhrPO7l_7y2d54";
const CHANNEL_HANDLE = "@KUMARBODA";
const MAX_VIDEOS = 50;

const statusBox = document.getElementById("status");
document.getElementById("year").textContent = new Date().getFullYear();

function escapeHTML(value="") {
  return value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function durationSeconds(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+(m[1]||0))*3600 + (+(m[2]||0))*60 + (+(m[3]||0)) : 0;
}
async function api(path, params) {
  const url = new URL("https://www.googleapis.com/youtube/v3/" + path);
  Object.entries({...params, key: API_KEY}).forEach(([k,v]) => url.searchParams.set(k,v));
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "YouTube API request failed");
  return data;
}
function renderVideos(videos, elementId, isShort) {
  const grid = document.getElementById(elementId);
  if (!videos.length) {
    grid.innerHTML = '<p class="empty">No public videos found in this section yet.</p>';
    return;
  }
  grid.innerHTML = videos.map(v => {
    const id = v.id;
    const title = escapeHTML(v.snippet.title || "Untitled video");
    const description = escapeHTML(v.snippet.description || "No description provided.");
    const thumb = v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || "";
    const url = isShort ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`;
    const date = v.snippet.publishedAt ? new Date(v.snippet.publishedAt).toLocaleDateString() : "";
    return `<article class="video-card ${isShort ? "short" : ""}">
      <a href="${url}" target="_blank" rel="noopener">
        <div class="thumb"><img src="${thumb}" alt="${title}" loading="lazy"></div>
        <h3>${title}</h3>
      </a>
      <p class="description">${description}</p>
      <p class="meta">${isShort ? "SHORT" : "LONG VIDEO"} · ${date} · <a href="${url}" target="_blank" rel="noopener">Watch on YouTube ↗</a></p>
    </article>`;
  }).join("");
}
async function loadChannelVideos() {
  if (!API_KEY || API_KEY.includes("PASTE_")) {
    statusBox.textContent = "Setup needed: add your YouTube Data API key in script.js. Follow the README instructions.";
    document.getElementById("shortsGrid").innerHTML = '<p class="empty">Add your API key to load Shorts automatically.</p>';
    document.getElementById("longGrid").innerHTML = '<p class="empty">Add your API key to load long videos automatically.</p>';
    return;
  }
  try {
    statusBox.textContent = "Connecting to YouTube…";
    const channel = await api("channels", {part:"contentDetails", forHandle:CHANNEL_HANDLE});
    const channelInfo = channel.items?.[0];
    if (!channelInfo) throw new Error("Could not find the YouTube channel. Check the handle in script.js.");
    const uploadsId = channelInfo.contentDetails.relatedPlaylists.uploads;
    const playlist = await api("playlistItems", {part:"snippet,contentDetails", playlistId:uploadsId, maxResults:MAX_VIDEOS});
    const ids = (playlist.items || []).map(x => x.contentDetails.videoId).filter(Boolean);
    if (!ids.length) {
      renderVideos([], "shortsGrid", true); renderVideos([], "longGrid", false);
      statusBox.textContent = "No public uploads found for this channel yet."; return;
    }
    const details = await api("videos", {part:"snippet,contentDetails", id:ids.join(",")});
    const videos = details.items || [];
    // Duration <= 180 seconds is used as an approximate Shorts grouping rule.
    const shorts = videos.filter(v => durationSeconds(v.contentDetails.duration) <= 180);
    const longs = videos.filter(v => durationSeconds(v.contentDetails.duration) > 180);
    renderVideos(shorts, "shortsGrid", true);
    renderVideos(longs, "longGrid", false);
    statusBox.textContent = `Loaded ${videos.length} recent public uploads from ${CHANNEL_HANDLE}. Titles and descriptions are fetched from YouTube.`;
  } catch (err) {
    statusBox.textContent = "Could not load videos: " + err.message + ". Check the API key, its restrictions and API quota.";
  }
}
loadChannelVideos();
