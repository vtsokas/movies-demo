import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { combineLatest, combineLatestWith, filter, fromEvent, map, Observable, pairwise, Subject, take, takeUntil, throttleTime } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieState } from '../../store/movie/movie.reducer';
import { Store } from '@ngrx/store';
import { loadMovies } from '../../store/movie/movie.actions';
import { CardComponent } from "../../components/card-component/card-component";
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { GenreState } from '../../store/genre/genre.reducer';
import { Genre } from '../../models/genre.model';
import { loadGenres } from '../../store/genre/genre.actions';
import { selectFilteredMovies, selectLoading } from '../../store/movie/movie.selector';

@Component({
  standalone: true,
  selector: 'app-card-page',
  imports: [CardComponent, CommonModule, RatingModule, FormsModule],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss',
})
export class CardPage implements OnInit, AfterViewInit, OnDestroy {
  //
  // Variable declarations
  //
  // Observables for the store
  movies$: Observable<Movie[]> = new Observable<Movie[]>();
  genres$: Observable<Genre[]> = new Observable<Genre[]>();
  loading$: Observable<boolean> = new Observable<boolean>();
  // A subject to react on destroy
  private destroy$ = new Subject<void>();
  // View child components to track their scroll position
  @ViewChildren(CardComponent, { read: ElementRef }) cardComponents!: QueryList<ElementRef>;
  // Local scroll variables
  lastLoadedPage = 1;
  scrollPosition = 0;
  // A simple array would be mutated on update
  // causing reactivity issues
  cardPositions = signal<boolean[]>([]);
  visibilityOffset: number = 1500;

  //
  // Component lifecycle
  //
  // Inject the store for both movies and genres
  constructor(protected store: Store<{ movies: MovieState, genres: GenreState }>) { }
  // On Init map our Observables to store selectors
  ngOnInit() {
    this.movies$ = this.store.select(selectFilteredMovies);
    this.loading$ = this.store.select(selectLoading);
    this.genres$ = this.store.select(state => state.genres.genres);
    // Restore last loaded page
    this.lastLoadedPage = parseInt(sessionStorage.getItem('lastLoadedPage') || '1');
    if (this.lastLoadedPage == 1) {
      // Load from here only when no other data loaded
      this.load();
    }
  }
  // After View Init
  ngAfterViewInit() {
    // Reset scroll position after page loads
    window.scrollTo(0, parseInt(sessionStorage.getItem('scrollPosition') || '0'));
    this.updateCardPositions();
    // Subscribe to window scroll
    fromEvent(window, 'scroll')
      .pipe(
        // Kill when this component is destroyed
        takeUntil(this.destroy$),
        // throttleTime(100),
        // only if not loading
        combineLatestWith(this.store.select(selectLoading)),
        filter(([_, loading]) => !loading),
        // This is a nasty fix. under certain circumstances 
        // the event run on other pages too
        // @Todo: watch event on internal element, adjust the calculations..
        filter(() => window.location.href.indexOf('cards') > -1),
        // check if near bottom
        filter(() => {
          this.scrollPosition = window.innerHeight + window.scrollY;
          // Save scroll position at any case
          sessionStorage.setItem('scrollPosition', (window.scrollY).toString()); 
          // Keep track of the distance of each card
          // from the spectrum of the page that is 
          // currently visible to the user
          this.updateCardPositions();
          const threshold = document.body.offsetHeight - 200;
          return this.scrollPosition >= threshold;
        }), 
      )
      .subscribe(() => {
        // Dispatch an action to load next page
        this.store.dispatch(loadMovies({ page: ++this.lastLoadedPage }));
        // Keep last loaded page in session
        sessionStorage.setItem('lastLoadedPage', this.lastLoadedPage.toString());
      });
  }
  // On destroy notify the destroy subject
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //
  // Data methods
  //
  // Request data to load
  load() {
    this.store.dispatch(loadMovies({ page: this.lastLoadedPage }));
    this.store.dispatch(loadGenres());
  }

  //
  // UI Helpers
  //
  // On scroll, keep track of each child's visibility
  updateCardPositions() {
    const scrollPosition = sessionStorage.getItem('scrollPosition') || 0;
    // Not to mutate
    var cardPositions = [...this.cardPositions()];
    this.cardComponents.forEach((c, i) => {
      var rect = c.nativeElement;
      // |position from top - current scroll position| should be less than the defined offset
      cardPositions[i] = Math.abs(rect?.offsetTop - +scrollPosition) < this.visibilityOffset;
    });
    this.cardPositions.set(cardPositions);
  }
  // Just retrieve from the signal
  getCardVisibility(index: number): boolean {
    return this.cardPositions()[index];
  }
}