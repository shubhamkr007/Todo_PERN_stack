import { useEffect, useState } from 'react';
import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import Auth from './components/Auth';
import {useCookies} from 'react-cookie';

function App() {

  const [tasks, setTasks] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies('');
  const userEmail = cookie.Email;

  const authToken = cookie.AuthToken;

  const getData  = async ()=>{
    try {
      const response = await fetch (`${process.env.REACT_APP_SERVER}/todos/${userEmail}`, {
        method: 'GET'
      });
      const  json =await response.json();
      // console.log(json)
      setTasks(json);
    } catch (error) {
        console.log(error);
    }
  }

  const sortedTasks = tasks?.sort((a,b)=> new Date(a.date) - new Date(b.date)); 

  useEffect(()=>{
    if(authToken) {
      getData();
    }
  },[])
  return (
    <div className='app' >
      {!authToken && <Auth/>}
      {authToken && <>
      <ListHeader listName={'🌴 Holiday Tick List'} getData={getData}/>
      <p className='user-email'>{userEmail}</p>
      {sortedTasks?.map((task)=>  <ListItem getData={getData} key={task.id} task={task}/>)}
      </>}
    </div>
  );
}

export default App;
