import { createAction, props } from "@ngrx/store";
import { Movie, MovieResponse } from "../../models/movie.model";

export const loadMovies = createAction(
    '[Movies] Load Movies',
    props<{ page: number }>()
);

export const loadMoviesSuccess = createAction(
    '[Movies] Load Movies Success',
    props<{ movies: Movie[] }>()
);

export const setFilter = createAction(
    '[Movies] Set Filter',
    props<{ filter: string }>()
);

export const loadMovieById = createAction(
    '[Movies] Load Movie By ID',
    props<{ id: number }>()
);

export const loadMovieByIdSuccess = createAction(
    '[Movies] Load Movie By ID Success',
    props<{ movie: Movie }>()
);

export const loadMovieByIdFailure = createAction(
    '[Movies] Load Movie By ID Failure',
    props<{ error: any }>()
);

export const loadMoviesFailure = createAction(
    '[Movies] Load Movies Failure',
    props<{ error: any }>()
);

export const updateMovie = createAction(
    '[Movies] Update Movie',
    props<{ movie: Movie }>()
);

export const updateMovieSuccess = createAction(
    '[Movies] Update Movie Success',
    props<{ movie: Movie }>()
);

export const updateMovieFailure = createAction(
    '[Movies] Update Movie Failure',
    props<{ error: any }>()
);

export const deleteMovie = createAction(
    '[Movies] Delete Movie',
    props<{ movie: Movie }>()
);

export const deleteMovieSuccess = createAction(
    '[Movies] Delete Movie Success',
    props<{ movie: Movie }>()
);

export const deleteMovieFailure = createAction(
    '[Movies] Delete Movie Failure',
    props<{ error: any }>()
);

export const favoriteMovie = createAction(
    '[Movies] Favorite Movie',
    props<{ movie: Movie }>()
);

export const favoriteMovieSuccess = createAction(
    '[Movies] Favorite Movie Success',
    props<{ movie: Movie }>()
);

export const favoriteMovieFailure = createAction(
    '[Movies] Favorite Movie Failure',
    props<{ error: any }>()
);

export const unfavoriteMovie = createAction(
    '[Movies] Unfavorite Movie',
    props<{ movie: Movie }>()
);

export const unfavoriteMovieSuccess = createAction(
    '[Movies] Unfavorite Movie Success',
    props<{ movie: Movie }>()
);

export const unfavoriteMovieFailure = createAction(
    '[Movies] Unfavorite Movie Failure',
    props<{ error: any }>()
);

export const loadFavoriteMovies = createAction(
    '[Movies] Load Favorite Movies'
);

export const loadFavoriteMoviesSuccess = createAction(
    '[Movies] Load Favorite Movies Success',
    props<{ movies: Movie[] }>()
);

export const loadFavoriteMoviesFailure = createAction(
    '[Movies] Load Favorite Movies Failure',
    props<{ error: any }>()
);