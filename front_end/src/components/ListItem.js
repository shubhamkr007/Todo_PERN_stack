import React, { useState } from 'react'
import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar'
import Modal from './Modal';


const ListItem = ({task, getData}) => {

  const [showModal, setShowModal] = useState(false);

  const deleteTodo = async ()=>{
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/todos/${task.id}`,{
        method: "DELETE"
      })

      if(response.status === 200){
        getData();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <li className='list-item'>
      <div className='info-container'>
        <TickIcon progress={task.progress} task={task} getData={getData}/>
        <p className='task-title'>
          {task.progress === 100 ? <strike>{task.title}</strike> : task.title}
          </p>
        <ProgressBar progress={task.progress}/>  
      </div>
      <div className='button-container'>
        <button className='edit' onClick={()=> setShowModal(true)}>EDIT</button>
        <button className='delete' onClick={()=> deleteTodo()}>DELETE</button>
      </div>
      {showModal && <Modal mode={'edit'} setShowModal = {setShowModal} task={task} getData={getData}/>}
    </li>
  )
}

export default ListItem