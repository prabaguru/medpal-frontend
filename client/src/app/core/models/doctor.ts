export class User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface IDoctor {
  firstName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
}
