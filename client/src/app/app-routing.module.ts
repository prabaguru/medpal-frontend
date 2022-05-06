import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./authentication/page404/page404.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";

//app-entry-components
import { AppHomeComponent } from "./app-home/app-entry/app-home.component";
import { AppEntryLayoutComponent } from "./app-home/_layout/app-layout/app-layout.component";
import { doctorsListingComponent } from "./app-home/doctors-listing/doctors-listing.component";
import { doctorsProfileComponent } from "./app-home/doctors-profile/doctors-profile.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    component: AppEntryLayoutComponent,
    children: [{ path: "", component: AppHomeComponent, pathMatch: "full" }],
  },
  {
    path: "doctorsListing",
    component: AppEntryLayoutComponent,
    children: [
      {
        path: "",
        component: doctorsListingComponent,
        pathMatch: "full",
      },
    ],
  },
  {
    path: "doctorsProfile",
    component: AppEntryLayoutComponent,
    children: [
      {
        path: "",
        component: doctorsProfileComponent,
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "doctors",
        loadChildren: () =>
          import("./doctors/doctors.module").then((m) => m.DoctorsModule),
      },
      {
        path: "hospitals",
        loadChildren: () =>
          import("./hospitals/hospitals.module").then((m) => m.HospitalsModule),
      },
    ],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: "**", component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
