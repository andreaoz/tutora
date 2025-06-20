import React, { useState, useEffect } from 'react';
import '../style/TutoringCalendar.css';

const TutoringCalendar = () => {
  const [weekdays, setWeekdays] = useState([]);
  const [tutoringsByDate, setTutoringsByDate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorings();
  }, []);

  const fetchTutorings = async () => {
    try {
      const response = await fetch('/backend/tutoring_calendar');
      const data = await response.json();
      setWeekdays(data.weekdays);
      setTutoringsByDate(data.tutorings_by_date);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutorings:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="calendar-container">
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-light mt-3">Cargando asesorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">

      <div className="container-fluid py-4">
        <div className="d-flex justify-content-start mb-3">
          <a href="/" className="btn btn-back-cal">Go back</a>
        </div>

        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="calendar-title">
              <i class="bi bi-calendar-check"></i> Available Tutorings
            </h2>
          </div>
        </div>

        {/* Vista desktop - Horizontal */}
        <div className="row d-flex flex-column flex-lg-row">
          {weekdays.map((date) => (
            <div key={date} className="col">
              <div className="day-card desktop-day">
                <div className="day-header">
                  <h5 className="day-title">{formatDateShort(date)}</h5>
                </div>
                <div className="day-content">
                  {tutoringsByDate[date] && tutoringsByDate[date].length > 0 ? (
                    tutoringsByDate[date].map((tutoring) => (
                      <div key={tutoring.id} className="tutoring-card mb-2">

                        <button 
                          className='text-start w-100 border-0 p-0'
                          onClick={""} // function to book tutoring
                          style={{ background: 'none' }}
                        >
                        <div className="card-body p-2">
                          <div className='d-flex align-items-center mb-1'>
                            <div className="tutoring-time-badge me-2">
                              {tutoring.tutoring_time}
                            </div>
                            <h6 className="tutoring-course  mb-0">{tutoring.course}</h6>
                          </div>

                          <p className="tutoring-teacher mb-1">
                            <i class="bi bi-person-lines-fill"></i> {tutoring.teacher.name} {tutoring.teacher.last_name}
                          </p>
                          <div className="tutoring-details mb-2">
                            <small className="text-muted">
                              <i className="bi bi-geo-alt"></i> {tutoring.classroom} | <i className="bi bi-mortarboard"></i> {tutoring.semester}° | <i className="bi bi-people"></i> {tutoring.max_students}
                            </small>
                          </div>
                        </div>
                        </button>

                      </div>
                    ))
                  ) : (
                    <div className="no-tutorings">
                      <p>No tutorings</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer className="custom-footer">
            <small>&copy; 2025 Tutora</small>
        </footer>

      </div>
    </div>
  );
};

export default TutoringCalendar;