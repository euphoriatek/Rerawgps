import { Injectable } from '@angular/core';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'dashboard',
    type: 'item',
    url: '/admin/dashboard/default',
    icon: 'ti ti-dashboard',
  },
  {
    id: 'servers',
    title: 'servers',
    type: 'item',
    url: '/admin/servers',
    icon: 'ti ti-dashboard',
  },
  {
    id: 'admin_users',
    title: 'admin_users',
    type: 'item',
    url: '/admin/admin-users',
    icon: 'ti ti-dashboard',
  },
  // {
  //   id: 'adduser',
  //   title: 'add_users',
  //   type: 'item',
  //   url: '/admin/add-user',
  //   icon: 'ti ti-user-plus',
  // },
  {
    id: 're_gaykar_users',
    title: 're_gaykar_users',
    type: 'item',
    url: '/admin/users',
    icon: 'ti ti-users',
  },
  // {
  //   id: 'addsalesagent',
  //   title: 'add_sales_agent',
  //   type: 'item',
  //   url: '/admin/add-sales-agent',
  //   icon: 'ti ti-user-plus',
  // },
  {
    id: 'assigned_server',
    title: 'servers',
    type: 'item',
    url: '/admin/assigned_server',
    icon: 'ti ti-users',
  },
  {
    id: 'regaykar_users',
    title: 're_gaykar_users',
    type: 'item',
    url: '/admin/regaykar_users',
    icon: 'ti ti-users',
  },
  {
    id: 'setting',
    title: 'setting',
    type: 'item',
    url: '/admin/dashboard/defaults',
    icon: 'ti ti-settings',
  }
];

@Injectable()
export class NavigationItem {
  AdminRole: string | undefined;
  constructor(public cookiesService:AdminCookiesService){
    this.AdminRole = this.cookiesService.getCookie('AdminUser')?.role;
  }
  get(role:any) {
    if (role === "admin") {
      return NavigationItems.filter(item => item.id !== 'servers' && item.id !== 'admin_users' && item.id !== 're_gaykar_users');
    }
    if(role === "superadmin"){
      return NavigationItems.filter(item => item.id !== 'regaykar_users' && item.id !== 'assigned_server');
    }
    return NavigationItems;
  }
}
