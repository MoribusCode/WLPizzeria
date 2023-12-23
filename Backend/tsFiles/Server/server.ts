import { Schema, model, connect, Mongoose, Error} from 'mongoose';
import { User } from '../Model/user.js';
import { Group } from '../Model/group.js';
import { WeeklyList, DailyList, IWeeklyList } from '../Model/weekly_list.js';
import bodyParser from 'body-parser';
import { generateRandomString, substitute } from './utilities.js';
import {Main} from "./calculateList/main.js"
import passport from 'passport';
import passportHTTP from "passport-http";
import jsonwebtoken from "jsonwebtoken"; //For sign the jwt data
import cors from 'cors';
import chalk from 'chalk';


import { expressjwt as jwt } from "express-jwt";

import dotenv from "dotenv";

const result = dotenv.config({
  path: "./dist/Server/.env",
});

if (result.error) {
  console.log(
    'Unable to load ".env" file. Please provide one to store the JWT secret key'
  );
  process.exit(-1);
}

if (!process.env.JWT_SECRET) {
  console.log('".env" file find but unable to locate JET_SECRET.');
}

const verifyJWT = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});


run().catch(err => console.log(err));

passport.use(new passportHTTP.BasicStrategy(async (username, password, done) => {
  const user = await User.findOne({ email: username });
  
  if (user && user.isPasswordCorrect(password)) {
    return done(null, user);
  }
  return done({ statusCode: 401, message: "Invalid credentials" }, false);
}));

export const basicAuthentication = passport.authenticate("basic", {
  session: false,
});

