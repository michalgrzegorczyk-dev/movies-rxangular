import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie } from '../movie.types';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movie-form.component.html',
})
export class MovieFormComponent {
  @Input() set movie(value: Movie | null) {
    this.movieCopy = value ? {...value} : {title: '', year: new Date().getFullYear()};
  }
  @Output() save = new EventEmitter<Movie>();
  @Output() cancel = new EventEmitter<void>();

  movieCopy: Movie = {title: '', year: new Date().getFullYear()};

  onSubmit() {
    if (this.movieCopy.title && this.movieCopy.year) {
      this.save.emit(this.movieCopy);
    }
  }
}
