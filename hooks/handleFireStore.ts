import {
    doc,
    collection,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
} from "@react-native-firebase/firestore";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { db, auth } from "@/firebase";

// Define interfaces for data structures
interface Car {
    id: string;
    data: {
        name: string;
        offer: string;
        year: string;
        color: string;
        variant: string;
        passing: string;
        km: string;
        insurance: string;
        owner: string;
    };
}

interface Person {
    id: string;
    data: {
        name: string;
        number: string;
    };
}

// Initializing Variables
let userCars: string[] = [];
let userCarsData: Car[] = [];
let userPeople: string[] = [];
let peopleData: Person[] = [];
let userId: string | null;

onAuthStateChanged(auth, (user: any) => {
    if (user) {
        userId = user.uid;
    } else {
        userId = null;
        userCars = [];
        userCarsData = [];
        userPeople = [];
        peopleData = [];
        console.log("User logged out");
    }
});

export const addUserDoc = async (): Promise<any> => {
    const userDoc = await getDoc(doc(db, "users", userId as string));
    if (userDoc.exists) {
        return userDoc.data();
    } else {
        await setDoc(doc(db, "users", userId as string), {});
    }
};

export const getUserCars = async (refresh: boolean): Promise<string[]> => {
    if (userCars.length === 0 || refresh) {
        try {
            const userDoc = await getDoc(doc(db, "users", userId as string));
            userCars = [];
            if (userDoc.exists) {
                userCars = userDoc.data()?.carsID;
            } else {
                console.log("No such document for user:", userId);
                userCars = [];
            }
            return userCars || [];
        } catch (error) {
            console.error("Error getting user cars:", error);
            return [];
        }
    } else {
        return userCars;
    }
};

export const getCarsData = async (refresh: boolean): Promise<Car[]> => {
    if (userCarsData.length === 0 || refresh) {
        userCarsData = [];
        try {
            const userCarsId = await getUserCars(true);
            if (userCarsId && Array.isArray(userCarsId)) {
                for (const carId of userCarsId) {
                    const carDoc = await getDoc(doc(db, "cars", carId));
                    if (carDoc.exists) {
                        userCarsData.push({
                            id: carDoc.id,
                            data: carDoc.data() as Car["data"],
                        });
                    } else {
                        console.log(`No car document found with ID: ${carId}`);
                    }
                }
            }
            return userCarsData || [];
        } catch (error) {
            console.error("Error getting cars data:", error);
            return [];
        }
    } else {
        return userCarsData;
    }
};

