import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card-component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

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

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
