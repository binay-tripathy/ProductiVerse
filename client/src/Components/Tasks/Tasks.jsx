import React, { useState } from 'react'
import './Tasks.scss'

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const handleAddTask = () => {
    if (taskText.trim() !== '') {
      setTasks([...tasks, taskText]);
      setTaskText('');
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.slice();
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleDoneTask = (index) => {
    const newTasks = tasks.slice();
    // const done = newTasks.slice(index, 1);
    let done = newTasks[index];
    // console.log(newTasks);
    done='\u0336'+done+'\u0336';
  //  setTasks(newTasks);
    console.log(done);
  //   console.log(newTasks);
  };

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
        {tasks.map((task, index) => (
          <li key={index}> {task} <button onClick={() => handleDoneTask(index)}>Done</button> <button onClick={() => handleDeleteTask(index)}>Delete</button></li>
        ))}
      </ul>
    </div>

  )
}

export default Tasks