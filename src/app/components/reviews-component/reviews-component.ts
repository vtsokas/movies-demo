import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  standalone: true,
  selector: 'app-reviews-component',
  imports: [CommonModule],
  templateUrl: './reviews-component.html',
  styleUrl: './reviews-component.scss',
})
export class ReviewsComponent {

  @Input() movie: Movie = {} as Movie;
  
}
