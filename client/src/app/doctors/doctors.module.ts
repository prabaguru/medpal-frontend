import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DoctorsRoutingModule } from "./doctors-routing.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
@NgModule({
  declarations: [ProfileSettingsComponent],
  imports: [
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
  ],
})
export class DoctorsModule {}
