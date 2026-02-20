import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPage } from './card-page';
import { firstValueFrom } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Movie } from '../../models/movie.model';
import { selectAllMovies } from '../../store/movie/movie.selector';

const initialState = {
  movies: {
    movies: [
      { id: 1, title: 'Test Movie' }
    ]
  },
  genres: {
    genres: [
      { id: 1, title: 'Test Genre' }
    ]
  }
};

let store: MockStore;
let mockSelectMovies: any;

describe('CardPage', () => {
  let component: CardPage;
  let fixture: ComponentFixture<CardPage>;

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
      imports: [CardPage],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
    mockSelectMovies = store.overrideSelector(selectAllMovies, [
      { id: 1, title: 'Test Movie' } as Movie
    ])
    fixture = TestBed.createComponent(CardPage);
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

  it('should update movie$', async () => {
    const initialMovies = await firstValueFrom(component.movies$);
    expect(initialMovies[0].title).toBe('Test Movie');
    // Simulate update by overriding selector
    mockSelectMovies.setResult([{ id: 1, title: 'New Title' } as Movie]);
    store.refreshState(); // triggers selector emission
    const updatedMovies = await firstValueFrom(component.movies$);
    expect(updatedMovies[0].title).toBe('New Title');
  });


});
