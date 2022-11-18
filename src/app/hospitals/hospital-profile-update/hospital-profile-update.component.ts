import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControlOptions,
} from "@angular/forms";
import {
  AuthService,
  sharedDataService,
  ApiService,
  MustMatch,
} from "../../core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { first } from "rxjs/operators";
import * as moment from "moment";
(moment as any).suppressDeprecationWarnings = true;
@Component({
  selector: "hospital-profile-update",
  templateUrl: "./hospital-profile-update.component.html",
  styleUrls: ["./hospital-profile-update.component.scss"],
})
export class HospitalUpdateProfileComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public profileForm: FormGroup = new FormGroup({});
  userData: any;
  submitted: boolean = false;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  lastLogin: string = "";
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.userData = this.authService.currentUserValue;
    this.lastLogin = moment(this.userData.lastLogin).format(
      "DD/MM/YYYY hh.mm a"
    );
    this.profileForm = this.formBuilder.group(
      {
        id: new FormControl(this.userData._id ? this.userData._id : "", [
          Validators.required,
        ]),
        firstName: new FormControl(
          {
            value: this.userData.firstName ? this.userData.firstName : "",
            disabled: true,
          },
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern("^[a-zA-Z '-]+$"),
          ]
        ),
        email: new FormControl(
          {
            value: this.userData.email ? this.userData.email : "",
            disabled: true,
          },
          [Validators.required, Validators.email]
        ),

        mobile: new FormControl(
          {
            value: this.userData.mobile.number
              ? this.userData.mobile.number
              : "",
            disabled: true,
          },
          [Validators.required, Validators.maxLength(10)]
        ),
        currentPwd: ["", [Validators.required, Validators.minLength(6)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      } as AbstractControlOptions
    );
  }
  get f() {
    return this.profileForm.controls;
  }
  saveChanges() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    } else {
      let obj = {};
      obj = {
        id: this.f["id"].value,
        resetPass: "reset",
        currentPwd: this.f["currentPwd"].value,
        password: this.f["password"].value,
        confirmPassword: this.f["confirmPassword"].value,
      };
      this.subs.sink = this.apiService
        .hopitalPasswordUpdate(obj)
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
                loginType: "Hospital",
                email: this.f["email"].value,
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
  public togglePasswordVisibility2(): void {
    this.showPassword2 = !this.showPassword2;
  }
}
