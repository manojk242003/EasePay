import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {Menu, MenuItem ,Avatar} from "@mui/material";

export function AppBar()
{   
    const token=localStorage.getItem("token")
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = ()=>{
        alert("are you sure you want to logout")
        localStorage.removeItem("token")
        navigate("/")
    }

    const [firstname,setFirstname]=useState("")
    const [user,setUser]=useState({})
    const navigate= useNavigate()
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/user/me",{
            headers:{
                Authorization: "Bearer "+localStorage.getItem('token')
            }
        })
        .then(res =>{
            setUser(res.data.user)
            setFirstname(res.data.user.firstname)
        })
    },[])
    
    return <div className="flex  justify-between shadow h-14">
        <div onClick={()=>{
            navigate("/")
        }} className="flex flex-col font-semi-bold text-2xl cursor-pointer ml-4 mt-3">
            PayTM App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                {user.firstname} {user.lastname}
            </div>
            {/* <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="cursor-pointer flex flex-col justify-center h-full text-xl">
                {firstname && firstname[0].toUpperCase()}
                </div>
            </div> */}
            <div className="flex flex-col justify-center mr-10">
                {token && (<Avatar
                            className="text-white"
                            onClick={handleClick}
                            aria-controls = {open ? "basic-menu" : undefined}
                            aria-haspopup = "true"
                            aria-expanded = {open ? "true" : undefined} 
                            // sx={{
                            //   bgcolor: deepPurple[500],
                            //   color:"white",
                            //   cursor:"pointer"
                            // }}
                            >
                            {firstname && firstname[0].toUpperCase()}
                </Avatar> )}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Transactions</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
            
        </div>
    </div>
}