import { Person } from "./person.js";
import { Day } from "./day.js";
import { DayOfList } from "./dayoflist.js";
import {CarBuilder} from "./carbuilder.js"

export class WeeklyList {
    private listOfPeople: Person[];
    private listOfDays: Map<Day, DayOfList>;
    private carBuilder: CarBuilder;

    constructor(listOfPeople: Person[], listOfDays: DayOfList[], numberOfPizzeriaCar: number) {
        this.listOfPeople = listOfPeople;
        this.listOfDays = new Map();
        for (const d of listOfDays) {
            this.listOfDays.set(Day.getDayByName(d.getName()), d);
        }
        //console.log(this.listOfDays)
        this.carBuilder = new CarBuilder(CarBuilder.createPropertyCar(listOfPeople, numberOfPizzeriaCar));
    }

    async calculate(): Promise<void> {
        if (this.isCorrectAvailabilityAndPerson() && this.checkIfExceedsFromInitialOptions() && this.isCorrectAbsence()) {
            let guard = true;
            let i = 0;
            while (i < 1100000 && guard) {
                if (await this.calculateAux()) {
                    guard = false;
                    console.log("volte: " + i);
                }
                i++;
            }
            if (guard) {
                throw new Error("Non esistono combinazioni");
            }
        }
    }

    private makeAggregateOccurrencesRand(): Person[] {
        const aggregateOccurrencesOfPeople: Person[] = [];
        for (const p of this.listOfPeople) {
          for (let i = 0; i < p.getNumberOfDaysToDo(); i++) {
            aggregateOccurrencesOfPeople.push(p);
          }
        }
        return this.shuffleArray(aggregateOccurrencesOfPeople);
      }

      private generateList(coda: Person[]): void {
        while (coda.length > 0) {
          const personToAdd = coda.shift();
      
          for (const [key, value] of this.listOfDays.entries()) {
            if (!value.isFull() && this.isAddable(personToAdd, value) && !this.isAlreadyPresent(personToAdd, value)) {
              value.addPerson(personToAdd);
              break;
            }
          }
        }
      }
      

