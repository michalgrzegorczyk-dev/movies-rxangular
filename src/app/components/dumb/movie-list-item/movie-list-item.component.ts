import {Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import {Movie} from "../../../types/movie.types";

@Component({
  selector: 'app-movie-list-item',
  standalone: true,
  templateUrl: './movie-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListItemComponent {
  movie = input.required<Movie>();
  readonly edit = output<Movie>();
  readonly delete = output<Movie>();
}
