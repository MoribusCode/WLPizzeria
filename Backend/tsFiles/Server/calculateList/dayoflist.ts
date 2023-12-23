

import { Tuple } from "./tuple.js";
import { Person } from "./person.js";

export class DayOfList {
    private numberOfSlots: number;
    private name: string;
    private listOfPeople: Tuple<Person, boolean>[] = [];

    constructor(g: string, n: number) {
        this.name = g;
        this.numberOfSlots = n;
    }

    addPerson(p: Person): void {
        this.listOfPeople.push(new Tuple(p, false));
    }

    getName(): string {
        return this.name;
    }

    getNumberOfSlots(): number {
        return this.numberOfSlots;
    }

    getListOfPeopleWithCar(): Tuple<Person, boolean>[] {
        return this.listOfPeople;
    }

    getListOfPeople(): Person[] {
        return this.listOfPeople.map(tuple => tuple.getT1());
    }

    setListOfPeople(listOfPeople: Tuple<Person, boolean>[]): void {
        this.listOfPeople = listOfPeople;
    }

    isFull(): boolean {
        return this.getNumberOfSlots() <= this.listOfPeople.length;
    }

    equals(o: any): boolean {
        if (o instanceof DayOfList) {
            const g = o as DayOfList;
            return this.name === g.name;
        }
        return false;
    }

    toString(): string {
        return `GiornoLista{ numeroGiorniMax=${this.getNumberOfSlots()}, name='${this.name}', listaDiPersona=${this.listOfPeople} }`;
    }
}
