async function getRandomAnime() {
  const animeBox = document.getElementById("animeBox");
  const loadingText = document.getElementById("loading");

  animeBox.style.display = "none";
  loadingText.innerText = "Fetching something awesome...";

  try {
    const page = Math.floor(Math.random() * 50) + 1;
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    const data = await res.json();
    const animeList = data.data;
    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

    animeBox.innerHTML = `
      <h2>${randomAnime.title}</h2>
      <img src="${randomAnime.images.jpg.image_url}" alt="${randomAnime.title}" />
      <p><strong>Episodes:</strong> ${randomAnime.episodes || 'N/A'}</p>
      <p><strong>Score:</strong> ${randomAnime.score || 'N/A'}</p>
      <p>${randomAnime.synopsis || 'No synopsis available.'}</p>
    `;

    animeBox.style.display = "block";
    loadingText.innerText = "";
  } catch (error) {
    loadingText.innerText = "Oops! Something went wrong. Please try again.";
    console.error(error);
  }
}
