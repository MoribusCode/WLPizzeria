export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  isOwner: boolean;
  email: string;
  salt: string;
  digest: string;
  __v: number;
}
