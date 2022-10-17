import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { AdvanceTableService } from "../../advance-table.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  AbstractControlOptions,
} from "@angular/forms";
import { AdvanceTable } from "../../advance-table.model";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { formatDate } from "@angular/common";
import { MustMatch, AuthService, sharedDataService } from "../../../../core";
import { UnsubscribeOnDestroyAdapter } from "../../../../shared/UnsubscribeOnDestroyAdapter";
import { first } from "rxjs/operators";
import * as moment from "moment";
@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.scss"],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class FormDialogComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AdvanceTable;
  public showPassword: boolean = false;
  tomorrow = new Date(moment().subtract(21, "years").format("MM/DD/YYYY"));
  minDate = new Date("01/01/1940");
  userData;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AdvanceTableService,
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedDataService: sharedDataService
  ) {
    super();
    this.userData = this.authService.currentUserValue;
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.advanceTable.firstName;
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = "Add User";
      this.advanceTable = new AdvanceTable({});
    }
    this.advanceTableForm = this.createContactForm();
  }
  // formControl = new FormControl("", [
  //   Validators.required,
  //   // Validators.email,
  // ]);
  // getErrorMessage() {
  //   return this.formControl.hasError("required")
  //     ? "Required field"
  //     : this.formControl.hasError("email")
  //     ? "Not a valid email"
  //     : "";
  // }
  createContactForm(): FormGroup {
    return this.fb.group(
      {
        id: [this.advanceTable.id, []],
        img: [this.advanceTable.img, []],
        d_id: [this.userData._id, []],
        firstName: [
          this.advanceTable.firstName,
          [Validators.required, Validators.pattern("^[a-zA-Z '-]+$")],
        ],
        email: [
          this.advanceTable.email,
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        role: [this.advanceTable.role, [Validators.required]],
        dob: [this.advanceTable.dob, [Validators.required]],
        regType: ["Reception", []],
        mobile: [this.advanceTable.mobile, [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      } as AbstractControlOptions
    );
  }
  ngOnInit() {}
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    if (this.action !== "edit") {
      this.subs.sink = this.advanceTableService
        .addAdvanceTable(this.advanceTableForm.getRawValue())
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.advanceTableService.dialogData =
              this.advanceTableForm.getRawValue();
            this.dialogRef.close(1);
          },
          error: (error) => {
            this.sharedDataService.showNotification(
              "snackbar-danger",
              error,
              "bottom",
              "center"
            );
          },
          complete: () => {},
        });
    } else {
      this.confirmEdit();
    }
  }

  public confirmEdit(): void {
    this.subs.sink = this.advanceTableService
      .updateAdvanceTable(this.advanceTableForm.getRawValue())
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.advanceTableService.dialogData =
            this.advanceTableForm.getRawValue();
          this.dialogRef.close(1);
        },
        error: (error) => {
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "bottom",
            "center"
          );
        },
        complete: () => {},
      });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
