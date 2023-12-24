import { Model, Schema, HydratedDocument, model, Types } from 'mongoose';
import { workersPreference } from '../Server/calculateList/main';

// Definisci il modello per le giornate di prenotazione
export interface PrenotationDay {
  _id : Types.ObjectId
  date: Date;
  users : Types.ObjectId[],
  numberOfWorker : number
  // Altri campi specifici per le giornate di prenotazione, se necessario
}


export interface Worker {
    user: Types.ObjectId;
    useHisCar: boolean;
}
// Definisci il modello per le liste giornaliere
export interface DailyList {
    day: Date;
    workerList: Worker[];
}

export interface IWeeklyList {
  readonly _id: Schema.Types.ObjectId;
  StartDate: Date;
  isDraft: boolean;
  prenotationDays: PrenotationDay[];
  weeklyList: DailyList[];
  workers : Schema.Types.ObjectId[];
}

interface IWeeklyListMethods {
    calculateList(preferences : workersPreference[]),
    addPrenotation(idd : string,  idu: string)
    isDayPrenotable(prenotationDay : PrenotationDay)
}

interface WeeklyListModel extends Model<IWeeklyList, {}, IWeeklyListMethods> {
    createWeeklyList(StartDate: Date,
        numberOfWorkers: number[], workers : Schema.Types.ObjectId[]): Promise<HydratedDocument<IWeeklyList, IWeeklyListMethods>>;
}

const weeklyListSchema = new Schema<IWeeklyList, WeeklyListModel, IWeeklyListMethods>({
  StartDate: { type: Date, required: true },
  isDraft: { type: Boolean, required: true },
  prenotationDays: [{
    date: { type: Date, required: true },
    users: [{ type: Types.ObjectId, ref: 'User' }],
    numberOfWorker: { type: Number },
  }],
  weeklyList: [{
    day: { type: Date, required: true },
    workerList: [{
      user: { type: Types.ObjectId, ref: 'User' },
      useHisCar: { type: Boolean, required: true },
    }],
  }],
  workers: [{ type: Types.ObjectId, ref: 'User' }],
});

weeklyListSchema.methods.addPrenotation = async function (idd: string, idu: string) {
  const indexToUpdate = this.prenotationDays.findIndex((prenotationDay) => prenotationDay._id.toString() === idd);

  if (indexToUpdate !== -1) {
    const prenotationDay = this.prenotationDays[indexToUpdate];
    const userIndex = prenotationDay.users.indexOf(idu);

    // Controllo se il giorno è prenotabile
    

    if (!prenotationDay.users.includes(idu)) {
      if (!this.isDayPrenotable(prenotationDay)) {
        console.error("The day is not prenotable.");
        return; // Interrompe l'esecuzione se il giorno non è prenotabile
      }
      prenotationDay.users.push(idu);
      console.log("User added successfully.");
    } else {
      console.log("User is already present in the users array.");
      prenotationDay.users.splice(userIndex, 1);
      console.log("User removed successfully.");
    }
  } else {
    console.error("PrenotationDay element not found.");
  }
};

weeklyListSchema.methods.isDayPrenotable = function(prenotationDay : PrenotationDay) {
  // Calcola il numero di persone prenotate per il giorno
  const numberOfPrenotatedUsers = prenotationDay.users.length;

  console.log("Numero di persone prenotate questo giorno " + prenotationDay.date + " : " + numberOfPrenotatedUsers);
  // Ottieni il numero massimo di lavoratori desiderato
  console.log(this.workers)
  const maxWorkers = this.workers.length - prenotationDay.numberOfWorker;

  console.log("Numero di persone mancanti: " + maxWorkers);

  // Verifica se il giorno è prenotabile
  
  return this.workers.length - prenotationDay.numberOfWorker > prenotationDay.users.length;
}
  

  
  
    

weeklyListSchema.statics.createWeeklyList = async function (
    StartDate: Date,
    numberOfWorkers: number[],
    workers: string[]
  ) {
    // Converti gli oggetti ObjectId in stringhe
    const workerStrings = workers.map(workerId => new Types.ObjectId(workerId));
  
    // Calcola le date per i prossimi 7 giorni a partire dalla StartDate
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(StartDate);
      date.setDate(StartDate.getDate() + i);
      next7Days.push({ date, users: [], numberOfWorker: numberOfWorkers[i] });
    }
  
    // Combinare i giorni calcolati con quelli passati come parametro
    const allPrenotationDays = [...next7Days];
  
    return this.create({ StartDate, isDraft: true, prenotationDays: allPrenotationDays, weeklyList: [], workers: workerStrings });
  };

// Eventualmente, aggiungi metodi e campi statici specifici per il modello WeeklyList
// ...

export const WeeklyList = model<IWeeklyList, WeeklyListModel>('WeeklyList', weeklyListSchema);
