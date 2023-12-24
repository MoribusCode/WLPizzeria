import { Model, Schema, model, Types } from 'mongoose';

export interface IScheduledTask {
  _id: Types.ObjectId;
  cronExpression: string; // Espressione cron per la pianificazione
  action: string; // Descrizione dell'azione pianificata o riferimento a una funzione
}

interface IScheduledTaskMethods {
  execute(): Promise<void>; // Metodo per eseguire l'azione pianificata
}

interface IScheduledTaskModel extends Model<IScheduledTask, {}, IScheduledTaskMethods> {
  getAllTasks(): Promise<IScheduledTask[]>;
  createTask(cronExpression: string, action: string): Promise<IScheduledTask>;
}

// Schema per le pianificazioni cron
const scheduledTaskSchema = new Schema<IScheduledTask, IScheduledTaskModel, IScheduledTaskMethods>({
  cronExpression: { type: String, required: true },
  action: { type: String, required: true },
});

scheduledTaskSchema.methods.execute = async function (): Promise<void> {
  // Qui dovresti implementare la logica per eseguire l'azione pianificata.
  // Ad esempio, se `action` è una funzione, puoi eseguirla qui.
};

scheduledTaskSchema.statics.getAllTasks = async function (): Promise<IScheduledTask[]> {
  return this.find();
};

scheduledTaskSchema.statics.createTask = async function (cronExpression: string, action: string): Promise<IScheduledTask> {
  const task = new this({ cronExpression, action });
  return task.save();
};

// Creazione del modello
const ScheduledTaskModel = model<IScheduledTask, IScheduledTaskModel>('ScheduledTask', scheduledTaskSchema);

export default ScheduledTaskModel;