export const getCarDetails = async (carId: string): Promise<Car | null> => {
    try {
        const car = userCarsData.find((car) => car.id === carId);
        if (car) {
            return car;
        } else {
            console.log(`No car document found with ID: ${carId}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching car details:", error);
        return null;
    }
};

export const addNewCar = async (
    name: string,
    offer: number,
    year: number,
    color: string,
    variant: string,
    passing: string,
    km: number,
    insurance: string,
    owner: string,
): Promise<void> => {
    try {
        const docRef = await addDoc(collection(db, "cars"), {
            name,
            offer,
            year,
            color,
            variant,
            passing,
            km,
            insurance,
            owner,
        });
        const userRef = doc(db, "users", userId as string);
        await updateDoc(userRef, {
            carsID: arrayUnion(docRef.id),
        });
        updateCarsData();
    } catch (error) {
        console.error("Error adding car: ", error);
    }
};

export const editCar = async (
    carId: string,
    name: string,
    offer: number,
    year: number,
    color: string,
    variant: string,
    passing: string,
    km: number,
    insurance: string,
    owner: string,
): Promise<void> => {
    try {
        await updateDoc(doc(db, "cars", carId), {
            name,
            offer,
            year,
            color,
            variant,
            passing,
            km,
            insurance,
            owner,
        });
        updateCarsData();
    } catch (error) {
        console.error("Error updating car: ", error);
    }
};

export const deleteCar = async (carId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "cars", carId));
        const userDocRef = doc(db, "users", userId as string);
        await updateDoc(userDocRef, {
            carsID: arrayRemove(carId),
        });
        updateCarsData();
    } catch (error) {
        console.error("Error deleting car: ", error);
    }
};

export const getUserPeople = async (refresh: boolean): Promise<string[]> => {
    if (userPeople.length === 0 || refresh) {
        try {
            const userDoc = await getDoc(doc(db, "users", userId as string));
            userPeople = [];
            if (userDoc.exists) {
                userPeople = userDoc.data()?.peopleID;
            } else {
                console.log("No such document for user:", userId);
                userPeople = [];
            }
            return userPeople || [];
        } catch (error) {
            console.error("Error getting user cars:", error);
            return [];
        }
    } else {
        return userPeople;
    }
};
export const getPeopleData = async (refresh: boolean): Promise<Person[]> => {
    if (peopleData.length === 0 || refresh) {
        peopleData = [];
        try {
            const userPeopleId = await getUserPeople(true);
            if (userPeopleId && Array.isArray(userPeopleId)) {
                for (const personId of userPeopleId) {
                    const personDoc = await getDoc(doc(db, "people", personId));
                    if (personDoc.exists) {
                        peopleData.push({
                            id: personId,
                            data: personDoc.data() as Person["data"],
                        });
                    } else {
                        console.log(
                            `No person document found with ID: ${personId}`,
                        );
                    }
                }
            }
            return peopleData || [];
        } catch (error) {
            console.error("Error getting people data:", error);
            return [];
        }
    } else {
        return peopleData;
    }
};

export const getPersonData = async (
    personId: string,
): Promise<Person | null> => {
    if (peopleData.length === 0) await getPeopleData(true);

    try {
        const person = peopleData.find((person) => person.id === personId);
        if (person) {
            return person;
        } else {
            console.log(`No person document found with ID: ${personId}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching person details:", error);
        return null;
    }
};

export const addPerson = async (
    name: string,
    number: number,
): Promise<void> => {
    try {
        const docRef = await addDoc(collection(db, "people"), {
            name,
            number,
        });
        const userRef = doc(db, "users", userId as string);
        await updateDoc(userRef, {
            peopleID: arrayUnion(docRef.id),
        });
        updatePeopleData();
    } catch (error) {
        console.error("Error adding person: ", error);
    }
};

export const editPerson = async (
    personId: string,
    name: string,
    number: string,
): Promise<void> => {
    try {
        await updateDoc(doc(db, "people", personId), {
            name,
            number,
        });
        updatePeopleData();
    } catch (error) {
        console.error("Error updating person: ", error);
    }
};

export const deletePerson = async (personId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "people", personId));
        const userDocRef = doc(db, "users", userId as string);
        await updateDoc(userDocRef, {
            peopleID: arrayRemove(personId),
        });
        updatePeopleData();
    } catch (error) {
        console.error("Error deleting person: ", error);
    }
};

// Subscribers
let carDataSubscribers: (() => void)[] = [],
    peopleDataSubscribers: (() => void)[] = [];

export const subscribeToCarsDataChanges = (
    callback: () => void,
): (() => void) => {
    carDataSubscribers.push(callback);
    return () => {
        carDataSubscribers = carDataSubscribers.filter(
            (subscriber) => subscriber !== callback,
        );
    };
};

const notifyCarsDataSubscribers = (): void => {
    carDataSubscribers.forEach((subscriber) => subscriber());
};

export const updateCarsData = (): void => {
    notifyCarsDataSubscribers();
};

export const subscribeToPeopleDataChanges = (
    callback: () => void,
): (() => void) => {
    peopleDataSubscribers.push(callback);
    return () => {
        peopleDataSubscribers = peopleDataSubscribers.filter(
            (subscriber) => subscriber !== callback,
        );
    };
};

const notifyPeopleDataSubscribers = (): void => {
    peopleDataSubscribers.forEach((subscriber) => subscriber());
};

export const updatePeopleData = (): void => {
    notifyPeopleDataSubscribers();
};
