import logo from './logo.svg';
import './App.css';
import LoginPanel from "./components/pages/login"
import Home from './components/pages/home';
import Dashboard from './components/pages/dashboard';
import Signup from './components/pages/SignUp';
import AddTutoring from './components/pages/AddTutoring';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/add_tutoring' element={<AddTutoring />} />
    </Routes>
  );
}

export default App;
