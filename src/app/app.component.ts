import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MovieListContainerComponent} from "./components/smart/movie-list-container/movie-list-container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MovieListContainerComponent],
  template: '<app-movies />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
