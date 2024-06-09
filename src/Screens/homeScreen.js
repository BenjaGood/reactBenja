import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../firebase'; // Asegúrate de que la ruta sea correcta
import { onAuthStateChanged } from 'firebase/auth';

function HomeScreen({ username }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async (userEmail) => {
      try {
        const userTasksSnapshot = await getDocs(collection(firestore, 'tasks', userEmail, 'user_tasks'));
        const userTasks = userTasksSnapshot.docs.map(taskDoc => taskDoc.data());
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Error fetching tasks');
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTasks(user.email);
      }
    });
  }, []);

  return (
    <div>
      <h1>Bienvenido a la página de inicio para USUARIO</h1>
      <p>¡Has iniciado sesión correctamente, {username}!</p>
      <h2>Tus Tareas:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>No tienes tareas.</p>
      ) : (
        tasks.map((task, index) => (
          <div key={index}>
            <p><strong>{task.name}</strong> - Due on {task.due_date} - {task.priority} Priority</p>
            <p>Descripción: {task.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default HomeScreen;
