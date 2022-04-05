import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthService, sharedDataService } from "../../core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  BLOODGROUP,
  IFspecialisation,
  SPECIALISATION,
  DOCTORTYPE,
  UG,
  PG,
  CONSULTATIONDURATION,
  YEAROFPASSING,
  EDITORCONFIG,
} from "../../../dropdwndata";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as moment from "moment";
@Component({
  selector: "profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
})
export class ProfileSettingsComponent implements OnInit {
  preliminaryForm: FormGroup;
  educationForm: FormGroup;
  ServicesForm: FormGroup;
  public Editor = ClassicEditor;
  config = EDITORCONFIG;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  @Output() timeSet = new EventEmitter<string>();
  consultationDuration = CONSULTATIONDURATION;
  doctorType: IFspecialisation[] = DOCTORTYPE;
  bloodGrp: String[] = BLOODGROUP;
  yearOfPassing = YEAROFPASSING;
  specialisation: IFspecialisation[] = SPECIALISATION;
  UGList: IFspecialisation[] = UG;
  PGList: IFspecialisation[] = PG;
  specialisationCtrl = new FormControl("", Validators.required);
  specialisationOptions: Observable<IFspecialisation[]>;
  qualificationCtrl = new FormControl("", Validators.required);
  qualificationOptions: Observable<IFspecialisation[]>;
  format = 24;
  tomorrow = new Date("01/01/2000");
  minDate = new Date("01/01/1960");
  cyPickerStart = new Date("01/01/1980");
  cyPickerEnd = new Date();
  cage: any;
  Age: any;
  panelOpenState = false;
  userData;
  submitted = false;
  gradeOption = ["UG", "PG"];
  step = 3;
  selected = new FormControl(0);
  timeFormat: number = 24;
  preventOverlayClick: boolean = true;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sharedDataService: sharedDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData = this.authService.currentUserValue;
    this.preliminaryForm = this.formBuilder.group({
      firstName: [
        this.userData.firstName,
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      lastName: [
        this.userData.lastName,
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      email: [
        this.userData.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      mobile: [this.userData.mobile.number],
      smobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
      dob: ["", [Validators.required]],
      age: ["", []],
      address: ["", []],
      bloodGroup: ["", [Validators.required]],
      AadhaarNo: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(12),
        ],
      ],
      role: ["Doctor", []],
    });

    this.educationForm = this.formBuilder.group({
      Graduation: ["", []],
      DoctorType: ["", [Validators.required]],
      qualificationUG: this.qualificationCtrl.value,
      CollegeUG: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      CompletionYearUG: ["", [Validators.required]],
      MedicalRegistrationNoUG: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9 '-]+$")],
      ],
      MedicalCouncilNameUG: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      qualificationPG: ["", [Validators.required]],
      specialisationPG: this.specialisationCtrl.value,
      CollegePG: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      CompletionYearPG: ["", [Validators.required]],
      MedicalRegistrationNoPG: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9 '-]+$")],
      ],
      MedicalCouncilNamePG: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],

      role: ["Doctor", []],
    });
    this.ServicesForm = this.formBuilder.group({
      servicesData: ["", [Validators.required]],
    });
    this.preliminaryForm.controls.mobile.disable();
    this.preliminaryForm.controls.email.disable();
    //this.establishmentForm.controls.sundayStartTimeCtrl.disable();

    this.specialisationOptions = this.specialisationCtrl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.specialisation.slice()))
    );
    this.qualificationOptions = this.qualificationCtrl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.name)),
      map((name) => (name ? this._filterQua(name) : this.UGList.slice()))
    );
  }

  displayFn(user: IFspecialisation): string {
    return user && user.name ? user.name : "";
  }

  private _filter(name: string): IFspecialisation[] {
    const filterValue = name.toLowerCase();

    return this.specialisation.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterQua(name: string): IFspecialisation[] {
    const filterValue = name.toLowerCase();

    return this.UGList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  get f() {
    return this.preliminaryForm.controls;
  }
  get g() {
    return this.educationForm.controls;
  }
  get s() {
    return this.ServicesForm.controls;
  }
  resetform() {
    this.educationForm.reset();
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  calAge(e) {
    let date = e.value;
    var timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    this.cage = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) + " - Years";
    this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }
  onSubmit() {
    this.submitted = true;
    this.preliminaryForm.controls.age.setValue(this.cage);
    console.log(this.preliminaryForm.value);
  }

  onSubmitEdu() {
    this.submitted = true;
    let grad = {
      _id: this.userData._id,
      graduation: this.educationForm.value,
    };

    console.log(grad);
  }
  resetformSer() {
    this.ServicesForm.reset();
  }
  onSubmitSer() {
    this.submitted = true;
    console.log(this.ServicesForm.value);
    // stop here if form is invalid
    if (this.ServicesForm.invalid) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Services Info is required",
        "top",
        "center"
      );
      return;
    }
  }
}
