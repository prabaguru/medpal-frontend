import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FileUploadComponent2 } from "./file-upload2.component";

describe("FileUploadComponent2", () => {
  let component: FileUploadComponent2;
  let fixture: ComponentFixture<FileUploadComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent2],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
