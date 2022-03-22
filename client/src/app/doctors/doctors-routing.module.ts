import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";

const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "profile-settings",
  //   pathMatch: "full",
  // },
  {
    path: "profile-settings",
    component: ProfileSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorsRoutingModule {}
