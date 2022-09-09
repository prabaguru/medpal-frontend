import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControlOptions,
} from "@angular/forms";
import { first } from "rxjs/operators";
import { ApiService, MustMatch, sharedDataService } from "../../core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  loginForm: FormGroup;
  submitted = false;
  hide = true;
  chide = true;
  registerAs;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }
  ngOnInit() {
    this.registerAs = this.route.snapshot.queryParamMap.get("loginType");
    if (!this.registerAs) {
      //this.router.navigate(["/home"]);
      this.registerAs = "Doctor";
    }
    this.loginForm = this.formBuilder.group(
      {
        loginType: [{ value: this.registerAs }, Validators.required],
        firstName: [
          "",
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        email: [
          "",
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        mobile: ["", [Validators.required]],
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
  resetmobilefield() {
    if (this.loginForm.controls.mobile.value) {
      this.loginForm.controls.mobile.setValue("");
    }
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
      //this.loading = true;
    }
    if (this.loginForm.value.loginType === "Doctor") {
      this.doctorRegistration();
    }
    if (this.loginForm.value.loginType === "Hospital") {
      this.hospitalRegistration();
    }
  }

  hospitalRegistration() {
    this.subs.sink = this.apiService
      .hospitalregister(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.sharedDataService.showNotification(
            "snackbar-success",
            "Registration Successfull. Login with your password...",
            "top",
            "center"
          );
          this.router.navigate(["/authentication/signin"], {
            queryParams: { loginType: "Hospital", email: this.f.email.value },
          });
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
          this.submitted = false;
        },
        complete: () => {
          //this.alertService.success("Registration successful", true);
        },
      });
  }

  doctorRegistration() {
    this.subs.sink = this.apiService
      .register(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.sharedDataService.showNotification(
            "snackbar-success",
            "Registration Successfull. Login with your password...",
            "top",
            "center"
          );
          this.router.navigate(["/authentication/signin"], {
            queryParams: { loginType: "Doctor", email: this.f.email.value },
          });
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
          this.submitted = false;
        },
        complete: () => {
          //this.alertService.success("Registration successful", true);
        },
      });
  }
}
