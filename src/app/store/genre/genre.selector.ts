import { createFeatureSelector, createSelector } from '@ngrx/store';

import { GenreState } from './genre.reducer';

export const selectGenreState = createFeatureSelector<GenreState>('genres');

export const selectGenres = createSelector(
    selectGenreState,
    (state: GenreState) => state.genres
);