import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { DoctorAppointmentsComponent } from "./appointments/appointments.component";

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
    path: "users",
    loadChildren: () =>
      import("./clinic-users/advance-table.module").then(
        (m) => m.AdvanceTableModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
