import { Injectable } from '@angular/core';

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
    title: 'Dashboard',
    type: 'item',
    url: '/admin/dashboard/default',
    icon: 'ti ti-dashboard',
  },
  {
    id: 'adduser',
    title: 'Add Users',
    type: 'item',
    url: '/admin/add-user',
    icon: 'ti ti-user-plus',
  },
  {
    id: 'setting',
    title: 'Setting',
    type: 'item',
    url: '/admin/dashboard/defaults',
    icon: 'ti ti-settings',
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
