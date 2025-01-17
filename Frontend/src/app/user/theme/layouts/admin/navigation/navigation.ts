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
    title: 'dashboard',
    type: 'item',
    url: '/dashboard/default',
    icon: 'fa-solid fa-server',
  },
  {
    id: 'pois',
    title: 'pois',
    type: 'item',
    url: '/pois',
    icon: 'fa-solid fa-earth-asia',
  },
  {
    id: 'saleagent',
    title: 'saleagent',
    type: 'item',
    url: '/saleagent',
    icon: 'fa-solid fa-user',
  },
  {
    id: 'groups',
    title: 'groups',
    type: 'item',
    url: '/group',
    icon: 'fa-solid fa-people-group'
  },
  {
    id: 'reports',
    title: 'reports',
    type: 'item',
    url: '/reports',
    icon: 'fa-solid fa-file-signature',
  },
  {
    id: 'pending_request',
    title: 'pending_request',
    type: 'item',
    url: '/pendingrequest',
    icon: 'fa-solid fa-hand-point-up',
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
