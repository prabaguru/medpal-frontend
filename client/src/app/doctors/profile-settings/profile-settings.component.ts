import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControlOptions,
} from "@angular/forms";
import {
  AuthService,
  sharedDataService,
  ApiService,
  MustMatch,
} from "../../core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Observable } from "rxjs";
import { map, startWith, first } from "rxjs/operators";
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
  EXPERIENCE,
} from "../../../dropdwndata";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import * as moment from "moment";
@Component({
  selector: "profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
})
export class ProfileSettingsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public profileFormPass: FormGroup = new FormGroup({});
  preliminaryForm: FormGroup;
  educationForm: FormGroup;
  ServicesForm: FormGroup;
  public Editor = ClassicEditor;
  config = EDITORCONFIG;
  experience = EXPERIENCE;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  @Output() timeSet = new EventEmitter<string>();
  consultationDuration = CONSULTATIONDURATION;
  doctorType: IFspecialisation[] = DOCTORTYPE;
  bloodGrp: String[] = BLOODGROUP;
  yearOfPassing = YEAROFPASSING;
  specialisation: IFspecialisation[] = SPECIALISATION;
  UGList: IFspecialisation[] = UG;
  PGList: IFspecialisation[] = PG;
  specialisationCtrl = new FormControl();
  specialisationOptions: Observable<IFspecialisation[]>;
  qualificationCtrl = new FormControl("", Validators.required);
  qualificationOptions: Observable<IFspecialisation[]>;
  format = 24;
  tomorrow = new Date("01/01/2000");
  minDate = new Date("01/01/1940");
  cyPickerStart = new Date("01/01/1980");
  cyPickerEnd = new Date();
  cage: any;
  Age: any;
  panelOpenState = false;
  userData;
  submitted = false;
  gradeOption = ["UG", "PG"];
  gender = ["Male", "Female", "Others"];
  step = null;
  selected = new FormControl(0);
  timeFormat: number = 24;
  preventOverlayClick: boolean = true;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    //this.userData = this.authService.currentUserValue;
    this.authService.currentUser.subscribe((x) => {
      this.userData = x;
    });
    this.cage = this.userData.age ? this.userData.age : "";
    this.preliminaryForm = this.formBuilder.group({
      id: [this.userData._id, []],
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
        this.userData.smobile,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
        ],
      ],
      dob: [this.userData.dob, [Validators.required]],
      age: [this.userData.age, []],
      address: [this.userData.address, []],
      bloodGroup: [this.userData.bloodGroup, [Validators.required]],
      gender: [this.userData.gender, []],
      AadhaarNo: [
        this.userData.AadhaarNo,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(12),
        ],
      ],
      tab2: [true],
    });
    this.educationForm = this.formBuilder.group({
      tab3: [true],
      id: [this.userData._id, []],
      graduation: this.formBuilder.group({
        id: [this.userData._id, []],
        Graduation: [
          this.userData.graduation.Graduation,
          [Validators.required],
        ],
        DoctorType: [
          this.userData.graduation.DoctorType,
          [Validators.required],
        ],
        overallExperience: [
          this.userData.graduation.overallExperience,
          [Validators.required],
        ],
        qualificationUG: ["", []],
        CollegeUG: [
          this.userData.graduation.CollegeUG,
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        CompletionYearUG: [
          this.userData.graduation.CompletionYearUG,
          [Validators.required],
        ],
        MedicalRegistrationNoUG: [
          this.userData.graduation.MedicalRegistrationNoUG,
          [Validators.required, Validators.pattern("^[a-zA-Z0-9 '-]+$")],
        ],
        MedicalCouncilNameUG: [
          this.userData.graduation.MedicalCouncilNameUG,
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        qualificationPG: [this.userData.graduation.qualificationPG, []],
        specialisationPG: ["", []],
        CollegePG: [this.userData.graduation.CollegePG, []],
        CompletionYearPG: [this.userData.graduation.CompletionYearPG, []],
        MedicalRegistrationNoPG: [
          this.userData.graduation.MedicalRegistrationNoPG,
          [],
        ],
        MedicalCouncilNamePG: [
          this.userData.graduation.MedicalCouncilNamePG,
          [],
        ],
      }),
    });
    this.ServicesForm = this.formBuilder.group({
      id: [this.userData._id, []],
      services: [this.userData.services, [Validators.required]],
      tab5: [true],
    });
    this.profileFormPass = this.formBuilder.group(
      {
        id: new FormControl(this.userData._id ? this.userData._id : "", [
          Validators.required,
        ]),
        currentPwd: ["", [Validators.required, Validators.minLength(6)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      } as AbstractControlOptions
    );
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

    this.qualificationCtrl.setValue(this.userData.graduation.qualificationUG);
    this.specialisationCtrl.setValue(this.userData.graduation.specialisationPG);
  }
  compareWith(o1: any, o2: any) {
    if (o1.name === o2.name && o1.id === o2.id) return true;
    else return false;
  }

  compareArr(o1: any, o2: any) {
    if (o1 === o2) return true;
    else return false;
  }

  displayFn(user): string {
    return user ? user.name : user;
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
    return this.educationForm;
  }
  get s() {
    return this.ServicesForm.controls;
  }
  get p() {
    return this.profileFormPass.controls;
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
    //console.log(this.preliminaryForm.value);
    this.preliminaryForm.controls.age.setValue(this.cage);
    // stop here if form is invalid
    if (this.preliminaryForm.invalid) {
      return;
    }

    this.subs.sink = this.apiService
      .update(this.preliminaryForm.value)
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
          this.updateLocalStorage(this.preliminaryForm.value);
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
  eduformAddPg(e: any) {
    if (e.value === "PG") {
      this.g
        .get("graduation.qualificationPG")
        .addValidators(Validators.required);
      this.g
        .get("graduation.CollegePG")
        .addValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z '-]+$"),
        ]);
      this.g
        .get("graduation.CompletionYearPG")
        .addValidators([Validators.required]);
      this.g
        .get("graduation.CollegePG")
        .addValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z '-]+$"),
        ]);
      this.g
        .get("graduation.MedicalRegistrationNoPG")
        .addValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9 '-]+$"),
        ]);
      this.g
        .get("graduation.MedicalCouncilNamePG")
        .addValidators([
          Validators.required,
          Validators.pattern("^[a-zA-Z '-]+$"),
        ]);
      this.specialisationCtrl.addValidators(Validators.required);
    } else {
      this.clearEduValidators();
    }
  }
  clearEduValidators() {
    this.g.get("graduation.qualificationPG").clearValidators();
    this.g.get("graduation.CollegePG").clearValidators();
    this.g.get("graduation.CompletionYearPG").clearValidators();
    this.g.get("graduation.MedicalRegistrationNoPG").clearValidators();
    this.g.get("graduation.MedicalCouncilNamePG").clearValidators();

    this.g.get("graduation.qualificationPG").setValue("");
    this.g.get("graduation.CollegePG").setValue(null);
    this.g.get("graduation.CompletionYearPG").setValue(null);
    this.g.get("graduation.MedicalRegistrationNoPG").setValue(null);
    this.g.get("graduation.MedicalCouncilNamePG").setValue(null);

    this.g.get("graduation.qualificationPG").setErrors(null);
    this.g.get("graduation.CollegePG").setErrors(null);
    this.g.get("graduation.CompletionYearPG").setErrors(null);
    this.g.get("graduation.MedicalRegistrationNoPG").setErrors(null);
    this.g.get("graduation.MedicalCouncilNamePG").setErrors(null);
    this.specialisationCtrl.setValue("");
    this.specialisationCtrl.clearValidators();
  }
  onSubmitEdu() {
    this.submitted = true;

    this.g.get("graduation.qualificationUG").setValue("");
    this.g
      .get("graduation.qualificationUG")
      .setValue(this.qualificationCtrl.value);
    this.g.get("graduation.specialisationPG").setValue("");
    this.g
      .get("graduation.specialisationPG")
      .setValue(this.specialisationCtrl.value);
    //console.log(this.educationForm.value);
    // stop here if form is invalid
    if (this.educationForm.invalid) {
      return;
    }

    this.subs.sink = this.apiService
      .update(this.educationForm.value)
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
          this.updateLocalStorage(this.educationForm.value);
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

  resetformSer() {
    this.ServicesForm.reset();
    this.ServicesForm.controls.id.setValue(this.userData._id);
  }

  onSubmitSer() {
    this.submitted = true;
    //console.log(this.ServicesForm.value);
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

    this.subs.sink = this.apiService
      .update(this.ServicesForm.value)
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
          this.updateLocalStorage(this.ServicesForm.value);
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
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  public togglePasswordVisibility2(): void {
    this.showPassword2 = !this.showPassword2;
  }
  saveChanges() {
    this.submitted = true;
    if (this.profileFormPass.invalid) {
      return;
    } else {
      let obj = {};
      obj = {
        id: this.p["id"].value,
        resetPass: "reset",
        currentPwd: this.p["currentPwd"].value,
        password: this.p["password"].value,
        confirmPassword: this.p["confirmPassword"].value,
      };
      console.log(obj);
      return;
      this.subs.sink = this.apiService
        .hopitalPasswordUpdate(obj)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.submitted = false;
            this.sharedDataService.showNotification(
              "snackbar-success",
              "Password change successful... Login with your new password",
              "top",
              "center"
            );
            this.router.navigate(["/authentication/signin"], {
              queryParams: {
                loginType: "Hospital",
                email: this.f["email"].value,
              },
            });
          },
          error: (error) => {
            this.submitted = false;
            this.sharedDataService.showNotification(
              "snackbar-danger",
              error,
              "top",
              "center"
            );
          },
          complete: () => {},
        });
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
