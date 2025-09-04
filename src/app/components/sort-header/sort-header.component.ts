import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.scss'],
})
export class SortHeaderComponent {
  /** The display label for the column */
  @Input() label = '';

  /** The key representing this column in data */
  @Input() columnKey = '';

  /** Currently sorted column */
  @Input() activeColumn = '';

  /** Current sort direction ('asc' | 'desc' | '') */
  @Input() direction: 'asc' | 'desc' | '' = '';

  /** Emit when user requests sorting change */
  @Output() sortChange = new EventEmitter<string>();

  /** Toggle sorting direction and emit */
  onSortClick() {
    this.sortChange.emit(this.columnKey);
  }
}
