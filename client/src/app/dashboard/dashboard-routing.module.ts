import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HospitalDashboardComponent } from "./hospital-dashboard/hospital-dashboard.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },

  {
    path: "main",
    component: DashboardComponent,
  },
  {
    path: "HospitalDashboard",
    component: HospitalDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
