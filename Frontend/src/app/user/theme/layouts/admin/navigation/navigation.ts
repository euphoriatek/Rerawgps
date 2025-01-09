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
  // {
  //   id: 'dashboard',
  //   title: 'Dashboard',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'dashboard',
  //       title: 'Dashboard',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/dashboard/default',
  //       icon: 'ti ti-dashboard',
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard/default',
    icon: 'ti ti-dashboard',
  },
  {
    id: 'groups',
    title: 'groups',
    type: 'item',
    url: '/group',
    icon: 'ti ti-users'
  },
  {
    id: 'saleagent',
    title: 'saleagent',
    type: 'item',
    url: '/saleagent',
    icon: 'ti ti-users',
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
