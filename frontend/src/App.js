// App.js
import React, { useEffect, useState } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async () => {
    await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, priority }),
    });
    fetchTasks();
    setTitle('');
    setDescription('');
  };

  const toggleCompletion = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
    });
    fetchTasks();
  };

  return (
    <div>
      <h1>タスク管理アプリaa</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タスク名" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="詳細" />
      <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} min="1" max="5" />
      <button onClick={addTask}>追加</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
            <button onClick={() => toggleCompletion(task.id)}>完了</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;