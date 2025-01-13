// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserAppComponent } from './user-app.component';
import { authGuard } from './guard/auth.guard';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { unAuthGuard } from './guard/un-auth.guard';
import { GroupComponent } from './demo/component/group/group.component';
import { SalesAgentsViewComponent } from './demo/component/sales-agents-view/sales-agents-view.component';
import { POIsComponent } from './demo/component/pois/pois.component';
import { PendingRequestComponent } from './demo/component/pendingrequest/pendingrequest.component';
import { ReportsComponent } from './demo/component/reports/reports.component';
const routes: Routes = [
  {
    path: '',
    component: UserAppComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component'),
        canActivate:[authGuard]
      },
      {
        path: 'pois',
        component: POIsComponent,
        canActivate:[authGuard]
      },
      {
        path: 'saleagent',
        component: SalesAgentsViewComponent,
        canActivate:[authGuard]
      },
      {
        path: 'group',
        component: GroupComponent,
        canActivate:[authGuard]
      },
      {
        path: 'pendingrequest',
        component: PendingRequestComponent,
        canActivate:[authGuard]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate:[authGuard]
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
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
        canActivate:[unAuthGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component'),
        canActivate:[unAuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAppRoutingModule {}