    private shuffleArray<T>(array: T[]): T[] {
        const newArray = array.slice(); // Creiamo una copia dell'array originale
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Scambio gli elementi
        }
        return newArray;
      }
      
      

      private async calculateAux(): Promise<boolean> {
        const randomQueue: Person[] = this.makeAggregateOccurrencesRand();
        this.generateList(randomQueue);
      
        if (!this.isListCorrect()) {
          this.clearDays();
          return false;
        } else {
          await this.carBuilder.makeListWithCarsOptions(this);
      
          if (this.carBuilder.isFair(1)) {
            console.log("Distanza Corretta");
            console.log(this.carBuilder.getPerson_NumberOfTimesPizzeriaCar());
            this.printListInOrder();
            return true;
          } else {
            this.clearDays();
            return false;
          }
        }
      }
      

      private clearDays(): void {
        for (const g of this.listOfDays.entries()) {
          g[1].getListOfPeopleWithCar().splice(0);
        }
      }

    public printList(): void {
        for (const g of this.listOfDays.entries()) {
            console.log(g[1].getName() + ": " + g[1].getListOfPeopleWithCar());
        }
        console.log();
        console.log("* = macchina propria.");
    }

    public printListInOrder(): void {
        for (const [day, dayOfList] of this.listOfDays.entries()) {
            console.log(day.getDay() + ": " + dayOfList?.getListOfPeopleWithCar());
        }
    
        console.log();
        console.log("* = macchina propria.");
    }

    public static printList(l: DayOfList[]): void {
        console.log(l)
        for (const g of l) {
            console.log(g.getName() + ": " + g.getListOfPeopleWithCar());
        }
        console.log();
        console.log("* = macchina propria.");
    }

    

    public isCorrectAbsence(): boolean {
        const occupiedSlots: Map<Day, number> = this.fillOccupiedSlots();
        let cond = true;
        console.log(occupiedSlots.entries())

        console.log()
        for (const [m, value] of occupiedSlots.entries()) {
            const matchingDay = [...this.listOfDays.keys()].find(day => day.equals(m));
            if (matchingDay) {
                if (value + this.listOfDays.get(matchingDay).getNumberOfSlots() > this.listOfPeople.length) {
                    cond = false;
                    throw new Error(`Controlla ${matchingDay.toString()}\n${matchingDay.toString()} hai inserito le assenze di ${value} persone.`);
                }
            }
        }
        
        return cond;
    }

    private fillOccupiedSlots(): Map<Day, number> {
        const occupiedSlots: Map<Day, number> = new Map();
        occupiedSlots.set(Day.getLunedi(), 0);
        occupiedSlots.set(Day.getMartedi(), 0);
        occupiedSlots.set(Day.getMercoledi(), 0);
        occupiedSlots.set(Day.getGiovedi(), 0);
        occupiedSlots.set(Day.getVenerdi(), 0);
        occupiedSlots.set(Day.getSabato(), 0);
        occupiedSlots.set(Day.getDomenica(), 0);

        for (const p of this.listOfPeople) {
            for (const g of p.getDaysOfAbsence()) {
                switch (g.getDay()) {
                    case Day.getLunedi().getDay():
                        occupiedSlots.set(Day.getLunedi(), occupiedSlots.get(Day.getLunedi()) + 1);
                        break;
                    case Day.getMartedi().getDay():
                        occupiedSlots.set(Day.getMartedi(), occupiedSlots.get(Day.getMartedi()) + 1);
                        break;
                    case Day.getMercoledi().getDay():
                        occupiedSlots.set(Day.getMercoledi(), occupiedSlots.get(Day.getMercoledi()) + 1);
                        break;
                    case Day.getGiovedi().getDay():
                        occupiedSlots.set(Day.getGiovedi(), occupiedSlots.get(Day.getGiovedi()) + 1);
                        break;
                    case Day.getVenerdi().getDay():
                        occupiedSlots.set(Day.getVenerdi(), occupiedSlots.get(Day.getVenerdi()) + 1);
                        break;
                    case Day.getSabato().getDay():
                        occupiedSlots.set(Day.getSabato(), occupiedSlots.get(Day.getSabato()) + 1);
                        break;
                    case Day.getDomenica().getDay():
                        occupiedSlots.set(Day.getDomenica(), occupiedSlots.get(Day.getDomenica()) + 1);
                        break;
                }
            }
        }
        return occupiedSlots;
    }

    public isCorrectAvailabilityAndPerson(): boolean {
        let cond = true;
        let numeroPresenzeDaOccupare = 0;
        let numeroDisponibilitaPersone = 0;
    
        for (const [, dayOfList] of this.listOfDays.entries()) {
            numeroPresenzeDaOccupare += dayOfList.getNumberOfSlots();
        }
    
        for (const person of this.listOfPeople) {
            numeroDisponibilitaPersone += person.getNumberOfDaysToDo();
        }
    
        if (numeroDisponibilitaPersone > numeroPresenzeDaOccupare) {
            cond = false;
            throw new Error(`Diminuisci di ${numeroDisponibilitaPersone - numeroPresenzeDaOccupare} i giorni lavorativi alle persone!`);
          } else if (numeroDisponibilitaPersone < numeroPresenzeDaOccupare) {
            cond = false;
            throw new Error(`Aggiungi di ${numeroPresenzeDaOccupare - numeroDisponibilitaPersone} i giorni lavorativi alle persone!`);
          }
        return cond;
    }
    

    private isListCorrect(): boolean {
        return this.doSlotsAndPeopleMatch() && this.doDaysMatchFromInitialOptions();
    }

    private isAlreadyPresent(personToAdd: Person, g: DayOfList): boolean {
        let cond = false;
        for (const g1 of g.getListOfPeopleWithCar()) {
            if (g1.getT1().getAbbreviation() === personToAdd.getAbbreviation()) {
                cond = true;
                break;
            }
        }
        return cond;
    }

    private isAddable(personToAdd: Person, d: DayOfList): boolean {
        let cond = true;
        const s = d.getName();
        for (const g of personToAdd.getDaysOfAbsence()) {
            if (g.getDay() === s) {
                cond = false;
                break;
            }
        }
        return cond;
    }

    private doSlotsAndPeopleMatch(): boolean {
        let bool = true;
        for (const [, dayOfList] of this.listOfDays.entries()) {
            if (dayOfList.getListOfPeopleWithCar().length !== dayOfList.getNumberOfSlots()) {
                bool = false;
                break;
            }
        }
        return bool;
    }
    

    private doDaysMatchFromInitialOptions(): boolean {
        let check = true;
        for (const p of this.listOfPeople) {
            let giorniAssegnati = 0;
            for (const [, dayOfList] of this.listOfDays.entries()) {
                if (dayOfList.getListOfPeople().includes(p)) {
                    giorniAssegnati++;
                }
            }
            if (p.getNumberOfDaysToDo() !== giorniAssegnati) {
                check = false;
                break;
            }
        }
        return check;
    }

    public checkIfExceedsFromInitialOptions(): boolean {
        let cond = true;
        for (const p of this.listOfPeople) {
            if (!p.isAbsenceAndDayToDoCorrects()) {
                cond = false;
                break;
            }
        }
        return cond;
    }

    public getListOfPeople(): Person[] {
        return this.listOfPeople;
    }

    public getListOfDays(): Map<Day, DayOfList> {
        return this.listOfDays;
    }
}


class Queue<T> {
    private items: T[] = [];
  
    enqueue(item: T): void {
      this.items.push(item);
    }
  
    dequeue(): T | undefined {
      return this.items.shift();
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    size(): number {
      return this.items.length;
    }
  }