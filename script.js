// Replace the sample YouTube IDs below with your own video IDs.
const videos = [
  { title: "My latest daily vlog", category: "Vlogs", id: "ScMzIvxBSi4" },
  { title: "A little entertainment break", category: "Entertainment", id: "ysz5S6PUM-U" },
  { title: "Never give up — motivation", category: "Motivation", id: "ZXsQAXx_ao0" }
];

const grid = document.getElementById("videoGrid");
const search = document.getElementById("search");
let activeCategory = "All";

function renderVideos() {
  const term = search.value.trim().toLowerCase();
  const filtered = videos.filter(video =>
    (activeCategory === "All" || video.category === activeCategory) &&
    video.title.toLowerCase().includes(term)
  );

  grid.innerHTML = filtered.length ? filtered.map(video => `
    <article class="video-card">
      <a href="https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}" target="_blank" rel="noopener">
        <div class="thumb"><span>▶</span></div>
        <h3>${escapeHTML(video.title)}</h3>
        <p>${escapeHTML(video.category)} · Watch on YouTube ↗</p>
      </a>
    </article>`).join("") : '<p class="hint">No videos found. Try another search.</p>';
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderVideos();
  });
});
search.addEventListener("input", renderVideos);
document.getElementById("year").textContent = new Date().getFullYear();
renderVideos();
