import { Component } from '@angular/core';
import { CardPage } from '../card-page/card-page';
import { CardComponent } from '../../components/card-component/card-component';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { selectAllMovies, selectFavoriteMovies } from '../../store/movie/movie.selector';
import { GenreState } from '../../store/genre/genre.reducer';
import { MovieState } from '../../store/movie/movie.reducer';
import { Store } from '@ngrx/store';
import { loadFavoriteMovies } from '../../store/movie/movie.actions';
import { loadGenres } from '../../store/genre/genre.actions';

@Component({
  standalone: true,
  selector: 'app-favourites-page',
  imports: [CardComponent, CommonModule, RatingModule, FormsModule],
  templateUrl: './../card-page/card-page.html',
  styleUrl: './../card-page/card-page.scss',
})
export class FavouritesPage extends CardPage {
  // Override OnInit to load different data (favourite movies)
  override ngOnInit(): void {
    this.movies$ = this.store.select(selectFavoriteMovies);
    this.loading$ = this.store.select(state => state.movies.loading);
    this.genres$ = this.store.select(state => state.genres.genres);
    // Always load here
    this.load();
  }

  // Do not activatrete infinite scroll on favourites page, as it 
  // only shows a limited number of movies
  override ngAfterViewInit(): void {
    // Always begin from top
    window.scrollTo(0,0);
  }

  // Override load for different data
  override load(): void {
    this.store.dispatch(loadFavoriteMovies());
    this.store.dispatch(loadGenres());
  }

  // Always show at this page
  override getCardVisibility(index: number): boolean {
    return true; 
  }
}
