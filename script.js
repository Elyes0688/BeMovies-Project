document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'f9c5d189f16c809ab236d9416d22d1f6';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    async function fetchLatestMovies() {
        try {
            const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            displayLatestMovies(data.results);
        } catch (error) {
            console.error('Error fetching latest movies:', error);
        }
    }

    function displayLatestMovies(movies) {
        const container = document.querySelector('.swiper-releases .swiper-wrapper');
        if (!container) return console.error('Container for latest movies not found');
        container.innerHTML = '';

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;
            container.appendChild(slide);
        });

        new Swiper('.swiper-releases', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next-release',
                prevEl: '.swiper-button-prev-release',
            },
        });
    }

    async function fetchGenres() {
        try {
            const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            displayGenres(data.genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    }

    function displayGenres(genres) {
        const genresContainer = document.querySelector('.genres');
        if (!genresContainer) return console.error('Genres container not found');
        genresContainer.innerHTML = '';

        genres.forEach(genre => {
            const genreLink = document.createElement('a');
            genreLink.href = '#';
            genreLink.textContent = genre.name;
            genreLink.addEventListener('click', () => {
                fetchMoviesByGenre(genre.id, genre.name);
            });
            genresContainer.appendChild(genreLink);
        });
    }

    async function fetchMoviesByGenre(genreId, genreName) {
        try {
            const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            displayMoviesByGenre(data.results, genreName);
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
        }
    }

    function displayMoviesByGenre(movies, genreName) {
        const container = document.querySelector('.swiper-genres .swiper-wrapper');
        if (!container) return console.error('Container for genre movies not found');
        container.innerHTML = '';

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;
            container.appendChild(slide);
        });

        new Swiper('.swiper-genres', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next-genres',
                prevEl: '.swiper-button-prev-genres',
            },
        });
    }

    // Charger les sections
    fetchLatestMovies();
    fetchGenres();
});
