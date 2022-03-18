import { Component, OnInit } from "@angular/core";
declare var $: any;
@Component({
  selector: "app-entry-header",
  templateUrl: "./app-header.component.html",
})
export class AppEntryHeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  ngOnInit(): void {}
}
