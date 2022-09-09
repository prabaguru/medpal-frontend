import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControlOptions,
} from "@angular/forms";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { first } from "rxjs/operators";
import { ApiService, MustMatch, sharedDataService } from "../../core";
@Component({
  selector: "app-forgot-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  loginForm: FormGroup;
  submitted = false;
  registerAs;
  userId;
  timestamp;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private sharedDataService: sharedDataService
  ) {
    super();
  }
  ngOnInit() {
    this.registerAs = this.route.snapshot.queryParamMap.get("loginType");
    this.userId = this.route.snapshot.queryParamMap.get("_id");
    this.timestamp = this.route.snapshot.queryParamMap.get("stamp");
    if (!this.registerAs) {
      //this.router.navigate(["/home"]);
      this.registerAs = "Doctor";
    }
    let datenow = Date.now();
    let diff = (datenow - this.timestamp) / 1000 / 60;
    let round = Math.round(diff);
    if (round > 120) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Password reset link expired. Resend the link to reset your password...",
        "top",
        "center"
      );
      this.router.navigate(["/authentication/forgot-password"], {
        queryParams: { loginType: this.registerAs },
      });
    }

    this.loginForm = this.formBuilder.group(
      {
        loginType: [
          { value: this.registerAs, disabled: true },
          Validators.required,
        ],
        id: [this.userId, Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      } as AbstractControlOptions
    );
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.subs.sink = this.apiService
        .updatePassword(this.loginForm.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.submitted = false;
            this.sharedDataService.showNotification(
              "snackbar-success",
              "Password change successful... Login with your new password",
              "top",
              "center"
            );
            this.router.navigate(["/authentication/signin"], {
              queryParams: {
                loginType: this.registerAs,
                email: "yyyypraba.wg@gmail.com",
              },
            });
          },
          error: (error) => {
            this.submitted = false;
            this.sharedDataService.showNotification(
              "snackbar-danger",
              error,
              "top",
              "center"
            );
          },
          complete: () => {},
        });
    }
  }
}
