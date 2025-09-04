import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-edit-user-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KeyValuePipe],
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.scss'],
})
export class EditUserPopupComponent {
  @Input() openEditPopup = false;
  @Input() editForm!: FormGroup;
  @Input() currencies: any;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }

  saveUser() {
    this.save.emit();
  }
}
