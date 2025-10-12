const API_KEY = '269890f657dddf4635473cf4cf456576';
const API_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieListContainer = document.getElementById('movie-list'); 
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let genresMap = {};

async function fetchGenres() {
    try {
        const response = await fetch(`${API_URL}genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        data.genres.forEach(genre => {
            genresMap[genre.id] = genre.name;
        });
    } catch (error) {
        console.error("Не удалось загрузить жанры:", error);
    }
}

async function displayPopularMovies() {
    try {
        const response = await fetch(`${API_URL}movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        renderMovieList(data.results);
    } catch (error) {
        console.error("Не удалось загрузить популярные фильмы:", error);
    }
}

async function searchMovies(query) {
    if (!query) return;
    try {
        const response = await fetch(`${API_URL}search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        renderMovieList(data.results);
    } catch (error) {
        console.error("Ошибка при поиске фильмов:", error);
    }
}

function renderMovieList(movies) {
    movieListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        const posterPath = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : 'placeholder.png';
        const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
        const genres = movie.genre_ids.map(id => genresMap[id]).filter(name => name).slice(0, 3);
        const genresHTML = genres.map(genre => `
            <span class="inline-block bg-slate-700 text-sky-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                ${genre}
            </span>
        `).join(''); 

        const voteCount = movie.vote_count.toLocaleString('en-US');

        movieCard.innerHTML = `
            <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
                <div>
                    <img
                        src="${posterPath}"
                        alt="${movie.title}"
                        class="h-60 object-cover"
                    />
                </div>
                <div class="p-4 md:w-2/3 flex flex-col">
                    <h2 class="text-2xl font-bold text-white mb-2">${movie.title}</h2>
                    <div class="flex items-center space-x-4 text-slate-400 text-sm mb-4 flex-wrap">
                        <span>${year}</span>
                        <span class="before:content-['•'] before:mr-4">${voteCount} Votes</span> 
                        <div class="flex items-center before:content-['•'] before:mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>${movie.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                    <div class="mb-4 flex flex-wrap gap-y-2">
                        ${genresHTML}
                    </div>
                    <p class="text-slate-300 leading-relaxed line-clamp-3 md:line-clamp-3">
                        ${movie.overview || "No overview available."}
                    </p>
                </div>
            </div>
        `;
        movieListContainer.appendChild(movieCard);
    });
}


async function initializeApp() {
    await fetchGenres();
    displayPopularMovies();
}

document.addEventListener('DOMContentLoaded', initializeApp);

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        displayPopularMovies();
    }
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            displayPopularMovies();
        }
    }
});