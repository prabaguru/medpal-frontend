import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { first } from "rxjs/operators";
import { of } from "rxjs";
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  loginForm: FormGroup;
  submitted = false;
  error = "";
  hide = true;
  returnUrl: string;
  loginAs: string;
  userEmail: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.loginAs = this.route.snapshot.queryParamMap.get("loginType");
    this.userEmail = this.route.snapshot.queryParamMap.get("email");
    if (!this.loginAs) {
      //this.router.navigate(["/home"]);
      this.loginAs = "Doctor";
    }
    this.loginForm = this.formBuilder.group({
      loginType: [{ value: this.loginAs, disabled: true }, Validators.required],
      email: [
        this.userEmail ? this.userEmail : "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ["", Validators.required],
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.error = "";
    if (this.loginForm.invalid) {
      this.error = "Username or password not valid !";
      return;
    } else {
      if (this.f.loginType.value === "Doctor") {
        this.doctorLogin();
      }
      if (this.f.loginType.value === "Hospital") {
        this.hospitallogin();
      }
      if (this.f.loginType.value === "Hospital") {
        //this.hospitallogin();
      }
    }
  }

  doctorLogin() {
    this.subs.sink = this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              this.router.navigate(["/doctors/main"]);
            }
          } else {
            this.error = "Invalid Login";
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.error = error;
          this.submitted = false;
        },
        complete: () => {},
      });
  }

  hospitallogin() {
    this.subs.sink = this.authService
      .hospitallogin(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              this.router.navigate(["/hospitals/HospitalDashboard"]);
            }
          } else {
            this.error = "Invalid Login";
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.error = error;
          this.submitted = false;
        },
        complete: () => {},
      });
  }
}
