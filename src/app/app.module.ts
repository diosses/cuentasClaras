import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseService } from './services/expense.service';

@NgModule({
  declarations: [AppComponent, ExpenseFormComponent, ExpenseListComponent,],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    FormsModule, 
    AppRoutingModule, 
    ReactiveFormsModule, 
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ExpenseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
