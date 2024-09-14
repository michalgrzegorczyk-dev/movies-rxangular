import {Component, inject, ChangeDetectionStrategy, OnInit, DestroyRef} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from "@angular/common";
import {Movie} from "../../../types/movie.types";
import {MoviesService} from "../../../services/movies.service";
import {MovieFormComponent} from "../../dumb/movie-form/movie-form.component";
import {MovieSearchComponent} from "../../dumb/movie-search/movie-search.component";
import {ActionButtonsComponent} from "../../dumb/movie-list-action-buttons/action-buttons.component";
import {MovieListComponent} from "../../dumb/movie-list/movie-list.component";
import {rxState} from "@rx-angular/state";
import {MovieStateType} from "../../../types/movie-state.type";
import {SortBy} from "../../../types/movie-sort-by.type";
import {
  Subject,
  combineLatest,
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  EMPTY,
  first
} from "rxjs";
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
  imports: [RouterOutlet, NgForOf, NgIf, MovieFormComponent, MovieSearchComponent, ActionButtonsComponent, MovieListComponent],
  templateUrl: './movie-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListContainerComponent implements OnInit {
  readonly setFetchedMovieList$ = new Subject<Movie[]>();
  readonly fetchedMoviesTrigger$ = new Subject<void>();
  readonly deleteMovie$ = new Subject<Movie>();
  readonly deleteMovieHandler$ = this.deleteMovie$.pipe(switchMap((movie: Movie) => {
    if (movie.id) {
      return this.moviesService.deleteMovie(movie.id).pipe(tap(() => this.fetchedMoviesTrigger$.next()));
    }
    return EMPTY;
  }));
  readonly addMovie$ = new Subject<void>();
  readonly cancelMovie$ = new Subject<void>();
  readonly editMovie$ = new Subject<Movie>();
  readonly search$ = new Subject<string>();
  private readonly searchHandler$ = this.search$.pipe(debounceTime(500), distinctUntilChanged(), startWith(''));

  readonly sort$ = new Subject<SortBy>();
  readonly saveMovie$ = new Subject<Movie>();
  private readonly saveMovieHandler$ = this.saveMovie$.pipe(
    switchMap(movie => !!movie.id ? this.moviesService.updateMovie(movie) : this.moviesService.addMovie(movie)),
    tap(() => this.fetchedMoviesTrigger$.next())
  );
  private readonly sortHandler$ = this.sort$.pipe(startWith<SortBy>('title'), distinctUntilChanged());
  private readonly filteredMoviesHandler$ = combineLatest([this.setFetchedMovieList$, this.searchHandler$, this.sortHandler$])
    .pipe(
      map(([movies, search, sort]: [Movie[], string, SortBy]) => {
        const filtered = filterMovies(movies, search);
        return sortMovies(filtered, sort);
      })
    );
  private readonly moviesService = inject(MoviesService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = rxState<MovieStateType>(({set, connect}) => {
    set(INITIAL_STATE);
    connect('movies', this.setFetchedMovieList$);
    connect('selectedMovie', this.deleteMovieHandler$, () => null);
    connect('selectedMovie', this.saveMovieHandler$, () => null);
    connect('selectedMovie', this.addMovie$, () => ({title: '', year: new Date().getFullYear()}));
    connect('selectedMovie', this.cancelMovie$, () => null);
    connect('selectedMovie', this.editMovie$, (_, movie) => movie);
    connect('sortBy', this.sortHandler$, (_, sortBy) => sortBy);
    connect('filteredMovies', this.filteredMoviesHandler$);
  });

  readonly filteredMovies = this.state.signal('filteredMovies');
  readonly selectedMovie = this.state.signal('selectedMovie');

  ngOnInit(): void {
    this.fetchedMoviesTrigger$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadMovies());
    this.fetchedMoviesTrigger$.next();
  }

  private loadMovies(): void {
    this.moviesService.getMovies().pipe(first()).subscribe(movies => this.setFetchedMovieList$.next(movies))
  }
}
