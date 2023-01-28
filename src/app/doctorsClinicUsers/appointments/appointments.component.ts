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
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import * as moment from "moment";
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
@Component({
  selector: "doctor-appointmentsCli",
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
  showdoc: boolean = false;
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
  getAppointmentsflag: boolean = true;
  codeOwnerListCtrl = new FormControl();
  codeOwnerfilteredOptions: Observable<any[]>;
  @ViewChild("inputAutoComplete3") inputAutoComplete3: any;
  arrowIconSubject3 = new BehaviorSubject("arrow_drop_down");
  doctorData: any;
  clinincForm: FormGroup;
  clinicSelection: string = "";
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    super();
    this.userData = this.authService.currentUserValue;

    this.subs.sink = this.apiService
      .clinicUserDoctorInfo(this.userData.h_id)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.doctorData = data;
          //console.log(this.doctorData);
          this.codeOwnerfilteredOptions =
            this.codeOwnerListCtrl.valueChanges.pipe(
              startWith(""),
              map((value) =>
                typeof value === "string" ? value : value?.firstName
              ),
              map((name) =>
                name
                  ? this.doctorData.filter(
                      (option) =>
                        option.firstName
                          .toLowerCase()
                          .indexOf(name.toLowerCase()) === 0 ||
                        option.lastName
                          .toLowerCase()
                          .indexOf(name.toLowerCase()) === 0
                    )
                  : this.doctorData.slice()
              )
            );
          this.showdoc = true;
          //this.getHospitalById();
        },
        error: (error) => {
          this.showdoc = false;
        },
        complete: () => {},
      });
    this.clinincForm = this._formBuilder.group({
      clinic: this.codeOwnerListCtrl,
    });
    //this.getAllDoctorAppoinmentsById("Clinic1", "reset");
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
  getAllDoctorAppoinmentsById(id: string, reset?: string) {
    let obj = {};
    if (!this.clinincForm.controls.clinic.value?._id) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Select Doctor",
        "top",
        "center"
      );
      return;
    }
    if (reset === "search") {
      if (!this.range.controls.start.value || !this.range.controls.end.value) {
        this.sharedDataService.showNotification(
          "snackbar-danger",
          "Select Date Range",
          "top",
          "center"
        );
        return;
      }

      obj = {
        id: this.clinincForm.controls.clinic.value._id,
        clinic: "Clinic1",
        start: this.range.controls.start.value
          ? this.range.controls.start.value
          : "",
        end: this.range.controls.end.value ? this.range.controls.end.value : "",
      };
    }
    if (reset === "drname") {
      this.resetDate();
      obj = {
        id: id,
        clinic: "Clinic1",
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
      closedBy: "Doctor",
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
  cancelAppointment(aId: any) {
    let obj = {};
    obj = {
      id: aId._id,
      AppointmentStatus: "Cancelled",
      closedBy: "Doctor",
      slot: `${aId.slot}-Cancelled`,
      appointmentDate: aId.appointmentDate,
      updateType: "Cancel",
    };
    let curTime = moment().unix();
    if (aId.appointmentDate < curTime) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Slot time has expired.This appointment cannot be cancelled.",
        "top",
        "center"
      );
      return;
    }
    this.subs.sink = this.apiService
      .closeDoctorappointment(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.sharedDataService.showNotification(
            "snackbar-success",
            "Appointment cancelled sucessfully.",
            "top",
            "center"
          );
          let len = this.getAppointments.length;
          for (let i = 0; i < len; i++) {
            if (aId._id == this.getAppointments[i]._id) {
              this.getAppointments[i].AppointmentStatus = "Cancelled";
            }
          }
          this.updateCancelAppointments(aId);
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
  updateCancelAppointments(obj: any) {
    this.subs.sink = this.apiService
      .updateCancelAppointments(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  openOrClosePanelCOW(evt: any, trigger3: MatAutocompleteTrigger): void {
    evt.stopPropagation();
    if (trigger3.panelOpen) trigger3.closePanel();
    else trigger3.openPanel();
  }
  clearInputCOW(evt: any): void {
    evt.stopPropagation();
    this.codeOwnerListCtrl?.reset();
    this.inputAutoComplete3?.nativeElement.focus();
  }
  displayFn3(doc: any) {
    return doc
      ? `Dr- ${doc.firstName}-${doc.lastName}-${
          doc.ClinicOneTimings.ClinicName
        }-${doc.ClinicOneTimings.clinicArea}- (${
          doc.graduation.Graduation === "UG" ||
          doc.graduation.Graduation === "PG"
            ? doc.graduation.qualificationUG.sName + "-"
            : ""
        }${
          doc.graduation.Graduation === "PG"
            ? doc.graduation.qualificationPG.sName +
              "-" +
              doc.graduation.specialisationPG.name
            : ""
        }) - ₹:${doc.ClinicOneTimings.ConsultationFeesC1}`
      : doc;
  }
}
