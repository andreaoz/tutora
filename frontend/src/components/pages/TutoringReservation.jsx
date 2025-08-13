import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../style/TutoringCalendar.css';
import'../style/style.css'

function TutoringReservation() {
  const { tutoringId } = useParams(); // Obtiene el ID de la URL
  const [tutoring, setTutoring] = useState(null); // Estado para guardar los datos de la tutoría
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para errores de carga
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    semester: "",
    group: "",
    email: ""
  });
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
 

   useEffect(() => {
    const fetchTutoringDetails = async () => {
      try {
        const res = await fetch(`/backend/tutoring_reservation/${tutoringId}`);
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/tutoring_calendar"); // Redirige si no hay sesión activa o acceso denegado
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTutoring(data); // Guarda los datos de la tutoría en el estado
      } catch (error) {
        console.error("Error fetching tutoring details:", error);
        setError("Failed to load tutoring details. Please try again.");
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    if (tutoringId) { 
      fetchTutoringDetails();
    }
  }, [tutoringId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tutoring) { // No permitir enviar si la tutoría no se ha cargado
        setMessages([{ type: "danger", text: "Tutoring details not loaded yet. Please wait." }]);
        return;
    }
    const res = await fetch(`/backend/tutoring_reservation/${tutoring.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (res.ok) {
      setReservationConfirmed(true); // Establece el estado de confirmación a true
      setReservationDetails(result); // Guarda los detalles de la reserva
      setMessages([{ type: "success", text: result.message }]); 
    } else {
      setMessages([{ type: "danger", text: result.error }]);
    }
  };

  if (loading) {
    return <div className="calendar-container"><div className="text-center ">Loading tutoring details...</div></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!tutoring) {
    return <div className="alert alert-warning text-center mt-5">Tutoring not found.</div>;
  }

  if (reservationConfirmed && reservationDetails) {
    return (
      <div className="calendar-container">
        <div className="container mt-5">
          <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
            <div className="card-body">
              <h2 className="card-title text-center text-success">Reservation Confirmed!</h2>
              <h5 className="text-center mb-4">Reservation ID: <strong>#{reservationDetails.reservation_id}</strong></h5>

              <div className="mb-3">
                <h5 className="text-success">Tutoring Information</h5>
                <p><strong>Class:</strong> {reservationDetails.tutoring.course}</p>
                <p><strong>Teacher:</strong> {tutoring.teacher.name} {tutoring.teacher.last_name}</p> 
                <p><strong>Date:</strong> {tutoring.tutoring_date}</p>
                <p><strong>Time:</strong> {tutoring.tutoring_time}</p>
                <p><strong>Classroom:</strong> {tutoring.classroom}</p>
              </div>

              <div className="mb-4">
                <h5 className="text-success">Student</h5>
                <p><strong>Name:</strong> {reservationDetails.student.name} {reservationDetails.student.last_name}</p>
              </div>

              <div className="text-center">
                <a href="/tutoring_calendar" className="btn btn-back-cal"> Book another tutoring</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="calendar-container">
      <div className="container mt-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <h3 className="card-title text-center mb-4">
              Reserve tutoring for <strong>{tutoring.course}</strong>
            </h3>
            <p><strong>Teacher:</strong> {tutoring.teacher.name} {tutoring.teacher.last_name}</p>
            <p><strong>Date:</strong> {tutoring.tutoring_date}</p>
            <p><strong>Time:</strong> {tutoring.tutoring_time}</p>
            <p><strong>Classroom:</strong> {tutoring.classroom}</p>
            <p><strong>Spots Left:</strong> {tutoring.spots_left}</p> {/* Muestra los lugares disponibles */}

            {messages.length > 0 && (
              <div className="mt-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`alert alert-${msg.type} alert-dismissible fade show`} role="alert">
                    {msg.text}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-3">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">First Name</label>
                <input type="text" className="form-control" id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="semester" className="form-label">Semester</label>
                <select className="form-select" id="semester" name="semester" required value={formData.semester} onChange={handleChange}>
                  <option value="">Select semester</option>
                  <option value="1st">01</option>
                  <option value="2nd">02</option>
                  <option value="3rd">03</option>
                  <option value="4th">04</option>
                  <option value="5th">05</option>
                  <option value="6th">06</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="group" className="form-label">Group</label>
                <input type="text" className="form-control" id="group" name="group" required value={formData.group} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-login" disabled={tutoring.spots_left <= 0}>Register Reservation</button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <a href="/tutoring_calendar" className="btn btn-signup w-auto">← Back to tutoring schedule</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutoringReservation;