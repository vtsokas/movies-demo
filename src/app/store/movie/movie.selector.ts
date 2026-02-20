import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { MovieState } from './movie.reducer';
import { GenreState } from '../genre/genre.reducer';
import { Movie } from '../../models/movie.model';

export const selectMoviesState = createFeatureSelector<MovieState>('movies');
export const selectGenresState = createFeatureSelector<GenreState>('genres');

export const selectAllMovies = createSelector(
  selectMoviesState,
  (state: MovieState) => state.movies
);

export const selectFilter = createSelector(
  selectMoviesState,
  (state: MovieState) => state.filter
);

export const selectLoading = createSelector(
  selectMoviesState,
  (state: MovieState) => state.loading
);

export const selectCurrentMovie = createSelector(
  selectMoviesState,
  (state: MovieState) => state.currentMovie
);

export const selectFilteredMovies = createSelector(
  selectAllMovies,
  selectFilter,
  selectGenresState,
    (movies, filter, genresState) => {
        if (!filter) return movies;
        const lowerFilter = filter.toLowerCase();
        const genre = genresState.genres.find(g => g.name.toLowerCase().includes(lowerFilter));
        // Either match text content at any property, or match category name
        return movies.filter(movie => {
            const matchesGenre = genre ? movie.genre_ids.includes(genre.id) : true;
            const matchesText = JSON.stringify(movie).toLowerCase().includes(lowerFilter);
            return matchesGenre || matchesText;
        });
    }
);

export const selectFavoriteMovies = createSelector(
  selectMoviesState,
   (state: MovieState) => state.favouriteMovies
);