import React, { useEffect, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import { Avatar } from "@mui/material";
import { Button } from './Button';
import { useState } from 'react';
import axios from 'axios';
export function Users() {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [filter,setFilter] = useState("");

    useEffect(()=>{
        axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`,{
            headers: {
              authorization: "Bearer "+localStorage.getItem('token')
            }
          })
        .then(res  =>{
            setUsers(res.data.user)
        })
        
    },[filter])
    return (
        <div className='mt-4'>
            <div className='flex flex-col justify-center text-xl font-bold ml-6'>
                Users
            </div>
            <div className="my-2 mr-6">
            <input type="text" onChange={(e)=>{
                setFilter(e.target.value)
            }} placeholder="Search users..." className=" ml-4 w-full px-2 py-1 border rounded border-slate-500"></input>
            </div>
            <div>
            {users.map(user => <User user={user} key={user._id}/>)}
            </div>
        </div>
    );
}

function User({ user }) {
    const navigate = useNavigate();
    return (
        <div className='flex justify-between items-center'>
            <div className='ml-4 mt-2 w-auto flex items-center'>
                <Avatar
                    className="text-white"
                    sx={{
                        bgcolor: 'deepPurple[500]',  // Add this if you want a background color
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    {user.firstname[0].toUpperCase()}
                </Avatar>
                <div className='flex flex-col justify-center font-medium ml-2'>
                    {user.firstname} {user.lastname} - {user.username}
                </div>
            </div>
            <div className='flex items-center mt-2 mr-3'>
                <Button onClick={(e)=>{
                    navigate("/send?id="+user._id+"&name="+user.firstname);
                }} label={"Send Money"}/>
            </div>
        </div>
    );
}