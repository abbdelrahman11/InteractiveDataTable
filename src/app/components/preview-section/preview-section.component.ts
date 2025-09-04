import { Component, Input } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TableData } from '../../models/data';

@Component({
  selector: 'app-preview-section',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './preview-section.component.html',
  styleUrls: ['./preview-section.component.scss'],
})
export class PreviewSectionComponent {
  @Input() rowDetailes!: TableData | null;
}
