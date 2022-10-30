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
    this.subs.sink = this.advanceTableService
      .deleteAdvanceTable(this.data.id)
      .pipe(first())
      .subscribe({
        next: (data) => {
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
}
