export class Tuple<T, T1> {
    private t1: T;
    private t2: T1;

    constructor(t: T, t1?: T1) {
        this.t1 = t;
        this.t2 = t1!;
    }

    getT1(): T {
        return this.t1;
    }

    getT2(): T1 {
        return this.t2;
    }

    setT1(t1: T): void {
        this.t1 = t1;
    }

    setT2(t2: T1): void {
        this.t2 = t2;
    }

    toString(): string {
        if (typeof this.t2 === 'boolean') {
            const bool = this.t2 as boolean;
            if (bool) {
                return this.t1 + '*';
            } else {
                return this.t1.toString();
            }
        } else {
            throw new Error('Tipo di dati non supportato nel Tuple.');
        }
    }

    equals(o: any): boolean {
        if (this === o) return true;
        if (o == null || this.constructor !== o.constructor) return false;
        const tuple = o as Tuple<T, T1>;
        return this.t1 === tuple.t1;
    }

    hashCode(): number {
        const strRepresentation = JSON.stringify(this.t1);
        let hash = 0;
        for (let i = 0; i < strRepresentation.length; i++) {
            const char = strRepresentation.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        return hash;
    }
}
