import {Component, EventEmitter, Output, input, ChangeDetectionStrategy, output} from '@angular/core';
import { NgFor } from '@angular/common';
import { MovieListItemComponent } from "../movie-list-item/movie-list-item.component";
import { Movie } from "../../../types/movie.types";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [NgFor, MovieListItemComponent],
  template: `
    <ul class="bg-white rounded-lg shadow-md overflow-hidden divide-y divide-gray-200">
      @for (movie of movies(); track movie.id) {
        <li>
          <app-movie-list-item [movie]="movie" (edit)="editMovie.emit($event)" (delete)="deleteMovie.emit($event)" />
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  movies = input.required<Movie[]>();
  readonly editMovie = output<Movie>();
  readonly deleteMovie = output<Movie>();
}
