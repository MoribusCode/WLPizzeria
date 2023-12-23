
import {Tuple} from "./tuple.js"
import {CarBuilderProperty} from "./carbuilderproperty.js"
import {Person} from "./person.js"
import { WeeklyList } from "./weeklylist.js"

export class CarBuilder {
    private carBuilderProperty: CarBuilderProperty;
    private person_NumberOfTimesPizzeriaCar: Map<string, number>;

    constructor(propertyCar: CarBuilderProperty) {
        this.carBuilderProperty = propertyCar;
        this.person_NumberOfTimesPizzeriaCar = new Map<string, number>();
        for (const person of this.carBuilderProperty.getPeopleOwnCar()) {
            this.person_NumberOfTimesPizzeriaCar.set(person.getAbbreviation(), 0);
        }
    }

    private takeMin(l: Tuple<Person, boolean>[]): Person {
        let min: Tuple<Person, number> = new Tuple(l[0].getT1(), this.person_NumberOfTimesPizzeriaCar.get(l[0].getT1().getAbbreviation()));
        for (const e of l) {
            const numeroVolteE = this.person_NumberOfTimesPizzeriaCar.get(e.getT1().getAbbreviation())!;
            if (numeroVolteE <= min.getT2()) {
                min = new Tuple(e.getT1(), numeroVolteE);
            }
        }
        return min.getT1();
    }

    public makeListWithCarsOptions(listaSettimana: WeeklyList): void {
        for (const [g, dayOfList] of listaSettimana.getListOfDays()) {
            if (
                dayOfList.getListOfPeople().every(person => this.carBuilderProperty.getPeoplePizzeriaCar().includes(person)) &&
                this.carBuilderProperty.getPeoplePizzeriaCar().length === this.getNumeroMacchinePizzeria()
            ) {
                const l = dayOfList.getListOfPeopleWithCar()
                    .filter(personaBooleanTuple => this.carBuilderProperty.getPeopleOwnCar().includes(new Person(personaBooleanTuple.getT1().getAbbreviation())))
                    .map(personaBooleanTuple => new Tuple<Person, boolean>(personaBooleanTuple.getT1(), true));

                dayOfList.getListOfPeopleWithCar().forEach((personaBooleanTuple, index, array) => {
                    if (l.some(item => item.getT1().getAbbreviation() === personaBooleanTuple.getT1().getAbbreviation())) {
                        array[index] = new Tuple(personaBooleanTuple.getT1(), true);
                    }
                });
            } else {
                const countPeopleWithoutMotorBike = dayOfList.getListOfPeople().filter(person => !this.carBuilderProperty.getPeopleMotorbike().includes(person)).length;

                const mPcounterPersoneChedovrebberoUsareMacchinaPizzeria = dayOfList.getListOfPeople().filter(person => this.carBuilderProperty.getPeoplePizzeriaCar().includes(person)).length;

                const nPersoneCheMacchinaPropria = dayOfList.getListOfPeople().filter(person => this.carBuilderProperty.getPeopleOwnCar().includes(person)).length;

                const l = dayOfList.getListOfPeopleWithCar()
                    .filter(personaBooleanTuple => this.carBuilderProperty.getPeopleOwnCar().includes(new Person(personaBooleanTuple.getT1().getAbbreviation())))
                    .map(personaBooleanTuple => new Tuple(personaBooleanTuple.getT1(), true));

                const numeroScooter = dayOfList.getListOfPeople().filter(person => this.carBuilderProperty.getPeopleMotorbike().includes(person)).length;

                let formula: number;
                if (this.getNumeroMacchinePizzeria() > mPcounterPersoneChedovrebberoUsareMacchinaPizzeria && nPersoneCheMacchinaPropria > 0) {
                    formula = this.getNumeroMacchinePizzeria() - mPcounterPersoneChedovrebberoUsareMacchinaPizzeria;
                    for (let i = 0; i < formula; i++) {
                        if (l.length !== 0) {
                            const min = this.takeMin(l);
                            this.person_NumberOfTimesPizzeriaCar.set(min.getAbbreviation(), this.person_NumberOfTimesPizzeriaCar.get(min.getAbbreviation())! + 1);
                            l.splice(l.findIndex(item => item.getT1().getAbbreviation() === min.getAbbreviation()), 1);
                        }
                    }
                }

                dayOfList.getListOfPeopleWithCar().forEach((personaBooleanTuple, index, array) => {
                    if (
                        !(
                            l.some(item => item.getT1().getAbbreviation() === personaBooleanTuple.getT1().getAbbreviation()) ||
                            this.carBuilderProperty.getPeopleMotorbike().includes(new Person(personaBooleanTuple.getT1().getAbbreviation())) ||
                            this.carBuilderProperty.getPeoplePizzeriaCar().includes(new Person(personaBooleanTuple.getT1().getAbbreviation()))
                        )
                    ) {
                        array[index] = new Tuple(personaBooleanTuple.getT1(), true);
                    }
                });
            }
        }
    }

    private getNumeroMacchinePizzeria(): number {
        return this.carBuilderProperty.getNumberOfPizzeriaCar();
    }

    private minAux(): number {
        return Math.min(...this.person_NumberOfTimesPizzeriaCar.values());
    }

    private maxAux(): number {
        return Math.max(...this.person_NumberOfTimesPizzeriaCar.values());
    }

    public isFair(i: number): boolean {
        const bool = this.maxAux() - this.minAux() <= i;
        if (bool) {
            return true;
        } else {
            this.reset();
            return false;
        }
    }

    private reset(): void {
        for (const key of this.person_NumberOfTimesPizzeriaCar.keys()) {
            this.person_NumberOfTimesPizzeriaCar.set(key, 0);
        }
    }

    public getValueFromPerson(p: string): number | undefined {
        return this.person_NumberOfTimesPizzeriaCar.get(p);
    }

    public getPerson_NumberOfTimesPizzeriaCar(): Map<string, number> {
        return this.person_NumberOfTimesPizzeriaCar;
    }

    public static createPropertyCar(listOfPeople: Person[], numberOfPizzeriaCar: number): CarBuilderProperty {
        const peopleOwnCar: Person[] = [];
        const peoplePizzeriaCar: Person[] = [];
        const peopleMotorbike: Person[] = [];

        for (const p of listOfPeople) {
            switch (p.getMeans().toString()) {
                case "MOTOR_BIKE":
                    peopleMotorbike.push(p);
                    break;
                case "OWN_CAR":
                    peopleOwnCar.push(p);
                    break;
                case "PIZZERIA_CAR":
                    peoplePizzeriaCar.push(p);
                    break;
            }
        }

        return new CarBuilderProperty(peopleOwnCar, peoplePizzeriaCar, peopleMotorbike, numberOfPizzeriaCar);
    }
}
