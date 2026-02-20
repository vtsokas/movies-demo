// src/app/todos/ui/todo-list.component.ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MovieState } from './store/movie/movie.reducer';
import { Movie } from './models/movie.model';
import { Observable } from 'rxjs';
import * as MovieActions from './store/movie/movie.actions';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, ProgressSpinnerModule, RouterOutlet, MenubarModule, IconFieldModule, InputTextModule, InputIconModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    sessionStorage.removeItem('scrollPosition'); // clear saved scroll position when leaving app
    sessionStorage.removeItem('lastLoadedPage'); // clear saved last loaded page when leaving app
  }

  items = [
    { label: 'Home', routerLink: '/' },
    { label: 'Movies', routerLink: '/cards' },
    { label: 'Favourites', routerLink: '/favourites' }
  ];
  
  // movies$: Observable<Movie[]> = new Observable<Movie[]>();
  // loading$: Observable<boolean> = new Observable<boolean>();

  constructor(private store: Store<{ movies: MovieState }>) {}

  ngOnInit() {
    // this.loading$ = this.store.select(state => state.movies.loading);
    // this.movies$ = this.store.select(state => state.movies.movies);
    sessionStorage.removeItem('scrollPosition'); // clear saved scroll position when leaving app
    sessionStorage.removeItem('lastLoadedPage'); // clear saved last loaded page when leaving app
  }

  onFilter(filter: string) {
    this.store.dispatch(MovieActions.setFilter({ filter }));
  }

  // load() {
  //   this.store.dispatch(MovieActions.loadMovies());
  // }
}
