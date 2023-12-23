import { Model, Schema, HydratedDocument, model, Types } from 'mongoose';
import crypto from 'crypto';
import { generateRandomString } from '../Server/utilities.js';


interface DailyReservation {
    day: Date;
    workerList: Types.ObjectId[];
    numberOfWorker: number;
  }

  interface Config {
    mondayOnMonday: number;
    peopleTuesday: number;
    peopleWednesday: number;
    peopleThursday: number;
    peopleFriday: number;
    peopleSaturday: number;
    peopleSunday: number;
  }

interface IGroup {
  readonly _id: Schema.Types.ObjectId;
  // Aggiungi qui i campi specifici per il modello Group
  // Ad esempio, potresti avere un campo "name" e un campo "members"
  name: string;
  reservations : DailyReservation[],
  config : Config
  // ...
}

interface IGroupMethods {

    createReservation(
        day: Date,
        workerList: Types.ObjectId[],
        numberOfWorker: number
    ): DailyReservation;

}

interface GroupModel extends Model<IGroup, {}, IGroupMethods> {
    createGroup(name: string, reservations: DailyReservation[], config: Config): Promise<HydratedDocument<IGroup, IGroupMethods>>;
}

const groupSchema = new Schema<IGroup, GroupModel, IGroupMethods>({
    name: { type: String, required: true },
    reservations: [{
        //_id: false,  // Imposta _id a false per il sottodocumento
        day: { type: Date, required: true },
        workerList: [{ type: Types.ObjectId, ref: 'Worker', required: true }],
        numberOfWorker: { type: Number, required: true },
      }],
    config: {
      mondayOnMonday: { type: Number, required: true },
      peopleTuesday: { type: Number, required: true },
      peopleWednesday: { type: Number, required: true },
      peopleThursday: { type: Number, required: true },
      peopleFriday: { type: Number, required: true },
      peopleSaturday: { type: Number, required: true },
      peopleSunday: { type: Number, required: true },
    },

    
  });

groupSchema.method("createReservation", function(
    this: HydratedDocument<IGroup, IGroupMethods>,
    day: Date,
    workerList: Types.ObjectId[],
    numberOfWorker: number
): DailyReservation {
    try {
        const reservation = {
            day : day,
            workerList,
            numberOfWorker,
        };
        this.reservations.push(reservation);
        
        return reservation;
    } catch (error) {
        throw new Error(`Errore durante la creazione della prenotazione: ${error}`);
    }
});

groupSchema.static('createGroup', async function (name: string, reservations: DailyReservation[], config: Config): Promise<HydratedDocument<IGroup, IGroupMethods>> {
  return this.create({ name, reservations, config });
});



export const Group = model<IGroup, GroupModel>('Group', groupSchema);
