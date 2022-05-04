import { Component, OnInit } from "@angular/core";
declare var $: any;
@Component({
  selector: "app-entry-footer",
  templateUrl: "./site-footer.component.html",
})
export class AppEntryFooterComponent implements OnInit {
  year: any;
  ngOnInit(): void {
    const d = new Date();
    this.year = d.getFullYear();
  }
}
