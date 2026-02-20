import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MovieActions from './movie.actions';
import { catchError, EMPTY, filter, forkJoin, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { MovieState } from './movie.reducer';
import { Store } from '@ngrx/store';
import { Movie } from '../../models/movie.model';
import { selectAllMovies } from './movie.selector';
import { MessageService } from 'primeng/api';

@Injectable()
export class MovieEffects {

    constructor(private actions$: Actions, private movieService: MovieService, private store: Store<{ movies: MovieState }>,
        private messageService: MessageService
    ) {
        this.loadActions();
    }

    loadMovies$: any;
    loadMovieById$: any;
    updateMovie$: any;
    deleteMovie$: any;
    notificationSuccess$: any;
    notificationFailure$: any;
    loadFavoriteMovies$: any;
    favoriteMovie$: any;
    unfavoriteMovie$: any;

    private loadActions() {

        ////
        // Load movie(s) and pass through fog
        //

        this.loadMovies$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.loadMovies),
                mergeMap((action) =>
                    this.movieService.getMovies(action.page).pipe(
                        // 
                        map(res => ({ ...res, results: this.movieService.transformMovies(res.results) })),
                        map(res => MovieActions.loadMoviesSuccess({ movies: res.results })),
                        catchError(error => of(MovieActions.loadMoviesFailure({ error })))
                    )
                )
            )
        );

        this.loadMovieById$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.loadMovieById),
                withLatestFrom(this.store.select(selectAllMovies)),
                switchMap(([action, entities]) => {
                    const movieFromStore = entities[action.id];
                    // Step 1: get the movie (from store or HTTP)
                    const movie$ = movieFromStore
                        ? of(movieFromStore) // already in store
                        : this.movieService.getMovieById(action.id).pipe(
                            map(movie => this.movieService.transformMovie(movie))
                        );
                    // Step 2: after getting movie, make 3 parallel calls
                    return movie$.pipe(
                        switchMap(movie =>
                            forkJoin({
                                images: this.movieService.getImages(movie.id),
                                credits: this.movieService.getCredits(movie.id),
                                similar: this.movieService.getSimilar(movie.id),
                                reviews: this.movieService.getReviews(movie.id)
                            }).pipe(
                                map(({ images, credits, similar, reviews }) => {
                                    const details = {
                                        ...movie,
                                        images,
                                        credits,
                                        similar,
                                        reviews
                                    };
                                    return MovieActions.loadMovieByIdSuccess({ movie: details });
                                })
                            )
                        ),
                        catchError(error => of(MovieActions.loadMovieByIdFailure({ error })))
                    );
                })
            )
        );

        ////
        // Update / Delete movie
        ////

        this.updateMovie$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.updateMovie),
                mergeMap((action) =>
                    this.movieService.updateMovie(action.movie).pipe(
                        map(updatedMovie => MovieActions.updateMovieSuccess({ movie: updatedMovie })),
                        catchError(error => of(MovieActions.loadMoviesFailure({ error })))
                    )
                )
            )
        );

        this.deleteMovie$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.deleteMovie),
                mergeMap((action) =>
                    this.movieService.deleteMovie(action.movie).pipe( // Simulate delete operation
                        map(movie => MovieActions.deleteMovieSuccess({ movie })),
                        catchError(error => of(MovieActions.deleteMovieFailure({ error })))
                    )
                )
            )
        );

        ////
        // Favourite / Unfavourite
        ////

        this.loadFavoriteMovies$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.loadFavoriteMovies),
                mergeMap(() =>
                    this.movieService.getFavoriteMovies().pipe(
                        map(movies => this.movieService.transformMovies(movies)), // Transform movies if needed
                        map(movies => MovieActions.loadFavoriteMoviesSuccess({ movies })),
                        catchError(error => of(MovieActions.loadFavoriteMoviesFailure({ error })))
                    )
                )
            )
        );

        this.favoriteMovie$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.favoriteMovie),
                mergeMap((action) =>
                    this.movieService.favoriteMovie(action.movie).pipe(
                        map(movie => MovieActions.favoriteMovieSuccess({ movie })),
                        catchError(error => of(MovieActions.favoriteMovieFailure({ error })))
                    )
                )
            )
        );

        this.unfavoriteMovie$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.unfavoriteMovie),
                mergeMap((action) =>
                    this.movieService.unfavoriteMovie(action.movie).pipe(
                        map(movie => MovieActions.unfavoriteMovieSuccess({ movie }))
                    )
                )
            )
        );

        ////
        // Notifications
        ////

        this.notificationSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.updateMovieSuccess, MovieActions.deleteMovieSuccess, MovieActions.favoriteMovieSuccess,
                    MovieActions.unfavoriteMovieSuccess),
                map(action => {
                    let message: string;
                    switch (action.type) {
                        case MovieActions.updateMovieSuccess.type:
                            message = `Movie "${action.movie.title}" updated successfully!`;
                            break;
                        case MovieActions.deleteMovieSuccess.type:
                            message = `Movie "${action.movie.title}" deleted successfully!`;
                            break;
                        case MovieActions.favoriteMovieSuccess.type:
                            message = `Movie "${action.movie.title}" favorited successfully!`;
                            break;
                        default:
                            message = `Movie "${action.movie.title}" unfavorited successfully!`;
                    }
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
                })
            ), { dispatch: false }
        );

        this.notificationFailure$ = createEffect(() =>
            this.actions$.pipe(
                ofType(MovieActions.loadMoviesFailure, MovieActions.loadMovieByIdFailure, MovieActions.updateMovieFailure,
                    MovieActions.deleteMovieFailure, MovieActions.favoriteMovieFailure, MovieActions.unfavoriteMovieFailure),
                map(action => {
                    const message = action.error?.message || 'An error occurred while processing your request.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
                })
            ), { dispatch: false }
        );
    }
}