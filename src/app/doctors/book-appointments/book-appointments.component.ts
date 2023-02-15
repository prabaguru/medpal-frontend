import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { AuthService, sharedDataService, ApiService } from "../../core";
import { first } from "rxjs/operators";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatStepper } from "@angular/material/stepper";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import * as moment from "moment";
(moment as any).suppressDeprecationWarnings = true;
declare var $: any;
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
  selector: "doctor-bookappointments",
  templateUrl: "./book-appointments.component.html",
  styleUrls: ["./book-appointments.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DoctorBookAppointmentsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild("stepper") stepper!: MatStepper;
  clinincForm: FormGroup;
  doc: any = [];
  userData: any;
  clinics: Array<String> = ["Clinic1", "Reset"];
  editable: boolean = true;
  isEditable: boolean = false;
  clinicNumber: any = [];
  pushPage: boolean = false;
  timingSlotsFlag: boolean = false;
  timingSlots = [];
  showtemplate: boolean = false;
  @Input() data: any;
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth" });
  }
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  day = this.now.getDay();
  weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date().getDay()
  ];
  momweekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  minDate: Date;
  maxDate: Date;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  otpListCtrl = new FormControl("", Validators.required);
  submitted: boolean = false;
  secSubmitted: boolean = true;
  isOtpVisible: boolean = false;
  otpBtnText: String = "SEND OTP";
  hidden: boolean = true;
  config = {
    length: 6,
    allowNumbersOnly: true,
  };
  timeLeft: number = 90;
  interval: any;
  disableOtpBtn: boolean = false;
  otp: any;
  loggedIn: boolean = false;
  userInfo: any;
  formatDate: any;
  updateUser: Boolean = false;
  appoinmentDetails: any;
  finalTimeslot: any = [];
  bookedppointments: any = [];
  bookedTimeslot: any = [];
  clinicSelection: string;
  showStepper: boolean = false;
  hospitalData: any;
  serverTime: any;
  appId: any;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    super();
    this.userData = this.authService.currentUserValue;
    this.getHospitalById();
    if (
      this.userData.role === "Doctor" &&
      (!this.userData.tab2 ||
        !this.userData.tab3 ||
        !this.userData.tab4 ||
        !this.userData.tab5)
    ) {
      this.router.navigate(["/doctors/profile-settings"]);
    }
    this.minDate = moment(moment.now()).toDate();
    this.maxDate = moment(this.minDate, "DD/MM/YYYY").add(10, "days").toDate();

    this.firstFormGroup = this._formBuilder.group({
      slot: ["", Validators.required],
      appointmentDate: ["", Validators.required],
      bookedDate: [""],
      bookedDay: [""],
    });
    this.secondFormGroup = this._formBuilder.group({
      mobNo: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
    });
    this.thirdFormGroup = this._formBuilder.group({
      appointmentFor: [false],
      confirmbooking: ["", Validators.required],
      primaryMobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
      firstName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z '-]+$"),
          Validators.minLength(3),
        ],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
      ],
    });
    this.clinincForm = this._formBuilder.group({
      clinic: ["", []],
    });
  }
  ngOnInit(): void {
    //console.log(this.userData);
    // if (this.userData.ClinicTwoTimings.active) {
    //   this.clinics.splice(1, 0, "Clinic2");
    // }
  }
  getHospitalById() {
    this.subs.sink = this.apiService
      .getHospitalById(this.userData.hId)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.hospitalData = data[0];
          //console.log(this.hospitalData);
        },
        error: (error) => {},
        complete: () => {},
      });
  }
  clninicSelect(doc: any) {
    this.doc = [];
    this.clinicSelection = "Clinic1";
    if (doc === "Reset") {
      this.showStepper = false;
      this.clinincForm.controls.clinic.setValue("");
    } else {
      this.showStepper = true;
      this.subs.sink = this.apiService
        .getDocById(doc)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.doc = data[0];
            this.showStepper = true;
          },
          error: (error) => {
            this.showStepper = false;
          },
          complete: () => {},
        });
    }
    this.resetForm();
  }
  get f() {
    return this.firstFormGroup.controls;
  }
  get t() {
    return this.secondFormGroup.controls;
  }
  get g() {
    return this.thirdFormGroup.controls;
  }
  get c() {
    return this.clinincForm.controls;
  }
  getDay(e: any) {
    this.timingSlots = [];
    let date;
    date = moment(e.value._d).day();
    let checkSlot = this.slotCheck(this.momweekday[date]);
    let checkLeavearr = this.doc.leaveDates;
    let checkLeave: boolean = false;
    let calDate = moment(e.value._d).format("DD/MM/YYYY");
    for (let i = 0; i < checkLeavearr.length; i++) {
      if (checkLeavearr[i].date === calDate) {
        checkLeave = true;
      }
    }
    if (checkSlot && !checkLeave) {
      this.getAppointmentsById(date);
      this.timingSlotsFlag = false;
    } else {
      this.finalTimeslot = [];
      this.timingSlotsFlag = true;
    }
    //this.generateSlots(this.momweekday[date]);
  }
  slotCheck(slot: string) {
    if (slot === "Sun" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.SundaySlots;
    }
    if (slot === "Sun" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.SundaySlots;
    }
    if (slot === "Mon" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.MondaySlots;
    }
    if (slot === "Mon" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.MondaySlots;
    }
    if (slot === "Tue" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.TuesdaySlots;
    }
    if (slot === "Tue" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.TuesdaySlots;
    }
    if (slot === "Wed" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.WednesdaySlots;
    }
    if (slot === "Wed" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.WednesdaySlots;
    }
    if (slot === "Thu" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.ThursdaySlots;
    }
    if (slot === "Thu" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.ThursdaySlots;
    }
    if (slot === "Fri" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.FridaySlots;
    }
    if (slot === "Fri" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.FridaySlots;
    }
    if (slot === "Sat" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.SaturdaySlots;
    }
    if (slot === "Sat" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.SaturdaySlots;
    }
    if (this.timingSlots.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  generateSlots(slot: string) {
    this.f["slot"].setValue("");
    if (slot === "Sun" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.SundaySlots;
    }
    if (slot === "Sun" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.SundaySlots;
    }
    if (slot === "Mon" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.MondaySlots;
    }
    if (slot === "Mon" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.MondaySlots;
    }
    if (slot === "Tue" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.TuesdaySlots;
    }
    if (slot === "Tue" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.TuesdaySlots;
    }
    if (slot === "Wed" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.WednesdaySlots;
    }
    if (slot === "Wed" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.WednesdaySlots;
    }
    if (slot === "Thu" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.ThursdaySlots;
    }
    if (slot === "Thu" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.ThursdaySlots;
    }
    if (slot === "Fri" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.FridaySlots;
    }
    if (slot === "Fri" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.FridaySlots;
    }
    if (slot === "Sat" && this.clinicSelection === "Clinic1") {
      this.timingSlots = this.doc.ClinicOneTimings.SaturdaySlots;
    }
    if (slot === "Sat" && this.clinicSelection === "Clinic2") {
      this.timingSlots = this.doc.ClinicTwoTimings.SaturdaySlots;
    }
    let getTime: any;
    if (this.clinicSelection === "Clinic1") {
      let cTime = parseInt(this.doc.ClinicOneTimings.ConsultationDurationC1);
      if (cTime > 20) {
        let num = cTime - 15;
        getTime = moment(this.serverTime, "hh:mm a").add(num, "minutes");
      } else {
        getTime = moment(this.serverTime, "hh:mm a");
      }
    } else {
      let cTime = parseInt(this.doc.ClinicTwoTimings.ConsultationDurationC1);
      if (cTime > 20) {
        let num = cTime - 15;
        getTime = moment(this.serverTime, "hh:mm a").add(num, "minutes");
      } else {
        getTime = moment(this.serverTime, "hh:mm a");
      }
    }
    //console.log(this.timingSlots);

    //let getTime = moment().toDate().getTime();
    let halfAnHourAgo: any = moment(getTime).unix();
    //console.log(halfAnHourAgo);

    this.finalTimeslot = [];
    //this.bookedTimeslot = [];
    // this.bookedTimeslot =
    //   this.clinicSelection === "Clinic1"
    //     ? this.doc.clinic1appointments
    //     : this.doc.clinic2appointments;
    let arrLength = this.timingSlots.length;
    let barrLength = this.bookedTimeslot.length;
    for (let i = 0; i < arrLength; i++) {
      let dd = this.changeTS(this.timingSlots[i]);
      this.finalTimeslot.push({
        time: dd,
        Stime: moment.unix(dd).format("hh:mm a"),
        disabled: dd > halfAnHourAgo ? false : true,
      });
      if (this.finalTimeslot.length == arrLength) {
        let frrLength = this.finalTimeslot.length;
        for (let i = 0; i < frrLength; i++) {
          for (let j = 0; j < barrLength; j++) {
            if (this.finalTimeslot[i].time === this.bookedTimeslot[j]) {
              this.finalTimeslot[i].disabled = true;
            }
          }
        }
      }
    }
    if (this.timingSlots.length > 0) {
      this.timingSlotsFlag = false;
    } else {
      this.timingSlotsFlag = true;
    }
    //console.log(this.finalTimeslot);
  }

  changeTS(ts: string) {
    let calDate = null;
    let dt = null;
    let dateeObj = null;
    calDate = this.f["appointmentDate"].value;
    dateeObj = moment(calDate).format("DD/MM/YYYY");
    let concot = dateeObj + " " + ts;
    dt = moment(concot, "DD/MM/YYYY hh:mm a").unix();
    return dt;
  }
  resetsetformvalue() {
    this.g["firstName"].setValue("");
    this.g["firstName"].enable();
    this.g["primaryMobile"].setValue("");
    this.g["primaryMobile"].enable();
    this.g["email"].setValue("");
    this.g["email"].enable();
  }
  slotToggle(time: any) {
    let bTime = new Date(time.time * 1000);
    let curdate = new Date();
    let check = bTime.toDateString() == curdate.toDateString();
    if (check) {
      let getTime: any;
      let currentTime: any;
      if (this.clinicSelection === "Clinic1") {
        let cTime = parseInt(this.doc.ClinicOneTimings.ConsultationDurationC1);
        let num: number;
        if (cTime > 20) {
          num = cTime - 15;
          getTime = moment().subtract(num, "minutes");
          currentTime = getTime.unix();
        } else {
          currentTime = moment().unix();
        }
      } else {
        let cTime = parseInt(this.doc.ClinicTwoTimings.ConsultationDurationC1);
        let num: number;
        if (cTime > 20) {
          num = cTime - 15;
          getTime = moment().subtract(num, "minutes");
          currentTime = getTime.unix();
        } else {
          currentTime = moment().unix();
        }
      }
      // let ct = moment.unix(currentTime).format("hh.mm a");
      // let bt = moment.unix(time.time).format("hh.mm a");
      // console.log(`current: ${ct} - bookedtime: ${bt}`);
      if (currentTime > time.time) {
        this.sharedDataService.showNotification(
          "snackbar-danger",
          "This Timeslot has elapsed",
          "top",
          "center"
        );
        this.getAppointmentsById();
      } else {
        this.stepper.next();
      }
    } else {
      this.stepper.next();
    }
  }
  stepperChange(e: any) {
    if (e.selectedIndex === 1) {
      this.formatDate = null;
      let appval = null;
      appval = this.f["appointmentDate"].value;
      this.formatDate = moment(appval).format("DD/MM/YYYY");
      this.f["bookedDate"].setValue(this.formatDate);
      this.f["bookedDay"].setValue(moment(appval).format("ddd"));
    }
    if (e.selectedIndex === 2) {
      this.editable = false;
      //e.previouslySelectedStep._editable = false;
    }
  }
  checkvalFone() {
    if (this.firstFormGroup.invalid) {
      //this.commonService.showNotification("Select Appointment slot...");
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Select Appointment slot...",
        "top",
        "center"
      );
      return;
    }
  }

  getAppointmentsById(d?: any) {
    this.bookedTimeslot = [];
    this.serverTime = null;
    let obj: any = {
      id: this.doc._id,
      clinic: this.clinicSelection === "Clinic1" ? "Clinic1" : "Clinic2",
    };
    this.subs.sink = this.apiService
      .getDoctorAppointments(obj)
      .pipe(first())
      .subscribe(
        (data: any) => {
          let clinic = this.clinicSelection;
          let app =
            clinic === "Clinic1"
              ? data.data.clinic1appointments
              : data.data.clinic2appointments;
          this.bookedTimeslot = app;
          this.serverTime = data.currentTime;
          if (Object.getOwnPropertyNames(this.doc).length > 0) {
            this.showtemplate = true;
            this.generateSlots(
              this.momweekday[d] ? this.momweekday[d] : this.weekday
            );
          }
          //console.log(this.bookedTimeslot);
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
  resetForm() {
    if (this.updateUser) {
      this.updateUserFNE();
    }
    this.editable = true;
    this.isOtpVisible = false;
    this.disableOtpBtn = false;
    this.timingSlots = [];
    this.timingSlotsFlag = false;
    this.otpBtnText = "SEND OTP";
    this.finalTimeslot = [];
    this.pauseTimer();
    this.timeLeft = 0;
    this.secondFormGroup.get("mobNo")?.enable({ onlySelf: true });
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.stepper?.reset();
    this.loggedIn = false;
    this.submitted = false;
    this.otp = "";
    //this.setUserInfo();
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  sendOtp() {
    this.otp = "";
    this.otp = this.generateOtp();
    //console.log("otp- " + this.otp);
    this.isOtpVisible = true;
    this.disableOtpBtn = true;
    this.startTimer();
    this.timeLeft = 90;
    this.otpBtnText = "sec left to enter OTP";
    this.secondFormGroup.get("mobNo")?.disable({ onlySelf: true });
    this.onSubmitOtp(this.otp);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      if (this.timeLeft == 0) {
        this.disableOtpBtn = false;
        this.isOtpVisible = false;
        this.pauseTimer();
        this.otpBtnText = "OTP Expired Resend OTP";
        this.secondFormGroup.get("mobNo")?.enable({ onlySelf: true });
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  submitOtp() {
    if (this.secondFormGroup.invalid) {
      return;
    }
    let enteredOtp = this.otpListCtrl.value;
    let otp = this.otp.toString();
    if (enteredOtp === otp) {
      this.sharedDataService.showNotification(
        "snackbar-success",
        "OTP success...",
        "top",
        "center"
      );
      let obj = {
        firstName: "newuser",
        password: "newuser",
        mobile: {
          number: this.t["mobNo"].value,
          countryCode: "IN",
          dialCode: "+91",
        },
        primaryMobile: this.t["mobNo"].value,
        email: enteredOtp,
      };
      this.regNLogin(obj);
    } else {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        " OTP entered is wrong...",
        "top",
        "center"
      );
      return;
    }
  }

  regNLogin(obj: any) {
    this.subs.sink = this.authService
      .reglogin(obj)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            this.userInfo = null;
            this.userInfo = res;
            if (this.userInfo?.status) {
              this.loggedIn = true;
              this.sharedDataService.showNotification(
                "snackbar-success",
                `Registration Success.Continue to book appointment`,
                "top",
                "center"
              );
              this.submitted = true;
              this.setformvalue(this.userInfo);
            }
          }
        },
        error: (err) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            err,
            "top",
            "center"
          );
          this.submitted = false;
        },
      });
  }
  bookfortoggle(e: Boolean) {
    e ? this.resetsetformvalue() : this.setformvalue(this.userInfo);
  }
  validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  setformvalue(res: any) {
    this.g["firstName"].enable();
    this.g["email"].enable();
    if (res.firstName === "newuser") {
      this.g["firstName"].setValue("");
    } else {
      this.g["firstName"].setValue(res.firstName);
      //this.g["firstName"].disable();
    }
    let uemail = this.validateEmail(res.email);
    if (uemail) {
      this.g["email"].setValue(res.email);
      //this.g["email"].disable();
      this.updateUser = false;
    } else {
      this.g["email"].setValue("");
      this.updateUser = true;
    }
    this.g["primaryMobile"].setValue(res.primaryMobile);
    this.g["primaryMobile"].disable();
  }
  submit() {
    let confirmbooking = this.g["confirmbooking"].value;
    if (!confirmbooking) {
      //this.commonService.showNotification("Check confirm booking...");
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Check confirm booking...",
        "top",
        "center"
      );
      return;
    }

    if (this.thirdFormGroup.valid) {
      //console.log(this.thirdFormGroup.value);
    } else {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Kindly fillin the mandatory fields...",
        "top",
        "center"
      );
      return;
    }
    this.createObjects();
    let docGrad = "";
    if (this.doc.graduation.Graduation === "PG") {
      docGrad = `(${this.doc.graduation.qualificationUG.sName} - ${this.doc.graduation.qualificationPG.sName} - ${this.doc.graduation.specialisationPG.name}) : ${this.doc.graduation.DoctorType.name}`;
    } else {
      docGrad = `(${this.doc.graduation.qualificationUG.sName}) : ${this.doc.graduation.DoctorType.name}`;
    }
    let clinicloc = "";
    let cord = [];
    if (this.clinicSelection === "Clinic1") {
      clinicloc = this.doc.ClinicOneTimings.ClinicLocation.address;
      cord = [
        this.doc.ClinicOneTimings.ClinicLocation.loc.x,
        this.doc.ClinicOneTimings.ClinicLocation.loc.y,
      ];
    } else {
      clinicloc = this.doc.ClinicTwoTimings.ClinicLocation.address;
      cord = [
        this.doc.ClinicTwoTimings.ClinicLocation.loc.x,
        this.doc.ClinicTwoTimings.ClinicLocation.loc.y,
      ];
    }
    let dateeObj = "";
    let concot = "";
    let formatDate = null;
    dateeObj = moment(this.f["appointmentDate"].value).format("DD/MM/YYYY");
    concot = dateeObj + " " + this.f["slot"].value;
    formatDate = moment(concot, "DD/MM/YYYY hh:mm a").unix();
    let apiobj = {
      p_id: this.userInfo._id,
      slot: this.f["slot"].value,
      appointmentDate: formatDate,
      dateStmp: moment(dateeObj, "DD/MM/YYYY").unix(),
      bookedBy: "Doctor",
      bookedDate: this.f["bookedDate"].value,
      bookedDay: this.f["bookedDay"].value,
      appointmentFor: this.g["appointmentFor"].value ? true : false,
      appointmentType: "Clinic Visit",
      email: this.g["email"].value,
      firstName: this.g["firstName"].value,
      primaryMobile: this.g["primaryMobile"].value,
      consultingFees: this.doc.ClinicOneTimings.ConsultationFeesC1,
      d_id: this.doc._id,
      h_id: this.doc.hId,
      doctorName: this.doc.firstName,
      doctorQualification: docGrad,
      clinic: "Clinic1",
      ClinicAddress: clinicloc,
      cord: cord,
      clinicName: this.doc.ClinicOneTimings.ClinicName,
    };

    this.subs.sink = this.apiService.bookAppointment(apiobj).subscribe({
      next: (data: any) => {
        this.stepper.next();
        this.appId = null;
        this.appId = data.data.id;
        this.sharedDataService.showNotification(
          "snackbar-success",
          data.message,
          "top",
          "center"
        );
        this.updateAppointments(apiobj);
      },
      error: (err) => {
        this.sharedDataService.showNotification(
          "snackbar-danger",
          err,
          "top",
          "center"
        );
        this.g["confirmbooking"].setValue(false);
        this.editable = true;
      },
    });
  }
  updateAppointments(updateObj: any) {
    let obj = {};
    let docAppo = [];
    let clinic1app = [];
    let clinic2app = [];
    let arr = 0;
    let getdate = moment().format("DD/MM/YYYY");
    let currentDate = moment(getdate, "DD/MM/YYYY").unix();
    if (updateObj.clinic === "Clinic1") {
      docAppo = this.bookedTimeslot;
      docAppo.push(updateObj.appointmentDate);
      arr = docAppo.length;
      for (let i = 0; i < arr; i++) {
        if (docAppo[i] >= currentDate) {
          clinic1app.push(docAppo[i]);
        }
      }
      obj = {
        id: updateObj.d_id,
        clinic: updateObj.clinic,
        updateAppointment: true,
        clinic1appointments: clinic1app,
      };
    } else {
      docAppo = this.bookedTimeslot;
      docAppo.push(updateObj.appointmentDate);
      arr = docAppo.length;
      for (let i = 0; i < arr; i++) {
        if (docAppo[i] >= currentDate) {
          clinic2app.push(docAppo[i]);
        }
      }
      obj = {
        id: updateObj.d_id,
        clinic: updateObj.clinic,
        updateAppointment: true,
        clinic2appointments: clinic2app,
      };
    }

    this.subs.sink = this.apiService.updateDoctorAppointments(obj).subscribe({
      next: (data: any) => {
        this.confirmBookingSms();
        //this.confirmBookingSms();
        //this.commonService.showNotification(data.message);
      },
      error: (err) => {
        //this.commonService.showNotification(err);
      },
    });
  }

  updateUserFNE() {
    let forOthers = this.g["appointmentFor"].value;
    let updateObj = {
      id: "",
      firstName: "",
      email: "",
    };
    if (this.updateUser && !forOthers) {
      updateObj = {
        id: this.userInfo._id,
        firstName: this.g["firstName"].value,
        email: this.g["email"].value,
      };
    }
    if (!updateObj.id || !updateObj.firstName || !updateObj.email) {
      return;
    }
    this.subs.sink = this.apiService.updatePatientFNE(updateObj).subscribe({
      next: (data: any) => {
        let obj = {
          firstName: updateObj.firstName,
          email: updateObj.email,
        };
        this.updateUser = false;
        //this.updateCurrentUserData(updateObj);
        //this.commonService.showNotification(data.message);
      },
      error: (err) => {
        //this.commonService.showNotification(err);
      },
    });
  }
  createObjects() {
    let dateeObj = "";
    let concot = "";
    let formatDate = null;
    dateeObj = moment(this.f["appointmentDate"].value).format("DD/MM/YYYY");
    concot = dateeObj + " " + this.f["slot"].value;
    formatDate = moment(concot, "DD/MM/YYYY hh:mm a").unix();
    let obj = {
      p_id: this.userInfo._id,
      slot: this.f["slot"].value,
      appointmentDate: formatDate,
      bookedDate: this.f["bookedDate"].value,
      bookedDay: this.f["bookedDay"].value,
      appointmentFor: this.g["appointmentFor"].value ? true : false,
      email: this.g["email"].value,
      firstName: this.g["firstName"].value,
      primaryMobile: this.g["primaryMobile"].value,
      consultingFees:
        this.clinicSelection === "Clinic1"
          ? this.doc.ClinicOneTimings.ConsultationFeesC1
          : this.doc.ClinicTwoTimings.ConsultationFeesC1,
      d_id: this.doc._id,
      doctorname: this.doc.firstName,
      DocDetails: this.doc.graduation,
      clinic: "Clinic1",
      clinicName: this.doc.ClinicOneTimings.ClinicName,
      ClinicAddress: this.doc.ClinicOneTimings.ClinicLocation,
    };
    this.appoinmentDetails = null;
    this.appoinmentDetails = obj;
  }
  onSubmitOtp(otp: string) {
    let mobileNo = this.t["mobNo"].value;
    let msgString = "";
    msgString = `Your OTP to book appointment is  - ${otp} . Please be 10 mins before your consultation time. Thank you. Medpal - Weisermanner`;
    let payload = {
      From: "WEISER",
      To: mobileNo,
      Body: msgString,
      dltentityid: "1601335161674716856",
      dlttemplateid: "1607100000000226779",
    };
    this.sendSMSafterBooking(payload);
  }

  confirmBookingSms() {
    let mobileNo = this.g["primaryMobile"].value;
    let docName = this.doc.firstName;
    //let glink = 'https://maps.google.com/maps?q=';
    //let gmap = `Clinic Map location: ${glink}${this.appoinmentDetails.ClinicAddress.loc.y},${this.appoinmentDetails.ClinicAddress.loc.x}`;
    let mob = this.hospitalData.smsHelpLineNo
      ? this.hospitalData.smsHelpLineNo
      : this.doc.mobile.number;
    let bookedfor = `${this.g["firstName"].value} on ${this.f["bookedDate"].value} - ${this.f["bookedDay"].value} at ${this.f["slot"].value}`;
    let th = `https://medpal.live/sms.html?dep,${this.appId}`;
    let msgString = "";
    msgString = `The consult at ${this.doc.ClinicOneTimings.ClinicName.toUpperCase()} with Dr. ${docName.toUpperCase()} is booked for ${bookedfor} . Our Helpline no is ${mob} . ${th}. Thank you. Medpal - Weisermanner`;
    let payload = {
      From: "WEISER",
      To: mobileNo,
      Body: msgString,
      dltentityid: "1601335161674716856",
      dlttemplateid: "1607100000000248206",
    };
    this.sendSMSafterBooking(payload);
  }

  sendSMSafterBooking(payload: any) {
    this.subs.sink = this.apiService
      .sendSMS(payload)
      .pipe(first())
      .subscribe(
        (data: any) => {
          //console.log(this.bookedTimeslot);
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
}
