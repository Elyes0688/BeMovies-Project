# BeMovies-Project

# BeMovies

**BeMovies** est un projet front-end permettant de rechercher et d’afficher des informations sur des films à partir de l’API de [The Movie Database (TMDb)](https://www.themoviedb.org/).  
Il inclut une barre de recherche, l’affichage des dernières sorties, la navigation par genre, ainsi que des pop-ups pour la connexion et l’inscription, et un pop-up détaillé pour consulter les informations d’un film.

## Sommaire

1. [Aperçu du Projet](#aperçu-du-projet)  
2. [Fonctionnalités](#fonctionnalités)  
3. [Technologies Utilisées](#technologies-utilisées)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [Structure des Fichiers](#structure-des-fichiers)  
7. [Personnalisation](#personnalisation)  
8. [Contributions](#contributions)  
9. [Licence](#licence)

---

## Aperçu du Projet

**BeMovies** vous permet de :

- **Rechercher** un film par son titre.  
- Consulter la liste des **dernières sorties** via l’endpoint *now_playing* de TMDb.  
- **Filtrer** les films par genre.  
- Ouvrir un **pop-up** pour accéder aux informations détaillées d’un film (titre, synopsis, année de sortie, etc.).  
- Gérer un **modal** de connexion et d’inscription (côté front seulement).

---

## Fonctionnalités

1. **Recherche de films**  
   - Saisie d’un titre dans la barre de recherche et affichage des résultats sous forme de carrousel Swiper.

2. **Dernières sorties**  
   - Récupération des films récents via **`/movie/now_playing`**.

3. **Navigation par genre**  
   - Chargement des genres (via **`/genre/movie/list`**).  
   - Affichage des films d’un genre choisi.

4. **Pop-up détaillé**  
   - Cliquez sur l’affiche d’un film pour afficher une fenêtre récapitulant ses informations principales.

5. **Modal de Connexion/Inscription**  
   - Formulaires de connexion et d’inscription simulés (sans backend).  
   - Possibilité de basculer entre les deux écrans.

---

## Technologies Utilisées

- **HTML5** pour la structure.
- **SCSS / CSS3** pour la mise en forme (avec `@mixin`, `@import`, etc.).
- **JavaScript (ES6)** pour la logique, la gestion du DOM et les appels API.
- **[Swiper.js](https://swiperjs.com/)** pour les carrousels.
- **[TMDb API](https://www.themoviedb.org/documentation/api)** pour la récupération des données de films.
- **Google Fonts** : *Inria Sans* et *Inter*.

---

## Installation

1. **Cloner le dépôt**  
   ```bash
   git clone https://github.com/<votre-compte-github>/BeMovies.git
