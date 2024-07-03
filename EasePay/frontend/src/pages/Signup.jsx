import React, { useState } from 'react'
import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar'

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        username:username,
        firstname:firstName,
        lastname:lastName,
        password:password
      });
      console.log('Signup successful:', response.data);
      localStorage.setItem("token",response.data.token)
      navigate("/dashboard")
      // storing the jwt in local storagee
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Error request:', error.request);
      } else {
        // Something else happened
        console.error('Error message:', error.message);
      }
    }
  }

  return (
    <>
    <AppBar/>
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">    
            <div className="rounded-lg bg-white w-120 text-center p-2 h-max px-4">
                <Heading label={"Signup"}/>
                <SubHeading label={"Enter your info to create an account"}/>
                <InputBox onChange={e => setFirstName(e.target.value)} label={"First Name"} placeholder={"Enter first name"}/>
                <InputBox onChange={e => setLastName(e.target.value)} label={"Last Name"} placeholder={"Enter your last name"}/>
                <InputBox onChange={e => setUsername(e.target.value)} label={"E-mail"} placeholder={"xyz@gmail.com"}/>
                <InputBox onChange={e => setPassword(e.target.value)} label={"Password"} type="password"/>
                <div className='pt-6'>
                    <Button onClick={handleSignup} label={"Sign Up"}></Button>
                </div>
                <BottomWarning label={"Already have an account?"} buttontext={"Sign In"} to={"/signin"}/>
             </div>
        </div>
    </div>
    </>
  )
}

export default Signup
