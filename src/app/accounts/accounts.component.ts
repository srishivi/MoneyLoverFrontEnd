import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../api.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {
  @Input() user: any = null;
  @Input() categories: Category[] = [];
  @Output() addCategory = new EventEmitter<string>();

  newCategory: string = '';

  onAddCategory() {
    if (this.newCategory.trim()) {
      this.addCategory.emit(this.newCategory.trim());
      this.newCategory = '';
    }
  }
}
