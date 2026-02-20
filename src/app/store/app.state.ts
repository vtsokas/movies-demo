import { Genre } from "../models/genre.model";
import { Movie } from "../models/movie.model";

export interface AppState {
    movies: Movie[];
    genres: Genre[];
    loading: boolean;
    error: any;
}