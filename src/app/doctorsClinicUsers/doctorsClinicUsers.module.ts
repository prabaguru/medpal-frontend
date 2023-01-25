import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MaterialModule } from "../shared/material.module";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullCalendarModule } from "@fullcalendar/angular";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgApexchartsModule } from "ng-apexcharts";
import { DoctorsClinicUsersRoutingModule } from "./doctorsClinicUsers-routing.module";
import { DoctorBookAppointmentsComponent } from "./book-appointments/book-appointments.component";
import { DoctorAppointmentsComponent } from "./appointments/appointments.component";
import { MatStepperModule } from "@angular/material/stepper";
import { NgOtpInputModule } from "ng-otp-input";
@NgModule({
  declarations: [DoctorBookAppointmentsComponent, DoctorAppointmentsComponent],
  imports: [
    GooglePlaceModule,
    CommonModule,
    DoctorsClinicUsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    CKEditorModule,
    MaterialModule,
    chartjsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    FullCalendarModule,
    NgApexchartsModule,
    PerfectScrollbarModule,
    MatStepperModule,
    NgOtpInputModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorsClinicUsersModule {}
