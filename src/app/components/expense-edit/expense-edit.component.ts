import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import { Expense } from 'src/app/models/expense';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrls: ['./expense-edit.component.scss'],
})
export class ExpenseEditComponent implements OnInit {
  @Input() expenseToEdit: Expense | null = null;
  @Output() expenseSubmitted = new EventEmitter<Expense>();

  expenseForm: FormGroup = this.formBuilder.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: [null, Validators.required],
    date: [null, Validators.required],
    description: [null, Validators.required],
    // Add an ID field to the form
    id: [null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    // If an expense is provided for editing, pre-fill the form
    if (this.expenseToEdit) {
      // Set amount separately to ensure it's treated as a number
      this.expenseForm.patchValue({
        amount: this.expenseToEdit.amount,
        category: this.expenseToEdit.category,
        date: this.expenseToEdit.date,
        description: this.expenseToEdit.description,
        id: this.expenseToEdit.id,
      });
    }
  }

  submitForm(): void {
    if (this.expenseForm.valid) {
      const formattedDate = this.formatDate(this.expenseForm.value.date);

      const expenseData: Expense = { ...this.expenseForm.value, date: formattedDate };

      if (this.expenseToEdit) {
        // If editing, update the existing expense
        this.expenseService.updateExpense(expenseData);
      }

      // Emit the event to notify the parent component
      this.expenseSubmitted.emit(expenseData);
      this.expenseForm.reset();
      this.modalController.dismiss({ action: 'edit', editedExpense: this.expenseToEdit });
    }
  }

  deleteExpense(): void {
    // If editing and delete is clicked, delete the existing expense
    if (this.expenseToEdit) {
      this.expenseService.deleteExpense(this.expenseToEdit);
      this.expenseSubmitted.emit(); // Notify parent that the expense is deleted
      this.expenseForm.reset();
      this.modalController.dismiss({ action: 'delete', editedExpense: this.expenseToEdit });
    }
  }

  private formatDate(date: string): string {
    return date;
  }
}