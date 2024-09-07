import {Component, output, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  templateUrl: 'action-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonsComponent {
  readonly sortByTitle = output<void>();
  readonly sortByYear = output<void>();
  readonly addNew = output<void>();
}
