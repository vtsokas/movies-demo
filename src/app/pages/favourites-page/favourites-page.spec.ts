import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesPage } from './favourites-page';
import { provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';

const initialState = {
  movies: {
    favouriteMovies: [
      { id: 1, title: 'Test Movie' }
    ]
  },
  genres: [{
    id: 1,
    name: 'Test Genre'
  }]
};

describe('FavouritesPage', () => {
  let component: FavouritesPage;
  let fixture: ComponentFixture<FavouritesPage>;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },        // deprecated, still called by some libs
        removeListener: () => { },     // deprecated
        addEventListener: () => { },   // new method
        removeEventListener: () => { },// new method
        dispatchEvent: () => false,
        scrollTo: () => false,
      }),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesPage],
      providers: [provideMockStore({ initialState }),]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FavouritesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies$', async () => {
    const movies = await firstValueFrom(component.movies$);
    expect(movies.length).toBeGreaterThan(0);
  });

});
