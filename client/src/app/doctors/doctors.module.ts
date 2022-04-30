import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DoctorsRoutingModule } from "./doctors-routing.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { establishmentComponent } from "./profile-settings/establishment/establishment.component";
import { establishment2Component } from "./profile-settings/establishment2/establishment2.component";
import { FileUploadComponent } from "../shared/components/file-upload/file-upload.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
@NgModule({
  declarations: [
    ProfileSettingsComponent,
    establishmentComponent,
    establishment2Component,
    FileUploadComponent,
  ],
  imports: [
    GooglePlaceModule,
    CommonModule,
    DoctorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgxMaterialTimepickerModule,
    CKEditorModule,
  ],
})
export class DoctorsModule {}
