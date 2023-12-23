export interface weeklyCreation {
  numberOfWorkers: number[];
  date: string;
  workers: string[];
  sendNotifications: boolean
}


export interface PrenotationDay {
  _id : string
  date: Date;
  users : IUser[],
  numberOfWorker : number
  // Altri campi specifici per le giornate di prenotazione, se necessario
}


export interface Worker {
    user: IUser;
    useHisCar: boolean;
}
// Definisci il modello per le liste giornaliere
export interface DailyList {
    day: Date;
    workerList: Worker[];
}

export interface IWeeklyList {
  readonly _id: string;
  StartDate: Date;
  isDraft: boolean;
  prenotationDays: PrenotationDay[];
  weeklyList: DailyList[];
  workers : IUser[];
}
interface IPushSubscription {
  endpoint: string;
  keys: {
      p256dh: string;
      auth: string;
  };
  userAgentInfo: {
      browserName: string;
      osName: string;
      fullUserAgent: string; // Opzionale, se vuoi salvare l'intera stringa dell'User Agent
  };
}

export interface IUser {
  readonly _id: string;
  firstName: string;
  lastName: string;
  digest: string,
  salt : string,
  isOwner : boolean,
  email : string,
  notificationActived : boolean
}

export interface UserPreference {
  user: string;
  dayAssigned: number;
}

export interface PreferenceInterface {
  preferences: UserPreference[];
}
