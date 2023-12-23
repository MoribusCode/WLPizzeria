export class Day {
    private day: string;
    private date : Date;

    private constructor(g: string) {
        this.day = g;
    }

    static getLunedi(): Day {
        return new Day("Lunedì");
    }

    static getMartedi(): Day {
        return new Day("Martedì");
    }

    static getMercoledi(): Day {
        return new Day("Mercoledì");
    }

    static getGiovedi(): Day {
        return new Day("Giovedì");
    }

    static getVenerdi(): Day {
        return new Day("Venerdì");
    }

    static getSabato(): Day {
        return new Day("Sabato");
    }

    static getDomenica(): Day {
        return new Day("Domenica");
    }

    getDay(): string {
        return this.day;
    }

    static getDayByName(name: string): Day | null {
        let d: Day | null = null;
        switch (name) {
            case "Lunedì":
                d = Day.getLunedi();
                break;
            case "Martedì":
                d = Day.getMartedi();
                break;
            case "Mercoledì":
                d = Day.getMercoledi();
                break;
            case "Giovedì":
                d = Day.getGiovedi();
                break;
            case "Venerdì":
                d = Day.getVenerdi();
                break;
            case "Sabato":
                d = Day.getSabato();
                break;
            case "Domenica":
                d = Day.getDomenica();
                break;
        }
        return d;
    }

    toString(): string {
        return this.day;
    }

    equals(o: any): boolean {
        if (this === o) return true;
        if (o == null || this.constructor !== o.constructor) return false;
        const otherDay = o as Day;
        return this.day === otherDay.day;
    }

    hashCode(): number {
        let hash = 0;
        for (let i = 0; i < this.day.length; i++) {
            const char = this.day.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        return hash;
    }
}