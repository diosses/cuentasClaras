import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import { Expense } from 'src/app/models/expense';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent {
  @Output() expenseAdded = new EventEmitter<Expense>();

  expenseForm: FormGroup = this.formBuilder.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: [null, Validators.required],
    date: [null, Validators.required], 
    description: [null, Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private expenseService: ExpenseService) {}

  submitForm(): void {
    if (this.expenseForm.valid) {
      const formattedDate = this.formatDate(this.expenseForm.value.date);

      const newExpense: Expense = { ...this.expenseForm.value, date: formattedDate };
      this.expenseAdded.emit(newExpense);
      this.expenseService.addExpense(newExpense);
      this.expenseForm.reset();
    }
  }

  private formatDate(date: string): string {
    return date;
  }
}
