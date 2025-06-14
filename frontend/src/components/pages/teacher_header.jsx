import { useEffect, useState } from 'react';
import'../style/style.css'
import defaultAvatar from '../style/default_avatar.jpg';

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
    
    const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/backend/dashboard') // o la ruta donde tengas tu vista
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <p>Loading...</p>;

  const { teacher } = data;

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
          <span className="me-2 fw-semibold text-light fs-5">
            {teacher.name.charAt(0).toUpperCase() + teacher.name.slice(1).toLowerCase()}{" "}
            {teacher.last_name.charAt(0).toUpperCase() + teacher.last_name.slice(1).toLowerCase()}
          </span>
          <img
            src={teacher.profile_pic || defaultAvatar}
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
        <a className="btn btn-secondary d-flex align-items-center gap-2" href="/newtutoring">
          <i className="bi bi-calendar-plus"></i>
          Add tutoring schedule
        </a>
        <a className="btn btn-secondary d-flex align-items-center gap-2" href="/tutoring_past_teacher">
          <i className="bi bi-journal-text"></i>
          Past tutorings
        </a>
        <a className="btn btn-signup d-flex align-items-center gap-2" href="#" onClick={logout}>
          <i className="bi bi-box-arrow-right"></i>
          Log out
        </a>
      </div>
    </div>


    </div>
  );

}

export default TeacherHeader
