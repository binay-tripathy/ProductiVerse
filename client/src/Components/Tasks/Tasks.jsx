import React, { useState } from 'react'
import './Tasks.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [done, setDone] = useState([]);

  const handleAddTask = () => {
    if (taskText.trim() !== '') {
      setTasks([...tasks, taskText]);
      setTaskText('');
    }
  };

  const handleDeleteTask = (index) => {
    const newDone = done.slice();
    newDone.splice(index, 1);
    setDone(newDone);
  };

  const handleDoneTask = (index) => {
    const newTasks = tasks.slice();
    const completed = newTasks.splice(index, 1);
    setDone([...done, completed]);
    setTasks(newTasks);
  };

  const handleUndoTask = (index) => {
    const Dones = done.slice();
    let temp = Dones[index];
    setTasks([...tasks, temp]);
    Dones.splice(index, 1);
    setDone(Dones);
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('addTask').click();
    }
  }

  return (

    <div className="todo-list-container">
      <h2>Todo List</h2>
      <div className="task-input">
        <input type="text" value={taskText} onKeyPress={handleEnter} onChange={(e) => setTaskText(e.target.value)} placeholder="Add a task" />
        <button id='addTask' onClick={handleAddTask}>Add</button>
      </div>
      <ul>
        <h4>Tasks</h4>
        {tasks.map((task, index) => (
          <li key={index}>
            {task}
              <button onClick={() => handleDoneTask(index)}><FontAwesomeIcon icon={faCheck} /></button>
          </li>
        ))}
      </ul>
      <ul>
        <h4>Completed Tasks</h4>
        {done.map((task, index) => (
          <li key={index}>
            {task}
            <span>
              <button onClick={() => handleUndoTask(index)}><FontAwesomeIcon icon={faRotateLeft} /></button>
              <button onClick={() => handleDeleteTask(index)}><FontAwesomeIcon icon={faTrash} /></button>
            </span>
          </li>
        ))}
      </ul>
    </div>

  )
}

export default Tasks
