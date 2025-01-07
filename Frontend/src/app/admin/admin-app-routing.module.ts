// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { AdminAppComponent } from './admin-app.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { authGuard } from './guard/auth.guard';
import { unAuthGuard } from './guard/un-auth.guard';
import { AddUserComponent } from './demo/component/add-user/add-user.component';
import { AddSalesAgentComponent } from './demo/component/add-sales-agent/add-sales-agent.component';
import { ServerComponent } from './demo/component/server/server.component';
import { AdminUsersComponent } from './demo/component/admin-users/admin-users.component';
import { accessPermissionGuard } from './guard/access-permission.guard';
import { UsersComponent } from './demo/component/users/users.component';
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
      },
      {
        path: 'servers',
        component: ServerComponent,
        canActivate:[authGuard, accessPermissionGuard]
      },
      {
        path: 'admin-users',
        component: AdminUsersComponent,
        canActivate:[authGuard, accessPermissionGuard]
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        canActivate:[authGuard]
      },
      {
        path: 'add-sales-agent',
        component: AddSalesAgentComponent,
        canActivate:[authGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
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
        // canActivate:[unAuthGuard]
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
