import { createReducer, on } from '@ngrx/store';
import * as MovieActions from './movie.actions';
import { Movie, MovieResponse } from '../../models/movie.model';

export interface MovieState {
    movies: Movie[];
    currentMovie: Movie | null;
    filter: string;
    favouriteMovies: Movie[];
    loading: boolean;
    error: any;
}

export const initialState: MovieState = {
    movies: [],
    currentMovie: null,
    filter: '',
    favouriteMovies: [],
    loading: false,
    error: null
};

export const movieReducer = createReducer(
    initialState,
    on(MovieActions.loadMovies, (state) => ({
        ...state,
        // keep existing movies while loading new ones
        movies: state.movies.concat(skeletonMovies), 
        loading: true,
        error: null
    })),
    on(MovieActions.loadMoviesSuccess, (state, { movies }) => ({
        ...state,
        // add new movies and remove any placeholders
        movies: state.movies.concat(movies).filter(m => m.id), 
        loading: false
    })),
    on(MovieActions.loadMoviesFailure, (state, { error }) => ({
        ...state,
        // remove any placeholders
        movies: state.movies.filter(m => m.id), 
        error: error,
        loading: false
    })),
    on(MovieActions.setFilter, (state, { filter }) => ({
        ...state,
        filter: filter
    })),
    on(MovieActions.loadMovieById, (state) => ({
        ...state,
        currentMovie: null,
    })),
    on(MovieActions.loadMovieByIdSuccess, (state, { movie }) => ({
        ...state,
        currentMovie: movie
    })),
    on(MovieActions.loadMovieByIdFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MovieActions.updateMovieSuccess, (state, { movie }) => ({
        ...state,
        // update the specific movie in the list
        movies: state.movies.map(m => m.id === movie.id ? movie : m) 
    })),
    on(MovieActions.updateMovieFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MovieActions.deleteMovieSuccess, (state, { movie }) => ({
        ...state,
        // remove from state
        movies: state.movies.filter(m => m.id !== movie.id)
    })),
    on(MovieActions.deleteMovieFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MovieActions.favoriteMovieSuccess, (state, { movie }) => ({
        ...state,
        // mark favourite at state
        movies: state.movies.map(m => m.id === movie.id ? { ...m, isFavorite: true } : m)
    })),
    on(MovieActions.favoriteMovieFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MovieActions.unfavoriteMovieSuccess, (state, { movie }) => ({
        ...state,
        // mark unfavourite
        movies: state.movies.map(m => m.id === movie.id ? { ...m, isFavorite: false } : m),
        // remove from state
        favouriteMovies: state.favouriteMovies.map(m => m.id === movie.id ? { ...m, isFavorite: false } : m)
    })),
    on(MovieActions.unfavoriteMovieFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MovieActions.loadFavoriteMovies, (state) => ({
        ...state,
        loading: true
    })),
    on(MovieActions.loadFavoriteMoviesSuccess, (state, { movies }) => ({
        ...state,
        favouriteMovies: movies,
        loading: false
    }))
);

// placeholder movies for skeleton loading
const skeletonMovies = Array(20).fill({} as Movie); 