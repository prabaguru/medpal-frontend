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
import * as moment from "moment";
@Component({
  selector: "establishment",
  templateUrl: "./establishment.component.html",
  styleUrls: ["./establishment.component.scss"],
})
export class establishmentComponent implements OnInit {
  establishmentForm: FormGroup;
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
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData = this.authService.currentUserValue;

    this.establishmentForm = this.formBuilder.group({
      ClinicOneTimings: this.formBuilder.group({
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
    return this.establishmentForm.controls;
  }
  get ec1() {
    return this.establishmentForm;
  }
  resetform() {
    this.submitted = false;
    this.establishmentForm.reset();
    this.resetValidation();
  }

  resetValidation() {
    let ec1 = this.establishmentForm;
    ec1.get("ClinicOneTimings.SunEndtime").clearValidators();
    ec1.get("ClinicOneTimings.SunEndtime").disable();
    ec1.get("ClinicOneTimings.MonEndtime").clearValidators();
    ec1.get("ClinicOneTimings.MonEndtime").disable();
    ec1.get("ClinicOneTimings.TueEndtime").clearValidators();
    ec1.get("ClinicOneTimings.TueEndtime").disable();
    ec1.get("ClinicOneTimings.WedEndtime").clearValidators();
    ec1.get("ClinicOneTimings.WedEndtime").disable();
    ec1.get("ClinicOneTimings.ThuEndtime").clearValidators();
    ec1.get("ClinicOneTimings.ThuEndtime").disable();
    ec1.get("ClinicOneTimings.FriEndtime").clearValidators();
    ec1.get("ClinicOneTimings.FriEndtime").disable();
    ec1.get("ClinicOneTimings.SatEndtime").clearValidators();
    ec1.get("ClinicOneTimings.SatEndtime").disable();
    ec1.get("ClinicOneTimings.ComBrEndtime").disable();
    this.enableDaySun(false, "Sun");
    this.enableDayMon(false, "Mon");
    this.enableDayTue(false, "Tue");
    this.enableDayWed(false, "Wed");
    this.enableDayThu(false, "Thu");
    this.enableDayFri(false, "Fri");
    this.enableDaySat(false, "Sat");
  }
  onSubmitEst() {
    this.submitted = true;
    console.log(this.establishmentForm.value);
  }
  changeTimeUnit(e: string, day: string) {
    let minval = "";
    minval = moment(e, "HH.mm").add(1, "hours").format("HH:mm");
    if (day === "ComBrStarttime") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.ComBrEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeCBT = minval;
    }

    if (day === "Sun") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.SunEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeSun = minval;
    }
    if (day === "Mon") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.MonEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeMon = minval;
    }

    if (day === "Tue") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.TueEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeTue = minval;
    }
    if (day === "Wed") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.WedEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeWed = minval;
    }
    if (day === "Thu") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.ThuEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeThu = minval;
    }
    if (day === "Fri") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.FriEndtime");
      getAcc.addValidators(Validators.required);
      getAcc.enable();
      if (getAcc.value) {
        getAcc.setValue("");
      }
      this.mintimeFri = minval;
    }
    if (day === "Sat") {
      let getAcc = this.establishmentForm.get("ClinicOneTimings.SatEndtime");
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
      dayStart = this.ec1.get("ClinicOneTimings.SunStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.SunEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();
      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.SunStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.SunEndtime");
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
      this.ec1.get("ClinicOneTimings.MonStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.MonEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.MonStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.MonStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.MonEndtime").value);
    }
    if (
      d === "Wed" &&
      this.ec1.get("ClinicOneTimings.TueStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.TueEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.TueStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.TueStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.TueEndtime").value);
    }
    if (
      d === "Thu" &&
      this.ec1.get("ClinicOneTimings.WedStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.WedEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.WedStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.WedStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.WedEndtime").value);
    }
    if (
      d === "Fri" &&
      this.ec1.get("ClinicOneTimings.ThuStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.ThuEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.ThuStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.ThuStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.ThuEndtime").value);
    }
    if (
      d === "Sat" &&
      this.ec1.get("ClinicOneTimings.FriStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.FriEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.FriStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.FriStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.FriEndtime").value);
    }
    if (
      d === "Sun" &&
      this.ec1.get("ClinicOneTimings.SatStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.SatEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.SatStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.SatStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.SatEndtime").value);
    }
  }
  enableDayMon(e, d) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d === "Mon") {
      dayStart = this.ec1.get("ClinicOneTimings.MonStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.MonEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.MonStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.MonEndtime");
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
      dayStart = this.ec1.get("ClinicOneTimings.TueStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.TueEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.TueStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.TueEndtime");
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
      dayStart = this.ec1.get("ClinicOneTimings.WedStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.WedEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.WedStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.WedEndtime");
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
      dayStart = this.ec1.get("ClinicOneTimings.ThuStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.ThuEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.ThuStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.ThuEndtime");
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
      dayStart = this.ec1.get("ClinicOneTimings.FriStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.FriEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.FriStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.FriEndtime");
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
      dayStart = this.ec1.get("ClinicOneTimings.SatStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.SatEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();

      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.SatStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.SatEndtime");
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
    }
  }
}
