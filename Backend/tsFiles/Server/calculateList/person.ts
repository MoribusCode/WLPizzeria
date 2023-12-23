

import { Day } from "./day.js";


export enum Means {
    MOTOR_BIKE,
    OWN_CAR,
    PIZZERIA_CAR,
}

export class Person {
    private abbreviation: string;
    private name: string;
    private numberOfDaysToDo: number;
    private daysOfAbsence: Day[] = [];
    private color: string;

    private means : Means;

    constructor(
        nome: string = "",
        i: number = 0,
        m: string = "",
        color: string = "",
        means: Means = Means.MOTOR_BIKE
    ) {
        this.name = nome;
        this.abbreviation = m;
        this.numberOfDaysToDo = i;
        this.color = color;
        this.means = means;
    }

    getMeans(){
        return this.means
    }
    addAbsences(absences: Day[]): void {
        this.daysOfAbsence.push(...absences);
    }

    getDaysOfAbsence(): Day[] {
        return this.daysOfAbsence;
    }

    getNumberOfDaysToDo(): number {
        return this.numberOfDaysToDo;
    }

    getAbbreviation(): string {
        return this.abbreviation;
    }

    toString(): string {
        return this.color + this.abbreviation + '\u001B[0m';
    }

    isAbsenceAndDayToDoCorrects(): boolean {
        const daysOfAbsence = this.daysOfAbsence.length;
        const cond = daysOfAbsence + this.getNumberOfDaysToDo() <= 7;
        if (!cond) {
            throw new Error(`Controlla ${this.abbreviation}, Giorni lavorativi: ${this.getNumberOfDaysToDo()}, Assenze impostate:${daysOfAbsence}.`);
        }
        return cond;
    }

    getName(): string {
        return this.name;
    }

    equals(o: any): boolean {
        if (this === o) return true;
        if (o == null || this.constructor !== o.constructor) return false;
        const persona = o as Person;
        return this.abbreviation === persona.abbreviation;
    }

    hashCode(): number {
        return this.customHashCode(this.abbreviation);
    }

    private customHashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        return hash;
    }

    setAbbreviation(abbreviation: string): void {
        this.abbreviation = abbreviation;
    }
}
