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
  public showPassword: boolean = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.India,
    // CountryISO.UnitedArabEmirates,
    // CountryISO.UnitedStates,
    // CountryISO.UnitedKingdom,
  ];
  loginForm: FormGroup;
  submitted = false;
  hide = true;
  chide = true;
  registerAs;
  returnUrl: any;
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
    this.loginForm = this.formBuilder.group(
      {
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

    if (this.loginForm.invalid) {
      return;
      //this.loading = true;
    } else {
      this.doctorRegistration();
    }
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
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
