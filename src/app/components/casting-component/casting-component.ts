import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  standalone: true,
  selector: 'app-casting-component',
  imports: [CommonModule],
  templateUrl: './casting-component.html',
  styleUrl: './casting-component.scss',
})
export class CastingComponent {

  @Input() movie: Movie = {} as Movie;

  getProfileUrl(path: string | null | undefined) {
    return path ? `https://image.tmdb.org/t/p/w200${path}` : 'assets/profile-placeholder.png';
  }
  
}
