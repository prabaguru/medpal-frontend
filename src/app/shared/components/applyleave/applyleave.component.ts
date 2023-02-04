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
  firstFormGroup: FormGroup;
  userData;
  preview: string;
  minDate: Date;
  maxDate: Date;
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
  }
  ngOnInit() {
    this.userData = this.authService.currentUserValue;
    //console.log(this.userData);
    this.firstFormGroup = this.fb.group({
      appointmentDate: ["", Validators.required],
    });
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  getDay(e: any) {
    let date;
    date = moment(e.value._d).day();
    //console.log(e.value._d);
    //let checkSlot = this.slotCheck(this.momweekday[date]);
  }

  submitForm() {
    let date = this.f["appointmentDate"].value._d;
    let dateeObj = moment(date).format("DD/MM/YYYY");
    let dt = moment(date, "DD/MM/YYYY hh:mm a").unix();
    // console.log(dateeObj);
    // console.log(dt);
    let obj = {
      d_id: this.userData._id,
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
  // updateLocalStorage(obj) {
  //   const oldInfo = JSON.parse(localStorage.getItem("currentUser"));
  //   localStorage.setItem("currentUser", JSON.stringify({ ...oldInfo, ...obj }));
  //   this.authService.updateUserObjOnSave(
  //     JSON.parse(localStorage.getItem("currentUser"))
  //   );
  //   this.userData = [];
  //   this.userData = this.authService.currentUserValue;
  //   //this.preview = null;
  // }
}
