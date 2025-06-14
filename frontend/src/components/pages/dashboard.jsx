import { useEffect, useState } from 'react';
import'../style/style.css'
import TeacherHeader from './teacher_header';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/backend/dashboard')
      .then((res) => {
        if (res.status === 401) {
          // No hay sesión activa, redirige al login
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch((error) => {
        console.error("Error al verificar sesión:", error);
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  const { tutorings_today, tutorings_future } = data;

  return (
    <div>
    <TeacherHeader/>
    {/* Today's tutorings */}
    <div className="container mt-4 border-bottom border-light-subtle">
      <h2 className="text-success d-flex align-items-center gap-2">
        <i className="bi bi-calendar-event"></i> Today's Tutorings
      </h2>
    {tutorings_today.length > 0 && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {tutorings_today.map((tutoring, i) => (
            <div className="col" key={i}>
              <div className="card h-100 shadow-sm border-success">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{tutoring.course}</h5>
                  <p><i className="bi bi-clock"></i> <strong>Time:</strong> {tutoring.time}</p>
                  <p><i className="bi bi-geo-alt"></i> <strong>Classroom:</strong> {tutoring.classroom}</p>
                  <p><i className="bi bi-mortarboard"></i> <strong>Semester:</strong> {tutoring.semester}</p>
                  <p><i className="bi bi-people"></i> <strong>Students:</strong> {tutoring.students}</p>
                  <p><i className="bi bi-person-dash"></i> <strong>Spots left:</strong> {tutoring.spots}</p>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1">
                      <i className="bi bi-list-check"></i> List
                    </a>
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1">
                      <i className="bi bi-pencil-square"></i> Edit
                    </a>
                    <button className="btn btn-sm btn-danger d-flex align-items-center gap-1">
                      <i className="bi bi-trash3"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    )}
    <br />
    {tutorings_today.length == 0 && (
      <h4 className="text-dark d-flex align-items-center">
          No tutorings scheduled for today.
      </h4>
    )}
    <br />
    </div>

    {/* Future tutorings */}
    <div className="container mt-4 border-bottom border-light-subtle">
      <h2 className="text-success d-flex align-items-center gap-2">
        <i className="bi bi-calendar-week"></i> Upcoming Tutorings
      </h2>
    {tutorings_future.length > 0 && (

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {tutorings_future.map((tutoring, i) => (
            <div className="col" key={i}>
              <div className="card h-100 shadow-sm border-success">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{tutoring.course}</h5>
                  <p><i className="bi bi-clock"></i> <strong>Time:</strong> {tutoring.time}</p>
                  <p><i className="bi bi-geo-alt"></i> <strong>Classroom:</strong> {tutoring.classroom}</p>
                  <p><i className="bi bi-mortarboard"></i> <strong>Semester:</strong> {tutoring.semester}</p>
                  <p><i className="bi bi-people"></i> <strong>Students:</strong> {tutoring.students}</p>
                  <p><i className="bi bi-person-dash"></i> <strong>Spots left:</strong> {tutoring.spots}</p>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1">
                      <i className="bi bi-list-check"></i> List
                    </a>
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1">
                      <i className="bi bi-pencil-square"></i> Edit
                    </a>
                    <button className="btn btn-sm btn-danger d-flex align-items-center gap-1">
                      <i className="bi bi-trash3"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>      
    )}
    <br />
    {tutorings_future.length == 0 && (
      <h4 className="text-dark d-flex align-items-center">
          No tutorings scheduled for next week.
      </h4>
    )}
    <br />
    </div>

    {/* Past tutorings button */}
    <div className="container mt-4 text-end">
        <a
          href="/tutoring_past_teacher"
          className="btn btn-outline-secondary gap-1"
        >
          <i className="bi bi-journal-text"></i>
          Past tutorings
        </a>
    </div>

    <footer className="custom-footer container mt-4">
      <small>&copy; 2025 Tutora</small>
    </footer>

    </div>
  );
}