import express, { Request } from 'express';
import CalendarEventModel from '../Model/calendar.js';
const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(cors({
  origin: process.env.FRONTEND_URL // replace with your Angular server's address
}));



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${chalk.green('Nuova richiesta in entrata:')} ${chalk.blue(req.method)} ${chalk.yellow(req.url)}`);
  next();
});

const apiV1 = "v1"

app.get("/api/"+ apiV1+ '/', (req, res) => {
  return res
      .status(200)
      .json({
        error: false,
        errormessage: "",
        message:"'Hello, Express.js!'"
      });
});

app.get("/api/" + apiV1 + '/login', basicAuthentication, login);

export function login(req, res, next) {
  const { _id, isOwner, email, firstName, lastName } = req.user;
  const token = { id: _id, isOwner, email, firstName, lastName };

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is not defined");

  const options = { expiresIn: "5h" }; // Imposta la scadenza a 5 secondi

  const tokenSigned = jsonwebtoken.sign(token, secret, options);

  return res.status(200).json({ error: false, errormessage: "", token: tokenSigned });
}


app.post("/api/"+ apiV1+ '/users', verifyJWT, async (req, res) => {

    const name = req.body.firstName
    const surname = req.body.lastName
    const email = req.body.email

    console.log(req.body)
    const newUser = await User.createUser(name,surname,email,false)
    const randomPassword : string = generateRandomString(10)
    newUser.setPassword(randomPassword)

    await newUser.save()
    return res
      .status(200)
      .json({
        error: false,
        errormessage: "",
        message : randomPassword
      });
});

app.put("/api/" + apiV1 + "/users/:idu", verifyJWT, async (req : any, res) => {
  const idUser = req.params.idu;
  const idAuthenticated = req.auth.id;
  const value = req.query.options

  if (idUser === idAuthenticated) {
    try {
      // Esempio di aggiornamento del campo "notificationActived" usando il metodo "setNotification"
      const user = await User.findById(idUser);
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      console.log(1)

      // Usa il metodo "setNotification" per impostare il valore del campo "notificationActived"
      user.setNotification(value); // Imposta la notifica su true

      console.log(2)
      // Salva le modifiche
      await user.save();
      console.log(3)
      console.log(user)
      return res.status(200).json({ message: "Notifica impostata su true", data : user});
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'utente:", error);
      return res.status(500).json({ message: "Errore nell'aggiornamento dell'utente" });
    }
  } else {
    return res.status(403).json({ message: "Accesso negato" });
  }
});


app.get("/api/"+ apiV1+ '/users/:id', verifyJWT, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: true, errormessage: 'Utente non trovato' });
    }

    return res.json({ error: false, message: user });
  } catch (error) {
    return res.status(500).json({ error: true, errormessage: 'Errore interno del server' });
  }
});

app.delete("/api/"+ apiV1+ '/users/:idu', verifyJWT, async (req, res) => {
  const { idu } = req.params;
  console.log(idu)

  try {
    const result = await User.findByIdAndRemove(idu);
    if (!result) {
      return res.status(404).json({
        error: true,
        message: "Utente non trovato."
      });
    }

    return res.status(200).json({
      error: false,
      message: "Utente eliminato con successo."
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Errore del server."
    });
  }
});

app.get("/api/"+ apiV1+ '/users', verifyJWT, async (req, res) => {
  const users = await User.find({})
  

  return res
    .status(200)
    .json({
      error: false,
      errormessage: "",
      message : users
    });
});

app.post("/api/" + apiV1 + '/reservations', verifyJWT, async (req, res) => {
  const { numberOfWorkers, date } = req.body;
  const reservationDay = new Date(date);

  // Assicurati che il campo "workers" nel corpo della richiesta contenga un array di ID lavoratori o un array vuoto se necessario
  const workers = [];

  // Esempio di creazione di una prenotazione:
  const group = await Group.findOne({});
  group.createReservation(reservationDay, workers, numberOfWorkers);
  await group.save();

  // Invia una risposta di successo
  return res.status(200).json({
    error: false,
    errormessage: "",
    message: group
  });
});


app.post("/api/"+ apiV1+ '/weeklylists', verifyJWT, async (req, res) => {
  const { numberOfWorkers, date, workers } = req.body;

  if (!numberOfWorkers || !date || !workers || workers.length === 0) {
    return res.status(400).json({
      error: true,
      errormessage: "Tutti i campi richiesti devono essere compilati.",
      message: null
    });
  }
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingList = await WeeklyList.findOne({
    StartDate: {
      $gte: startOfDay,
      $lt: endOfDay
    }
  });


  if (existingList) {
    console.log("la lista esiste gia")
    return res.status(409).json({
      error: true,
      errormessage: "Esiste già una lista con la stessa data.",
      message: null
    });
  }

  // Se non esiste, crea una nuova lista
  const newWeeklyList = await WeeklyList.createWeeklyList(new Date(date), numberOfWorkers, workers);
  await newWeeklyList.save();
  console.log(newWeeklyList)

  return res.status(200).json({
    error: false,
    errormessage: "",
    message: newWeeklyList
  });
});




app.get("/api/" + apiV1 + '/weeklylists', verifyJWT, async (req: any, res) => {
  const isDraftParam = req.query.isDraft;
  const toCompute = req.query.compute;
  const isDraft = (isDraftParam === 'true' || isDraftParam === 'false') ? isDraftParam === 'true' : undefined;

  if (isDraft === undefined) {
      return res.status(400).json({
          error: true,
          errormessage: "Il parametro 'isDraft' deve essere true o false",
          message: null
      });
  }

  let query: any = { isDraft };

  const newWeeklyList = await WeeklyList.find(query)
      .populate({
          path: "workers",
          model: "User"
      })
      .populate({
          path: "weeklyList.workerList.user",
          model: "User"
      })
      .populate({
          path: "prenotationDays.users",
          model: "User"
      });

  return res.status(200).json({
      error: false,
      errormessage: "",
      message: newWeeklyList
  });
});

app.delete("/api/" + apiV1 + '/weeklylists/:id', verifyJWT, async (req: any, res) => {
  const weeklyListId = req.params.id;
  const isAdmin = req.auth.isOwner
  console.log(isAdmin)

  // Verifica se l'utente è un amministratore
  if (!isAdmin) {
    return res.status(403).json({
      error: true,
      errormessage: "Accesso negato. Solo gli amministratori possono effettuare questa operazione",
      message: null
    });
  }

  console.log(weeklyListId);

  // Effettua la cancellazione della lista settimanale basata sull'ID
  try {
    const deletedWeeklyList = await WeeklyList.findOneAndDelete({ _id: weeklyListId });

    if (!deletedWeeklyList) {
      return res.status(404).json({
        error: true,
        errormessage: "Lista settimanale non trovata per l'ID specificato",
        message: null
      });
    }

    return res.status(200).json({
      error: false,
      errormessage: "",
      message: "Lista settimanale eliminata con successo"
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      errormessage: "Si è verificato un errore durante l'eliminazione della lista settimanale",
      message: null
    });
  }
});







export interface workersPreference{
    user : string,
    dayAssigned : number
}

app.put("/api/" + apiV1 + '/weeklylists/:idw', verifyJWT, async (req, res) => {
  try {
    const preferences: workersPreference[] = req.body.preferences;
    const newWeeklyList = await WeeklyList.findById(req.params.idw);

    if (!newWeeklyList) {
      return res.status(404).json({
        error: true,
        errormessage: "Lista settimanale non trovata.",
        message: null
      });
    }

    const list: DailyList[] = await Main.main(preferences, newWeeklyList.prenotationDays);

    newWeeklyList.weeklyList = list;
    newWeeklyList.isDraft = false;
    await newWeeklyList.save();

    console.log(newWeeklyList);

    return res.status(200).json({
      error: false,
      errormessage: "",
      message: newWeeklyList
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      errormessage: error.message, // Utilizza error.message per restituire il messaggio specifico
      message: null
    });
  }
});


const MAX_RETRIES = 3; // numero massimo di tentativi

app.put(`/api/${apiV1}/weeklylists/:idw/prenotationDays/:idd`, verifyJWT, async (req : any, res) => {
    const { idd, idw } = req.params;

    let retries = 0;
    let saved = false;
    let weeklylist;

    while (retries < MAX_RETRIES && !saved) {
        try {
            weeklylist = await WeeklyList.findById(idw);
            weeklylist.addPrenotation(idd, req.auth.id);
            await weeklylist.save();
            saved = true; // Se non ci sono errori, segna come salvato
        } catch (err) {
            if (err instanceof Error.VersionError) {
                retries++;
                console.log(`VersionError encountered. Retry ${retries}/${MAX_RETRIES}.`);
            } else {
                // Se l'errore non è un VersionError, rilancia l'errore
                throw err;
            }
        }
    }

    if (!saved) {
        return res.status(500).json({
            error: true,
            errormessage: "Failed to save after multiple retries due to concurrent updates."
        });
    }

    await (await weeklylist.populate({
        path: "prenotationDays.users",
        model: "User"
    })).populate({
        path: "workers",
        model: "User"
    });

    return res.status(200).json({
        error: false,
        errormessage: "",
        message: weeklylist
    });
});

// GET: Ottieni tutti gli eventi
app.get("/api/" + apiV1 +'/events', async (req, res) => {
  try {
      const events = await CalendarEventModel.getAllEvents();
      
      res.status(200).json({
          error: false,
          errormessage: "",
          message: events
      });
  } catch (error) {
      res.status(500).json({
          error: true,
          errormessage: 'Errore nel recupero degli eventi.',
          message: {}
      });
  }
});


// POST: Crea un nuovo evento


// POST: Prenota un evento
// POST: Prenota un evento o crea uno se non esiste
app.put("/api/" + apiV1 +'/events', verifyJWT, async (req : any, res) => {
  const date = new Date(req.body.eventId);
  const action = req.query.action;
  const userId = req.auth.id;

  try {
    console.log(date)
    let event = await CalendarEventModel.findOne({ date: date });

    if (action === 'book') {
      if (!event) {
        event = new CalendarEventModel({ date: date, users: [userId] });
      } else {
        const usersSet = new Set(event.users);
        usersSet.add(userId);
        event.users = Array.from(usersSet);
      }
      await event.save();
      return res.status(200).json({ error: false, message: 'Evento prenotato con successo!' });

    } else if (action === 'unbook' && event) {
      event.users = event.users.filter(user => user.toString() !== userId.toString());
      if (event.users.length === 0) {
        await CalendarEventModel.deleteOne({ date: date });
      } else {
        await event.save();
      }
      return res.status(200).json({ error: false, message: 'Prenotazione rimossa con successo!' });

    } else {
      return res.status(404).json({ error: true, errormessage: 'Evento non trovato o azione non valida.' });
    }

  } catch (error) {
      return res.status(500).json({ error: true, errormessage: 'Errore nel gestire la prenotazione.' });
  }
});






app.put(`/api/${apiV1}/weeklylists/:idw/weeklylist`, verifyJWT, async (req, res) => {
  try {
    const { weeklyList } = req.body;
    const { idw } = req.params;

    const weeklyListToTransform = await WeeklyList.findById(idw);
    if (!weeklyListToTransform) {
      return res.status(404).json({ message: 'WeeklyList not found' });
    }

    weeklyListToTransform.weeklyList = weeklyList;
    await weeklyListToTransform.save();

    console.log(weeklyListToTransform.weeklyList)

    await (await weeklyListToTransform.populate({
      path: "workers",
      model: "User"
    }))
    .populate({
      path: "weeklyList.workerList.user", // Popola i lavoratori all'interno di workerList nell'oggetto DailyList
      model: "User"
    });

    return res.status(200).json({ error: false, data: weeklyListToTransform.weeklyList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'metiupaga8@gmail.com',
    pass: 'vbot rwim ebtr rrxr',
  },
  
});

interface Email {
  from: string; // Mittente
  to: string; // Array di destinatari
  subject: string; // Oggetto della notifica
  text: string; // Testo del messaggio
  urlAdmin?: string; // URL per gli amministratori (opzionale)
  urlUser?: string; // URL per gli utenti normali (opzionale)
}

interface EmailOptions extends Email {
  html?: string; // Rende la proprietà html opzionale
}

// Endpoint per l'invio delle notifiche a più utenti
app.post(`/api/${apiV1}/notification`, async (req, res) => {
  try {
    const email: Email = req.body;
    const sentUsers = [];
    for (const userId of email.to) {
      const user = await User.findById(userId);

      if (user && user.email && user.notificationActived) {
        const mailOptions: EmailOptions = {
          from: email.from,
          to: user.email, 
          subject: email.subject,
          text: email.text,
        };
        if (user.isOwner) {
          mailOptions.html = substitute(user.firstName, user.lastName, email.text, email.urlAdmin, process.env.FRONTEND_URL);
        } else {
          mailOptions.html = substitute(user.firstName, user.lastName, email.text, email.urlUser, process.env.FRONTEND_URL);
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email inviata con successo a ${user.email}:`, info.response);
        sentUsers.push(user);
      }
    }
    return res.status(200).json({ message: 'Email inviata con successo a tutti gli utenti', sentUsers });
  } catch (error) {
    console.error('Errore durante l\'invio delle notifiche via email:', error);
    return res.status(500).json({ error: 'Errore durante l\'invio delle notifiche via email' });
  }
});


app.use( (err , req , res, next  )=> {

    console.log("Request error: " + JSON.stringify(err) );
    return res.status( err.statusCode || 500 ).json( err );
  
  });
  
  app.use( (req,res,next) => {
    res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
  })
  

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  
});

/*
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  
});
*/


async function run() {
  await connect(process.env.DB_URL);
  const admin = await User.findOne({isOwner:true})
    

  if(admin){
    console.log("admin trovato")
  }else{
    console.log("admin non trovato")
    const user =  new User();
    user.firstName = "Matteo"
    user.lastName = "Pagano"
    user.isOwner = true
    user.email = "metiupaga8@gmail.com"
    user.setPassword("admin")
  
    const newGroup = await Group.createGroup('Nome Gruppo', [], {
      mondayOnMonday: 2,
      peopleTuesday: 2,
      peopleWednesday: 2,
      peopleThursday: 2,
      peopleFriday: 2,
      peopleSaturday: 2,
      peopleSunday: 2,
    });
  
    console.log(newGroup)
  
    await newGroup.save()
  
    await user.save();
    console.log("Utente Salvato")
    const matteo = await User.findOne({firstName : "Matteo"})
    console.log("is password correct? " + matteo.isPasswordCorrect("admin"))
  }

  
}