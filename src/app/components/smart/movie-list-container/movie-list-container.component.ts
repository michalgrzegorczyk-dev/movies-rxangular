import {Component, inject, ChangeDetectionStrategy, OnInit, effect} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Movie} from "../../../types/movie.types";
import {MoviesService} from "../../../services/movies.service";
import {MovieFormComponent} from "../../dumb/movie-form/movie-form.component";
import {SearchComponent} from "../../dumb/movie-search/search.component";
import {ActionButtonsComponent} from "../../dumb/movie-list-action-buttons/action-buttons.component";
import {MovieListComponent} from "../../dumb/movie-list/movie-list.component";
import {rxState} from "@rx-angular/state";
import {MovieStateType} from "../../../types/movie-state.type";
import {SortBy} from "../../../types/sorty-by.type";
import {Subject, combineLatest, startWith, map, debounceTime, distinctUntilChanged} from "rxjs";
import {sortMovies} from "../../../utils/sort-movies.util";
import {filterMovies} from "../../../utils/filter-moves.util";

const INITIAL_STATE: MovieStateType = {
  movies: [],
  sortBy: 'title',
  selectedMovie: null,
  filteredMovies: [],
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgForOf, NgIf, MovieFormComponent, SearchComponent, ActionButtonsComponent, MovieListComponent],
  templateUrl: './movie-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListContainerComponent implements OnInit {
  // EVENTS
  readonly moviesFetch$ = new Subject<Movie[]>();
  readonly delete$ = new Subject<Movie>();
  readonly add$ = new Subject<void>();
  readonly cancel$ = new Subject<void>();
  readonly searchQuery$ = new Subject<string>();
  readonly edit$ = new Subject<Movie>();
  readonly sort$ = new Subject<SortBy>();

  private readonly moviesService = inject(MoviesService);
  private readonly state = rxState<MovieStateType>(({set, connect}) => {
    set(INITIAL_STATE);
    connect('movies', this.moviesFetch$);
    connect('movies', this.delete$, (state, movie) => movie.id ? state.movies.filter(m => m.id !== movie.id) : state.movies);
    connect('selectedMovie', this.add$, () => ({title: '', year: new Date().getFullYear()}));
    connect('selectedMovie', this.cancel$, () => null);
    connect('selectedMovie', this.edit$, (_, movie) => movie);
    connect('sortBy', this.sort$, (_, sortBy) => sortBy);
    connect('filteredMovies', combineLatest([
        this.moviesFetch$,
        this.searchQuery$.pipe(debounceTime(400), distinctUntilChanged(), startWith('')),
        this.sort$.pipe(startWith<SortBy>('title'))
      ]).pipe(
        map(([movies, search, sort]: [Movie[], string, SortBy]) => {
          const filtered = filterMovies(movies, search);
          return sortMovies(filtered, sort);
        })
      )
    );
  });

  filteredMovies = this.state.signal('filteredMovies');
  selectedMovie = this.state.signal('selectedMovie');

  ngOnInit() {
    this.moviesService.getMovies().subscribe(movies => {
      this.moviesFetch$.next(movies);
    })
  }

  onSave(movie: Movie) {
    if (movie.id !== undefined) {
      this.moviesService.updateMovie(movie).subscribe(() => {
        // this.loadMovies();
        this.state.set({
          selectedMovie: null
        })
      });
    } else {
      this.moviesService.addMovie(movie).subscribe(() => {
        // this.loadMovies();
        this.state.set({
          selectedMovie: null
        })
      });
    }
  }
}
