import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthService } from "../../../core";
import { Observable } from "rxjs";
import { map, startWith, first } from "rxjs/operators";
import { CONSULTATIONDURATION } from "../../../../dropdwndata";
import { ApiService, sharedDataService } from "../../../core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import * as moment from "moment";
(moment as any).suppressDeprecationWarnings = true;
@Component({
  selector: "clinic2",
  templateUrl: "./establishment2.component.html",
  styleUrls: ["./establishment2.component.scss"],
})
export class establishment2Component
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  establishmentForm2: FormGroup;
  @Output() timeSet = new EventEmitter<string>();
  consultationDuration = CONSULTATIONDURATION;
  timeFormat = 24;
  userData;
  submitted = false;
  selected = new FormControl(0);
  preventOverlayClick: boolean = true;
  mintimeDefault = "00:00 am";
  maxtimeDefault = "23:59 pm";
  mintimeSun = "00:00 am";
  mintimeMon = "00:00 am";
  mintimeTue = "00:00 am";
  mintimeWed = "00:00 am";
  mintimeThu = "00:00 am";
  mintimeFri = "00:00 am";
  mintimeSat = "00:00 am";
  mintimeCBT = "13:00";
  maxtimeCBT = "16:00";
  formattedaddress = " ";
  options = {
    componentRestrictions: {
      country: ["IND"],
    },
  };
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sharedDataService: sharedDataService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public AddressChange(address: any) {
    //setting address from API to local variable
    this.formattedaddress = address.formatted_address;
  }
  ngOnInit() {
    this.userData = this.authService.currentUserValue;

    this.establishmentForm2 = this.formBuilder.group({
      id: [this.userData._id, []],
      ClinicTwoTimings: this.formBuilder.group({
        Sunday: [this.userData.ClinicTwoTimings.Sunday, []],
        Monday: [this.userData.ClinicTwoTimings.Monday, []],
        Tuesday: [this.userData.ClinicTwoTimings.Tuesday, []],
        Wednesday: [this.userData.ClinicTwoTimings.Wednesday, []],
        Thursday: [this.userData.ClinicTwoTimings.Thursday, []],
        Friday: [this.userData.ClinicTwoTimings.Friday, []],
        Saturday: [this.userData.ClinicTwoTimings.Saturday, []],
        ConsultationDurationC1: [
          this.userData.ClinicTwoTimings.ConsultationDurationC1,
          [Validators.required],
        ],
        ConsultationFeesC1: [
          this.userData.ClinicTwoTimings.ConsultationFeesC1,
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(2),
          ],
        ],
        ClinicName: [
          this.userData.ClinicTwoTimings.ClinicName,
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        ClinicLocation: [
          this.userData.ClinicTwoTimings.ClinicLocation,
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        SunStarttime: [
          {
            value: this.userData.ClinicTwoTimings.SunStarttime,
            disabled: true,
          },
          [],
        ],
        SunEndtime: [
          {
            value: this.userData.ClinicTwoTimings.SunEndtime,
            disabled: true,
          },
          [],
        ],
        MonStarttime: [
          {
            value: this.userData.ClinicTwoTimings.MonStarttime,
            disabled: true,
          },
          [],
        ],
        MonEndtime: [
          { value: this.userData.ClinicTwoTimings.MonEndtime, disabled: true },
          [],
        ],
        ComBrStarttime: [this.userData.ClinicTwoTimings.ComBrStarttime, []],
        ComBrEndtime: [
          {
            value: this.userData.ClinicTwoTimings.ComBrEndtime,
            disabled: true,
          },
          [],
        ],
        TueStarttime: [
          {
            value: this.userData.ClinicTwoTimings.TueStarttime,
            disabled: true,
          },
          [],
        ],
        TueEndtime: [
          { value: this.userData.ClinicTwoTimings.TueEndtime, disabled: true },
          [],
        ],
        WedStarttime: [
          {
            value: this.userData.ClinicTwoTimings.WedStarttime,
            disabled: true,
          },
          [],
        ],
        WedEndtime: [
          { value: this.userData.ClinicTwoTimings.WedEndtime, disabled: true },
          [],
        ],
        ThuStarttime: [
          {
            value: this.userData.ClinicTwoTimings.ThuStarttime,
            disabled: true,
          },
          [],
        ],
        ThuEndtime: [
          { value: this.userData.ClinicTwoTimings.ThuEndtime, disabled: true },
          [],
        ],
        FriStarttime: [
          {
            value: this.userData.ClinicTwoTimings.FriStarttime,
            disabled: true,
          },
          [],
        ],
        FriEndtime: [
          { value: this.userData.ClinicTwoTimings.FriEndtime, disabled: true },
          [],
        ],
        SatStarttime: [
          {
            value: this.userData.ClinicTwoTimings.SatStarttime,
            disabled: true,
          },
          [],
        ],
        SatEndtime: [
          { value: this.userData.ClinicTwoTimings.SatEndtime, disabled: true },
          [],
        ],
      }),
    });
  }

  get e() {
    return this.establishmentForm2.controls;
  }
  get ec1() {
    return this.establishmentForm2;
  }
  resetform() {
    this.submitted = false;
    this.establishmentForm2.reset();
    this.resetValidation();
    this.establishmentForm2.controls.id.setValue(this.userData._id);
  }

  resetValidation() {
    let ec1 = this.establishmentForm2;
    ec1.get("ClinicTwoTimings.SunEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.SunEndtime").disable();
    ec1.get("ClinicTwoTimings.MonEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.MonEndtime").disable();
    ec1.get("ClinicTwoTimings.TueEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.TueEndtime").disable();
    ec1.get("ClinicTwoTimings.WedEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.WedEndtime").disable();
    ec1.get("ClinicTwoTimings.ThuEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.ThuEndtime").disable();
    ec1.get("ClinicTwoTimings.FriEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.FriEndtime").disable();
    ec1.get("ClinicTwoTimings.SatEndtime").clearValidators();
    ec1.get("ClinicTwoTimings.SatEndtime").disable();
    ec1.get("ClinicTwoTimings.ComBrEndtime").disable();
    this.enableDaySun(false, "Sun");
    this.enableDayMon(false, "Mon");
    this.enableDayTue(false, "Tue");
    this.enableDayWed(false, "Wed");
    this.enableDayThu(false, "Thu");
    this.enableDayFri(false, "Fri");
    this.enableDaySat(false, "Sat");
  }
  onSubmitEst2() {
    this.submitted = true;
    this.ValidateTimeEntered();
    console.log(this.establishmentForm2.value);
    if (this.establishmentForm2.invalid) {
      return;
    }
    let obj = {
      id: this.userData._id,
      ClinicTwoTimings: {
        id: this.userData._id,
        ClinicName: this.ec1.get("ClinicTwoTimings.ClinicName").value
          ? this.ec1.get("ClinicTwoTimings.ClinicName").value
          : this.userData.ClinicTwoTimings.ClinicName,
        ClinicLocation: this.ec1.get("ClinicTwoTimings.ClinicLocation").value
          ? this.ec1.get("ClinicTwoTimings.ClinicLocation").value
          : this.userData.ClinicTwoTimings.ClinicLocation,
        ComBrEndtime: this.ec1.get("ClinicTwoTimings.ComBrEndtime").value
          ? this.ec1.get("ClinicTwoTimings.ComBrEndtime").value
          : this.userData.ClinicTwoTimings.ComBrEndtime,
        ComBrStarttime: this.ec1.get("ClinicTwoTimings.ComBrStarttime").value
          ? this.ec1.get("ClinicTwoTimings.ComBrStarttime").value
          : this.userData.ClinicTwoTimings.ComBrStarttime,
        ConsultationDurationC1: this.ec1.get(
          "ClinicTwoTimings.ConsultationDurationC1"
        ).value
          ? this.ec1.get("ClinicTwoTimings.ConsultationDurationC1").value
          : this.userData.ClinicTwoTimings.ConsultationDurationC1,
        ConsultationFeesC1: this.ec1.get("ClinicTwoTimings.ConsultationFeesC1")
          .value
          ? this.ec1.get("ClinicTwoTimings.ConsultationFeesC1").value
          : this.userData.ClinicTwoTimings.ConsultationFeesC1,
        FriEndtime: this.ec1.get("ClinicTwoTimings.FriEndtime").value
          ? this.ec1.get("ClinicTwoTimings.FriEndtime").value
          : this.userData.ClinicTwoTimings.FriEndtime,
        FriStarttime: this.ec1.get("ClinicTwoTimings.FriStarttime").value
          ? this.ec1.get("ClinicTwoTimings.FriStarttime").value
          : this.userData.ClinicTwoTimings.FriStarttime,
        Friday: this.ec1.get("ClinicTwoTimings.Friday").value
          ? this.ec1.get("ClinicTwoTimings.Friday").value
          : this.userData.ClinicTwoTimings.Friday,
        MonEndtime: this.ec1.get("ClinicTwoTimings.MonEndtime").value
          ? this.ec1.get("ClinicTwoTimings.MonEndtime").value
          : this.userData.ClinicTwoTimings.MonEndtime,
        MonStarttime: this.ec1.get("ClinicTwoTimings.MonStarttime").value
          ? this.ec1.get("ClinicTwoTimings.MonStarttime").value
          : this.userData.ClinicTwoTimings.MonStarttime,
        Monday: this.ec1.get("ClinicTwoTimings.Monday").value
          ? this.ec1.get("ClinicTwoTimings.Monday").value
          : this.userData.ClinicTwoTimings.Monday,
        SatEndtime: this.ec1.get("ClinicTwoTimings.SatEndtime").value
          ? this.ec1.get("ClinicTwoTimings.SatEndtime").value
          : this.userData.ClinicTwoTimings.SatEndtime,
        SatStarttime: this.ec1.get("ClinicTwoTimings.SatStarttime").value
          ? this.ec1.get("ClinicTwoTimings.SatStarttime").value
          : this.userData.ClinicTwoTimings.SatStarttime,
        Saturday: this.ec1.get("ClinicTwoTimings.Saturday").value
          ? this.ec1.get("ClinicTwoTimings.Saturday").value
          : this.userData.ClinicTwoTimings.Saturday,
        SunEndtime: this.ec1.get("ClinicTwoTimings.SunEndtime").value
          ? this.ec1.get("ClinicTwoTimings.SunEndtime").value
          : this.userData.ClinicTwoTimings.SunEndtime,
        SunStarttime: this.ec1.get("ClinicTwoTimings.SunStarttime").value
          ? this.ec1.get("ClinicTwoTimings.SunStarttime").value
          : this.userData.ClinicTwoTimings.SunStarttime,
        Sunday: this.ec1.get("ClinicTwoTimings.Sunday").value
          ? this.ec1.get("ClinicTwoTimings.Sunday").value
          : this.userData.ClinicTwoTimings.Sunday,
        ThuEndtime: this.ec1.get("ClinicTwoTimings.ThuEndtime").value
          ? this.ec1.get("ClinicTwoTimings.ThuEndtime").value
          : this.userData.ClinicTwoTimings.ThuEndtime,
        ThuStarttime: this.ec1.get("ClinicTwoTimings.ThuStarttime").value
          ? this.ec1.get("ClinicTwoTimings.ThuStarttime").value
          : this.userData.ClinicTwoTimings.ThuStarttime,
        Thursday: this.ec1.get("ClinicTwoTimings.Thursday").value
          ? this.ec1.get("ClinicTwoTimings.Thursday").value
          : this.userData.ClinicTwoTimings.Thursday,
        TueEndtime: this.ec1.get("ClinicTwoTimings.TueEndtime").value
          ? this.ec1.get("ClinicTwoTimings.TueEndtime").value
          : this.userData.ClinicTwoTimings.TueEndtime,
        TueStarttime: this.ec1.get("ClinicTwoTimings.TueStarttime").value
          ? this.ec1.get("ClinicTwoTimings.TueStarttime").value
          : this.userData.ClinicTwoTimings.TueStarttime,
        Tuesday: this.ec1.get("ClinicTwoTimings.Tuesday").value
          ? this.ec1.get("ClinicTwoTimings.Tuesday").value
          : this.userData.ClinicTwoTimings.Tuesday,
        WedEndtime: this.ec1.get("ClinicTwoTimings.WedEndtime").value
          ? this.ec1.get("ClinicTwoTimings.WedEndtime").value
          : this.userData.ClinicTwoTimings.WedEndtime,
        WedStarttime: this.ec1.get("ClinicTwoTimings.WedStarttime").value
          ? this.ec1.get("ClinicTwoTimings.WedStarttime").value
          : this.userData.ClinicTwoTimings.WedStarttime,
        Wednesday: this.ec1.get("ClinicTwoTimings.Wednesday").value
          ? this.ec1.get("ClinicTwoTimings.Wednesday").value
          : this.userData.ClinicTwoTimings.Wednesday,
      },
    };
    this.subs.sink = this.apiService
      .update(obj)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.sharedDataService.showNotification(
            "snackbar-success",
            "Update Successfull...",
            "top",
            "center"
          );
          //this.router.navigate(["/authentication/signin"]);
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
          this.submitted = false;
        },
        complete: () => {},
      });
  }
  ValidateTimeEntered() {
    let sun = this.ec1.get("ClinicTwoTimings.Sunday").value;
    let mon = this.ec1.get("ClinicTwoTimings.Monday").value;
    let tue = this.ec1.get("ClinicTwoTimings.Tuesday").value;
    let wed = this.ec1.get("ClinicTwoTimings.Wednesday").value;
    let thu = this.ec1.get("ClinicTwoTimings.Thursday").value;
    let fri = this.ec1.get("ClinicTwoTimings.Friday").value;
    let sat = this.ec1.get("ClinicTwoTimings.Saturday").value;
    if (
      sun == "" &&
      mon == "" &&
      tue == "" &&
      wed == "" &&
      fri == "" &&
      sat == ""
    ) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Week day timings is required",
        "top",
        "center"
      );
    }
  }
  changeTimeUnit(e: string, day: string) {
    let minval = "";
    minval = moment(e, "HH.mm").add(1, "hours").format("HH:mm");
    if (day === "ComBrStarttime") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.ComBrEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeCBT = minval;
    }

    if (day === "Sun") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.SunEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeSun = minval;
    }
    if (day === "Mon") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.MonEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeMon = minval;
    }

    if (day === "Tue") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.TueEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeTue = minval;
    }
    if (day === "Wed") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.WedEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeWed = minval;
    }
    if (day === "Thu") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.ThuEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeThu = minval;
    }
    if (day === "Fri") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.FriEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeFri = minval;
    }
    if (day === "Sat") {
      let getAcc = this.establishmentForm2.get("ClinicTwoTimings.SatEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeSat = minval;
    }
  }

  SetAllTime(dayStart, dayEnd, d) {
    if (
      d === "Tue" &&
      this.ec1.get("ClinicTwoTimings.MonStarttime").value !== "" &&
      this.ec1.get("ClinicTwoTimings.MonEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicTwoTimings.MonStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicTwoTimings.MonStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicTwoTimings.MonEndtime").value);
    }
    if (
      d === "Wed" &&
      this.ec1.get("ClinicTwoTimings.TueStarttime").value !== "" &&
      this.ec1.get("ClinicTwoTimings.TueEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicTwoTimings.TueStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicTwoTimings.TueStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicTwoTimings.TueEndtime").value);
    }
    if (
      d === "Thu" &&
      this.ec1.get("ClinicTwoTimings.WedStarttime").value !== "" &&
      this.ec1.get("ClinicTwoTimings.WedEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicTwoTimings.WedStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicTwoTimings.WedStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicTwoTimings.WedEndtime").value);
    }
    if (
      d === "Fri" &&
      this.ec1.get("ClinicTwoTimings.ThuStarttime").value !== "" &&
      this.ec1.get("ClinicTwoTimings.ThuEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicTwoTimings.ThuStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicTwoTimings.ThuStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicTwoTimings.ThuEndtime").value);
    }
    if (
      d === "Sat" &&
      this.ec1.get("ClinicTwoTimings.FriStarttime").value !== "" &&
      this.ec1.get("ClinicTwoTimings.FriEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicTwoTimings.FriStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicTwoTimings.FriStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicTwoTimings.FriEndtime").value);
    }
    if (
      d === "Sun" &&
      this.ec1.get("ClinicTwoTimings.SatStarttime").value !== "" &&
      this.ec1.get("ClinicTwoTimings.SatEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicTwoTimings.SatStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicTwoTimings.SatStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicTwoTimings.SatEndtime").value);
    }
  }
  compareArr(o1: any, o2: any) {
    if (o1 === o2) return true;
    else return false;
  }
  enableDaySun(e, d: String) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d === "Sun") {
      dayStart = this.ec1.get("ClinicTwoTimings.SunStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.SunEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();
      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.SunStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.SunEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
      this.userData.ClinicTwoTimings.SunStarttime
        ? (this.userData.ClinicTwoTimings.SunStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.SunEndtime
        ? (this.userData.ClinicTwoTimings.SunEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Sunday
        ? (this.userData.ClinicTwoTimings.Sunday = false)
        : dayEnd.setValue(false);
    }
  }

  enableDayMon(e, d) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d === "Mon") {
      dayStart = this.ec1.get("ClinicTwoTimings.MonStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.MonEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.MonStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.MonEndtime");
      this.userData.ClinicTwoTimings.MonStarttime
        ? (this.userData.ClinicTwoTimings.MonStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.MonEndtime
        ? (this.userData.ClinicTwoTimings.MonEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Monday
        ? (this.userData.ClinicTwoTimings.Monday = false)
        : dayEnd.setValue(false);
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
    }
  }
  enableDayTue(e, d) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d == "Tue") {
      dayStart = this.ec1.get("ClinicTwoTimings.TueStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.TueEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.TueStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.TueEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
      this.userData.ClinicTwoTimings.TueStarttime
        ? (this.userData.ClinicTwoTimings.TueStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.TueEndtime
        ? (this.userData.ClinicTwoTimings.TueEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Tuesday
        ? (this.userData.ClinicTwoTimings.Tuesday = false)
        : dayEnd.setValue(false);
    }
  }

  enableDayWed(e, d) {
    let dayStart;
    let dayEnd;

    if (e.checked === true && d == "Wed") {
      dayStart = this.ec1.get("ClinicTwoTimings.WedStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.WedEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.WedStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.WedEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
      this.userData.ClinicTwoTimings.WedStarttime
        ? (this.userData.ClinicTwoTimings.WedStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.WedEndtime
        ? (this.userData.ClinicTwoTimings.WedEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Wednesday
        ? (this.userData.ClinicTwoTimings.Wednesday = false)
        : dayEnd.setValue(false);
    }
  }

  enableDayThu(e, d) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d == "Thu") {
      dayStart = this.ec1.get("ClinicTwoTimings.ThuStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.ThuEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.ThuStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.ThuEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
      this.userData.ClinicTwoTimings.ThuStarttime
        ? (this.userData.ClinicTwoTimings.ThuStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.ThuEndtime
        ? (this.userData.ClinicTwoTimings.ThuEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Thursday
        ? (this.userData.ClinicTwoTimings.Thursday = false)
        : dayEnd.setValue(false);
    }
  }

  enableDayFri(e, d) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d == "Fri") {
      dayStart = this.ec1.get("ClinicTwoTimings.FriStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.FriEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.FriStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.FriEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
      this.userData.ClinicTwoTimings.FriStarttime
        ? (this.userData.ClinicTwoTimings.FriStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.FriEndtime
        ? (this.userData.ClinicTwoTimings.FriEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Friday
        ? (this.userData.ClinicTwoTimings.Friday = false)
        : dayEnd.setValue(false);
    }
  }

  enableDaySat(e, d) {
    let dayStart;
    let dayEnd;

    if (e.checked === true && d == "Sat") {
      dayStart = this.ec1.get("ClinicTwoTimings.SatStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.SatEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicTwoTimings.SatStarttime");
      dayEnd = this.ec1.get("ClinicTwoTimings.SatEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
      this.userData.ClinicTwoTimings.SatStarttime
        ? (this.userData.ClinicTwoTimings.SatStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicTwoTimings.SatEndtime
        ? (this.userData.ClinicTwoTimings.SatEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicTwoTimings.Saturday
        ? (this.userData.ClinicTwoTimings.Saturday = false)
        : dayEnd.setValue(false);
    }
  }
}
