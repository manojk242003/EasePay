import { Link } from "react-router-dom";

export function BottomWarning({label,buttontext,to})
{
    return <div className="text-gray-500">
        {label} 
        <Link to={to} className="text-blue-600">
        {buttontext}</Link>
    </div>
}