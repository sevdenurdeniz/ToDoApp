import { db, ref, get } from './firebase.js';

const testConnection = async () => {
  const todosRef = ref(db, 'todos');
  try {
    const snapshot = await get(todosRef);
    console.log("Connection successful!", snapshot.val());
  } catch (error) {
    console.error("Error connecting to Firebase:", error);
  }
};

testConnection();