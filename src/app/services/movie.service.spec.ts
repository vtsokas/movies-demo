import { TestBed } from '@angular/core/testing';
import { MovieService } from './movie.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Movie, MovieResponse } from '../models/movie.model';

describe('MovieService', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;

    const mockMovie: Movie = {
        adult: false,
        backdrop_path: '/test.jpg',
        genre_ids: [1, 2],
        id: 1,
        original_language: 'en',
        original_title: 'Test Movie',
        overview: 'Overview',
        popularity: 10,
        poster_path: '/poster.jpg',
        release_date: '2024-01-01',
        title: 'Test Movie',
        video: false,
        vote_average: 7.5,
        vote_count: 100,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovieService],
        });

        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);

        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify(); // verify no outstanding HTTP requests
    });

    /////////////////////////////////////////////
    //////////////// FOG METHODS ////////////////
    /////////////////////////////////////////////

    it('should update a movie in localStorage', (done) => {
        service.updateMovie(mockMovie).subscribe((movie) => {
            expect(movie).toEqual(mockMovie);

            const stored = JSON.parse(localStorage.getItem('updatedMovies')!);
            expect(stored.length).toBe(1);
            expect(stored[0].title).toBe('Test Movie');
        });
    });

    it('should delete a movie in localStorage', (done) => {
        service.deleteMovie(mockMovie).subscribe((movie) => {
            const deleted = JSON.parse(localStorage.getItem('deletedMovies')!);
            expect(deleted).toContain(mockMovie.id);
        });
    });

    it('should favorite and unfavorite a movie', (done) => {
        service.favoriteMovie(mockMovie).subscribe(() => {
            let favs = JSON.parse(localStorage.getItem('favoriteMovies')!);
            expect(favs[0].id).toBe(mockMovie.id);

            service.unfavoriteMovie(mockMovie).subscribe(() => {
                favs = JSON.parse(localStorage.getItem('favoriteMovies')!);
                expect(favs.length).toBe(0);
            });
        });
    });

    /////////////////////////////////////////////
    /////////////// CLOUD METHODS ///////////////
    /////////////////////////////////////////////

    it('should fetch movies from API', (done) => {
        const mockResponse: MovieResponse = { page: 1, results: [mockMovie], total_pages: 1, total_results: 1 };

        service.getMovies(1).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne((request) =>
            request.url.includes('/discover/movie') && request.params.get('page') === '1'
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should fetch a movie by id', (done) => {
        service.getMovieById(mockMovie.id).subscribe((res) => {
            expect(res).toEqual(mockMovie);
        });

        const req = httpMock.expectOne(`${service['API_URL'].replace('/discover/movie', '')}/movie/${mockMovie.id}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMovie);
    });

    /////////////////////////////////////////////
    /////////////// CLOUD METHODS ///////////////
    /////////////////////////////////////////////

    it('should transform movies using fog data', () => {
        // Save an updated movie in localStorage
        localStorage.setItem('updatedMovies', JSON.stringify([{ ...mockMovie, title: 'Updated Title' }]));
        const transformed = service.transformMovie(mockMovie);
        expect(transformed.title).toBe('Updated Title');

        // Test transformMovies with deleted & favorite
        localStorage.setItem('deletedMovies', JSON.stringify([2]));
        localStorage.setItem('favoriteMovies', JSON.stringify([mockMovie]));
        const movies = service.transformMovies([{ ...mockMovie }, { ...mockMovie, id: 2 }]);
        expect(movies.length).toBe(1); // movie with id 2 is deleted
        expect(movies[0].isFavorite).toBeTruthy();
    });

});
