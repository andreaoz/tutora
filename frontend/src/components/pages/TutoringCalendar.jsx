import React, { useState, useEffect } from 'react';
import '../style/TutoringCalendar.css'; // Importar el CSS separado

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
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="calendar-title">
              📚 Asesorías Disponibles - Próximos 7 Días Laborales
            </h2>
          </div>
        </div>

        {/* Vista móvil - Vertical */}
        <div className="row d-lg-none">
          {weekdays.map((date) => (
            <div key={date} className="col-12 mb-4">
              <div className="day-card mobile-day">
                <div className="day-header">
                  <h4 className="day-title">{formatDate(date)}</h4>
                </div>
                <div className="day-content">
                  {tutoringsByDate[date] && tutoringsByDate[date].length > 0 ? (
                    tutoringsByDate[date].map((tutoring) => (
                      <div key={tutoring.id} className="tutoring-card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="tutoring-course">{tutoring.course}</h6>
                            <span className="tutoring-time">{tutoring.tutoring_time}</span>
                          </div>
                          <p className="tutoring-teacher mb-2">
                            👨‍🏫 {tutoring.teacher.name} {tutoring.teacher.last_name}
                          </p>
                          <div className="tutoring-details">
                            <small className="text-muted d-block">
                              📍 Salón: {tutoring.classroom} | 
                              🎓 Semestre: {tutoring.semester} | 
                              👥 Max: {tutoring.max_students}
                            </small>
                          </div>
                          <button 
                            className="btn btn-reserve btn-sm mt-2 w-100"
                          >
                            📝 Reservar Asesoría
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-tutorings">
                      <p>No hay asesorías disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vista desktop - Horizontal */}
        <div className="row d-none d-lg-flex">
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
                        <div className="card-body p-2">
                          <div className="tutoring-time-badge mb-1">
                            {tutoring.tutoring_time}
                          </div>
                          <h6 className="tutoring-course">{tutoring.course}</h6>
                          <p className="tutoring-teacher mb-1">
                            👨‍🏫 {tutoring.teacher.name}
                          </p>
                          <div className="tutoring-details mb-2">
                            <small className="text-muted">
                              📍 {tutoring.classroom}<br/>
                              🎓 {tutoring.semester}° | 👥 {tutoring.max_students}
                            </small>
                          </div>
                          <button 
                            className="btn btn-reserve btn-sm w-100"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-tutorings">
                      <p>Sin asesorías</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutoringCalendar;