import { Component } from "@angular/core";

@Component({
  templateUrl: "./doctors-profile.component.html",
  styleUrls: ["./doctors-profile.component.scss"],
})
export class doctorsProfileComponent {
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
