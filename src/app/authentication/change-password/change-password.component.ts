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
  public showPassword: boolean = false;
  loginForm: FormGroup;
  submitted = false;
  registerAs;
  userId;
  timestamp;
  useremail: string;
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
    this.userId = this.route.snapshot.queryParamMap.get("_id");
    this.timestamp = this.route.snapshot.queryParamMap.get("stamp");
    this.useremail = this.route.snapshot.queryParamMap.get("email");

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
      this.router.navigate(["/authentication/forgot-password"]);
    }

    this.loginForm = this.formBuilder.group(
      {
        resetPass: ["forgot"],
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
                email: this.useremail,
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
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
