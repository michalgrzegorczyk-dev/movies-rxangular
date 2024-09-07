import {Component, input, output, ChangeDetectionStrategy} from '@angular/core';
import {Movie} from "../../../types/movie.types";

@Component({
  selector: 'app-movie-list-item',
  standalone: true,
  template: `
    <div class="flex items-center justify-between p-4 hover:bg-primary-50 transition duration-300">
      <span class="text-gray-800 font-medium">
        {{ movie().title }}
        <span class="text-gray-500 text-sm ml-2">({{ movie().year }})</span>
      </span>
      <div class="space-x-2">
        <button (click)="edit.emit(movie())"
                class="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition duration-300">
          Edit
        </button>
        <button (click)="delete.emit(movie())"
                class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition duration-300">
          Delete
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListItemComponent {
  movie = input.required<Movie>();
  readonly edit = output<Movie>();
  readonly delete = output<Movie>();
}
