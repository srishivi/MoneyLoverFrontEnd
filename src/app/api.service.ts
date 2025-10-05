import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  amount: string; // Accept string from API
  type: string;
  category: Category;
  tags: Tag[];
  description: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`);
  }


  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags/`);
  }

  createCategory(data: { name: string }): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, data);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/`);
  }

  createTransaction(data: any): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions/`, data);
  }

  updateTransaction(id: number, data: any): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}/`, data);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/transactions/${id}/`);
  }
}
