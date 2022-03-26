import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./layout/header/header.component";
import { PageLoaderComponent } from "./layout/page-loader/page-loader.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { RightSidebarComponent } from "./layout/right-sidebar/right-sidebar.component";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { ErrorInterceptor } from "./core/interceptor/error.interceptor";
import { JwtInterceptor } from "./core/interceptor/jwt.interceptor";
import { NgxSpinnerModule } from "ngx-spinner";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { ClickOutsideModule } from "ng-click-outside";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { WINDOW_PROVIDERS } from "./core/service/window.service";
import { FlexLayoutModule } from "@angular/flex-layout";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};
//app-entry-components
import { AppHomeComponent } from "./app-home/app-entry/app-home.component";
import { AppEntryLayoutComponent } from "./app-home/_layout/app-layout/app-layout.component";
import { AppEntryHeaderComponent } from "./app-home/_layout/app-header/app-header.component";
import { AppEntryFooterComponent } from "./app-home/_layout/site-footer/site-footer.component";
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    AppEntryLayoutComponent,
    AppHomeComponent,
    AppEntryHeaderComponent,
    AppEntryFooterComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    ClickOutsideModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    CoreModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    WINDOW_PROVIDERS,
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
