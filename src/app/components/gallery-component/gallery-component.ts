import { Component, Input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { Movie } from '../../models/movie.model';

@Component({
  standalone: true,
  selector: 'app-gallery-component',
  imports: [GalleriaModule],
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.scss',
})
export class GalleryComponent {

  @Input() movie: Movie = {} as Movie;

  getImageUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '';
  }
  
}
