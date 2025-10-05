import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Category, Tag, Transaction } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() tags: Tag[] = [];
  @Input() formData: Transaction | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form: any = {
    amount: '',
    type: 'expense',
    category_id: '',
    tag_ids: [],
    description: '',
    timestamp: new Date().toISOString().slice(0, 16)
  };

  errors: { [key: string]: string } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.form = {
        amount: this.formData.amount,
        type: this.formData.type,
        category_id: String(this.formData.category.id),
        tag_ids: this.formData.tags.map((t: any) => String(t.id)),
        description: this.formData.description,
        timestamp: this.formData.timestamp.slice(0, 16)
      };
    } else if (changes['formData'] && !this.formData) {
      this.form = {
        amount: '',
        type: 'expense',
        category_id: '',
        tag_ids: [],
        description: '',
        timestamp: new Date().toISOString().slice(0, 16)
      };
    }
  }

  // Evaluate arithmetic expression for amount
  evaluateAmountExpression() {
    if (typeof this.form.amount === 'string' && this.form.amount.match(/^[0-9+\-*/ ().]+$/)) {
      try {
        // eslint-disable-next-line no-eval
        const result = Function('return ' + this.form.amount)();
        if (!isNaN(result) && isFinite(result)) {
          this.form.amount = result.toString();
        }
      } catch (e) {
        // Ignore invalid expressions
      }
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.amount || isNaN(Number(this.form.amount)) || Number(this.form.amount) <= 0) {
      this.errors['amount'] = 'Amount must be a positive number.';
    }
    if (!this.form.type) {
      this.errors['type'] = 'Type is required.';
    }
    if (!this.form.category_id) {
      this.errors['category_id'] = 'Category is required.';
    }
    if (!this.form.timestamp) {
      this.errors['timestamp'] = 'Date & Time is required.';
    }
    return Object.keys(this.errors).length === 0;
  }

  onSubmit() {
    this.evaluateAmountExpression();
    if (this.validate()) {
      this.save.emit(this.form);
    }
  }
}
