import React, { useState } from 'react'
import {useCookies} from 'react-cookie';

const Auth = () => {

  const [cookie, setCookie, removeCookie] = useCookies('');
  const [isLogIn, setLogIn]= useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(undefined);

  const viewLogin = (status)=>{
    setError(undefined);
    setLogIn(status);
  }

  const handleSubmit =async (e, endpoint)=>{
    e.preventDefault();

    if(!isLogIn && password !== confirmPassword){
      setError('Make sure passwords Match!')
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_SERVER}/${endpoint}`,{
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({email, password})
    })

    console.log(cookie);
    const data = await response.json()
    console.log(data);
    if(data?.detail)
      setError(data.detail);
    else{
      setCookie('Email', data.email);
      setCookie('AuthToken', data.token);
      window.location.reload();
    }
  }

  return (
    <div className='auth-container'>
      <div className="auth-container-box">
        <form onSubmit={(e)=> handleSubmit(e, isLogIn ? 'login' : 'signup')} >
          <h2>{isLogIn ? 'Please Log In': 'Please Sign Up'}</h2>
          <input type="email" required placeholder='email' onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" required placeholder='password' onChange={(e)=>setPassword(e.target.value)}/>
          {!isLogIn && <input type="password" required placeholder='confirm password' onChange={(e)=>setConfirmPassword(e.target.value)}/>}
          <input type="submit" style={{cursor: "pointer"}} className='create'/>
          {error && <p>{error}</p>}
        </form>
      </div>
      <div className='auth-options'>
        <button onClick={()=>viewLogin(false)}
        style={{backgroundColor: !isLogIn ? 'rgb(255,255,255)': 'rgb(188, 188, 188)'}}
        >Sign Up</button>
        <button onClick={()=> viewLogin(true)}
        style={{backgroundColor: !isLogIn ? 'rgb(188, 188, 188)': 'rgb(255,255,255)'}}
        >LogIn</button>
      </div>
    </div>
  )
}

export default Auth