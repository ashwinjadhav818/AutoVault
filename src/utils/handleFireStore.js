import { doc, collection, getDoc, addDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "@react-native-firebase/firestore"; import { onAuthStateChanged } from "@react-native-firebase/auth";
import { db, auth } from "../../firebase";

// Initilizing Varaibles
let userCars = [], userCarsData = [], userPeople = [], peopleData = [];
let userId;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userId = user.uid;
        // Proceed with your code
    } else {
        // User is signed out
        userId = null;
        userCars = [];
        userCarsData = [];
        userPeople = [];
        peopleData = [];
    }
});

export const addUserDoc = async () => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists) {
        console.log("User exists:", userDoc.data());
        return userDoc.data(); // Return the user data if it exists
    } else {
        await setDoc(doc(db, "users", userId));
    }
}

// Cars CRUD (Create, Read, Update, Delete)
export const getUserCars = async (refresh) => {
    if (userCars.length === 0 || refresh) {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            userCars = [];
            if (userDoc.exists) {
                userCars = userDoc.data().carsID;
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
}

export const getCarsData = async (refresh) => {
    if (userCarsData.length === 0 || refresh) {
        userCarsData = [];
        try {
            const userCarsId = await getUserCars(userId);
            for (const carId of userCarsId) {
                const carDoc = await getDoc(doc(db, "cars", carId));
                if (carDoc.exists) {
                    userCarsData.push({ id: carDoc.id, data: carDoc.data() });
                } else {
                    console.log(`No car document found with ID: ${carId}`);
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
}

export const getCarDetails = async (carId) => {
    try {
        // Find the car in userCarsData
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
}

export const addNewCar = async (name, offer, year, color, variant, passing, km, insurance, owner) => {
    try {
        const docRef = await addDoc(collection(db, "cars"), {
            name: name,
            offer: offer,
            year: year,
            color: color,
            variant: variant,
            passing: passing,
            km: km,
            insurance: insurance,
            owner: owner
        });
        // Update the user document to add the new car ID to the carsId array
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            carsID: arrayUnion(docRef.id)
        });

        // Refetch the data
        updateCarsData();
    } catch (error) {
        console.error("Error adding car: ", error);
    }
}

export const editCar = async (carId, name, offer, year, color, variant, passing, km, insurance, owner) => {
    try {
        await updateDoc(doc(db, "cars", carId), {
            name: name,
            offer: offer,
            year: year,
            color: color,
            variant: variant,
            passing: passing,
            km: km,
            insurance: insurance,
            owner: owner
        });

        // Refetch the data
        updateCarsData();
    } catch (error) {
        console.error("Error updating car: ", error);
    }
}

export const deleteCar = async (carId) => {
    try {
        // Delete the car document
        await deleteDoc(doc(db, "cars", carId));

        // Remove the carId from the user's carsId array
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            carsID: arrayRemove(carId)
        });

        // Refetch the data
        updateCarsData();
    } catch (error) {
        console.error("Error deleting car: ", error);
    }
}

export const getUserPeople = async () => {
    userPeople = [];
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists) {
            userPeople = userDoc.data().peopleID || [];
        } else {
            console.log("No such document for user:", userId);
            userPeople = [];
        }
        return userPeople;
    } catch (error) {
        console.error("Error getting user peole:", error);
        return [];
    }
}

export const getPeopleData = async (refresh) => {
    if (peopleData.length === 0 || refresh) {
        peopleData = [];
        try {
            const userPeopleId = await getUserPeople(userId);
            for (const personId of userPeopleId) {
                const personDoc = await getDoc(doc(db, "people", personId));
                if (personDoc.exists) {
                    peopleData.push({ id: personDoc.id, data: personDoc.data() });
                } else {
                    console.log(`No person document found with ID: ${peopleId}`);
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
}

export const getPersonData = async (personId) => {
    try {
        // Find the person data in peopleData
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
}

export const addPerson = async (name, number) => {
    try {
        const docRef = await addDoc(collection(db, "people"), {
            name: name,
            number: number
        });
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            peopleID: arrayUnion(docRef.id)
        });

        // Refetch the data
        updatePeopleData();
    } catch (error) {
        console.error("Error adding person: ", error);
    }
}

export const editPerson = async (personId, name, number) => {
    try {
        await updateDoc(doc(db, "people", personId), {
            name: name,
            number: number
        });

        // Refetch the data
        updatePeopleData();
    } catch (error) {
        console.error("Error updating person: ", error);
    }
}

export const deletePerson = async (personId) => {
    try {
        // Delete the person document
        await deleteDoc(doc(db, "people", personId));

        // Remove the personId from the user's peopleId array
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            peopleID: arrayRemove(personId)
        });

        // Refetch the data
        updatePeopleData();
    } catch (error) {
        console.error("Error deleting person: ", error);
    }
}

// Subscribers
let carDataSubscribers = [], peopleDataSubscribers = [];

export const subscribeToCarsDataChanges = (callback) => {
    carDataSubscribers.push(callback);

    // Return an unsubscribe function
    return () => {
        carDataSubscribers = carDataSubscribers.filter(subscriber => subscriber !== callback);
    };
};

const notifyCarsDataSubscribers = () => {
    carDataSubscribers.forEach(subscriber => subscriber());
};

export const updateCarsData = () => {
    notifyCarsDataSubscribers();
};


export const subscribeToPeopleDataChanges = (callback) => {
    peopleDataSubscribers.push(callback);

    // Return an unsubscribe function
    return () => {
        peopleDataSubscribers = peopleDataSubscribers.filter(subscriber => subscriber !== callback);
    };
};

const notifyPeopleDataSubscribers = () => {
    peopleDataSubscribers.forEach(subscriber => subscriber());
};

export const updatePeopleData = () => {
    notifyPeopleDataSubscribers();
};
