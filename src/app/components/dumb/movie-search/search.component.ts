import {Component, ChangeDetectionStrategy, input, output, signal} from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <input [value]="searchQuery()"
           (input)="onInput($event)"
           placeholder="Search movies..."
           class="w-full p-3 rounded-lg border-2 border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-300">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  readonly searchQuery = signal<string>('');
  readonly search = output<string>();

  onInput(event: Event) {
    this.search.emit((event.target as HTMLInputElement).value);
  }
}
