import { formatDate } from "@angular/common";
export class AdvanceTable {
  id: number;
  img: string;
  firstName: string;
  email: string;
  mobile: string;
  role: string;
  dob: string;
  regType: string;

  constructor(advanceTable) {
    {
      this.id = advanceTable.id;
      this.img = advanceTable.avatar || "assets/images/user/user1.jpg";
      this.firstName = advanceTable.firstName || "";
      this.email = advanceTable.email || "";
      this.dob = advanceTable.dob || "";
      this.mobile = advanceTable.mobile || "";
      this.role = advanceTable.role || "ClinicUser";
      this.regType = advanceTable.regType || "Clinic1";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
