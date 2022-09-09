import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullCalendarModule } from "@fullcalendar/angular";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgApexchartsModule } from "ng-apexcharts";
import { HospitalDashboardComponent } from "./hospital-dashboard/hospital-dashboard.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";

const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "profile-settings",
  //   pathMatch: "full",
  // },
  {
    path: "HospitalDashboard",
    component: HospitalDashboardComponent,
  },
  {
    path: "profile-settings",
    component: ProfileSettingsComponent,
  },
];
@NgModule({
  declarations: [HospitalDashboardComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
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
  ],
  exports: [RouterModule],
})
export class HospitalsRoutingModule {}
