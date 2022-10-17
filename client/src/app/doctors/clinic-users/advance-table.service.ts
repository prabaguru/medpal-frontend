import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AdvanceTable } from "./advance-table.model";
import {
  HttpParams,
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "../../shared/UnsubscribeOnDestroyAdapter";
import { environment } from "src/environments/environment";
import { catchError, Observable, of, throwError } from "rxjs";
@Injectable()
export class AdvanceTableService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTable[]> = new BehaviorSubject<
    AdvanceTable[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): AdvanceTable[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAdvanceTables(data: any) {
    let params = new HttpParams({ fromObject: data });
    this.subs.sink = this.httpClient
      .get<AdvanceTable[]>(`${environment.apiUrl}/doctors/users/getById`, {
        params,
      })
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error) => {
          this.isTblLoading = false;
          console.log(error);
        },
      });
  }
  addAdvanceTable(advanceTable: AdvanceTable) {
    return this.httpClient
      .post(`${environment.apiUrl}/doctors/users/register`, advanceTable)
      .pipe(catchError(this.handleError));
  }

  updateAdvanceTable(advanceTable: AdvanceTable) {
    //this.dialogData = advanceTable;

    /* this.httpClient.put(this.API_URL + advanceTable.id, advanceTable).subscribe(data => {
      this.dialogData = advanceTable;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/

    return this.httpClient
      .put(`${environment.apiUrl}/doctors/users/update`, advanceTable)
      .pipe(catchError(this.handleError));
  }
  deleteAdvanceTable(id: number) {
    console.log(id);

    return this.httpClient
      .delete(`${environment.apiUrl}/doctors/users/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(err) {
    //console.log("error caught in service");
    //console.error(err);
    //Handle the error here
    return throwError(err);
  }
}
