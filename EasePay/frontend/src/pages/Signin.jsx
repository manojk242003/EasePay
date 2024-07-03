import React, { useState } from 'react'
import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar'
const Signin =  () => {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const navigate=useNavigate()
  const [login_err,setLogin_err]=useState("")

  const handlesignin= async ()=>{
    try
    {  const response= await axios.post("http://localhost:3000/api/v1/user/signin",{
        username,
        password
      })
      
      if(response.data.token === undefined)
      {
        setLogin_err(response.data.msg)
      }
      else
      {
        console.log("sigin succesful")
        localStorage.setItem("token",response.data.token)
        navigate("/dashboard")
      }
      
    }
    catch(err)
    {
      console.log(err)
    }
  }
  return (
    <>
    <AppBar />
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">    
            <div className="rounded-lg bg-white w-90 text-center p-2 h-max px-4">
                <Heading label={"Sign In"}/>
                <SubHeading label={"Enter your credentials to acccess your account"}/>
                <InputBox onChange={(e)=>{
                  setUsername(e.target.value)
                }} label={"Username"}  placeholder={"xyz123"}/>
                <InputBox  onChange={(e)=>{
                  setPassword(e.target.value)
                }} label={"Password"} />
                <div className='pt-6'>
                    <Button onClick={handlesignin} label={"Sign In"}></Button>
                </div>
                <BottomWarning label={"Don't have an account?"} buttontext={"signup"} to={"/signup"}/>
                <div className="text-red-700">{login_err} </div>
             </div>
        </div>
    </div>
    </>
  )
}

export default Signin