export class User {
  _id: number;
  username: string;
  password: string;
  firstName: string;
  email: string;
  mobile: string;
  token: string;
  role: string;
  address: string;
  Pincode: string;
}

export interface IDoctor {
  firstName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
}
