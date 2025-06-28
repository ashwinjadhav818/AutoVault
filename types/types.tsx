// types.ts

export interface PersonType {
    id: string;
    name: string;
    number: string;
}

export interface CarType {
    name: string;
    offer: number | null;
    year: number | null;
    color: string;
    variant: string;
    passing: string;
    km: number | null;
    insurance: string;
    owner: string;
    images: string[];
}
