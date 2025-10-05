import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Transaction } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReplaceCommaPipe } from '../replace-comma.pipe';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReplaceCommaPipe],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Output() edit = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<Transaction>();

  // Filter state
  filterType: string = '';
  filterCategory: string = '';
  filterText: string = '';
  filterMode: 'all' | 'month' | 'year' | 'custom' = 'all';
  filterMonth: string = '';
  filterYear: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';

  constructor() {}

  ngOnInit(): void {}

  // Grouped transactions for Money Lover-style display
  get groupedTransactions(): { group: string, total: number, transactions: Transaction[] }[] {
    // Filter transactions first
    let filtered = this.transactions.filter(t => {
      const date = t.timestamp.slice(0, 10);
      const year = date.slice(0, 4);
      const month = date.slice(0, 7);
      let dateMatch = true;
      if (this.filterMode === 'month' && this.filterMonth) {
        dateMatch = month === this.filterMonth;
      } else if (this.filterMode === 'year' && this.filterYear) {
        dateMatch = year === this.filterYear;
      } else if (this.filterMode === 'custom' && (this.filterStartDate || this.filterEndDate)) {
        dateMatch = (!this.filterStartDate || date >= this.filterStartDate) && (!this.filterEndDate || date <= this.filterEndDate);
      }
      return (
        (!this.filterType || t.type === this.filterType) &&
        (!this.filterCategory || t.category.name === this.filterCategory) &&
        (!this.filterText || t.description?.toLowerCase().includes(this.filterText.toLowerCase())) &&
        dateMatch
      );
    });

    // Group by period
    let groups: { [key: string]: Transaction[] } = {};
    filtered.forEach(t => {
      const date = t.timestamp.slice(0, 10);
      let groupKey = '';
      if (this.filterMode === 'month') {
        groupKey = date.slice(0, 7); // YYYY-MM
      } else if (this.filterMode === 'year') {
        groupKey = date.slice(0, 4); // YYYY
      } else if (this.filterMode === 'custom') {
        groupKey = date; // group by day
      } else {
        // 'all' mode: group by year, then month (YYYY-MM)
        groupKey = date.slice(0, 7);
      }
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(t);
    });

    // Convert to array and sort groups (descending)
    let groupArr = Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(key => {
      const total = groups[key].reduce((sum, t) => sum + Number(t.amount), 0);
      return { group: key, total, transactions: groups[key].sort((a, b) => b.timestamp.localeCompare(a.timestamp)) };
    });
    return groupArr;
  }

  get uniqueCategories(): string[] {
    return Array.from(new Set(this.transactions.map(t => t.category.name)));
  }
}
