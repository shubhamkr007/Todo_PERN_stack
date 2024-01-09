import React from 'react'

const TickIcon = ({task, getData}) => {
  
  let data={
    user_email: task.user_email,
    title: task.title,
    progress:  "",
    date: new Date()
  }

  const setCompleted = async () =>{
    data.progress = '100';
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/todos/${task.id}`,{
        method:"PUT",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
      })

      if(response.status === 200){
        getData();
      }
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(task)

  if(task.progress ===   100){
    return  <img width="30" style={{marginRight: '10px'}} height="30" src="https://img.icons8.com/cute-clipart/64/double-tick.png" alt="double-tick"/>
  }
  else{
    return <img width="30" onClick={()=>setCompleted()} style={{marginRight: '5px', cursor: 'pointer'}} height="30" src="https://img.icons8.com/color-glass/48/true-false.png" alt="true-false"/>
  }
}

export default TickIcon 
