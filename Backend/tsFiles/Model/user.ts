import { Model, Schema, HydratedDocument, model } from 'mongoose';
import crypto from 'crypto';
import { generateRandomString } from '../Server/utilities.js';

interface IUser {
    readonly _id: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    digest: string;
    salt: string;
    isOwner: boolean;
    email: string;
    notificationActived : boolean
}


interface IUserMethods {
    fullName(): string;
    setPassword(this: IUser, password: string): void;
    isPasswordCorrect(this: IUser, password: string): boolean;
    setPushSubscription(this: IUser, subscription: any): Promise<void>;
    removePushSubscription(this: IUser, subscription: any): Promise<void>;
    setNotification(this: IUser, value: boolean): void;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
    createUser(firstName: string, lastName:string, email:string, isOwner : boolean): Promise<HydratedDocument<IUser, IUserMethods>>;
}



const schema = new Schema<IUser, UserModel, IUserMethods>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    digest: { type: String, required: false },
    salt: { type: String, required: false },
    isOwner : { type: Boolean, required: true },
    email: { type: String, required: true },
    notificationActived : { type: Boolean, required: false},
});


schema.method("setPassword", function (password: string): void {
    this.salt = crypto.randomBytes(16).toString("hex");
    const hmac = crypto.createHmac("sha512", this.salt);
    hmac.update(password);
    this.digest = hmac.digest("hex");
});
  
schema.method("isPasswordCorrect", function (password: string): boolean {
    const hmac = crypto.createHmac("sha512", this.salt);
    hmac.update(password);
    return this.digest === hmac.digest("hex");
});

schema.method("setNotification", function (value: boolean): void {
    this.notificationActived = value
});


schema.static('createUser', async function createUser(firstName: string, lastName:string, email:string, isOwner : boolean) {
    const newUser = await this.create({ firstName, lastName, email, isOwner});
    newUser.setPassword(generateRandomString(10))
    return newUser
});



export const User = model<IUser, UserModel>('User', schema);



