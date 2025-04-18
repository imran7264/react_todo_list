import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaSun, FaMoon } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import './App.css';
import ConfirmDialog from './components/ConfirmDialog';
import Input from './components/input';
import Button from './components/button';
import { v4 as uuidv4 } from 'uuid';

const RECORDS_PER_PAGE = 4;

function App() {

  const [tasks, setTasks] = useState(() => {
    const storedTask = localStorage.getItem('myTasks');
    let parsedTasks = [];
    try {
      parsedTasks = JSON.parse(storedTask || []);
    } catch (error) {
      console.log(error)
      parsedTasks = [];
    }

    return parsedTasks;
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchTask, setSearchTask] = useState('');
  const [pagNo, setPageNo] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [editTaskName, setEditTaskName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode'
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('myTasks', JSON.stringify(tasks))
  }, [tasks])


  const handlSetName = (e) => {
    const { value } = e.target;
    setName(value);

  }
  const handlSetDescription = (e) => {
    const { value } = e.target
    setDescription(value)
  }

  const handleAddTask = () => {

    if (!name || !description) {
      toast.error('Kindly enter task name and description')
      return;
    }

    const isDuplicateTask = tasks.some(task => task.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase());
    if(isDuplicateTask) {
      toast.error('Task Already Exist');
      return
    }

    const { time, day, dayName, month, year } = getFormattedTime();

    if (editTaskName) {
      const updated = tasks.map(task =>
        task.name === editTaskName
          ? { ...task, name, description, edited: true }
          : task
      );
      toast.success('Edited successfully')
      setTasks(updated);
      setEditTaskName(null)
    }
    else {
      setTasks([
        {
          name,
          description,
          time,
          day,
          dayName,
          month,
          year,
          completed: false
        }, ...tasks
      ])
      toast.success('Task added successfulyy')
    }

    setName('');
    setDescription('');
  }

  const handleOpenModal = (todo) => {
    setTaskToDelete(todo);
    setShowModal(true);
  }

  const confirmDelete = () => {
    handleDeleteTask(taskToDelete)
  }

  const handleDeleteTask = (todo) => {
    const updatedTask = tasks.filter((task) => task.name != todo)
    toast.success('Deleted successfully')
    setTasks(updatedTask);
    setShowModal(false)


  }

  const handleEditTask = (todo) => {
    const editedTask = tasks.find(t => t.name === todo);
    const { name, description } = editedTask;
    if (editedTask) {
      setName(name)
      setDescription(description)
      setEditTaskName(todo);
    }
  }

  const handleSearchTasks = (event) => {
    const { value } = event.target;
    setSearchTask(value)
  }

  const handlCompleteTask = (taskName) => {
    setTasks([
      ...tasks.map(t => {
        if (t.name === taskName) {
          t.completed = !t.completed;

        }
        return t;
      })
    ])
  }

  const getFormattedTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    <input
      type="text"
      value={name}
      placeholder="Add new task..."
      className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none"
      onChange={handlSetName}
    />
    const day = now.toLocaleDateString(undefined, { weekday: 'long' });
    const dayName = now.getDate();
    const month = now.toLocaleDateString(undefined, { month: 'long' })
    const year = now.getFullYear();
    return { time, day, dayName, month, year };
  };


  const filterTask = tasks.filter((task) => {
    if (activeTab === 'todo') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;

  })

  const handlePageChange = (pageNo) => {
    setPageNo(pageNo)
  }

  const totalPage = Math.ceil(filterTask.filter(t => t.name.toLocaleLowerCase().includes(searchTask)).length / RECORDS_PER_PAGE);

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4 flex-col text-white main-container">

      <ConfirmDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title={'Delete Task'}
        message={'Are You Sure You Want To Delete The Task'}
      />

      <div className="bg-white p-4 rounded-2xl shadow-2xl overflow-auto relative todo-container">
        <ToastContainer position='top-right' autoClose={2000} />
        <div className="m-2 text-right">
          <h1 className="text-blue-600 text-xl font-bold mb-4 text-center">My Todo List</h1>

          <Button
            className={'bg-blue-300 px-1 py-1 rounded-md text-sm shadow-md scale-105 toggle-btn'}
            onClick={() => setDarkMode(!darkMode)}
            style={{
              position: 'absolute',
              top: 10,
              right: 15
            }}
          >
            {darkMode ? <FaSun /> : <FaMoon color='black' />}
          </Button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();


        }}>
          <div className="flex mb-2">

            <Input
              value={name}
              onChange={handlSetName}
              className='flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none'
              placeholder={'Enter Task Name'}
            />

            <Button
              type='submit'
              className={'bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition'}
              onClick={handleAddTask}
            >
              {editTaskName ? 'Save' : 'Add'}
            </Button>
          </div>

          <div className="flex mb-4">
            <Input
              value={description}
              onChange={handlSetDescription}
              placeholder={'Enter Task Description'}
              className={'flex-auto border border-gray-300 rounded-lg p-2 focus:outline-none'}
            />
          </div>
        </form>

        <div className="flex justify-between flex-wrap">
          <div className="flex gap-2 mb-3">
            {["all", "todo", "completed"].map((tab) => (

              <Button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPageNo(1);
                }}
                className={`capitalize px-5 py-2 rounded-full font-medium transition
              ${activeTab === tab
                    ? "bg-blue-600 text-white text-sm shadow-md scale-105"
                    : "bg-gray-200 text-gray-700 text-sm hover:bg-gray-300"}`}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="search-container">
            <Input
              onChange={handleSearchTasks}
              value={searchTask}
              className={'border-gray-300 border rounded-lg p-2 focus:outline-none'}
              placeholder={'Search Task By Name'}
            />
          </div>
        </div>

        {filterTask.filter(t => t.name.toLocaleLowerCase().includes(searchTask.toLocaleLowerCase()))
          .slice(((pagNo - 1) * RECORDS_PER_PAGE), pagNo * RECORDS_PER_PAGE)
          .map(({ name, description, completed, edited, day, dayName, time, month, year }) => (


            <div className="text-white text-start px-6 shadow-m transition m-2 p-2 rounded-lg tasks"
              key={uuidv4()}
              style={{
                background: completed ? 'rgba(62, 106, 237, 0.8)' : '#333'
              }}
            >
              <div className="">
                <li className='text-md list-none font-semibold capitalize'
                  style={{
                    textDecoration: completed ? 'line-through' : 'none',
                    textDecorationThickness: 2
                  }}>
                  {name}
                </li>
              </div>

              <div className="flex justify-between">

                <li
                  className="text-sm list-none break-words max-w-lg overflow-hidden mb-1"
                  style={{
                    textDecoration: completed ? 'line-through' : 'none',
                    wordBreak: 'break-word',
                  }}
                >
                  {description}
                </li>

                <div className="btn-container w-32 flex justify-end gap-3">
                  <Button
                    className={'text-white text-md px-1 align-middle rounded-sm max-w-sm transition'}
                    onClick={() => handleOpenModal(name)}
                  >
                    <FaTrash className='text-red-500' title='Delete' />
                  </Button>


                  <Button className='text-white text-md px-1 align-middle rounded-sm max-w-sm transition'
                    onClick={() => handleEditTask(name)}
                    disabled={completed}
                    style={{
                      cursor: completed ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaEdit className='text-cyan-400' title={completed ? "Can't edit Completed task" : "Edit"} />
                  </Button>

                  <Input type="checkbox"
                    onChange={() => handlCompleteTask(name)}
                    checked={completed}
                    className='accent-green-500 w-[15px]'
                  />

                </div>
              </div>

              <div className="flex">
                <li
                  className="list-none italic max-w-lg font-bold"
                  style={{
                    fontSize: 12
                  }}
                >
                  {day} {dayName} {month} {year} {time}
                </li>

                {edited && (
                  <span className='ml-2 text-red-300 text-xs italic font-semibold'>
                    (Edited)
                  </span>
                )}
                {completed && (
                  <span className='ml-2 text-blue-300 text-xs italic font-semibold'>
                    (Completed)
                  </span>
                )}
              </div>

            </div>
          ))}


      </div>
      <div className="mt-2 inline-flex">
        {Array.from({ length: totalPage }, (v, i) => {
          const page = i + 1;
          const isActive = page === pagNo;

          return (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md m-2 text-white transition 
            ${isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} 
            focus:ring-2 focus:ring-offset-2 focus:ring-slate-600`}
            >
              {page}
            </Button>
          );
        })}
      </div>
    </div>


  );
}

export default App
