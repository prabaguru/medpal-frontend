import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AuthService, sharedDataService, ApiService } from "../../core";
import { first } from "rxjs/operators";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import * as moment from "moment";
import { FormGroup, FormControl } from "@angular/forms";
@Component({
  selector: "doctor-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class DoctorAppointmentsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  userData;
  minDate = new Date(2022, 7, 1);
  maxDate = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
  range = new FormGroup({
    start: new FormControl(""),
    end: new FormControl(""),
  });
  clinic1Flag: boolean = false;
  clinic2Flag: boolean = false;
  getAppointments: any = [];
  dataSource: any = [];
  columnsToDisplay = [
    "doctorName",
    "PatientName",
    "AppointmentDate",
    "AppointmentStatus",
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, "expand"];
  expandedElement: any;
  getAppointmentsflag: boolean = false;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService
  ) {
    super();
    this.userData = this.authService.currentUserValue;
    this.getAllDoctorAppoinmentsById("Clinic1", "reset");
  }
  ngOnInit(): void {
    //console.log(this.userData);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  resetDate() {
    this.range.reset();
  }
  getAllDoctorAppoinmentsById(Clinic: string, reset: string) {
    if (Clinic === "Clinic1") {
      this.clinic1Flag = true;
      this.clinic2Flag = false;
    } else {
      this.clinic1Flag = false;
      this.clinic2Flag = true;
    }
    if (!this.userData?._id) {
      return;
    }
    let obj = {};
    if (reset === "search") {
      obj = {
        id: this.userData?._id,
        clinic: Clinic,
        start: this.range.controls.start.value,
        end: this.range.controls.end.value,
      };
    } else {
      this.resetDate();
      obj = {
        id: this.userData?._id,
        clinic: Clinic,
        start: "",
        end: "",
      };
    }
    //console.log(obj);
    this.subs.sink = this.apiService
      .getAllDoctorAppoinmentsById(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
          this.getAppointments = [];
          this.getAppointments = data;
          if (this.getAppointments.length > 0) {
            this.dataSource = new MatTableDataSource(this.getAppointments);
            //this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.getAppointmentsflag = false;
          } else {
            this.getAppointmentsflag = true;
          }
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
          //this.submitted = false;
          this.getAppointmentsflag = false;
        },
        complete: () => {},
      });
  }

  closeAppointment(aId: string) {
    let obj = {};
    obj = {
      id: aId,
      AppointmentStatus: "Closed",
    };
    this.subs.sink = this.apiService
      .closeDoctorappointment(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
          this.sharedDataService.showNotification(
            "snackbar-success",
            "Appointment closed sucessfully...",
            "top",
            "center"
          );
          let len = this.getAppointments.length;
          for (let i = 0; i < len; i++) {
            if (aId == this.getAppointments[i]._id) {
              this.getAppointments[i].AppointmentStatus = "Closed";
            }
          }
        },
        error: (error) => {
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

  tabClick(e: any) {
    if (e.index == 0) {
      this.getAllDoctorAppoinmentsById("Clinic1", "reset");
    } else {
      this.getAllDoctorAppoinmentsById("Clinic2", "reset");
    }
  }
}
