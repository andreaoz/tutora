import logo from './logo.svg';
import './App.css';
import LoginPanel from "./components/pages/Login";
import Home from './components/pages/home';
import Dashboard from './components/pages/Dashboard';
import Signup from './components/pages/SignUp';
import AddTutoring from './components/pages/AddTutoring';
import PastTutorings from './components/pages/PastTutorings';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/add_tutoring' element={<AddTutoring />} />
      <Route path='/past_tutorings' element={<PastTutorings />} />
    </Routes>
  );
}

export default App;
