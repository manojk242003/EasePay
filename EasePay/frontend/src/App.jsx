import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import LandingPage from "./pages/LandingPage";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/send" element={<SendMoney/>}></Route>
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
