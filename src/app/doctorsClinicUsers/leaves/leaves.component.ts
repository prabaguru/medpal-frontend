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
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import * as moment from "moment";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
(moment as any).suppressDeprecationWarnings = true;
const MY_DATE_FORMAT = {
  parse: {
    dateInput: "DD/MM/YYYY", // this is how your date will be parsed from Input
  },
  display: {
    dateInput: "DD/MM/YYYY", // this is how your date will get displayed on the Input
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Component({
  selector: "app-leaves",
  templateUrl: "./leaves.component.html",
  styleUrls: ["./leaves.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocLeaveComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  firstFormGroup: FormGroup;
  preview: string;
  minDate: Date;
  maxDate: Date;
  submitFlag: boolean = true;
  learveArr: any = [];
  userData;
  showdoc: boolean = false;
  getAppointments: any = [];
  expandedElement: any;
  getAppointmentsflag: boolean = true;
  codeOwnerListCtrl = new FormControl();
  codeOwnerfilteredOptions: Observable<any[]>;
  @ViewChild("inputAutoComplete3") inputAutoComplete3: any;
  arrowIconSubject3 = new BehaviorSubject("arrow_drop_down");
  doctorData: any;
  clinincForm: FormGroup;
  doc: any = null;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    super();
    this.userData = this.authService.currentUserValue;
    this.minDate = moment(moment.now()).toDate();
    this.maxDate = moment(this.minDate, "DD/MM/YYYY").add(10, "days").toDate();

    this.clinincForm = this._formBuilder.group({
      clinic: this.codeOwnerListCtrl,
    });
    this.getAllDoctors();
    //this.getAllDoctorAppoinmentsById("Clinic1", "reset");
  }
  ngOnInit(): void {
    //console.log(this.userData);
    this.firstFormGroup = this._formBuilder.group({
      appointmentDate: ["", Validators.required],
    });
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  getDay(e: any) {
    //let date;
    //date = moment(e.value._d).day();
    //console.log(e.value._d);
    //let checkSlot = this.slotCheck(this.momweekday[date]);
    this.submitFlag = false;
  }
  getAllDoctorInfo(data: any) {
    this.doc = [];
    this.learveArr = [];
    this.subs.sink = this.apiService
      .getDocById(data)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.doc = data[0];
          this.learveArr = this.doc?.leaveDates ? this.doc?.leaveDates : [];
          //console.log(this.doc);
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            "Doctor info not found. Try sometime later",
            "top",
            "center"
          );
          return;
        },
        complete: () => {},
      });
  }

  submitForm() {
    if (!this.doc?._id) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Select Doctor.",
        "top",
        "center"
      );
      return;
    }
    let date = this.f["appointmentDate"].value._d;
    let dateeObj = moment(date).format("DD/MM/YYYY");
    let dt = moment(date, "DD/MM/YYYY hh:mm a").unix();
    // console.log(dateeObj);
    // console.log(dt);
    let obj = {};
    obj = {
      d_id: this.doc._id,
      date: dateeObj,
      datestamp: dt,
    };
    this.subs.sink = this.apiService
      .updateAllLeave(obj)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.sharedDataService.showNotification(
            "snackbar-success",
            data.message,
            "top",
            "center"
          );
          this.submitFlag = true;
          this.firstFormGroup.reset();
          this.learveArr.push(obj);
          // let objL = {
          //   leaveDates: this.learveArr,
          // };
          //this.updateLocalStorage(objL);
        },
        (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
        }
      );
  }

  getAllDoctors() {
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
    this.learveArr = [];
    this.doc = [];
    this.firstFormGroup.reset();
    this.submitFlag = true;
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
