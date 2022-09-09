import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core";
@Component({
  selector: "app-page500",
  templateUrl: "./page500.component.html",
  styleUrls: ["./page500.component.scss"],
})
export class Page500Component implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {}
  submit() {
    this.authService.logout();
    this.router.navigate(["/authentication/signin"]);
  }
}
