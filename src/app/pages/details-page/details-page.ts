import { Component, Input, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card-component/card-component';
import { Movie } from '../../models/movie.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MovieState } from '../../store/movie/movie.reducer';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Genre } from '../../models/genre.model';
import { GenreState } from '../../store/genre/genre.reducer';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { selectCurrentMovie } from '../../store/movie/movie.selector';
import { selectGenres } from '../../store/genre/genre.selector';
import { SimilarComponent } from "../../components/similar-component/similar-component";
import { CastingComponent } from "../../components/casting-component/casting-component";
import { ReviewsComponent } from "../../components/reviews-component/reviews-component";
import { GalleryComponent } from "../../components/gallery-component/gallery-component";

@Component({
  standalone: true,
  selector: 'app-details-page',
  imports: [CardComponent, CommonModule, CardModule, DataViewModule, DividerModule,
    SimilarComponent, CastingComponent, ReviewsComponent, GalleryComponent],
  templateUrl: './details-page.html',
  styleUrl: './details-page.scss',
})
export class DetailsPage implements OnInit {
  //
  // Variable declarations
  //
  // Observables for the store
  movie$: Observable<Movie | null> = new Observable<Movie | null>();
  genres$: Observable<Genre[] | null> = new Observable<Genre[] | null>();

  //
  // Component lifecycle
  //
  // Inject the router and the store for both movies and genres
  constructor(private route: ActivatedRoute, private store: Store<{ movies: MovieState, genres: GenreState }>) {
    this.movie$ = this.store.select(selectCurrentMovie);
    this.genres$ = this.store.select(selectGenres);
  }
  // Dispatch load requests
  ngOnInit(): void {
    this.store.dispatch({ type: '[Movies] Load Movie By ID', id: parseInt(this.route.snapshot.paramMap.get('id') || '0') });
    this.store.dispatch({ type: '[Genres] Load Genres' });
  }

  //
  // UI Helpers
  //
  getPosterUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'assets/placeholder.png';
  }
}
