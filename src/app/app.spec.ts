import { TestBed } from '@angular/core/testing';
import { App } from './app';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const mockActivatedRoute = {
  params: of({ id: 1 }),
  queryParams: of({}),
  snapshot: {
    paramMap: {
      get: (key: string) => '1',
    },
    queryParamMap: {
      get: (key: string) => null,
    },
  },
};

const initialState = {
  movies: {
    movies: [
      { id: 1, title: 'Test Movie' }
    ]
  }
};

describe('App', () => {

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
      imports: [App],
      providers: [
        provideMockStore({ initialState }), 
        MessageService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }  
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-content'))
  });
});
