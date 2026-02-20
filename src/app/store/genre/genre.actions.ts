import { createAction, props } from "@ngrx/store";
import { Genre } from "../../models/genre.model";

export const loadGenres = createAction(
    '[Genres] Load Genres',
);

export const loadGenresSuccess = createAction(
    '[Genres] Load Genres Success',
    props<{ genres: Genre[] }>()
);

export const loadGenresFailure = createAction(
    '[Genres] Load Genres Failure',
    props<{ error: any }>()
);
