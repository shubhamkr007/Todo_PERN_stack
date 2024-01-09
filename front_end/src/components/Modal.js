import React, { useState } from 'react'
import {useCookies} from 'react-cookie';

const Modal = ({mode, setShowModal, task, getData}) => {

  const [cookie, setCookie, removeCookie] = useCookies('');
  const editMode = mode ==="edit" ? true : false;
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookie.Email,
    title: editMode ? task.title : undefined ,
    progress: editMode ? task.progress: "50",
    date: editMode ? task.date: new Date()
  })


  const handleChange = (e)=>{
    // console.log("dfghjkjhgcgh")
    const {name , value} = e.target;
    setData((prev) => ({...prev, [name]:value}))

    // console.log(data);
  }

  const postData = async (e)=>{
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/todos`,{
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
      })

      if(response.status === 200){
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const editDate = async (e)=>{
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/todos/${task.id}`,{
        method:"PUT",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
      })

      if(response.status === 200){
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='form-title-container'>
          <h3>Let' {mode} You a Task</h3>
          <button onClick={()=> setShowModal(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>
          </button>
        </div>

        <form>
          <input 
          required maxLength={30} 
          placeholder='Your task goes here' 
          name='title'
          value={data.title}
          onChange={handleChange}
          />
          <br />
          <label htmlFor='range'>Drag to select your current progress</label>
          <input required
           type="range"
           id='range'
           min="0"
           max="100"
           name='progress'
           value={data.progress}
           onChange={handleChange}
          />
          <input className={mode} onClick={editMode ? editDate : postData} type="submit"/>
        </form>
      </div>
    </div>
  )
}

export default Modal