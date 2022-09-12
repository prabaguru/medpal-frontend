import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { HospitalDashboardComponent } from "./hospital-dashboard/hospital-dashboard.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { HospitalUpdateProfileComponent } from "./hospital-profile-update/hospital-profile-update.component";
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
    path: "updateProfile",
    component: HospitalUpdateProfileComponent,
  },
  {
    path: "profile-settings",
    component: ProfileSettingsComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class HospitalsRoutingModule {}
