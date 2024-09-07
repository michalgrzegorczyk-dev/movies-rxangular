import {Component, output, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-2 mb-6">
      <button (click)="sortByTitle.emit()"
              class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition duration-300 shadow-sm">
        Sort by Title
      </button>

      <button (click)="sortByYear.emit()"
              class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition duration-300 shadow-sm">
        Sort by Year
      </button>

      <button (click)="addNew.emit()"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 shadow-sm ml-auto">
        Add Movie
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonsComponent {
  readonly sortByTitle = output<void>();
  readonly sortByYear = output<void>();
  readonly addNew = output<void>();
}
