// db.ts
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

const dbName = 'huddleBoard';
const dbVersion = 1; // Increment version number to trigger an upgrade

let db: any;

export interface EventData {
    id?: string; // random key
    event_type: string;
    output: string;
    misc_info: string; // stores a string value
    // Add other properties as needed
    [key: string]: any;
}

export async function initDB() {
    db = await openDB(dbName, dbVersion, {
        upgrade(db, oldVersion, newVersion, transaction) {

            // Create object store for event data
            if (!db.objectStoreNames.contains('event-data')) {
                const eventDataStore = db.createObjectStore('event-data', {
                    keyPath: 'id',
                });
            }

            // Create object store for other data
            if (!db.objectStoreNames.contains('other-data')) {
                const otherDataStore = db.createObjectStore('other-data', {
                    keyPath: 'id',
                });
                otherDataStore.createIndex('someIndex', 'someField');
            }

            // Add more object stores as needed
        },
    });
}

export async function addEventData(eventData: EventData) {
    if (!db) {
        await initDB();
    }
    const tx = db.transaction('event-data', 'readwrite');
    const store = tx.objectStore('event-data');
    await store.add({ id: uuidv4(), ...eventData });
    await tx.done;
}

export async function getAllEventData(): Promise<EventData[]> {
    if (!db) {
        await initDB();
    }
    try {
        const tx = db!.transaction('event-data', 'readonly');
        const store = tx.objectStore('event-data');
        const eventData: EventData[] = [];

        const allData = await store.getAll();
        allData.forEach((data: any) => {
            eventData.push({
                id: data.id,
                event_type: data.event_type,
                output: data.output,
                misc_info: data.misc_info,
            });
        });

        return eventData;
    } catch (error) {
        console.error('Error getting all event data:', error);
        return []; // Return an empty array on error
    }
}

export async function addOtherData(otherData: any) {
    if (!db) {
        await initDB();
    }
    const tx = db.transaction('other-data', 'readwrite');
    const store = tx.objectStore('other-data');
    await store.add({ ...otherData });
    await tx.done;
}

export async function getAllOtherData(): Promise<any[]> {
    if (!db) {
        await initDB();
    }
    try {
        const tx = db!.transaction('other-data', 'readonly');
        const store = tx.objectStore('other-data');
        const otherData: any[] = await store.getAll();
        return otherData;
    } catch (error) {
        console.error('Error getting all other data:', error);
        return []; // Return an empty array on error
    }
}


// Function to clear all data from all object stores
// Function to clear all data from all object stores
export async function clearDB(): Promise<void> {
    if (!db) {
        await initDB();
    }
    try {
        const storeNames: string[] = Array.from(db.objectStoreNames) as string[];
        const tx = db.transaction(storeNames, 'readwrite');

        storeNames.forEach((storeName) => {
            const store = tx.objectStore(storeName);
            store.clear();
        });

        await tx.done;
    } catch (error) {
        console.error('Error clearing the database:', error);
    }
}