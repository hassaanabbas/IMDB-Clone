const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OGQ4Y2YyYjI0NTQyMzgzNzg4NGVkYTZlNWIzMmE1ZCIsIm5iZiI6MTczMzYwNDUyMi44NDksInN1YiI6IjY3NTRiNGFhNmYzN2Y2ZTg5YWRjNDAxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ae0JPbb53GLXEr4seF9HrKfOQ2avYgJk6l4jR-nle6g';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const modal = document.getElementById('movieModal');
const closeButton = document.querySelector('.close');
const movieDetails = document.getElementById('movieDetails');

// Fetch options for TMDB API
const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
};

// Fetch popular movies by default
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular`, options);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Search movies
async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, options);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// Display movies in grid
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/200x300'}" 
                 alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        moviesGrid.appendChild(movieCard);
    });
}

// Fetch and show movie details
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}`, options);
        const movie = await response.json();
        
        movieDetails.innerHTML = `
            <div class="movie-details">
                <div class="movie-poster">
                    <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/300x450'}" 
                         alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <div class="movie-meta">
                        <p>Release Date: ${movie.release_date}</p>
                        <p>Rating: ${movie.vote_average}/10</p>
                        <p>Runtime: ${movie.runtime} minutes</p>
                    </div>
                    <div class="movie-overview">
                        <h3>Overview</h3>
                        <p>${movie.overview}</p>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initial load
fetchPopularMovies();