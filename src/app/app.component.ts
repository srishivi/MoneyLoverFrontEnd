import { Component, OnInit } from '@angular/core';
import { ApiService, Category, Tag, Transaction } from './api.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NavigationDrawerComponent } from './navigation-drawer/navigation-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TransactionListComponent, TransactionFormComponent, AccountsComponent, NavigationDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  categories: Category[] = [];
  tags: Tag[] = [];
  transactions: Transaction[] = [];
  showTransactionForm = false;
  editingTransaction: Transaction | null = null;
  confirmDeleteId: number | null = null;
  user: any = { username: 'demo_user', email: 'demo@example.com' }; // Replace with real user data if available
  activeSection: string = 'transactions';
  onSectionChange(section: string) {
    this.activeSection = section;
    this.showTransactionForm = false;
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCategories().subscribe(data => this.categories = data);
    this.api.getTags().subscribe(data => this.tags = data);
    this.api.getTransactions().subscribe(data => this.transactions = data);
  }

  onAddCategory(name: string) {
    this.api.createCategory({ name }).subscribe(newCat => {
      this.categories = [...this.categories, newCat];
    });
  }

  getTotal(type: 'income' | 'expense'): number {
    return this.transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + Number((t.amount || '0').replace(/,/g, '')), 0);
  }

  getBalance(): number {
    return this.getTotal('income') - this.getTotal('expense');
  }

  openTransactionForm(tx?: Transaction) {
    this.editingTransaction = tx || null;
    this.showTransactionForm = true;
  }

  closeTransactionForm() {
    this.showTransactionForm = false;
    this.editingTransaction = null;
  }

  saveTransaction(form: any) {
    if (this.editingTransaction) {
      this.api.updateTransaction(this.editingTransaction.id, form).subscribe(updatedTx => {
        this.transactions = this.transactions.map(t => t.id === updatedTx.id ? updatedTx : t);
        this.showTransactionForm = false;
        this.editingTransaction = null;
      });
    } else {
      this.api.createTransaction(form).subscribe(newTx => {
        this.transactions = [...this.transactions, newTx];
        this.showTransactionForm = false;
      });
    }
  }

  onEdit(tx: Transaction) {
    this.openTransactionForm(tx);
  }

  onDelete(tx: Transaction) {
    this.confirmDeleteId = tx.id;
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.api.deleteTransaction(tx.id).subscribe(() => {
        this.transactions = this.transactions.filter(t => t.id !== tx.id);
        this.confirmDeleteId = null;
      });
    } else {
      this.confirmDeleteId = null;
    }
  }

  getTagNames(tags: Tag[]): string {
    return tags.map(t => t.name).join(', ');
  }
}
