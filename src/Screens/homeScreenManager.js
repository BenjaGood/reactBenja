import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase'; // Asegúrate de que la ruta sea correcta

function HomeScreenManager({ username }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'usuarios'));
        let allTasks = [];
        const userEmails = [];

        // Itera sobre los documentos de usuarios
        for (const userDoc of usersSnapshot.docs) {
          const userEmail = userDoc.data().correo;

          if (!userEmails.includes(userEmail)) {
            userEmails.push(userEmail);

            const userTasksSnapshot = await getDocs(collection(firestore, 'tasks', userEmail, 'user_tasks'));
            const userTasks = userTasksSnapshot.docs.map(taskDoc => ({
              user: userEmail,
              ...taskDoc.data()
            }));

            allTasks = [...allTasks, ...userTasks];
          }
        }

        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Error fetching tasks');
      }
    };

    fetchAllTasks();
  }, []);

  return (
    <div>
      <h1>Bienvenido a la página de inicio para MANAGER</h1>
      <p>¡Has iniciado sesión correctamente, {username}!</p>
      <h2>Tareas de Todos los Usuarios:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        tasks.map((task, index) => (
          <div key={index}>
            <h3>USUARIO: {task.user.split('@')[0]}</h3>
            <p>{task.user}</p>
            <p><strong>{task.name}</strong> - Due on {task.due_date} - {task.priority} Priority</p>
            <p>Descripción: {task.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default HomeScreenManager;
