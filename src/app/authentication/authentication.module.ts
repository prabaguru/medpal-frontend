import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { Page500Component } from "./page500/page500.component";
import { Page404Component } from "./page404/page404.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ClinicSigninComponent } from "./clinic-signin/signin.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
@NgModule({
  declarations: [
    Page500Component,
    Page404Component,
    SigninComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ClinicSigninComponent,
  ],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class AuthenticationModule {}
