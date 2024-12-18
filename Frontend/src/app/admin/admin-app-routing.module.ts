// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { AdminAppComponent } from './admin-app.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { authGuard } from './guard/auth.guard';
import { unAuthGuard } from './guard/un-auth.guard';
const routes: Routes = [
  {
    path: '',
    component: AdminAppComponent,
    children: [
      {
        path: '',
        redirectTo: '/admin/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component'),
        canActivate:[authGuard]
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component'),
        canActivate:[unAuthGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAppRoutingModule {}
