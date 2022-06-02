import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MaterialModule } from "../shared/material.module";

import { DoctorsRoutingModule } from "./doctors-routing.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { establishmentComponent } from "./profile-settings/establishment/establishment.component";
import { establishment2Component } from "./profile-settings/establishment2/establishment2.component";
import { FileUploadComponent } from "../shared/components/file-upload/file-upload.component";
import { FileUploadComponent2 } from "../shared/components/file-upload2/file-upload2.component";

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    establishmentComponent,
    establishment2Component,
    FileUploadComponent,
    FileUploadComponent2,
  ],
  imports: [
    GooglePlaceModule,
    CommonModule,
    DoctorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    CKEditorModule,
    MaterialModule,
  ],
})
export class DoctorsModule {}
