import {Component, input, ChangeDetectionStrategy, output} from '@angular/core';
import {NgFor} from '@angular/common';
import {MovieListItemComponent} from "../movie-list-item/movie-list-item.component";
import {Movie} from "../../../types/movie.types";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [NgFor, MovieListItemComponent],
  templateUrl: './movie-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  movies = input.required<Movie[]>();
  readonly editMovie = output<Movie>();
  readonly deleteMovie = output<Movie>();
}
