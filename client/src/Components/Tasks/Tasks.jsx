import React, { useState } from 'react'
import './Tasks.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

  const onDragEnd = (result) => {
    if (!result.destination) return; 
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  }

  return (
    <div className="todo-list-container">
      <h2>Todo List</h2>
      <div className="task-input">
        <input type="text" value={taskText} onKeyPress={handleEnter} onChange={(e) => setTaskText(e.target.value)} placeholder="Add a task" />
        <button id='addTask' onClick={handleAddTask}>Add</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks" type='group'>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <ul className='DND task-list'>
                <h4>Tasks</h4>
                {tasks.map((task, index) => (
                  <Draggable key={index} draggableId={`task-${index}`} index={index}>
                    {(provided) => (
                      <li className='task-item' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {task}
                        <button className='actions' onClick={() => handleDoneTask(index)}><FontAwesomeIcon icon={faCheck} /></button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ul className='completed-tasks'>
        <h4>Completed Tasks</h4>
        {done.map((task, index) => (
          <li className='completed-task' key={index}>
            {task}
            <span>
              <button className='actions' onClick={() => handleUndoTask(index)}><FontAwesomeIcon icon={faRotateLeft} /></button>
              <button className='actions' onClick={() => handleDeleteTask(index)}><FontAwesomeIcon icon={faTrash} /></button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tasks