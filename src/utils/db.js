import { openDB } from 'idb';

const DB_NAME = 'QuizApp';
const STORE_NAME = 'attempts';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveAttempt = async (attempt) => {
  const db = await initDB();
  return db.put(STORE_NAME, attempt);
};

export const getAttempts = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

//Please,I really want this internship due to my family condition 