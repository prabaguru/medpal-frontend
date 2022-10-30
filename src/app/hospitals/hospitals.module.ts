import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MaterialModule } from "../shared/material.module";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { FullCalendarModule } from "@fullcalendar/angular";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgApexchartsModule } from "ng-apexcharts";
//components
import { HospitalDashboardComponent } from "./hospital-dashboard/hospital-dashboard.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { establishmentComponent } from "./profile-settings/establishment/establishment.component";
import { establishment2Component } from "./profile-settings/establishment2/establishment2.component";
import { HospitalsRoutingModule } from "./hospitals-routing.module";
import { HospitalUpdateProfileComponent } from "./hospital-profile-update/hospital-profile-update.component";
@NgModule({
  declarations: [
    HospitalDashboardComponent,
    ProfileSettingsComponent,
    HospitalUpdateProfileComponent,
    establishmentComponent,
    establishment2Component,
  ],
  imports: [
    GooglePlaceModule,
    CommonModule,
    HospitalsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    CKEditorModule,
    MaterialModule,
    chartjsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    FullCalendarModule,
    NgApexchartsModule,
    PerfectScrollbarModule,
  ],
})
export class HospitalsModule {}
