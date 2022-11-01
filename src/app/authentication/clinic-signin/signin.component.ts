import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { first } from "rxjs/operators";
import { of } from "rxjs";
@Component({
  selector: "clinic-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class ClinicSigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public showPassword: boolean = false;
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
    this.userEmail = this.route.snapshot.queryParamMap.get("email");

    this.loginForm = this.formBuilder.group({
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
      this.doctorLogin();
    }
  }

  doctorLogin() {
    this.subs.sink = this.authService
      .clinicUserlogin(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            const token = this.authService.currentUserValue.token;
            if (token) {
              this.router.navigate(["/clinicUsers/bookappointments"]);
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

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
