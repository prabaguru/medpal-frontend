import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { first } from "rxjs/operators";
import { ApiService, sharedDataService } from "../../core";
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  loginForm: FormGroup;
  submitted = false;
  registerAs;
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
    if (!this.registerAs) {
      this.router.navigate(["/home"]);
    }
    this.loginForm = this.formBuilder.group({
      loginType: [this.registerAs, Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
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
        .forgotPassWordSendEmail(this.loginForm.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.submitted = false;
            this.loginForm.controls.email.setValue("");
            this.sharedDataService.showNotification(
              "snackbar-success",
              "Password reset link sent to your registered email... Check your email to reset your password...",
              "top",
              "center"
            );
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
