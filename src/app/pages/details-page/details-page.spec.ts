import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPage } from './details-page';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

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
    currentMovie: {
      id: 1,
      title: 'Test Movie'
    }
  },
  genres: {
    genres: [{
      id: 1,
      name: 'Test Genre'
    }]
  }
};

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPage],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie$', async () => {
    const movie = await firstValueFrom(component.movie$);
    expect(movie != null).toBeTruthy();
  });

});
