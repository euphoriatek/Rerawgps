// angular import
import { NgModule } from '@angular/core';


// project import
import { AdminAppRoutingModule } from './admin-app-routing.module';
import { AdminAppComponent } from './admin-app.component';
import { SharedModule } from './theme/shared/shared.module';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { NavigationComponent } from './theme/layouts/admin/navigation/navigation.component';
import { NavBarComponent } from './theme/layouts/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layouts/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layouts/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavigationItem } from './theme/layouts/admin/navigation/navigation';
// import { AdminInterceptor } from './services/admin.interceptor';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddUserComponent } from './demo/component/add-user/add-user.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddSalesAgentComponent } from './demo/component/add-sales-agent/add-sales-agent.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ServerComponent } from './demo/component/server/server.component';
import { AdminUsersComponent } from './demo/component/admin-users/admin-users.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button"; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from 'src/app/admin/services/confirm-dialog.component';
@NgModule({
  declarations: [
    AdminAppComponent,
    AdminComponent,
    GuestComponent,
    NavigationComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    AddUserComponent,
    AddSalesAgentComponent,
    ServerComponent,
    AdminUsersComponent,
    ConfirmDialogComponent
  ],
  imports: [AdminAppRoutingModule,DialogModule,ButtonModule,MatDialogModule,MatButtonModule,SharedModule,TranslateModule,MatDatepickerModule,MatInputModule,MatFormFieldModule,MatNativeDateModule,MatSlideToggleModule],
  providers: [NavigationItem,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AdminInterceptor,
    //   multi: true, 
    // },
  ],
  bootstrap: [AdminAppComponent]
})
export class AdminAppModule {}
