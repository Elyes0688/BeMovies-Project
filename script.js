document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'f9c5d189f16c809ab236d9416d22d1f6';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    // Fonction pour récupérer les derniers films
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

    // Fonction pour afficher les derniers films
    function displayLatestMovies(movies) {
        const container = document.querySelector('.swiper-releases .swiper-wrapper');
        if (!container) {
            console.error('Container not found for latest movies');
            return;
        }
        container.innerHTML = ''; // Nettoyer les slides précédents

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;
            slide.addEventListener('click', () => showMovieDetails(movie));
            container.appendChild(slide);
        });

        // Initialisation de Swiper
        new Swiper('.swiper-releases', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next-release',
                prevEl: '.swiper-button-prev-release',
            },
        });
    }

    // Fonction pour afficher les détails d'un film
    function showMovieDetails(movie) {
        const popup = document.querySelector('.popup-movie');
        if (!popup) {
            console.error('Popup container not found');
            return;
        }
        popup.innerHTML = `
            <div class="modal-content">
                <h2>${movie.title}</h2>
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <p>${movie.overview}</p>
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        popup.style.display = 'block';

        // Bouton pour fermer la modale
        popup.querySelector('.close-modal').addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    // Appel initial pour charger les derniers films
    fetchLatestMovies();
});
