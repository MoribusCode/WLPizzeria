import { WeeklyList } from "../../Model/weekly_list.js";
import {Main} from "../calculateList/main.js"
import {Error} from 'mongoose';

export async function createWeeklyListHandler(req, res) {
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
        return res.status(409).json({
            error: true,
            errormessage: "Esiste già una lista con la stessa data.",
            message: null
        });
    }

    // Se non esiste, crea una nuova lista
    const newWeeklyList = await WeeklyList.createWeeklyList(new Date(date), numberOfWorkers, workers);
    await newWeeklyList.save();

    return res.status(200).json({
        error: false,
        errormessage: "",
        message: newWeeklyList
    });
}

// Funzione per ottenere le liste settimanali
export async function getWeeklyListsHandler(req, res) {
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

    let query = { isDraft };

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
}

// Funzione per eliminare una lista settimanale
export async function deleteWeeklyListHandler(req, res) {
    const weeklyListId = req.params.id;
    const isAdmin = req.auth.isOwner;

    // Verifica se l'utente è un amministratore
    if (!isAdmin) {
        return res.status(403).json({
            error: true,
            errormessage: "Accesso negato. Solo gli amministratori possono effettuare questa operazione",
            message: null
        });
    }


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
}

export interface workersPreference{
    user : string,
    dayAssigned : number
}


// Funzione per trasformare una lista settimanale in lista giornaliera
export async function transformWeeklyListToDailyListHandler(req, res) {
    try {
        const preferences : workersPreference[] = req.body.preferences;
        const newWeeklyList = await WeeklyList.findById(req.params.idw);

        if (!newWeeklyList) {
            return res.status(404).json({
                error: true,
                errormessage: "Lista settimanale non trovata.",
                message: null
            });
        }

        const list = await Main.main(preferences, newWeeklyList.prenotationDays);

        newWeeklyList.weeklyList = list;
        newWeeklyList.isDraft = false;
        await newWeeklyList.save();


        return res.status(200).json({
            error: false,
            errormessage: "",
            message: newWeeklyList
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            errormessage: error.message,
            message: null
        });
    }
}

// Funzione per aggiornare una lista settimanale
export async function updateWeeklyListHandler(req, res) {
    try {
        const { weeklyList } = req.body;
        const { idw } = req.params;

        const weeklyListToTransform = await WeeklyList.findById(idw);
        if (!weeklyListToTransform) {
            return res.status(404).json({ message: 'WeeklyList not found' });
        }

        weeklyListToTransform.weeklyList = weeklyList;
        await weeklyListToTransform.save();


        await (await weeklyListToTransform.populate({
            path: "workers",
            model: "User"
        }))
        .populate({
            path: "weeklyList.workerList.user",
            model: "User"
        });

        return res.status(200).json({ error: false, data: weeklyListToTransform.weeklyList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const MAX_RETRIES = 3; // numero massimo di tentativi

export async function handleConcurrentPrenotations(req : any, res){
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
}