import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from "rxjs";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { MoviesService } from "./movies.service";
import { MoviesState, Movie } from "./movie.types";
import { RxState } from "@rx-angular/state";
import {MovieFormComponent} from "./movie-form/movie-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgForOf, NgIf, MovieFormComponent],
  providers: [RxState],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly searchQuery$: Observable<string>;
  readonly filteredMovies$: Observable<Movie[]>;
  selectedMovie: Movie | null = null;

  constructor(
    private moviesService: MoviesService,
    private state: RxState<MoviesState>
  ) {
    this.state.set({
      movies: [],
      filteredMovies: [],
      searchQuery: '',
      sortBy: null
    });
    this.searchQuery$ = this.state.select('searchQuery');
    this.filteredMovies$ = this.state.select('filteredMovies');
  }

  ngOnInit() {
    this.loadMovies();
    this.state.connect('filteredMovies', this.state.select(['movies', 'searchQuery', 'sortBy']),
      ({movies, searchQuery, sortBy}) => {
        let filtered: Movie[] = movies.filter(movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (sortBy) {
          filtered = filtered.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
        }
        return filtered;
      }
    );
  }

  loadMovies() {
    this.moviesService.getMovies().subscribe(movies => {
      this.state.set({movies, filteredMovies: movies});
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.state.set({searchQuery: query});
  }

  onSort(sortBy: 'title' | 'year') {
    this.state.set({sortBy});
  }

  onAddNew() {
    this.selectedMovie = { title: '', year: new Date().getFullYear() };
  }

  onEdit(movie: Movie) {
    this.selectedMovie = {...movie};
  }

  onDelete(id: number) {
    this.moviesService.deleteMovie(id).subscribe(() => {
      this.loadMovies();
    });
  }

  onSave(movie: Movie) {
    if (movie.id !== undefined) {
      this.moviesService.updateMovie(movie).subscribe(() => {
        this.loadMovies();
        this.selectedMovie = null;
      });
    } else {
      this.moviesService.addMovie(movie).subscribe(() => {
        this.loadMovies();
        this.selectedMovie = null;
      });
    }
  }

  onCancel() {
    this.selectedMovie = null;
  }
}
