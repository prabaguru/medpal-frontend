import { Component, ElementRef, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { AuthService, sharedDataService, ApiService } from "../../../core";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { first } from "rxjs/operators";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
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
  selector: "applyleave",
  templateUrl: "./applyleave.component.html",
  styleUrls: ["./applyleave.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ApplyLeaveComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @Input() userData: any;
  firstFormGroup: FormGroup;
  preview: string;
  minDate: Date;
  maxDate: Date;
  submitFlag: boolean = true;
  learveArr: any = [];
  constructor(
    private host: ElementRef<HTMLInputElement>,
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    public fb: FormBuilder
  ) {
    super();
    this.minDate = moment(moment.now()).toDate();
    this.maxDate = moment(this.minDate, "DD/MM/YYYY").add(10, "days").toDate();
    this.subs.sink = this.authService.currentUser.subscribe((x) => {
      this.userData = x;
      this.learveArr = [];
      let learveArr = this.userData?.leaveDates
        ? this.userData?.leaveDates
        : [];
      let curDate = moment(new Date());
      let learveArrLen = learveArr.length;
      for (let i = 0; i < learveArrLen; i++) {
        let pastDate = moment.unix(learveArr[i].datestamp);
        let after = pastDate.isSameOrAfter(curDate, "days");
        if (after) {
          this.learveArr.push(learveArr[i]);
        }
      }
      //console.log(this.learveArr);
    });
  }
  ngOnInit() {
    this.firstFormGroup = this.fb.group({
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

  submitForm() {
    let date = this.f["appointmentDate"].value._d;
    let dateeObj = moment(date).format("DD/MM/YYYY");
    let dt = moment(date, "DD/MM/YYYY hh:mm a").unix();
    // console.log(dateeObj);
    // console.log(dt);
    let obj = {};
    obj = {
      d_id: this.userData._id,
      date: dateeObj,
      datestamp: dt,
    };
    if (!this.userData._id) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Doctor info not found.",
        "top",
        "center"
      );
      return;
    }
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
          let objL = {
            leaveDates: this.learveArr,
          };
          this.updateLocalStorage(objL);
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

  cancelLeave(obj: any) {
    if (!obj?.date) {
      return;
    }
    this.subs.sink = this.apiService
      .cancelLeave(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
          this.sharedDataService.showNotification(
            "snackbar-success",
            "Leave cancelled successfully.",
            "top",
            "center"
          );
          for (let i = 0; i < this.learveArr.length; i++) {
            if (this.learveArr[i].datestamp === obj?.datestamp) {
              this.learveArr.splice(i, 1);
            }
          }
          if (data.data) {
            this.updateLocalStorage(data.data);
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
        },
        complete: () => {},
      });
  }
  updateLocalStorage(obj: any) {
    const oldInfo = JSON.parse(localStorage.getItem("currentUser"));
    localStorage.setItem("currentUser", JSON.stringify({ ...oldInfo, ...obj }));
    this.authService.updateUserObjOnSave(
      JSON.parse(localStorage.getItem("currentUser"))
    );
  }
}
