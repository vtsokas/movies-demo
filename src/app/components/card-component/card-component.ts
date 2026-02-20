import { Component, Input, ViewChild } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Skeleton, SkeletonModule } from 'primeng/skeleton';
import { Genre } from '../../models/genre.model';
import { FormComponent } from "../form-component/form-component";
import { MovieState } from '../../store/movie/movie.reducer';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-card-component',
  imports: [ButtonModule, CardModule, RatingModule, CommonModule, FormsModule, SkeletonModule,
    ChipModule, SplitButtonModule, FormComponent, RouterModule],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
})
export class CardComponent {
  //
  // Variable declarations
  //
  // Data inputs
  @Input() movie: Movie = {} as Movie;
  @Input() genres: Genre[] = [];
  // UI inputs
  @Input() isDetailView: boolean = false;
  @Input() showContent: boolean = true;
  // View the form if any
  @ViewChild(FormComponent) formComponent!: FormComponent;
  // Local variables
  imageBasePath = 'https://image.tmdb.org/t/p/w342';
  editMode = false;
  // Card actions
  actions = [
    { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editMode = true },
    { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteMovie() },
    { label: 'Details', icon: 'pi pi-info-circle', command: () => this.navigateToDetails(this.movie.id) },
  ];

  //
  // Component lifecycle
  //
  // Dependency injection: The router and the store
  constructor(private router: Router, private store: Store<{ movies: MovieState }>) { }

  //
  // Data functionality
  //
  // Update current movie
  updateMovie() {
    // Take the form value of the child component
    if (this.formComponent && this.formComponent.movieForm && this.formComponent.movieForm.valid) {
      // Dispatch a [Movies] Update Movie action after patching the form object into the original one 
      this.store.dispatch({ type: '[Movies] Update Movie', movie: { ...this.movie, ...this.formComponent.movieForm.value } });
      this.editMode = false;
    }
  }
  // Delete current movie
  deleteMovie() {
    this.store.dispatch({ type: '[Movies] Delete Movie', movie: this.movie });
  }
  // Favourite or Unfavourite currrent movie
  toggleFavorite(movie: Movie) {
    if (movie.isFavorite) {
      this.store.dispatch({ type: '[Movies] Unfavorite Movie', movie });
    } else {
      this.store.dispatch({ type: '[Movies] Favorite Movie', movie });
    }
  }

  //
  // UI Helpers
  //
  // Get genres (categories) as an array of names
  getGenreNames(): string {
    var genreIds = this.movie.genre_ids || this.movie.genres?.map(g => g.id) || [];
    const genreNames = genreIds.map(id => this.genres?.find(g => g.id === id)?.name).filter(name => name);
    return genreNames.join(', ');
  }
  // Navigate to Details Page for the current movie
  navigateToDetails(id: number) {
    this.router.navigate([`/details/${id}`])
  }
  // Merge base path with poster path
  getImageUrl(path: string) {
    return this.imageBasePath + path;
  }

}
