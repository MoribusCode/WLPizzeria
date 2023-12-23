import { Person } from "./person.js";
import { DayOfList } from "./dayoflist.js";
import { Day } from "./day.js";
import { Model, Schema, HydratedDocument, model, Types } from 'mongoose';
import { DailyList } from "../../Model/weekly_list.js";

import { WeeklyList } from "./weeklylist.js"
import { PrenotationDay, Worker} from "../../Model/weekly_list.js";



export enum Means {
    MOTOR_BIKE,
    OWN_CAR,
    PIZZERIA_CAR,
}

export interface workersPreference{
    user : string,
    dayAssigned : number
}

export class Main {
    static async main(preferences : workersPreference[], absences : PrenotationDay[]) {

      console.log("PREFERENZE")
      console.log(preferences)
      console.log("ASSENZE")
      console.log(absences)
      const listOfPeople: Person[] = [];
  
      const ANSI_BLACK = "\u001B[30m";
      const ANSI_RED = "\u001B[31m";
      const ANSI_GREEN = "\u001B[32m";
      const ANSI_YELLOW = "\u001B[33m";
      const ANSI_BLUE = "\u001B[34m";
      const ANSI_PURPLE = "\u001B[35m";
      const ANSI_CYAN = "\u001B[36m";
      const ANSI_WHITE = "\u001B[37m";
      const idk = "\u001B[38m";
  
      const LunediLista = new DayOfList("Lunedì", absences[0].numberOfWorker);
      const MartediLista = new DayOfList("Martedì", absences[1].numberOfWorker);
      const MercolediLista = new DayOfList("Mercoledì", absences[2].numberOfWorker);
      const GiovediLista = new DayOfList("Giovedì", absences[3].numberOfWorker);
      const VenerdiLista = new DayOfList("Venerdì", absences[4].numberOfWorker);
      const SabatoLista = new DayOfList("Sabato", absences[5].numberOfWorker);
      const DomenicaLista = new DayOfList("Domenica", absences[6].numberOfWorker);
  
      
      const listaGiorni: DayOfList[] = [
        LunediLista,
        MartediLista,
        MercolediLista,
        GiovediLista,
        VenerdiLista,
        SabatoLista,
        DomenicaLista,
      ];

      

      for(let preference of preferences){
        const user = new Person(preference.user, preference.dayAssigned, preference.user, idk, Means.PIZZERIA_CAR);
        const absencePerson: Day[] = [];

        for (let i = 0; i < absences.length; i++) {
        const absence = absences[i];
        if (absence.users.includes(new Types.ObjectId(user.getName()))) {
            switch (i) {
                case 0:
                  absencePerson.push(Day.getLunedi());
                  break;
                case 1:
                  absencePerson.push(Day.getMartedi());
                  break;
                case 2:
                  absencePerson.push(Day.getMercoledi());
                  break;
                case 3:
                  absencePerson.push(Day.getGiovedi());
                  break;
                case 4:
                  absencePerson.push(Day.getVenerdi());
                  break;
                case 5:
                  absencePerson.push(Day.getSabato());
                  break;
                case 6:
                  absencePerson.push(Day.getDomenica());
                  break;
                default:
                  // Gestisci eventuali casi non validi qui
                  break;
              }
        }
        }
        user.addAbsences(absencePerson)
        console.log("Printo user")
        console.log(user)
        listOfPeople.push(user);
      }

  
  
      const weeklyList = new WeeklyList(listOfPeople, listaGiorni, 2);
  
      await weeklyList.calculate();

      const list : DailyList[] = []


      const listOfDays = weeklyList.getListOfDays()

      

      
      const dayToDatesMap = new Map([
        [Day.getLunedi().getDay(), absences[0].date],
        [Day.getMartedi().getDay(), absences[1].date],
        [Day.getMercoledi().getDay(), absences[2].date],
        [Day.getGiovedi().getDay(), absences[3].date],
        [Day.getVenerdi().getDay(), absences[4].date],
        [Day.getSabato().getDay(), absences[5].date],
        [Day.getDomenica().getDay(), absences[6].date],
      ]);
      
      listOfDays.forEach((dayOfList, day) => {
        const currentDate = dayToDatesMap.get(day.getDay());
        if (currentDate) {
          // Ora hai accesso a currentDate, che contiene la data corrispondente a questo giorno della settimana.
      
          const dailyList: DailyList = { day: currentDate, workerList: [] };
      
          dayOfList.getListOfPeopleWithCar().forEach(person => {
            dailyList.workerList.push({
              user: new Types.ObjectId(person.getT1().getName()),
              useHisCar: !person.getT2(),
            });
          });
      
          list.push(dailyList);
        }
      });
      


    return list
  }
  



}