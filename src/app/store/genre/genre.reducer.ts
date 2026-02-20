import { createReducer, on } from '@ngrx/store';
import * as GenreActions from './genre.actions';
import { Movie, MovieResponse } from '../../models/movie.model';
import { Genre } from '../../models/genre.model';

export interface GenreState {
    genres: Genre[];
    loading: boolean;
    error: any;
}

export const initialState: GenreState = {
    genres: [],
    loading: false,
    error: null
};

export const genreReducer = createReducer(
    initialState,
    on(GenreActions.loadGenres, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(GenreActions.loadGenresSuccess, (state, { genres }) => ({
        ...state,
        genres: genres,
        loading: false
    })),
    on(GenreActions.loadGenresFailure, (state, { error }) => ({
        ...state,
        error: error,
        loading: false
    })),
);