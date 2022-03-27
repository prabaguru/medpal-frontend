import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthService } from "../../core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  BLOODGROUP,
  IFspecialisation,
  SPECIALISATION,
  DOCTORTYPE,
  CONSULTATIONDURATION,
} from "../../../dropdwndata";
@Component({
  selector: "profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
})
export class ProfileSettingsComponent implements OnInit {
  preliminaryForm: FormGroup;
  educationForm: FormGroup;
  establishmentForm: FormGroup;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  consultationDuration = CONSULTATIONDURATION;
  doctorType: IFspecialisation[] = DOCTORTYPE;
  bloodGrp: String[] = BLOODGROUP;
  specialisation: IFspecialisation[] = SPECIALISATION;
  specialisationCtrl = new FormControl("", Validators.required);
  specialisationOptions: Observable<IFspecialisation[]>;
  tomorrow = new Date("01/01/2000");
  minDate = new Date("01/01/1960");
  cyPickerStart = new Date("01/01/1980");
  cyPickerEnd = new Date();
  cage: any;
  Age: any;
  panelOpenState = false;
  userData;
  submitted = false;
  step = 2;
  tabs = ["Clinic1"];
  selected = new FormControl(0);

  addTab(selectAfterAdding?: boolean, len?: any) {
    this.tabs.push("Clinic" + len);

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
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
      DoctorType: ["", [Validators.required]],
      specialisation: this.specialisationCtrl,
      Qualification: ["", [Validators.required]],
      College: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      CompletionYear: ["", [Validators.required]],
      MedicalRegistrationNo: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9 '-]+$")],
      ],
      MedicalCouncilName: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
      ],
      role: ["Doctor", []],
    });

    this.establishmentForm = this.formBuilder.group({
      ConsultationDuration: ["", [Validators.required]],
      ConsultationFees: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(2),
        ],
      ],
      Clinics: ["", []],
    });

    this.preliminaryForm.controls.mobile.disable();
    this.preliminaryForm.controls.email.disable();
    // this.preliminaryForm.controls.age.disable();

    this.specialisationOptions = this.specialisationCtrl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.specialisation.slice()))
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

  get f() {
    return this.preliminaryForm.controls;
  }

  get e() {
    return this.establishmentForm.controls;
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
    let date = e.target.value;
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
    console.log(this.educationForm.value);
  }

  onSubmitEst() {
    this.submitted = true;
    console.log(this.establishmentForm.value);
  }
}
