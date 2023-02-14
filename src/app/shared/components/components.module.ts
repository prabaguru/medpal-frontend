import { NgModule } from "@angular/core";
import { ApplyLeaveComponent } from "../components/applyleave/applyleave.component";
import { SharedModule } from "../shared.module";

@NgModule({
  declarations: [ApplyLeaveComponent],
  imports: [SharedModule],
  exports: [ApplyLeaveComponent],
})
export class ComponentsModule {}
