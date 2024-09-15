import {Component, input, ChangeDetectionStrategy, output} from '@angular/core';
import {MovieListItemComponent} from "../movie-list-item/movie-list-item.component";
import {Movie} from "../../../types/movie.types";
import {RxFor} from "@rx-angular/template/for";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [RxFor, MovieListItemComponent],
  templateUrl: './movie-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  movies = input.required<Movie[]>();
  readonly editMovie = output<Movie>();
  readonly deleteMovie = output<Movie>();
}
