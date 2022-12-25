import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { DoctorAppointmentsComponent } from "./appointments/appointments.component";
import { DoctorBookAppointmentsComponent } from "./book-appointments/book-appointments.component";
const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "main",
  //   pathMatch: "full",
  // },
  {
    path: "main",
    component: DashboardComponent,
  },
  {
    path: "profile-settings",
    component: ProfileSettingsComponent,
  },
  {
    path: "appointments",
    component: DoctorAppointmentsComponent,
  },
  {
    path: "bookappointments",
    component: DoctorBookAppointmentsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
