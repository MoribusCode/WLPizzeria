import { Person } from "./person.js";

export class CarBuilderProperty {
    private peopleOwnCar: Person[] = [];
    private peoplePizzeriaCar: Person[] = [];
    private peopleMotorbike: Person[] = [];
    private numberOfPizzeriaCar: number;

    constructor(peopleOwnCar: Person[], peoplePizzeriaCar: Person[], peopleMotorbike: Person[], numberOfPizzeriaCar: number) {
        this.peopleOwnCar = peopleOwnCar;
        this.peoplePizzeriaCar = peoplePizzeriaCar;
        this.peopleMotorbike = peopleMotorbike;
        this.numberOfPizzeriaCar = numberOfPizzeriaCar;
    }

    public getPeopleOwnCar(): Person[] {
        return this.peopleOwnCar;
    }

    public getPeoplePizzeriaCar(): Person[] {
        return this.peoplePizzeriaCar;
    }

    public getPeopleMotorbike(): Person[] {
        return this.peopleMotorbike;
    }

    public getNumberOfPizzeriaCar(): number {
        return this.numberOfPizzeriaCar;
    }
}
