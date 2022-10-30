import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core";
@Component({
  selector: "app-page404",
  templateUrl: "./page404.component.html",
  styleUrls: ["./page404.component.scss"],
})
export class Page404Component implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {}

  submit() {
    this.authService.logout();
    this.router.navigate(["/authentication/signin"]);
  }
}
