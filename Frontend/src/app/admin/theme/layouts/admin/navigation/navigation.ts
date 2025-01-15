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
    icon: 'fa-solid fa-server',
  },
  {
    id: 'servers',
    title: 'servers',
    type: 'item',
    url: '/admin/servers',
    icon: 'fa-solid fa-layer-group',
  },
  {
    id: 'admin_users',
    title: 'admin_users',
    type: 'item',
    url: '/admin/admin-users',
    icon: 'fa-solid fa-user',
  },
  {
    id: 're_gaykar_users',
    title: 're_gaykar_users',
    type: 'item',
    url: '/admin/users',
    icon: 'fa-solid fa-user-group',
  },
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
    icon: 'fa-solid fa-user-group',
  },
  {
    id: 'sales_agents',
    title: 'sales_agents',
    type: 'item',
    url: '/admin/list-sales-agents',
    icon: 'fa-solid fa-people-group',
  },
  {
    id: 'setting',
    title: 'setting',
    type: 'item',
    url: '/admin/settings',
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
      return NavigationItems.filter(item => item.id !== 'servers' && item.id !== 'admin_users' && item.id !== 're_gaykar_users' && item.id !== 'setting');
    }
    if(role === "superadmin"){
      return NavigationItems.filter(item => item.id !== 'regaykar_users' && item.id !== 'assigned_server');
    }
    return NavigationItems;
  }
}
