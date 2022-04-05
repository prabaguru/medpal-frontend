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
import { map, startWith } from "rxjs/operators";
import { CONSULTATIONDURATION } from "../../../../dropdwndata";
import { ApiService, sharedDataService } from "../../../core";
import * as moment from "moment";
@Component({
  selector: "clinic2",
  templateUrl: "./establishment2.component.html",
  styleUrls: ["./establishment2.component.scss"],
})
export class establishment2Component implements OnInit {
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public AddressChange(address: any) {
    //setting address from API to local variable
    this.formattedaddress = address.formatted_address;
  }
  ngOnInit() {
    this.userData = this.authService.currentUserValue;

    this.establishmentForm2 = this.formBuilder.group({
      ClinicTwoTimings: this.formBuilder.group({
        Sunday: ["", []],
        Monday: ["", []],
        Tuesday: ["", []],
        Wednesday: ["", []],
        Thursday: ["", []],
        Friday: ["", []],
        Saturday: ["", []],
        ConsultationDurationC1: ["", [Validators.required]],
        ConsultationFeesC1: [
          "",
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(2),
          ],
        ],
        ClinicName: [
          "",
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        ClinicLocation: [
          "",
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        SunStarttime: [{ value: "", disabled: true }, []],
        SunEndtime: [{ value: "", disabled: true }, []],
        MonStarttime: [{ value: "", disabled: true }, []],
        MonEndtime: [{ value: "", disabled: true }, []],
        ComBrStarttime: ["", []],
        ComBrEndtime: [{ value: "", disabled: true }, []],
        TueStarttime: [{ value: "", disabled: true }, []],
        TueEndtime: [{ value: "", disabled: true }, []],
        WedStarttime: [{ value: "", disabled: true }, []],
        WedEndtime: [{ value: "", disabled: true }, []],
        ThuStarttime: [{ value: "", disabled: true }, []],
        ThuEndtime: [{ value: "", disabled: true }, []],
        FriStarttime: [{ value: "", disabled: true }, []],
        FriEndtime: [{ value: "", disabled: true }, []],
        SatStarttime: [{ value: "", disabled: true }, []],
        SatEndtime: [{ value: "", disabled: true }, []],
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
    }
  }
}
