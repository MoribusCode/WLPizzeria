import { Model, Schema, HydratedDocument, model, Types } from 'mongoose';

export interface ICalendarEvent {
    _id: Types.ObjectId;
    date: Date;
    users: Types.ObjectId[]; // Gli ID degli utenti che si sono prenotati
}

export interface ICalendarEventMethods {
    bookEvent(userId: Types.ObjectId): Promise<void>;
    removeBooking(userId: Types.ObjectId): Promise<void>;
    
}

interface ICalendarEventModel extends Model<ICalendarEvent, {}, ICalendarEventMethods> {
    getAllEvents(): Promise<ICalendarEvent[]>;
    createEvent(date: Date, users: Types.ObjectId[]): Promise<ICalendarEvent>;
}

// Schema dell'evento del calendario
const calendarEventSchema = new Schema<ICalendarEvent, ICalendarEventModel, ICalendarEventMethods>({
    date: { type: Date, required: true, unique: true },
    users: [{ type: Types.ObjectId, ref: 'User' }],
});

calendarEventSchema.methods.bookEvent = async function(userId: Types.ObjectId): Promise<void> {
    if (this.users.indexOf(userId) === -1) {
        this.users.push(userId);
        this.numberOfUsers++;
        await this.save();
    }
};

calendarEventSchema.methods.removeBooking = async function(userId: Types.ObjectId): Promise<void> {
    const index = this.users.indexOf(userId);
    if (index !== -1) {
        this.users.splice(index, 1);
        this.numberOfUsers--;
        await this.save();
    }
};

calendarEventSchema.statics.getAllEvents = async function(): Promise<ICalendarEvent[]> {
    return this.find().populate('users');
};

calendarEventSchema.statics.createEvent = async function(date: Date, users: Types.ObjectId[]): Promise<ICalendarEvent> {
    const event = new this({ date, users, numberOfUsers: users.length });
    return event.save();
};

// Creazione del modello
const CalendarEventModel = model<ICalendarEvent, ICalendarEventModel>('CalendarEvent', calendarEventSchema);

export default CalendarEventModel;