import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControlOptions,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { first } from "rxjs/operators";
import { of } from "rxjs";
import { ApiService, MustMatch } from "../../core";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  hide = true;
  chide = true;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
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
        mobile: [
          "",
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(10),
          ],
        ],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        role: ["Doctor", []],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      } as AbstractControlOptions
    );
  }
  get f() {
    return this.loginForm.controls;
  }
  showNotification(colorName, text: any, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    //this.loading = true;
    this.apiService
      .register(this.loginForm.value)
      .pipe(first())
      .subscribe({
        complete: () => {
          //this.alertService.success("Registration successful", true);
        },
        error: (error) => {
          this.showNotification("black", error, "top", "center");
        },
        next: (data) => {
          this.showNotification(
            "black",
            "Registration Successfull...",
            "top",
            "center"
          );
          this.router.navigate(["/authentication/signin"]);
        },
      });
  }
}
