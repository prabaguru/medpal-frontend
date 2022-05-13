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
    this.loginForm = this.formBuilder.group({
      loginType: ["Doctor", Validators.required],
      email: [
        "yyyypraba.wg@gmail.com",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ["qwqwqw", Validators.required],
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
      this.subs.sink = this.authService
        .login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            if (res) {
              const token = this.authService.currentUserValue.token;
              if (token) {
                this.router.navigate(["/dashboard/main"]);
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
}
