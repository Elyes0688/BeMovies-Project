document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'f9c5d189f16c809ab236d9416d22d1f6';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const genreMap = {};

    // Sélection des éléments de recherche
    const searchInput = document.querySelector('.searchbar .input');
    const searchButton = document.querySelector('.searchbar .submit');
    const searchResultsContainer = document.querySelector('.swiper-search .swiper-wrapper');

    // Sélection des éléments du popup movie
    const popupMovie = document.querySelector('.popup-movie');
    const closePopup = document.querySelector('.close-pop');
    const popupTitle = document.getElementById('popup-title');
    const popupYear = document.getElementById('popup-year');
    const popupSynopsis = document.getElementById('popup-synopsis');

    // Sélection des éléments du modal Login/Sign Up
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close-modal');
    const loginSection = document.querySelector('.login');
    const signupSection = document.querySelector('.signup');
    const switchToSignup = document.querySelector('.switch-to-signup');
    const switchToLogin = document.querySelector('.switch-to-login');

    const loginLink = document.querySelector('.navbar a[href="#login"]');
    const registerLink = document.querySelector('.navbar a[href="#register"]');

    // Fonction pour afficher les informations du film dans le popup
    function showMoviePopup(movie) {
        popupTitle.textContent = movie.title || 'No title available';
        popupYear.textContent = `Release Year: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}`;
        popupSynopsis.textContent = movie.overview || 'No synopsis available.';
        popupMovie.style.display = 'block';
    }

    // Fermer le popup movie
    closePopup.addEventListener('click', () => {
        popupMovie.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popupMovie) {
            popupMovie.style.display = 'none';
        }
    });

    // Modal Login/Sign Up
    loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'block';
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
    });

    registerLink.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'block';
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    switchToSignup.addEventListener('click', (event) => {
        event.preventDefault();
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    switchToLogin.addEventListener('click', (event) => {
        event.preventDefault();
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
    });

    // Initialisation des sliders Swiper
    function initializeSwiper(selector) {
        return new Swiper(selector, {
            loop: true,
            slidesPerView: 3,
            spaceBetween: 20,
            navigation: {
                nextEl: `${selector} + .swiper-button-next`,
                prevEl: `${selector} + .swiper-button-prev`,
            },
            pagination: {
                el: `${selector} + .swiper-pagination`,
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
    }

    // Fetch genres
    async function fetchGenres() {
        try {
            const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();

            data.genres.forEach((genre) => {
                genreMap[genre.id] = genre.name;
            });
            setupGenreClickHandlers(data.genres.slice(0, 5));
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    }

    // Fetch latest movies
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

    // Fetch search results
    async function fetchSearchResults(query) {
        try {
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            displaySearchResults(data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    // Fetch movies by genre
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

    // Display latest movies
    function displayLatestMovies(movies) {
        const container = document.querySelector('.swiper-releases .swiper-wrapper');
        if (!container) return console.error('Container for latest movies not found');
        container.innerHTML = '';

        movies.forEach((movie) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
                <div class="movie-overlay">
                    <h3>${movie.title}</h3>
                    <p>Year: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                </div>
            `;
            slide.addEventListener('click', () => showMoviePopup(movie));
            container.appendChild(slide);
        });

        initializeSwiper('.swiper-releases');
    }

    // Display search results
    function displaySearchResults(movies) {
        if (!searchResultsContainer) return console.error('Search results container not found');
        searchResultsContainer.innerHTML = '';

        if (movies.length === 0) {
            searchResultsContainer.innerHTML = `<div class="swiper-slide"><p>No results found for your search.</p></div>`;
            initializeSwiper('.swiper-search');
            return;
        }

        movies.forEach((movie) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
                <div class="movie-overlay">
                    <h3>${movie.title}</h3>
                    <p>Year: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                </div>
            `;
            slide.addEventListener('click', () => showMoviePopup(movie));
            searchResultsContainer.appendChild(slide);
        });

        initializeSwiper('.swiper-search');
    }

    // Display movies by genre
    function displayMoviesByGenre(movies, genreName) {
        const container = document.querySelector('.swiper-genres .swiper-wrapper');
        if (!container) return console.error('Container for genre movies not found');
        container.innerHTML = '';

        const genreHeader = document.querySelector('.genreSection .selected-genre');
        if (genreHeader) {
            genreHeader.textContent = `Movies in Genre: ${genreName}`;
        }

        if (movies.length === 0) {
            container.innerHTML = `<p>No movies found for this genre.</p>`;
            return;
        }

        movies.forEach((movie) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
                <div class="movie-overlay">
                    <h3>${movie.title}</h3>
                    <p>Year: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                </div>
            `;
            slide.addEventListener('click', () => showMoviePopup(movie));
            container.appendChild(slide);
        });

        initializeSwiper('.swiper-genres');
    }

    // Set up genres click handlers
    function setupGenreClickHandlers(genres) {
        const genresContainer = document.querySelector('.genres');
        if (!genresContainer) return console.error('Genres container not found');

        genresContainer.innerHTML = '';

        genres.forEach((genre) => {
            const genreLink = document.createElement('a');
            genreLink.href = '#';
            genreLink.textContent = genre.name;
            genreLink.addEventListener('click', (event) => {
                event.preventDefault();
                fetchMoviesByGenre(genre.id, genre.name);
            });
            genresContainer.appendChild(genreLink);
        });
    }

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchSearchResults(query);
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                fetchSearchResults(query);
            }
        }
    });

    fetchGenres();
    fetchLatestMovies();
});
