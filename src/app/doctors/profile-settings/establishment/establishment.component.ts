import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
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
import { ApiService, MustMatch, sharedDataService } from "../../../core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import * as moment from "moment";
(moment as any).suppressDeprecationWarnings = true;
@Component({
  selector: "clinic1",
  templateUrl: "./establishment.component.html",
  styleUrls: ["./establishment.component.scss"],
})
export class establishmentComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
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
  mintimeCBTS = "9:00 am";
  mintimeCBT = "12:00 pm";
  maxtimeCBT = "16:00 pm";
  BreakTimeStops = [];
  sunSlots: any;
  monSlots: any;
  tueSlots: any;
  wedSlots: any;
  thuSlots: any;
  friSlots: any;
  satSlots: any;
  options = {
    componentRestrictions: {
      country: ["in", "ua"],
    },
    fields: ["place_id", "name", "formatted_address", "geometry"],
  };
  clinicAddress: string = "";
  cliniclocation = {};
  coordinates: any;
  docESTDisabled: boolean = true;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sharedDataService: sharedDataService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.authService.currentUser.subscribe((x) => {
      this.userData = x;
    });
    if (this.userData === undefined) {
      this.clinicAddress = null;
    }
  }

  ngOnInit() {
    this.establishmentForm = this.formBuilder.group({
      id: [this.userData._id, []],
      ClinicOneTimings: this.formBuilder.group({
        Sunday: [
          {
            value: this.userData.ClinicOneTimings.Sunday,
            disabled: true,
          },
          [],
        ],
        Monday: [
          {
            value: this.userData.ClinicOneTimings.Monday,
            disabled: true,
          },
          [],
        ],
        Tuesday: [
          {
            value: this.userData.ClinicOneTimings.Tuesday,
            disabled: true,
          },
          [],
        ],
        Wednesday: [
          {
            value: this.userData.ClinicOneTimings.Wednesday,
            disabled: true,
          },
          [],
        ],
        Thursday: [
          {
            value: this.userData.ClinicOneTimings.Thursday,
            disabled: true,
          },
          [],
        ],
        Friday: [
          {
            value: this.userData.ClinicOneTimings.Friday,
            disabled: true,
          },
          [],
        ],
        Saturday: [
          {
            value: this.userData.ClinicOneTimings.Saturday,
            disabled: true,
          },
          [],
        ],
        Cbt: [
          {
            value: true,
            disabled: true,
          },
          [],
        ],
        clinicArea: [
          {
            value: this.userData.ClinicOneTimings.clinicArea,
            disabled: true,
          },
          [Validators.required],
        ],
        ConsultationDurationC1: [
          {
            value: this.userData.ClinicOneTimings.ConsultationDurationC1,
            disabled: true,
          },
          [Validators.required],
        ],
        ConsultationFeesC1: [
          {
            value: this.userData.ClinicOneTimings.ConsultationFeesC1,
            disabled: true,
          },
          [
            Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(2),
          ],
        ],
        ClinicName: [
          {
            value: this.userData.ClinicOneTimings.ClinicName,
            disabled: true,
          },
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        ClinicLocation: [
          {
            value: "",
            disabled: true,
          },
          ,
          [],
        ],
        location: ["", []],
        SunStarttime: [
          {
            value: this.userData.ClinicOneTimings.SunStarttime,
            disabled: true,
          },
          [],
        ],
        SunEndtime: [
          {
            value: this.userData.ClinicOneTimings.SunEndtime,
            disabled: true,
          },
          [],
        ],
        MonStarttime: [
          {
            value: this.userData.ClinicOneTimings.MonStarttime,
            disabled: true,
          },
          [],
        ],
        MonEndtime: [
          { value: this.userData.ClinicOneTimings.MonEndtime, disabled: true },
          [],
        ],
        ComBrStarttime: [
          {
            value: this.userData.ClinicOneTimings.ComBrStarttime,
            disabled: true,
          },
          [],
        ],
        ComBrEndtime: [
          {
            value: this.userData.ClinicOneTimings.ComBrEndtime,
            disabled: true,
          },
          [],
        ],
        TueStarttime: [
          {
            value: this.userData.ClinicOneTimings.TueStarttime,
            disabled: true,
          },
          [],
        ],
        TueEndtime: [
          { value: this.userData.ClinicOneTimings.TueEndtime, disabled: true },
          [],
        ],
        WedStarttime: [
          {
            value: this.userData.ClinicOneTimings.WedStarttime,
            disabled: true,
          },
          [],
        ],
        WedEndtime: [
          { value: this.userData.ClinicOneTimings.WedEndtime, disabled: true },
          [],
        ],
        ThuStarttime: [
          {
            value: this.userData.ClinicOneTimings.ThuStarttime,
            disabled: true,
          },
          [],
        ],
        ThuEndtime: [
          { value: this.userData.ClinicOneTimings.ThuEndtime, disabled: true },
          [],
        ],
        FriStarttime: [
          {
            value: this.userData.ClinicOneTimings.FriStarttime,
            disabled: true,
          },
          [],
        ],
        FriEndtime: [
          { value: this.userData.ClinicOneTimings.FriEndtime, disabled: true },
          [],
        ],
        SatStarttime: [
          {
            value: this.userData.ClinicOneTimings.SatStarttime,
            disabled: true,
          },
          [],
        ],
        SatEndtime: [
          { value: this.userData.ClinicOneTimings.SatEndtime, disabled: true },
          [],
        ],
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
    this.establishmentForm.controls.id.setValue(this.userData._id);
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
    this.enableDayCbt(false, "Cbt");
  }
  public AddressChange(address: any) {
    //setting address from API to local variable

    //console.log(address);
    this.clinicAddress = "";
    this.clinicAddress = address.formatted_address;
    let name: string;
    name = address.name.split(" ");
    name = name[0];
    this.cliniclocation = {
      placeID: address.place_id,
      address: address.formatted_address,
      name: name ? name : "",
      loc: {
        x: address.geometry.location.lng(),
        y: address.geometry.location.lat(),
      },
    };
    this.coordinates = {
      type: "Point",
      coordinates: [
        address.geometry.location.lng(),
        address.geometry.location.lat(),
      ],
    };

    //console.log(this.cliniclocation);
    //console.log(address);
  }
  getTimeStops(start, end) {
    if (this.ec1.get("ClinicOneTimings.ConsultationDurationC1").value == "") {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Select Consultation Duration...",
        "top",
        "center"
      );
      return;
    }
    let startTime = moment(start, "hh:mm a");
    let endTime = moment(end, "hh:mm a");

    let timeStops = [];

    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format("hh:mm a"));
      startTime.add(
        this.ec1.get("ClinicOneTimings.ConsultationDurationC1").value,
        "minutes"
      );
    }
    return timeStops;
  }
  getBreakTimeStops(start, end) {
    if (this.ec1.get("ClinicOneTimings.ConsultationDurationC1").value == "") {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Select Consultation Duration...",
        "top",
        "center"
      );
      return;
    }
    let startTime = moment(start, "hh:mm a");
    let endTime = moment(end, "hh:mm a");

    endTime.subtract(
      this.ec1.get("ClinicOneTimings.ConsultationDurationC1").value,
      "minutes"
    );
    this.BreakTimeStops = [];

    while (startTime <= endTime) {
      this.BreakTimeStops.push(moment(startTime).format("hh:mm a"));
      startTime.add(
        this.ec1.get("ClinicOneTimings.ConsultationDurationC1").value,
        "minutes"
      );
    }
    return this.BreakTimeStops;
  }
  generateSlots(st, et, d) {
    let bst = this.ec1.get("ClinicOneTimings.ComBrStarttime").value;
    let bet = this.ec1.get("ClinicOneTimings.ComBrEndtime").value;
    let breakslot: any;
    if (bst && bet) {
      breakslot = this.getBreakTimeStops(bst, bet);
      //console.log("breakslot" + breakslot);
    } else {
      breakslot = [];
    }
    let timeslot = this.getTimeStops(st, et);
    //console.log("timeslot" + timeslot);
    if (breakslot?.length > 0 && d === "Mon") {
      this.monSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("mondaySlotsmaa-" + this.monSlots);
    }
    if (breakslot?.length == 0 && d === "Mon") {
      this.monSlots = timeslot;
      //console.log("mondaySlots-" + this.monSlots);
    }
    if (breakslot?.length > 0 && d === "Tue") {
      this.tueSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("tueSlots-" + this.tueSlots);
    }
    if (breakslot?.length == 0 && d === "Tue") {
      this.tueSlots = timeslot;
    }
    if (breakslot?.length > 0 && d === "Wed") {
      this.wedSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("wedSlots-" + this.wedSlots);
    }
    if (breakslot?.length == 0 && d === "Wed") {
      this.wedSlots = timeslot;
    }
    if (breakslot?.length > 0 && d === "Thu") {
      this.thuSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("thuSlots-" + this.thuSlots);
    }
    if (breakslot?.length == 0 && d === "Thu") {
      this.thuSlots = timeslot;
    }
    if (breakslot?.length > 0 && d === "Fri") {
      this.friSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("friSlots-" + this.friSlots);
    }
    if (breakslot?.length == 0 && d === "Fri") {
      this.friSlots = timeslot;
    }
    if (breakslot?.length > 0 && d === "Sat") {
      this.satSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("satSlots-" + this.satSlots);
    }
    if (breakslot?.length == 0 && d === "Sat") {
      this.satSlots = timeslot;
    }
    if (breakslot?.length > 0 && d === "Sun") {
      this.sunSlots = timeslot.filter((o) => breakslot.indexOf(o) === -1);
      //console.log("sunSlots-" + this.sunSlots);
    }
    if (breakslot?.length == 0 && d === "Sun") {
      this.sunSlots = timeslot;
    }
  }
  onSubmitEst() {
    this.submitted = true;
    this.ValidateTimeEntered();
    //console.log(this.establishmentForm.value);
    if (this.userData?.ClinicOneTimings.ClinicLocation.address != "") {
      this.ec1.get("ClinicOneTimings.ClinicLocation").clearValidators();
    } else {
      this.ec1
        .get("ClinicOneTimings.ClinicLocation")
        .addValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z '-]+$"),
        ]);
    }
    if (this.establishmentForm.invalid) {
      return;
    }
    if (this.ec1.get("ClinicOneTimings.Sunday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.SunStarttime").value,
        this.ec1.get("ClinicOneTimings.SunEndtime").value,
        "Sun"
      );
    }
    if (this.ec1.get("ClinicOneTimings.Monday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.MonStarttime").value,
        this.ec1.get("ClinicOneTimings.MonEndtime").value,
        "Mon"
      );
    }
    if (this.ec1.get("ClinicOneTimings.Tuesday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.TueStarttime").value,
        this.ec1.get("ClinicOneTimings.TueEndtime").value,
        "Tue"
      );
    }
    if (this.ec1.get("ClinicOneTimings.Wednesday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.WedStarttime").value,
        this.ec1.get("ClinicOneTimings.WedEndtime").value,
        "Wed"
      );
    }
    if (this.ec1.get("ClinicOneTimings.Thursday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.ThuStarttime").value,
        this.ec1.get("ClinicOneTimings.ThuEndtime").value,
        "Thu"
      );
    }
    if (this.ec1.get("ClinicOneTimings.Friday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.FriStarttime").value,
        this.ec1.get("ClinicOneTimings.FriEndtime").value,
        "Fri"
      );
    }
    if (this.ec1.get("ClinicOneTimings.Saturday").value) {
      this.generateSlots(
        this.ec1.get("ClinicOneTimings.SatStarttime").value,
        this.ec1.get("ClinicOneTimings.SatEndtime").value,
        "Sat"
      );
    }

    let obj = {
      approved: true,
      tab4: true,
      id: this.userData._id,
      ClinicOneTimings: {
        active: true,
        id: this.userData._id,
        ClinicName: this.ec1.get("ClinicOneTimings.ClinicName").value
          ? this.ec1.get("ClinicOneTimings.ClinicName").value
          : this.userData.ClinicOneTimings.ClinicName,
        ClinicLocation: this.clinicAddress
          ? this.cliniclocation
          : this.userData.ClinicOneTimings.ClinicLocation,
        location: this.coordinates
          ? this.coordinates
          : this.userData.ClinicOneTimings.location,
        ComBrEndtime: this.ec1.get("ClinicOneTimings.ComBrEndtime").value
          ? this.ec1.get("ClinicOneTimings.ComBrEndtime").value
          : this.userData.ClinicOneTimings.ComBrEndtime,
        ComBrStarttime: this.ec1.get("ClinicOneTimings.ComBrStarttime").value
          ? this.ec1.get("ClinicOneTimings.ComBrStarttime").value
          : this.userData.ClinicOneTimings.ComBrStarttime,
        ConsultationDurationC1: this.ec1.get(
          "ClinicOneTimings.ConsultationDurationC1"
        ).value
          ? this.ec1.get("ClinicOneTimings.ConsultationDurationC1").value
          : this.userData.ClinicOneTimings.ConsultationDurationC1,
        ConsultationFeesC1: this.ec1.get("ClinicOneTimings.ConsultationFeesC1")
          .value
          ? this.ec1.get("ClinicOneTimings.ConsultationFeesC1").value
          : this.userData.ClinicOneTimings.ConsultationFeesC1,
        clinicArea: this.ec1.get("ClinicOneTimings.clinicArea").value
          ? this.ec1.get("ClinicOneTimings.clinicArea").value
          : this.userData.ClinicOneTimings.clinicArea,
        FriEndtime: this.ec1.get("ClinicOneTimings.FriEndtime").value
          ? this.ec1.get("ClinicOneTimings.FriEndtime").value
          : this.userData.ClinicOneTimings.FriEndtime,
        FriStarttime: this.ec1.get("ClinicOneTimings.FriStarttime").value
          ? this.ec1.get("ClinicOneTimings.FriStarttime").value
          : this.userData.ClinicOneTimings.FriStarttime,
        Friday: this.ec1.get("ClinicOneTimings.Friday").value
          ? this.ec1.get("ClinicOneTimings.Friday").value
          : this.userData.ClinicOneTimings.Friday,
        MonEndtime: this.ec1.get("ClinicOneTimings.MonEndtime").value
          ? this.ec1.get("ClinicOneTimings.MonEndtime").value
          : this.userData.ClinicOneTimings.MonEndtime,
        MonStarttime: this.ec1.get("ClinicOneTimings.MonStarttime").value
          ? this.ec1.get("ClinicOneTimings.MonStarttime").value
          : this.userData.ClinicOneTimings.MonStarttime,
        Monday: this.ec1.get("ClinicOneTimings.Monday").value
          ? this.ec1.get("ClinicOneTimings.Monday").value
          : this.userData.ClinicOneTimings.Monday,
        SatEndtime: this.ec1.get("ClinicOneTimings.SatEndtime").value
          ? this.ec1.get("ClinicOneTimings.SatEndtime").value
          : this.userData.ClinicOneTimings.SatEndtime,
        SatStarttime: this.ec1.get("ClinicOneTimings.SatStarttime").value
          ? this.ec1.get("ClinicOneTimings.SatStarttime").value
          : this.userData.ClinicOneTimings.SatStarttime,
        Saturday: this.ec1.get("ClinicOneTimings.Saturday").value
          ? this.ec1.get("ClinicOneTimings.Saturday").value
          : this.userData.ClinicOneTimings.Saturday,
        SunEndtime: this.ec1.get("ClinicOneTimings.SunEndtime").value
          ? this.ec1.get("ClinicOneTimings.SunEndtime").value
          : this.userData.ClinicOneTimings.SunEndtime,
        SunStarttime: this.ec1.get("ClinicOneTimings.SunStarttime").value
          ? this.ec1.get("ClinicOneTimings.SunStarttime").value
          : this.userData.ClinicOneTimings.SunStarttime,
        Sunday: this.ec1.get("ClinicOneTimings.Sunday").value
          ? this.ec1.get("ClinicOneTimings.Sunday").value
          : this.userData.ClinicOneTimings.Sunday,
        ThuEndtime: this.ec1.get("ClinicOneTimings.ThuEndtime").value
          ? this.ec1.get("ClinicOneTimings.ThuEndtime").value
          : this.userData.ClinicOneTimings.ThuEndtime,
        ThuStarttime: this.ec1.get("ClinicOneTimings.ThuStarttime").value
          ? this.ec1.get("ClinicOneTimings.ThuStarttime").value
          : this.userData.ClinicOneTimings.ThuStarttime,
        Thursday: this.ec1.get("ClinicOneTimings.Thursday").value
          ? this.ec1.get("ClinicOneTimings.Thursday").value
          : this.userData.ClinicOneTimings.Thursday,
        TueEndtime: this.ec1.get("ClinicOneTimings.TueEndtime").value
          ? this.ec1.get("ClinicOneTimings.TueEndtime").value
          : this.userData.ClinicOneTimings.TueEndtime,
        TueStarttime: this.ec1.get("ClinicOneTimings.TueStarttime").value
          ? this.ec1.get("ClinicOneTimings.TueStarttime").value
          : this.userData.ClinicOneTimings.TueStarttime,
        Tuesday: this.ec1.get("ClinicOneTimings.Tuesday").value
          ? this.ec1.get("ClinicOneTimings.Tuesday").value
          : this.userData.ClinicOneTimings.Tuesday,
        WedEndtime: this.ec1.get("ClinicOneTimings.WedEndtime").value
          ? this.ec1.get("ClinicOneTimings.WedEndtime").value
          : this.userData.ClinicOneTimings.WedEndtime,
        WedStarttime: this.ec1.get("ClinicOneTimings.WedStarttime").value
          ? this.ec1.get("ClinicOneTimings.WedStarttime").value
          : this.userData.ClinicOneTimings.WedStarttime,
        Wednesday: this.ec1.get("ClinicOneTimings.Wednesday").value
          ? this.ec1.get("ClinicOneTimings.Wednesday").value
          : this.userData.ClinicOneTimings.Wednesday,
        SundaySlots: this.sunSlots
          ? this.sunSlots
          : this.userData.ClinicOneTimings.sunSlots,
        MondaySlots: this.monSlots
          ? this.monSlots
          : this.userData.ClinicOneTimings.monSlots,
        TuesdaySlots: this.tueSlots
          ? this.tueSlots
          : this.userData.ClinicOneTimings.tueSlots,
        WednesdaySlots: this.wedSlots
          ? this.wedSlots
          : this.userData.ClinicOneTimings.wedSlots,
        ThursdaySlots: this.thuSlots
          ? this.thuSlots
          : this.userData.ClinicOneTimings.thuSlots,
        FridaySlots: this.friSlots
          ? this.friSlots
          : this.userData.ClinicOneTimings.friSlots,
        SaturdaySlots: this.satSlots
          ? this.satSlots
          : this.userData.ClinicOneTimings.satSlots,
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
          this.updateLocalStorage(obj);
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

  getWeekTimeSlots() {}
  ValidateTimeEntered() {
    let sun = this.ec1.get("ClinicOneTimings.Sunday").value;
    let mon = this.ec1.get("ClinicOneTimings.Monday").value;
    let tue = this.ec1.get("ClinicOneTimings.Tuesday").value;
    let wed = this.ec1.get("ClinicOneTimings.Wednesday").value;
    let thu = this.ec1.get("ClinicOneTimings.Thursday").value;
    let fri = this.ec1.get("ClinicOneTimings.Friday").value;
    let sat = this.ec1.get("ClinicOneTimings.Saturday").value;
    if (
      sun == "" &&
      mon == "" &&
      tue == "" &&
      wed == "" &&
      thu == "" &&
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
    return;
  }
  changeTimeUnit(e: string, day: string) {
    let minval = "";
    minval = moment(e, "HH.mm").add(30, "minutes").format("HH:mm");
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

    if (
      d === "Cbt" &&
      this.ec1.get("ClinicOneTimings.ComBrStarttime").value !== "" &&
      this.ec1.get("ClinicOneTimings.ComBrEndtime").value !== ""
    ) {
      this.changeTimeUnit(
        this.ec1.get("ClinicOneTimings.ComBrStarttime").value,
        d
      );
      dayStart.setValue(this.ec1.get("ClinicOneTimings.ComBrStarttime").value);
      dayEnd.setValue(this.ec1.get("ClinicOneTimings.ComBrEndtime").value);
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
      this.userData.ClinicOneTimings.SunStarttime
        ? (this.userData.ClinicOneTimings.SunStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.SunEndtime
        ? (this.userData.ClinicOneTimings.SunEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Sunday
        ? (this.userData.ClinicOneTimings.Sunday = false)
        : dayEnd.setValue(false);
    }
  }

  enableDayCbt(e, d) {
    let dayStart;
    let dayEnd;
    if (e.checked === true && d === "Cbt") {
      dayStart = this.ec1.get("ClinicOneTimings.ComBrStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.ComBrEndtime");
      dayStart.addValidators(Validators.required);
      dayStart.enable();
      this.SetAllTime(dayStart, dayEnd, d);
    } else {
      dayStart = this.ec1.get("ClinicOneTimings.ComBrStarttime");
      dayEnd = this.ec1.get("ClinicOneTimings.ComBrEndtime");
      this.userData.ClinicOneTimings.ComBrStarttime
        ? (this.userData.ClinicOneTimings.ComBrStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.ComBrEndtime
        ? (this.userData.ClinicOneTimings.ComBrEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Cbt
        ? (this.userData.ClinicOneTimings.Cbt = false)
        : dayEnd.setValue(false);
      dayStart.clearValidators();
      dayStart.disable();
      dayEnd.disable();
      dayStart.setValue("");
      dayEnd.setValue("");
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
      this.userData.ClinicOneTimings.MonStarttime
        ? (this.userData.ClinicOneTimings.MonStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.MonEndtime
        ? (this.userData.ClinicOneTimings.MonEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Monday
        ? (this.userData.ClinicOneTimings.Monday = false)
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
      this.userData.ClinicOneTimings.TueStarttime
        ? (this.userData.ClinicOneTimings.TueStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.TueEndtime
        ? (this.userData.ClinicOneTimings.TueEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Tuesday
        ? (this.userData.ClinicOneTimings.Tuesday = false)
        : dayEnd.setValue(false);
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
      this.userData.ClinicOneTimings.WedStarttime
        ? (this.userData.ClinicOneTimings.WedStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.WedEndtime
        ? (this.userData.ClinicOneTimings.WedEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Wednesday
        ? (this.userData.ClinicOneTimings.Wednesday = false)
        : dayEnd.setValue(false);
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
      this.userData.ClinicOneTimings.ThuStarttime
        ? (this.userData.ClinicOneTimings.ThuStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.ThuEndtime
        ? (this.userData.ClinicOneTimings.ThuEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Thursday
        ? (this.userData.ClinicOneTimings.Thursday = false)
        : dayEnd.setValue(false);
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
      this.userData.ClinicOneTimings.FriStarttime
        ? (this.userData.ClinicOneTimings.FriStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.FriEndtime
        ? (this.userData.ClinicOneTimings.FriEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Friday
        ? (this.userData.ClinicOneTimings.Friday = false)
        : dayEnd.setValue(false);
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
      this.userData.ClinicOneTimings.SatStarttime
        ? (this.userData.ClinicOneTimings.SatStarttime = "")
        : dayStart.setValue("");
      this.userData.ClinicOneTimings.SatEndtime
        ? (this.userData.ClinicOneTimings.SatEndtime = "")
        : dayEnd.setValue("");
      this.userData.ClinicOneTimings.Saturday
        ? (this.userData.ClinicOneTimings.Saturday = false)
        : dayEnd.setValue(false);
    }
  }
  updateLocalStorage(obj) {
    const oldInfo = JSON.parse(localStorage.getItem("currentUser"));
    localStorage.setItem("currentUser", JSON.stringify({ ...oldInfo, ...obj }));
    this.authService.updateUserObjOnSave(
      JSON.parse(localStorage.getItem("currentUser"))
    );
  }
}
