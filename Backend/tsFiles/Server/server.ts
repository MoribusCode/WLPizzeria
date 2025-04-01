import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import chalk from 'chalk';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import passportHTTP from 'passport-http';
import { expressjwt as jwt } from 'express-jwt';
import { User } from '../Model/user.js';

import {
  createWeeklyListHandler,
  getWeeklyListsHandler,
  deleteWeeklyListHandler,
  transformWeeklyListToDailyListHandler,
  updateWeeklyListHandler,
  handleConcurrentPrenotations,
} from '../Server/endpoints/weeklyListsRoutes.js';
import { sendEmailNotifications } from '../Server/endpoints/notificationRoutes.js';
import { login } from './endpoints/loginRoutes.js';

import {
  getAllEvents,
  handleEventBooking,
} from './endpoints/eventsRoutes.js';
import {
  createUserHandler,
  updateUserNotificationHandler,
  getUserByIdHandler,
  deleteUserHandler,
  getAllUsersHandler,
} from './endpoints/usersRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const apiV1 = 'v1';

dotenv.config({
  path: './dist/Server/.env',
});

if (!process.env.JWT_SECRET) {
  console.log('".env" file found but unable to locate JWT_SECRET.');
}

passport.use(
  new passportHTTP.BasicStrategy(async (username, password, done) => {
    const user = await User.findOne({ email: username });

    if (user && user.isPasswordCorrect(password)) {
      return done(null, user);
    }
    return done(
      { statusCode: 401, message: 'Invalid credentials' },
      false
    );
  })
);

export const basicAuthentication = passport.authenticate('basic', {
  session: false,
});

export const verifyJWT = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

app.use(cors({
  origin: process.env.FRONTEND_URL, // replace with your Angular server's address
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(
    `${chalk.green('Nuova richiesta in entrata:')} ${chalk.blue(
      req.method
    )} ${chalk.yellow(req.url)}`
  );
  next();
});

app.get(`/api/${apiV1}/login`, basicAuthentication, login);

app.post(`/api/${apiV1}/users`, verifyJWT, createUserHandler);
app.put(`/api/${apiV1}/users/:idu`, verifyJWT, updateUserNotificationHandler);
app.get(`/api/${apiV1}/users/:id`, verifyJWT, getUserByIdHandler);
app.delete(`/api/${apiV1}/users/:idu`, verifyJWT, deleteUserHandler);
app.get(`/api/${apiV1}/users`, verifyJWT, getAllUsersHandler);

app.post(`/api/${apiV1}/reservations`, verifyJWT, createWeeklyListHandler);

app.post(`/api/${apiV1}/weeklylists`, verifyJWT, createWeeklyListHandler);
app.get(`/api/${apiV1}/weeklylists`, verifyJWT, getWeeklyListsHandler);
app.delete(`/api/${apiV1}/weeklylists/:id`, verifyJWT, deleteWeeklyListHandler);
app.put(`/api/${apiV1}/weeklylists/:idw/weeklylist`, verifyJWT, updateWeeklyListHandler);
app.put(`/api/${apiV1}/weeklylists/:idw`, verifyJWT, transformWeeklyListToDailyListHandler);
app.put(`/api/${apiV1}/weeklylists/:idw/prenotationDays/:idd`, verifyJWT, handleConcurrentPrenotations);

app.get(`/api/${apiV1}/events`, getAllEvents);
app.put(`/api/${apiV1}/events`, verifyJWT, handleEventBooking);

app.post(`/api/${apiV1}/notification`, sendEmailNotifications);

app.use((err, res) => {
  console.log('Request error: ' + JSON.stringify(err));
  return res.status(err.statusCode || 500).json(err);
});

app.use((req, res) => {
  res
    .status(404)
    .json({ statusCode: 404, error: true, errormessage: 'Invalid endpoint' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

async function run() {
  await connect(process.env.DB_URL);
  const admin = await User.findOne({ isOwner: true });

  if (admin) {
    console.log('admin trovato');
  } else {
    console.log('admin non trovato');
    const user = new User();
    user.firstName = 'Jacopo';
    user.lastName = 'Moro';
    user.isOwner = true;
    user.email = 'jacopomoro04@gmail.com';
    user.setPassword('admin');


    await user.save();
    console.log('Utente Salvato');
    const matteo = await User.findOne({ firstName: 'Jacopo' });
    console.log('is password correct? ' + matteo.isPasswordCorrect('admin'));
  }
}

run().catch((err) => console.log(err));

console.log ();