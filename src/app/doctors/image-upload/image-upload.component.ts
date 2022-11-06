import { Component, OnInit, ViewChild } from "@angular/core";
import { DemoFilePickerAdapter } from "../filepicker.adapter";
import { FilePickerComponent, FilePreviewModel } from "ngx-awesome-uploader";
import { HttpClient } from "@angular/common/http";
import { AuthService, sharedDataService } from "../../core";
@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  userData: any;
  @ViewChild("uploader", { static: true }) uploader: FilePickerComponent;
  public adapter = new DemoFilePickerAdapter(this.http, this.authService);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userData = this.authService.currentUserValue;
  }

  public ngOnInit(): void {
    let getCliImgs = this.userData.clinic1Images;
    let cliImgs = [];
    for (let i = 0; i < getCliImgs.length; i++) {
      cliImgs.push({
        fileName: getCliImgs[i].imageUrl,
      });
    }
    console.log(cliImgs);
    const files = cliImgs as FilePreviewModel[];
    this.uploader.setFiles(files);
  }
}
