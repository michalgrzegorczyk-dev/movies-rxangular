import {Component, Input, ChangeDetectionStrategy, output, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Movie} from '../../../types/movie.types';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movie-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFormComponent {
  save = output<Movie>();
  cancel = output<void>();
  movieCopy = model<Movie>({title: '', year: new Date().getFullYear()});

  @Input() set movie(value: Movie | null) {
    this.movieCopy.set(value ? {...value} : {title: '', year: new Date().getFullYear()});
  }

  onSubmit(): void {
    if (this.movieCopy().title && this.movieCopy().year) {
      this.save.emit(this.movieCopy());
    }
  }
}
