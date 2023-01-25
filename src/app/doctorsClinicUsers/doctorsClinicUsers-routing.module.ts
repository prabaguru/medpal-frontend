import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DoctorBookAppointmentsComponent } from "./book-appointments/book-appointments.component";
import { DoctorAppointmentsComponent } from "./appointments/appointments.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "bookappointments",
    pathMatch: "full",
  },

  {
    path: "bookappointments",
    component: DoctorBookAppointmentsComponent,
  },
  {
    path: "manageappointments",
    component: DoctorAppointmentsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class DoctorsClinicUsersRoutingModule {}
