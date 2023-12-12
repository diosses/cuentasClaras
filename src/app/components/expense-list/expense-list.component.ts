import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ExpenseEditComponent } from '../../components/expense-edit/expense-edit.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
  expenses = new MatTableDataSource<Expense>([]);
  displayedColumns: string[] = ['category', 'amount', 'date', 'description', 'edit'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private navCtrl: NavController,
    private sqlite: SQLite
  ) {}

  ngOnInit() {
    this.expenses.sort = this.sort;
    this.initializeDatabase().then(() => {
      this.refreshExpenses();
    });

    // Subscribe to changes in route parameters
    this.route.params.subscribe((params) => {
      if (params['refresh']) {
        this.refreshExpenses();
      }
    });
  }

  ionViewDidEnter() {
    // Refresh expenses when the component is entered
    this.refreshExpenses();
  }

  async initializeDatabase(): Promise<any> {
    return this.sqlite
      .create({
        name: 'expenses.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        return db
          .executeSql(
            'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, amount REAL, date TEXT, description TEXT)',
            []
          )
          .then(() => console.log('Table created successfully'))
          .catch((error) => console.error('Error creating table', error));
      })
      .catch((error) => console.error('Error opening database', error));
  }

  async refreshExpenses() {
    try {
      // Use await to wait for the promise to resolve
      const expenses = await this.expenseService.getExpenses();
      console.log('Fetched expenses:', expenses);
    
      // Check if the result is an array before updating the data source
      if (Array.isArray(expenses)) {
        this.expenses.data = expenses;
      }
      console.log('All expenses:', this.expenses.data);
    } catch (error) {
      console.error('Error refreshing expenses:', error);
      // Handle the error here, you might want to show a message to the user or take other actions
    }
  }
  
  async editExpense(expense: Expense): Promise<void> {
    const modal = await this.modalController.create({
      component: ExpenseEditComponent,
      componentProps: { expenseId: expense.id }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { action, editedExpense } = result.data;
        
        if (action === 'edit') {
          // Handle the edited expense
          console.log('Expense edited:', editedExpense);
        } else if (action === 'delete') {
          // Handle the deleted expense
          console.log('Expense deleted:', editedExpense);
        }
        
        // Refresh the expenses list after editing or deleting
        this.refreshExpenses();
      }
    });
  
    return await modal.present();
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