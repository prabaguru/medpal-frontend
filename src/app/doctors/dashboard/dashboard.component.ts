import { Component, OnInit, ViewChild } from "@angular/core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  labels: string[];
  responsive: ApexResponsive | ApexResponsive[];
};
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, sharedDataService, ApiService } from "../../core";
import { first } from "rxjs/operators";
import * as moment from "moment";
(moment as any).suppressDeprecationWarnings = true;
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild("chart") chart: ChartComponent;
  //public chartOptions: Partial<ChartOptions>;
  public pieChartOptions: Partial<ChartOptions>;
  userData: any;
  lastLogin: string = "";
  getAppointments: any = {
    total: 0,
    booked: 0,
    closed: 0,
  };
  cancelled: any = [];
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  private smallChart2() {
    let tot = this.getAppointments.total;
    let pen = this.getAppointments.booked;
    let clo = this.getAppointments.closed;
    this.pieChartOptions = {
      series2: [tot, pen, clo],
      chart: {
        type: "donut",
        width: 400,
      },
      legend: {
        show: true,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ["Booked", "Ongoing", "Closed"],

      responsive: [],
    };
  }

  ngOnInit() {
    this.userData = this.authService.currentUserValue;
    if (
      this.userData.role === "Doctor" &&
      (!this.userData.tab2 ||
        !this.userData.tab3 ||
        !this.userData.tab4 ||
        !this.userData.tab5)
    ) {
      this.router.navigate(["/doctors/profile-settings"]);
    }
    this.lastLogin = moment(this.userData.lastLogin).format(
      "DD/MM/YYYY hh.mm a"
    );
    this.getAllDoctorAppoinmentsById("Clinic1");
  }

  getAllDoctorAppoinmentsById(Clinic: string) {
    // if (Clinic === "Clinic1") {
    //   this.clinic1Flag = true;
    //   this.clinic2Flag = false;
    // } else {
    //   this.clinic1Flag = false;
    //   this.clinic2Flag = true;
    // }
    if (!this.userData?._id) {
      return;
    }
    let obj = {};
    obj = {
      id: this.userData?._id,
      clinic: Clinic,
      report: true,
    };
    this.subs.sink = this.apiService
      .getAllDoctorAppoinmentsById(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
          this.getAppointments = data;
          this.smallChart2();
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
          //this.submitted = false;
        },
        complete: () => {},
      });
  }
}
