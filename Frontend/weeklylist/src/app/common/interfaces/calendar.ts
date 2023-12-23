import { IUser } from "./weeklylist";

export interface ICalendarEvent {
  _id: string;
  date: Date;
  users: IUser[]; // Gli ID degli utenti che si sono prenotati
}
