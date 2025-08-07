import logo from './logo.svg';
import './App.css';
import LoginPanel from "./components/pages/Login";
import Home from './components/pages/home';
import Dashboard from './components/pages/Dashboard';
import Signup from './components/pages/SignUp';
import AddTutoring from './components/pages/AddTutoring';
import PastTutorings from './components/pages/PastTutorings';
import CancelReservation from './components/pages/CancelReservation';
import StudentList from './components/pages/StudentList';
import TutoringCalendar from './components/pages/TutoringCalendar';
import TutoringReservation from './components/pages/TutoringReservation';
import EditProfile from './components/pages/EditProfile';
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
      <Route path='/cancel_reservation' element={<CancelReservation />} />
      <Route path='/student_list' element={<StudentList />} />
      <Route path='/tutoring_calendar' element={<TutoringCalendar />} />
      <Route path='/tutoring_reservation/:tutoringId' element={<TutoringReservation />} />
      <Route path='/edit_profile/:teacherId' element={<EditProfile/>} />
    </Routes>
  );
}

export default App;
