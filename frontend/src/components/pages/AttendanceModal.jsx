import React, { useState, useEffect } from 'react';
import'../style/style.css'

const AttendanceModal = ({ isOpen, onClose, tutoringId }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo hacemos el fetch si el modal está abierto y tenemos un ID
    if (isOpen && tutoringId) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/backend/attendance_list/${tutoringId}`);
          if (!response.ok) {
            throw new Error('La respuesta de la red no fue exitosa');
          }
          const data = await response.json();
          setAttendanceData(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen, tutoringId]); // Este efecto se ejecuta cuando isOpen o tutoringId cambian

  // Función para renderizar el contenido
  const renderContent = () => {
    if (isLoading) {
      return <p>Loading attendance list...</p>;
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    if (!attendanceData || attendanceData.tutoring_reservations.length === 0) {
      return <p>No reservations for this tutoring.</p>;
    }

    // Si tenemos datos, los mostramos
    const firstReservation = attendanceData.tutoring_reservations[0];

const handleSaveAttendance = async () => {
    try {
        // Mapeamos los datos para crear el array de objetos con `id` y `present`
        const updates = attendanceData.tutoring_reservations.map(r => ({
            id: r.id, // Ahora `r.id` existe gracias a la modificación en Django
            present: r.attendance
        }));

        const response = await fetch(`/backend/attendance_list/${tutoringId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ updates: updates }), // Enviamos los datos dentro de la clave 'updates'
        });

        if (!response.ok) {
            throw new Error("An error occurred while saving the attendance");
        }

        const result = await response.json();
        console.log("Attendance updated:", result);
        alert("Attendances saved successfully.");
    } catch (error) {
        console.error("Error saving changes:", error);
        alert("An error occurred while saving the attendance");
    }
};


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


    return (
      <div>
        <h2 className="text-success d-flex align-items-center gap-2">
          <i className="bi bi-list-check"></i>  Attendance List for {firstReservation.tutoring.course}
        </h2>
        <h4><strong>Teacher:</strong> {(firstReservation.tutoring.teacher.name)} {(firstReservation.tutoring.teacher.last_name)}</h4>
        <h4><strong>Date:</strong> {new Date(firstReservation.tutoring.tutoring_date).toLocaleDateString()}</h4>
        <h4><strong>Time:</strong> {(firstReservation.tutoring.tutoring_time)}</h4>
        <hr />
        <div className='table-responsive'>
        <table className="table table-bordered border-success-subtle align-middle table-green">
          <thead className='table-success'>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Semester</th>
              <th>Email</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.tutoring_reservations.map((r, index) => (
              <tr key={index}>
                <td>{r.student.name} {r.student.last_name}</td>
                <td>{r.student.group}</td>
                <td>{r.student.semester}</td>
                <td>{r.student.email}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={r.attendance}
                    onChange={(e) => {
                      const updated = { ...attendanceData };
                      updated.tutoring_reservations = updated.tutoring_reservations.map((item, i) =>
                        i === index ? { ...item, attendance: e.target.checked } : item
                      );
                      setAttendanceData(updated);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='just'>
            <button onClick={handleSaveAttendance} className="btn btn-login w-auto">
              Save Attendances
            </button>
        </div>


        </div>
        </div>

    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default AttendanceModal;