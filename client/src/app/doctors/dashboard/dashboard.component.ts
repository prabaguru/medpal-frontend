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
  getAppointments: any = [];
  pending: any = [];
  closed: any = [];
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
    let tot = this.getAppointments.length;
    let pen = this.pending.length;
    let clo = this.closed.length;
    this.pieChartOptions = {
      series2: [tot, pen, clo],
      chart: {
        type: "donut",
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ["Booked", "Pending", "Closed"],
      responsive: [
        {
          breakpoint: 480,
        },
      ],
    };
  }

  ngOnInit() {
    this.userData = this.authService.currentUserValue;
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
          this.getAppointments = [];
          this.getAppointments = data;
          this.pending = this.getAppointments.filter(
            (x: any) => x.AppointmentStatus == "Booked"
          );
          this.closed = this.getAppointments.filter(
            (x: any) => x.AppointmentStatus == "Closed"
          );
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
