import { useEffect, useState } from "react";
import axios from "axios";

export function Balance() {   
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                setBalance(res.data.balance);
            })
            .catch(error => {
                console.error("Error fetching balance:", error);
            });
        } else {
            console.warn("No token found in localStorage");
        }
    }, []);

    return (
        <div className="flex mt-6">
            <div className="flex flex-col justify-center text-xl font-bold ml-6">
                Your balance
            </div>
            <div className="flex flex-col justify-center ml-2 font-medium">
                Rs {balance}
            </div>
        </div>
    );
}
