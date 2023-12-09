import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
  expenses = new MatTableDataSource<Expense>();
  displayedColumns: string[] = ['category', 'amount', 'date', 'description', 'edit'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenses.data = this.expenseService.getExpenses();
    this.expenses.sort = this.sort;
    console.log('All expenses:', this.expenses.data);
  }

  editExpense(expense: Expense): void {
    console.log('Edit expense:', expense);
  }

  sortData(sort: Sort): void {
    const data = this.expenses.data.slice();
    if (!sort.active || sort.direction === '') {
      this.expenses.data = data;
      return;
    }

    this.expenses.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'category':
          return this.compare(a.category, b.category, isAsc);
        case 'amount':
          return this.compare(a.amount, b.amount, isAsc);
        case 'date':
          return this.compare(a.date, b.date, isAsc);
        case 'description':
          return this.compare(a.description, b.description, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}