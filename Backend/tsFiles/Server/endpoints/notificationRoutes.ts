import { User } from "../../Model/user.js";
import { substitute } from "../utilities.js";
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

export async function sendEmailNotifications(req, res) {
    try {
      const email: Email = req.body;
      const sentUsers = [];
      console.log("to" + email.to)
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
          sentUsers.push(user);
        }
      }
      return res.status(200).json({ message: 'Email inviata con successo a tutti gli utenti', sentUsers });
    } catch (error) {
      console.error('Errore durante l\'invio delle notifiche via email:', error);
      return res.status(500).json({ error: 'Errore durante l\'invio delle notifiche via email' });
    }
  }