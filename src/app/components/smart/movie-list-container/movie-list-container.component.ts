import {Component, inject, ChangeDetectionStrategy, OnInit, DestroyRef} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Movie} from "../../../types/movie.types";
import {MoviesService} from "../../../services/movies.service";
import {MovieFormComponent} from "../../dumb/movie-form/movie-form.component";
import {MovieSearchComponent} from "../../dumb/movie-search/movie-search.component";
import {ActionButtonsComponent} from "../../dumb/movie-list-action-buttons/action-buttons.component";
import {MovieListComponent} from "../../dumb/movie-list/movie-list.component";
import {rxState} from "@rx-angular/state";
import {MovieStateType} from "../../../types/movie-state.type";
import {SortBy} from "../../../types/sorty-by.type";
import {Subject, combineLatest, startWith, map, debounceTime, distinctUntilChanged, switchMap} from "rxjs";
import {sortMovies} from "../../../utils/sort-movies.util";
import {filterMovies} from "../../../utils/filter-moves.util";
import {tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

const INITIAL_STATE: MovieStateType = {
  movies: [],
  sortBy: 'title',
  selectedMovie: null,
  filteredMovies: [],
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgForOf, NgIf, MovieFormComponent, MovieSearchComponent, ActionButtonsComponent, MovieListComponent],
  templateUrl: './movie-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListContainerComponent implements OnInit {
  readonly fetchedMovies$ = new Subject<Movie[]>();
  readonly fetchedMoviesTrigger$ = new Subject<void>();
  readonly delete$ = new Subject<Movie>();
  readonly add$ = new Subject<void>();
  readonly cancel$ = new Subject<void>();
  readonly searchQuery$ = new Subject<string>();
  readonly edit$ = new Subject<Movie>();
  readonly sort$ = new Subject<SortBy>();
  readonly save$ = new Subject<Movie>();
  private readonly moviesService = inject(MoviesService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = rxState<MovieStateType>(({set, connect}) => {
    set(INITIAL_STATE);
    connect('movies', this.fetchedMovies$);
    connect('movies', this.delete$, (state, movie) => movie.id ? state.movies.filter(m => m.id !== movie.id) : state.movies);
    connect(this.save$.pipe(
      switchMap(movie => !!movie.id ? this.moviesService.updateMovie(movie) : this.moviesService.addMovie(movie)),
      tap(() => this.fetchedMoviesTrigger$.next())
    ), ((state, movies) => {
      return {
        ...state,
        movies,
        selectedMovie: null,
      }
    }));
    connect('selectedMovie', this.add$, () => ({title: '', year: new Date().getFullYear()}));
    connect('selectedMovie', this.cancel$, () => null);
    connect('selectedMovie', this.edit$, (_, movie) => movie);
    connect('sortBy', this.sort$, (_, sortBy) => sortBy);
    connect('filteredMovies', combineLatest([
        this.fetchedMovies$,
        this.searchQuery$.pipe(debounceTime(500), distinctUntilChanged(), startWith('')),
        this.sort$.pipe(startWith<SortBy>('title'))
      ]).pipe(
        map(([movies, search, sort]: [Movie[], string, SortBy]) => {
          const filtered = filterMovies(movies, search);
          return sortMovies(filtered, sort);
        })
      )
    );
  });

  readonly filteredMovies = this.state.signal('filteredMovies');
  readonly selectedMovie = this.state.signal('selectedMovie');

  ngOnInit(): void {
    this.fetchedMoviesTrigger$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadMovies());
    this.fetchedMoviesTrigger$.next();

    setInterval(() => {
      console.log('343434')
    }, 1000);
  }

  private loadMovies() {
    this.moviesService.getMovies().subscribe(movies => this.fetchedMovies$.next(movies))
  }
}
