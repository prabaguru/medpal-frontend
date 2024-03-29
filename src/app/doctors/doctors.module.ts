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
import { DoctorsRoutingModule } from "./doctors-routing.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { establishmentComponent } from "./profile-settings/establishment/establishment.component";
import { establishment2Component } from "./profile-settings/establishment2/establishment2.component";
import { FileUploadComponent } from "../shared/components/file-upload/file-upload.component";
import { FileUploadComponent2 } from "../shared/components/file-upload2/file-upload2.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DoctorAppointmentsComponent } from "./appointments/appointments.component";
import { DoctorBookAppointmentsComponent } from "./book-appointments/book-appointments.component";
import { MatStepperModule } from "@angular/material/stepper";
import { NgOtpInputModule } from "ng-otp-input";
import { FilePickerModule } from "ngx-awesome-uploader";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { ComponentsModule } from "../shared/components/components.module";
@NgModule({
  declarations: [
    ProfileSettingsComponent,
    establishmentComponent,
    establishment2Component,
    FileUploadComponent,
    FileUploadComponent2,
    DashboardComponent,
    DoctorAppointmentsComponent,
    DoctorBookAppointmentsComponent,
    ImageUploadComponent,
  ],
  imports: [
    GooglePlaceModule,
    CommonModule,
    DoctorsRoutingModule,
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
    FilePickerModule,
    ComponentsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DoctorsModule {}
