import {
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import {
  FilePickerAdapter,
  UploadResponse,
  UploadStatus,
  FilePreviewModel,
} from "ngx-awesome-uploader";
import { environment } from "src/environments/environment";
import { AuthService } from "../core";
export class DemoFilePickerAdapter extends FilePickerAdapter {
  userData: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    super();
    this.userData = this.authService.currentUserValue;
  }

  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    const form = new FormData();
    form.append("file", fileItem.file);
    form.append("id", this.userData._id);
    const api = `${environment.apiUrl}/doctors/upldclImgs`;
    const req = new HttpRequest("PUT", api, form, { reportProgress: true });
    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED,
          };
        } else if (res.type === HttpEventType.UploadProgress) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 * res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress,
          };
        }
      }),
      catchError((er) => {
        console.log(er);
        return of({ status: UploadStatus.ERROR, body: er });
      })
    );
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    const id = 50;
    const responseFromBackend = fileItem.uploadResponse;
    console.log(fileItem);
    const removeApi = `${environment.apiUrl}/doctors/upldclImgs`;
    return this.http.post(removeApi, { id });
  }
}
