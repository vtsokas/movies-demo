// src/app/todos/data-access/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Movie, MovieResponse } from '../models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovieService {

    // Movie DB url to fetch movies
    private API_URL = environment.apiUrl + '/discover/movie';

    // Inject http
    constructor(private http: HttpClient) { }
    
    ////////////////////////////////////////
    /////////////// FOG ////////////////////
    ////////////////////////////////////////

    // Update movie at fog
    updateMovie(movie: Movie): Observable<Movie> {
        var updatedMovies = localStorage.getItem('updatedMovies');
        var movies: Movie[] = updatedMovies ? JSON.parse(updatedMovies) : [];
        const index = movies.findIndex(m => m.id === movie.id);
        if (index !== -1) {
            movies[index] = movie;
        } else {
            movies.push(movie);
        }
        localStorage.setItem('updatedMovies', JSON.stringify(movies));
        return of(movie);
    }

    // Delete movie at fog
    deleteMovie(movie: Movie): Observable<Movie> {
        var deletedMovies = localStorage.getItem('deletedMovies');
        var movies: number[] = deletedMovies ? JSON.parse(deletedMovies) : [];
        if (!movies.includes(movie.id)) {
            movies.push(movie.id);
            localStorage.setItem('deletedMovies', JSON.stringify(movies));
        }
        return of(movie);
    }

    // Favourite a movie at fog
    favoriteMovie(movie: Movie): Observable<Movie> {
        var favoriteMovies = localStorage.getItem('favoriteMovies');
        var movies: Movie[] = favoriteMovies ? JSON.parse(favoriteMovies) : [];
        if (!movies.find(m => m.id === movie.id)) {
            movies.push(movie);
            localStorage.setItem('favoriteMovies', JSON.stringify(movies));
        }
        return of(movie);
    }

    // Unfavourite a movie at fog
    unfavoriteMovie(movie: Movie): Observable<Movie> {
        var favoriteMovies = localStorage.getItem('favoriteMovies');
        var movies: Movie[] = favoriteMovies ? JSON.parse(favoriteMovies) : [];
        movies = movies.filter(m => m.id !== movie.id);
        localStorage.setItem('favoriteMovies', JSON.stringify(movies));
        return of(movie);
    }
    
    // Get favourite movies from fog
    getFavoriteMovies(): Observable<Movie[]> {
        var favoriteMovies = localStorage.getItem('favoriteMovies');
        var movies: Movie[] = favoriteMovies ? JSON.parse(favoriteMovies) : [];
        return of(movies);
    }

    ////////////////////////////////////////
    ///////////// CLOUD ////////////////////
    ////////////////////////////////////////

    // Get movies from cloud using pagination
    getMovies(pageNum: number): Observable<MovieResponse> {
        return this.http.get<MovieResponse>(this.API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            },
            params: {
                page: pageNum
            }
        });
    }

    // Get one movie from cloud
    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${environment.apiUrl}/movie/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            }
        });
    }

    // Get similar movies from cloud
    getSimilar(id: number): Observable<MovieResponse> {
        return this.http.get<MovieResponse>(`${environment.apiUrl}/movie/${id}/similar`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            }
        });
    }

    // Get reviews from cloud
    getReviews(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/movie/${id}/reviews`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            }
        });
    }

    // Get images from cloud
    getImages(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/movie/${id}/images`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            }
        });
    }

    // Get credits from cloud
    getCredits(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/movie/${id}/credits`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${environment.apiToken}`
            }
        });
    }

    ////////////////////////////////////////
    ///////////// MERGE ////////////////////
    ////////////////////////////////////////

    // Pass a movie through fog
    transformMovie(movie: Movie): Movie {
        var updatedMovies = localStorage.getItem('updatedMovies');
        var updatedMovie = updatedMovies ? JSON.parse(updatedMovies).find((m: Movie) => m.id === movie.id) : null;
        return updatedMovie ? updatedMovie : movie;
    }

    // Pass movies through fog
    transformMovies(movies: Movie[]): Movie[] {
        var updatedMovies = localStorage.getItem('updatedMovies');
        var deletedMovies = localStorage.getItem('deletedMovies');
        var favoriteMovies = localStorage.getItem('favoriteMovies');
        var deletedMoviesList: number[] = deletedMovies ? JSON.parse(deletedMovies) : [];
        var updatedMoviesList: Movie[] = updatedMovies ? JSON.parse(updatedMovies) : [];
        var favoriteMoviesList: Movie[] = favoriteMovies ? JSON.parse(favoriteMovies) : [];
        return movies.filter(movie => !deletedMoviesList.includes(movie.id)).map(movie => {
            const updatedMovie = updatedMoviesList.find(m => m.id === movie.id);
            const isFavorite = favoriteMoviesList.find(m => m.id === movie.id) !== undefined;
            return updatedMovie ? { ...updatedMovie, isFavorite } : { ...movie, isFavorite };
        });
    }
}
