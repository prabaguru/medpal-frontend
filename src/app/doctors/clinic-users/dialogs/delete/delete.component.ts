import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { AdvanceTableService } from "../../advance-table.service";
import { UnsubscribeOnDestroyAdapter } from "../../../../shared/UnsubscribeOnDestroyAdapter";
import { sharedDataService } from "../../../../core";
import { first } from "rxjs/operators";
@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.scss"],
})
export class DeleteDialogComponent extends UnsubscribeOnDestroyAdapter {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AdvanceTableService,
    private sharedDataService: sharedDataService
  ) {
    super();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.data.status ? (this.data.status = false) : (this.data.status = true);
    let obj = {
      id: this.data._id,
      status: this.data.status,
    };
    this.subs.sink = this.advanceTableService
      .deleteAdvanceTable(obj)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dialogRef.close(1);
          this.sharedDataService.showNotification(
            "snackbar-success",
            data.message,
            "bottom",
            "center"
          );
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
}
