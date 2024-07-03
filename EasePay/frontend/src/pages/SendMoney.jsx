import React, { useState } from 'react'
import { Heading } from '../components/Heading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { Avatar } from "@mui/material";
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const name=searchParams.get('name')
  const id=searchParams.get('id')
  const [amount,setAmount]=useState(0)

  const handletransaction = async () => {
    const token = localStorage.getItem('token');
  
    if (!id || !amount || amount <= 0) {
      alert('Please enter a valid amount and ensure recipient ID is present.');
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
        to: id,
        amount: Number(amount) // Ensure amount is a number
      }, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
  
      console.log('Transaction successful:', response.data);
      alert('Transaction successful');
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      alert('Transaction failed. Please check the console for more details.');
    }
  };
  
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center lg:w-2/5 ">    
            <div className="rounded-lg bg-white w-90 text-center p-2 h-max px-4 ">
                <Heading label={"Send Money"}/>
                <div className='flex'>
                  <Avatar
                      className="text-white m-4 flex flex-col justify-center"
                      sx={{
                          backgroundColor: 'rgba(34, 197, 94, 1)', // Same as bg-green-500
                          color: 'white',
                          cursor: 'pointer'
                      }}
                  >
                      {name[0].toUpperCase()}
                  </Avatar>
                  <div className='text-xl font-semi-bold flex flex-col justify-center'>
                        {name.toUpperCase()}
                  </div>
                </div>
                <InputBox onChange={(e)=>{
                  setAmount(e.target.value)
                }} label={"Amount in Rs"} />
                <button onClick={handletransaction} className=" justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white mt-2">
                        Initiate Transfer
                </button>
             </div>
        </div>
    </div>
  )
}

export default SendMoney
