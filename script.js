document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'f9c5d189f16c809ab236d9416d22d1f6';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const genreMap = {};

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOWM1ZDE4OWYxNmM4MDlhYjIzNmQ5NDE2ZDIyZDFmNiIsIm5iZiI6MTczMTkxMTEwOS40NzUxMDMsInN1YiI6IjY3MjhjOGVkMmUxYjc5NzhkYmIzOWM5NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mIHy_I27isktJg82J42ErK7Iy9iiE66NJRhW4tksyv4'
        }
      };
      
          
    
    

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
                <div class="movie-overlay">
                    <h3>${movie.title}</h3>
                    <p>Year: ${movie.release_date.split('-')[0]}</p>
                    <p>Genres: ${movie.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ')}</p>
                </div>
            `;
            container.appendChild(slide);
        });

        new Swiper('.swiper-releases', {
            loop: true,
            slidesPerView: 3, // Display 3 slides at a time
            spaceBetween: 20, // Space (in px) between slides
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          });

        // new Swiper('.swiper-releases', {
        //     loop: true,
        //     navigation: {
        //         nextEl: '.swiper-button-next-release',
        //         prevEl: '.swiper-button-prev-release',
        //     },
        // });
    }

    async function fetchGenres() {
        try {
            const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();

            data.genres.forEach(genre => {
                genreMap[genre.id] = genre.name;
            });
            setupGenreClickHandlers(data.genres.slice(0, 5));
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    }

    function setupGenreClickHandlers(genres) {
        const genresContainer = document.querySelector('.genres');
        if (!genresContainer) return console.error('Genres container not found');

        genresContainer.innerHTML = ''; // Clear previous genres

        genres.forEach(genre => {
            const genreLink = document.createElement('a');
            genreLink.href = '#';
            genreLink.textContent = genre.name;
            genreLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent page reload
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
        container.innerHTML = ''; // Clear previous movies

        const genreHeader = document.querySelector('.genreSection .selected-genre');
        if (genreHeader) {
            genreHeader.textContent = `Movies in Genre: ${genreName}`;
        }

        if (movies.length === 0) {
            container.innerHTML = `<p>No movies found for this genre.</p>`;
            return;
        }

        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <div class="movie-overlay">
                    <h3>${movie.title}</h3>
                    <p>Year: ${movie.release_date.split('-')[0]}</p>
                    <p>Genres: ${genreName}</p>
                </div>
            `;
            container.appendChild(slide);
        });

        new Swiper('.swiper-genres', {
            slidesPerView: 3,
            spaceBetween: 20,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
          
    }

    const swiper = new Swiper('.swiper', {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });

    fetchGenres().then(fetchLatestMovies);
});
