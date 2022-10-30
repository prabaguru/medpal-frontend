import { Component, ElementRef, Input, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { AuthService, sharedDataService, ApiService } from "../../../core";
@Component({
  selector: "app-file-upload2",
  templateUrl: "./file-upload2.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent2,
      multi: false,
    },
  ],
  styleUrls: ["./file-upload2.component.scss"],
})
export class FileUploadComponent2 implements OnInit, ControlValueAccessor {
  @Input() progress;
  @Input() docType;
  @Input() userdatas;
  onChange: Function;
  myFiles: string[] = [];
  percentDone?: any = 0;
  form: FormGroup;
  userData;
  preview: string;
  constructor(
    private host: ElementRef<HTMLInputElement>,
    private authService: AuthService,
    private apiService: ApiService,
    private sharedDataService: sharedDataService,
    public fb: FormBuilder
  ) {}
  ngOnInit() {
    this.userData = this.authService.currentUserValue;
    //console.log(this.userData);
    this.form = this.fb.group({
      file: [null],
    });
  }

  writeValue(value: null) {
    this.host.nativeElement.value = "";
    this.myFiles = [];
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  uploadFile(e) {
    const file = (e.target as HTMLInputElement).files[0];
    let fileExt = file.name.split(".").pop();
    if (fileExt == "doc" || fileExt == "docx" || fileExt == "pdf") {
      this.form.patchValue({
        file: file,
      });
      this.form.get("file").updateValueAndValidity();

      // File Preview
      // const reader = new FileReader();
      // reader.onload = () => {
      //   this.preview = reader.result as string;
      // };
      // reader.readAsDataURL(file);
      this.myFiles = [];
      for (var i = 0; i < e.target.files.length; i++) {
        this.myFiles.push(e.target.files[i]);
      }
    } else {
      this.form.value.file = null;
      this.form.reset();
      this.myFiles = [];
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Only .pdf, .docx format allowed",
        "top",
        "center"
      );
    }
  }

  submitForm() {
    if (this.form.value.file === null) {
      this.sharedDataService.showNotification(
        "snackbar-danger",
        "Select or drag drop file.",
        "top",
        "center"
      );
      return;
    }
    let fileUnlink = null;
    if (this.docType == "adhaar") {
      fileUnlink = this.userData.doc1.docName
        ? this.userData.doc1.docName
        : null;
    } else {
      fileUnlink = this.userData.doc2.docName
        ? this.userData.doc2.docName
        : null;
    }
    this.apiService
      .uploadFile2(
        this.userData._id,
        this.form.value.file,
        fileUnlink,
        this.docType
      )
      .subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              //console.log("Request has been made!");
              break;
            case HttpEventType.ResponseHeader:
              //console.log("Response header has been received!");
              break;
            case HttpEventType.UploadProgress:
              this.percentDone = Math.round((event.loaded / event.total) * 100);
              //console.log(`Uploaded! ${this.percentDone}%`);
              break;
            case HttpEventType.Response:
              //console.log("Upload successfull!", event.body.result);
              this.userdatas = [];
              this.userdatas = event.body.result;
              let docfile = {};
              if (this.docType == "adhaar") {
                docfile = { doc1: event.body.result };
              } else {
                docfile = { doc2: event.body.result };
              }
              //console.log(docfile);
              this.updateLocalStorage(docfile);
              this.percentDone = false;
              this.form.value.file = null;
              this.form.reset();
              this.myFiles = [];
              this.sharedDataService.showNotification(
                "snackbar-success",
                "Upload Successfull...",
                "top",
                "center"
              );
          }
        },
        (error) => {
          this.percentDone = false;
          this.preview = null;
          this.form.value.file = null;
          this.form.reset();
          this.myFiles = [];
          this.sharedDataService.showNotification(
            "snackbar-danger",
            error,
            "top",
            "center"
          );
        }
      );
  }

  updateLocalStorage(obj) {
    const oldInfo = JSON.parse(localStorage.getItem("currentUser"));
    localStorage.setItem("currentUser", JSON.stringify({ ...oldInfo, ...obj }));
    this.authService.updateUserObjOnSave(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.userData = [];
    this.userData = this.authService.currentUserValue;
    this.preview = null;
  }
}
