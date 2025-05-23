function getSelectedGenres() {
  // Get all checked checkboxes in the genre dropdown
  const checkboxes = document.querySelectorAll('#genreDropdown input[type="checkbox"]:checked');
  // Return a comma-separated list of genre IDs or empty string if none
  return Array.from(checkboxes).map(cb => cb.value).join(',');
}

function getSelectedScore() {
  return document.getElementById('scoreSelect').value;
}

async function getRandomAnime() {
  const animeBox = document.getElementById("animeBox");
  const loadingText = document.getElementById("loading");
  const noteText = document.getElementById("note");

  animeBox.style.display = "none";
  loadingText.innerText = "Fetching...";
  noteText.style.display = "none";

  const genres = getSelectedGenres();
  const minScore = parseFloat(getSelectedScore()) || 0;

  let attempts = 0;
  let animeList = [];

  // Try up to 5 times to find matching anime
  while (attempts < 5) {
    const page = Math.floor(Math.random() * 25) + 1;
    let url = `https://api.jikan.moe/v4/anime?page=${page}&limit=25&type=tv&order_by=score&sort=desc`;
    if (genres) url += `&genres=${genres}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      animeList = (data.data || []).filter(anime => anime.score && anime.score >= minScore);

      if (animeList.length > 0) break; // Found anime, break out of loop
    } catch (e) {
      console.error("Fetch error:", e);
      break; // Stop retrying on fetch error
    }
    attempts++;
  }

  if (animeList.length === 0) {
    loadingText.innerText = "No anime found. Try different genres or score.";
    noteText.style.display = "block";
    return;
  }

  // Pick a random anime from the filtered list
  const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

  animeBox.innerHTML = `
    <h2>${randomAnime.title}</h2>
    <img src="${randomAnime.images.jpg.image_url}" alt="${randomAnime.title}" />
    <p><strong>Episodes:</strong> ${randomAnime.episodes || 'N/A'}</p>
    <p><strong>Score:</strong> ${randomAnime.score}</p>
    <p>${randomAnime.synopsis || 'No synopsis available.'}</p>
  `;

  animeBox.style.display = "block";
  loadingText.innerText = "";
}
