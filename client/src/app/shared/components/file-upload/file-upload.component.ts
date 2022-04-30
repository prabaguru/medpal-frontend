import { Component, ElementRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { AuthService, sharedDataService, ApiService } from "../../../core";
@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: false,
    },
  ],
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() progress;
  onChange: Function;
  myFiles: string[] = [];
  percentDone?: any = 0;
  constructor(
    private host: ElementRef<HTMLInputElement>,
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService
  ) {}

  writeValue(value: null) {
    this.host.nativeElement.value = "";
    this.myFiles = [];
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  getFileDetails(e) {
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles);

    this.apiService
      .uploadFile(this.myFiles)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log("Request has been made!");
            break;
          case HttpEventType.ResponseHeader:
            console.log("Response header has been received!");
            break;
          case HttpEventType.UploadProgress:
            this.percentDone = Math.round((event.loaded / event.total) * 100);
            console.log(`Uploaded! ${this.percentDone}%`);
            break;
          case HttpEventType.Response:
            console.log("User successfully created!", event.body);
            this.percentDone = false;
          //this.router.navigate(["users-list"]);
        }
      });
  }
}
