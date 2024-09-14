import {Component, ChangeDetectionStrategy, output, signal} from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './movie-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieSearchComponent {
  readonly searchQuery = signal<string>('');
  readonly search = output<string>();

  onInput(event: Event): void {
    this.search.emit((event.target as HTMLInputElement).value);
  }
}
