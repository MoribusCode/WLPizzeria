// Funzione per creare un nuovo utente
import { User } from "../../Model/user.js";
import { generateRandomString } from "../utilities.js";

export async function createUserHandler(req, res) {
    const name = req.body.firstName;
    const surname = req.body.lastName;
    const email = req.body.email;

    console.log(req.body);
    const newUser = await User.createUser(name, surname, email, false);
    const randomPassword = generateRandomString(10);
    newUser.setPassword(randomPassword);

    await newUser.save();
    return res
        .status(200)
        .json({
            error: false,
            errormessage: "",
            message: randomPassword,
        });
}

// Funzione per aggiornare la notifica dell'utente
export async function updateUserNotificationHandler(req, res) {
    const idUser = req.params.idu;
    const idAuthenticated = req.auth.id;
    const value = req.query.options;

    if (idUser === idAuthenticated) {
        try {
            const user = await User.findById(idUser);
            if (!user) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            user.setNotification(value);
            await user.save();

            return res.status(200).json({ message: "Notifica impostata su true", data: user });
        } catch (error) {
            console.error("Errore nell'aggiornamento dell'utente:", error);
            return res.status(500).json({ message: "Errore nell'aggiornamento dell'utente" });
        }
    } else {
        return res.status(403).json({ message: "Accesso negato" });
    }
}

// Funzione per ottenere un utente per ID
export async function getUserByIdHandler(req, res) {
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
}

// Funzione per eliminare un utente per ID
export async function deleteUserHandler(req, res) {
    const { idu } = req.params;
    console.log(idu);

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
}

// Funzione per ottenere tutti gli utenti
export async function getAllUsersHandler(req, res) {
    const users = await User.find({});

    return res
        .status(200)
        .json({
            error: false,
            errormessage: "",
            message: users
        });
}
