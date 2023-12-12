import { Injectable } from '@angular/core';
import { Expense } from '../models/expense';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesSubject: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([]);
  expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  constructor(private sqlite: SQLite) {
    this.initializeDatabase();
  }

  async initializeDatabase(): Promise<void> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'expenses.db',
        location: 'default',
      });

      await db.executeSql('CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, amount REAL, date TEXT, description TEXT)', []);

      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table', error);
    }
  }

  async getExpenses(): Promise<Expense[]> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'expenses.db',
        location: 'default',
      });
  
      const data = await db.executeSql('SELECT * FROM expenses', []);
  
      let expenses: Expense[] = [];
      for (let i = 0; i < data.rows.length; i++) {
        expenses.push(data.rows.item(i) as Expense);
      }
  
      console.log('Fetched expenses from database:', expenses);
  
      return expenses; // Resolve the promise with expenses array
    } catch (error) {
      console.error('Error executing SQL SELECT', error);
      return []; // Resolve with an empty array in case of an error
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'expenses.db',
        location: 'default',
      });

      await db.executeSql('INSERT INTO expenses (amount, category, date, description) VALUES (?, ?, ?, ?)', [expense.amount, expense.category, expense.date, expense.description]);

      console.log('Expense added successfully:', expense);
    } catch (error) {
      console.error('Error executing SQL INSERT', error);
      throw error;
    }
  }

  async updateExpense(expense: Expense): Promise<void> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'expenses.db',
        location: 'default',
      });

      await db.executeSql('UPDATE expenses SET amount = ?, category = ?, date = ?, description = ? WHERE id = ?', [expense.amount, expense.category, expense.date, expense.description, expense.id]);

      console.log('Expense updated successfully:', expense);
    } catch (error) {
      console.error('Error executing SQL UPDATE', error);
      throw error;
    }
  }

  async deleteExpense(expense: Expense): Promise<void> {
    try {
      const db: SQLiteObject = await this.sqlite.create({
        name: 'expenses.db',
        location: 'default',
      });
  
      await db.executeSql('DELETE FROM expenses WHERE id = ?', [expense.id]);
  
      console.log('Expense deleted successfully:', expense);
    } catch (error) {
      console.error('Error executing SQL DELETE', error);
      throw error;
    }
  }
}