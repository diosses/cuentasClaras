import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';

const routes: Routes = [
  {
    path: 'home',
    redirectTo: 'expense-list',
    pathMatch: 'full' 
  },
  { 
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  { 
    path: 'login',
    loadChildren: () => import('src/app/login/login.module').then( m => m.LoginPageModule) 
  },
  { 
    path: 'expense-form', component: ExpenseFormComponent 
  },
  { 
    path: 'expense-list', component: ExpenseListComponent 
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
