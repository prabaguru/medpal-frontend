import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControlOptions,
} from "@angular/forms";
import { AuthService } from "../../core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import drpdwndata from "../dddata.json";

@Component({
  selector: "profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
})
export class ProfileSettingsComponent implements OnInit {
  bloodGrp: String[] = drpdwndata.bloodGroup;
  specialization = drpdwndata.specialization;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  tomorrow = new Date("01/01/2000");
  minDate = new Date("01/01/1960");
  cage: any;
  Age: any;
  panelOpenState = false;
  preliminaryForm: FormGroup;
  EducationForm: FormGroup;
  userData;
  submitted = false;
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
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
      dob: ["", []],
      age: ["", []],
      address: ["", []],
      bloodGroup: ["", []],
      role: ["Doctor", []],
    });

    this.EducationForm = this.formBuilder.group({
      specialisation: ["", []],
      name: ["", []],
    });
    // this.preliminaryForm.controls.mobile.disable();
    // this.preliminaryForm.controls.email.disable();
    // this.preliminaryForm.controls.age.disable();
  }
  get f() {
    return this.preliminaryForm.controls;
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
    console.log(this.EducationForm.value);
  }
}
