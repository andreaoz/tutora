import { useEffect, useState } from 'react';
import'../style/style.css'
import avatars from '../avatars/avatar_list.js';

const TeacherHeader = () => {

    const logout = async (e) => {
    e.preventDefault();
    let logout_url = window.location.origin+"/backend/logout";
    
    try {
        const res = await fetch(logout_url, { method: "GET" });
        if (res.ok) {
        window.location.href = "/login"; 
        } else {
        console.error("Logout failed.");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

    const getIconSrc = (iconId) => {
        console.log("Avatar ID recibido:", iconId);
        const id = Number(iconId);
        const foundIcon = avatars.find(icon => icon.id === id);
        console.log("Icono encontrado:", foundIcon);
        if (!foundIcon) {
            return avatars.find(icon => icon.id).src;
        }
        return foundIcon.src;
    };
    
    const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/backend/dashboard') // o la ruta donde tengas tu vista
      .then((res) => res.json())
      .then((json) => setData(json));

  }, []);

  if (!data) return <p>Loading...</p>;

  const { teacher } = data;

  console.log(data);

  return(
    <div>
      {/* Navbar */}
    <nav className="navbar navbar-dark bg-green shadow-sm w-100">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-light"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarMenu"
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="d-flex align-items-center ms-auto">
            <a className="btn btn-success text-light" type="button" href="/dashboard">
              {teacher?.name?.charAt(0).toUpperCase() + teacher?.name?.slice(1).toLowerCase()}{" "}
              {teacher?.last_name?.charAt(0).toUpperCase() + teacher?.last_name?.slice(1).toLowerCase()}
            </a>
            <img
              src={getIconSrc(teacher.avatar)}
              alt="profile"
              className="profile-pic-navbar"
            />
        </div>
      </div>
    </nav>

      {/* Sidebar */}
    <div className="offcanvas offcanvas-start text-bg-dark" id="sidebarMenu">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">Tutora</h5>
        <button className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body d-grid gap-3">
        <a className="btn btn-secondary d-flex align-items-center gap-2" href="/dashboard">
          <i className="bi bi-grid"></i>
          Teacher Dashboard
        </a>
        <a className="btn btn-secondary d-flex align-items-center gap-2" href="/add_tutoring">
          <i className="bi bi-calendar-plus"></i>
          Add Tutoring Schedule
        </a>
        <a className="btn btn-secondary d-flex align-items-center gap-2" href="/past_tutorings">
          <i className="bi bi-journal-text"></i>
          Past Tutorings
        </a>
        <a className="btn btn-secondary d-flex align-items-center gap-2" href="/student_list">
          <i className="bi bi-search"></i>
          Find Student
        </a>
        <a className="btn btn-secondary d-flex align-items-center gap-2" href={`/edit_profile/${teacher.id}`}>
          <i className="bi bi-pencil-square"></i>
          Edit Profile
        </a>
        <a className="btn btn-signup d-flex align-items-center gap-2" href="#" onClick={logout}>
          <i className="bi bi-box-arrow-right"></i>
          Sign Out
        </a>
      </div>
    </div>


    </div>
  );

}

export default TeacherHeader
