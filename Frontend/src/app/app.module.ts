// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { SharedModule } from './theme/shared/shared.module';
// import { AdminComponent } from './theme/layouts/admin/admin.component';
// import { GuestComponent } from './theme/layouts/guest/guest.component';
// import { NavigationComponent } from './theme/layouts/admin/navigation/navigation.component';
// import { NavBarComponent } from './theme/layouts/admin/nav-bar/nav-bar.component';
// import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
// import { NavRightComponent } from './theme/layouts/admin/nav-bar/nav-right/nav-right.component';
// import { NavContentComponent } from './theme/layouts/admin/navigation/nav-content/nav-content.component';
// import { NavCollapseComponent } from './theme/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
// import { NavGroupComponent } from './theme/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
// import { NavItemComponent } from './theme/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
// import { NavigationItem } from './theme/layouts/admin/navigation/navigation';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { TranslationService } from './services/translation.service';
import { RouteInterceptor } from './services/route.interceptor';
import { AdminInterceptor } from './admin/services/admin.interceptor';
import { UserInterceptor } from './user/services/user.interceptor';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    // AdminComponent,
    // GuestComponent,
    // NavigationComponent,
    // NavBarComponent,
    // NavLeftComponent,
    // NavRightComponent,
    // NavContentComponent,
    // NavCollapseComponent,
    // NavGroupComponent,
    // NavItemComponent
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule,NgxSpinnerModule,ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RouteInterceptor,
      multi: true, 
    },
    AdminInterceptor,
    UserInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
