import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-similar-component',
  imports: [CommonModule],
  templateUrl: './similar-component.html',
  styleUrl: './similar-component.scss',
})
export class SimilarComponent {

  @Input() movie: Movie = {} as Movie;

  getPosterUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : 'assets/placeholder.png';
  }
  
}
