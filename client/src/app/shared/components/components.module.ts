import { NgModule } from "@angular/core";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FileUploadComponent2 } from "./file-upload2/file-upload2.component";
import { SharedModule } from "../shared.module";

@NgModule({
  declarations: [FileUploadComponent, FileUploadComponent2],
  imports: [SharedModule],
  exports: [FileUploadComponent, FileUploadComponent2],
})
export class ComponentsModule {}
