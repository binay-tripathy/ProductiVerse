import { useState, useEffect } from 'react'
import './Tasks.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getMultipleFromStorage, saveMultipleToStorage } from '../../utils/chromeAPI';
import BackButton from '../BackButton/BackButton';

const SortableTaskItem = ({ task, index, onComplete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`task-item ${isDragging ? 'dragging' : ''}`}
    >
      <span 
        className="task-text"
        {...attributes}
        {...listeners}
      >
        {task.text}
      </span>
      <button
        className="actions"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onComplete(index);
        }}
        title="Mark as completed"
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </li>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [done, setDone] = useState([]);
  const [taskIdCounter, setTaskIdCounter] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const result = await getMultipleFromStorage(['tasks', 'completedTasks', 'taskIdCounter']);
        const normalizeTasks = (taskList) => {
          return (taskList || []).map(task => {
            if (typeof task === 'string') {
              return { id: `task-${Date.now()}-${Math.random()}`, text: task };
            }
            return task;
          });
        };
        if (result.tasks) setTasks(normalizeTasks(result.tasks));
        if (result.completedTasks) setDone(normalizeTasks(result.completedTasks));
        if (result.taskIdCounter) setTaskIdCounter(result.taskIdCounter);
      } catch (error) {
        console.warn('Failed to load tasks from storage:', error);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || done.length > 0 || taskIdCounter > 0) {
      saveMultipleToStorage({
        tasks,
        completedTasks: done,
        taskIdCounter
      });
    }
  }, [tasks, done, taskIdCounter]);

  const handleAddTask = () => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: `task-${Date.now()}-${Math.random()}`,
        text: taskText.trim()
      };
      setTasks([...tasks, newTask]);
      setTaskIdCounter(taskIdCounter + 1);
      setTaskText('');
    }
  };

  const handleDeleteTask = (index) => {
    const newDone = [...done];
    newDone.splice(index, 1);
    setDone(newDone);
  };

  const handleDoneTask = (index) => {
    const newTasks = [...tasks];
    const completed = newTasks.splice(index, 1)[0];
    setDone([...done, completed]);
    setTasks(newTasks);
  };

  const handleUndoTask = (index) => {
    const newDone = [...done];
    const task = newDone.splice(index, 1)[0];
    setDone(newDone);
    setTasks([...tasks, task]);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="todo-list-container">
      <BackButton />
      <div className="task-header">
        <h2>Todo List</h2>
      </div>
      <div className="task-content">
        <div className="task-input-section">
          <div className="task-input">
            <input
              type="text"
              value={taskText}
              onKeyPress={handleEnter}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task..."
            />
            <button onClick={handleAddTask}>Add</button>
          </div>
        </div>

        <div className="tasks-section">
          <div className="section-header">
            <h4>
              Active Tasks 
              {tasks.length > 0 && <span className="task-count">{tasks.length}</span>}
            </h4>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              <ul className="task-list">
                {tasks.length === 0 ? (
                  <p className="empty-list">No tasks yet. Add some tasks to get started!</p>
                ) : (
                  tasks.map((task, index) => (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      index={index}
                      onComplete={handleDoneTask}
                    />
                  ))
                )}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <div className="completed-section">
          <div className="section-header">
            <h4>
              Completed 
              {done.length > 0 && <span className="task-count">{done.length}</span>}
            </h4>
          </div>
          <ul className="completed-tasks">
            {done.length === 0 ? (
              <p className="empty-completed">No completed tasks yet.</p>
            ) : (
              done.map((task, index) => (
                <li className="completed-task" key={task.id || `done-${index}`}>
                  <span className="task-text">{task.text}</span>
                  <span>
                    <button
                      className="actions"
                      onClick={() => handleUndoTask(index)}
                      title="Move back to tasks"
                    >
                      <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                    <button
                      className="actions"
                      onClick={() => handleDeleteTask(index)}
                      title="Delete task"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Tasks;
