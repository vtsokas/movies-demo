import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GenreActions from './genre.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { GenreService } from '../../services/genre.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class GenreEffects {

    constructor(private actions$: Actions, private genreService: GenreService, private messageService: MessageService) {
        this.loadActions();
    }

    loadGenres$: any;
    notificationSuccess$: any;
    notificationFailure$: any;

    private loadActions() {
        this.loadGenres$ = createEffect(() =>
            this.actions$.pipe(
                ofType(GenreActions.loadGenres),
                mergeMap((action) =>
                    this.genreService.getGenres().pipe(
                        map(res => GenreActions.loadGenresSuccess({ genres: res.genres })),
                        catchError(error => of(GenreActions.loadGenresFailure({ error })))
                    )
                )
            )
        );

        this.notificationFailure$ = createEffect(() =>
            this.actions$.pipe(
                ofType(GenreActions.loadGenresFailure),
                map(action => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to load genres: ${action.error.message || action.error}` });                    
                })
            ), { dispatch: false }
        );
    }
}