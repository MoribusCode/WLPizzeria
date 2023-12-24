import CalendarEventModel from '../../Model/calendar.js';


export async function getAllEvents(req: any, res: any) {
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
}




export async function handleEventBooking(req: any, res: any) {
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
}
