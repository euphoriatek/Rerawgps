// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { AdminAppComponent } from './admin-app.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { authGuard } from './guard/auth.guard';
import { unAuthGuard } from './guard/un-auth.guard';
import { ServerComponent } from './demo/component/server/server.component';
import { AdminUsersComponent } from './demo/component/admin-users/admin-users.component';
import { accessPermissionGuard } from './guard/access-permission.guard';
import { accessPermissionGuardAdmin } from './guard/admin-access-permission.guard';
import { UsersComponent } from './demo/component/users/users.component';
import { RegayKarUserViewComponent } from './demo/component/regay-kar-user-view/regay-kar-user-view.component';
import { AdminRegayKarUserComponent } from './demo/component/admin-regay-kar-user/admin-regay-kar-user.component';
import { AdminRegayKarUserViewComponent } from './demo/component/admin-regay-kar-user-view/admin-regay-kar-user-view.component';
import { AssignedServerComponent } from './demo/component/assigned-server/assigned-server.component';
import { SalesAgentsComponent } from './demo/sales-agents/sales-agents.component';
import { SettingComponent } from './demo/component/setting/setting.component';
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
        path: 'users',
        component: UsersComponent,
        canActivate:[authGuard, accessPermissionGuard]
      },
      {
        path: 'user-view/:id',
        component: RegayKarUserViewComponent,
        canActivate:[authGuard, accessPermissionGuard]
      },
      {
        path: 'regaykar_users',
        component: AdminRegayKarUserComponent,
        canActivate:[authGuard, accessPermissionGuardAdmin]
      },
      {
        path: 'regayuser-view/:id',
        component: AdminRegayKarUserViewComponent,
        canActivate:[authGuard, accessPermissionGuardAdmin]
      },
      {
        path: 'assigned_server',
        component: AssignedServerComponent,
        canActivate:[authGuard, accessPermissionGuardAdmin]
      },
      {
        path: 'list-sales-agents',
        component: SalesAgentsComponent,
        canActivate:[authGuard]
      },
      {
        path: 'settings',
        component: SettingComponent,
        canActivate:[authGuard, accessPermissionGuard]
      },
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
