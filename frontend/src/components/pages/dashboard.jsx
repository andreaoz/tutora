import { useEffect, useState } from 'react';
import'../style/style.css'
import TeacherHeader from './TeacherHeader';
import AttendanceModal from './AttendanceModal';
import EditTutoringModal from './EditTutoringModal';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutoringId, setSelectedTutoringId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tutoringToEdit, setTutoringToEdit] = useState(null);

  // Esta función se llamará al hacer clic en un botón
  const handleOpenModal = (tutoringId) => {
    setSelectedTutoringId(tutoringId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutoringId(null); // Limpia el ID al cerrar
  };

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

      // Función para manejar el clic en el botón "Confirmar Cancelación"
    const handleConfirmButtonClick = () => {
        setShowConfirmModal(true); // Muestra el modal
    };

    const handleCancelConfirmation = async (tutoringId) => {
        if (!selectedTutoringId || !selectedTutoringId) {
            setError('No details found for this tutoring ID.');
            return;
        }

        const csrftoken = getCookie('csrftoken'); // Función para obtener el token CSRF de la cookie

        try {
            const response = await fetch(`/backend/delete_tutoring/${tutoringId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                }
                          });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo al eliminar la asesoría.');
            }

            const data = await response.json();
            alert(data.message); 
            window.location.reload();
            setSelectedTutoringId('');
            setError('');
            setShowConfirmModal(false); 
        } catch (err) {
            setError(err.message);
            setShowConfirmModal(false); 
        }
    };

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const handleOpenEditModal = (tutoring) => {
      setTutoringToEdit(tutoring);
      setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setTutoringToEdit(null);
    };


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
                  <p><i className="bi bi-calendar-event"></i> <strong>Date:</strong> {tutoring.date}</p>
                  <p><i className="bi bi-clock"></i> <strong>Time:</strong> {tutoring.time}</p>
                  <p><i className="bi bi-geo-alt"></i> <strong>Classroom:</strong> {tutoring.classroom}</p>
                  <p><i className="bi bi-mortarboard"></i> <strong>Semester:</strong> {tutoring.semester}</p>
                  <p><i className="bi bi-people"></i> <strong>Students:</strong> {tutoring.students}</p>
                  <p><i className="bi bi-person-dash"></i> <strong>Spots left:</strong> {tutoring.spots}</p>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1" 
                    onClick={() => handleOpenModal(tutoring.id)}>
                      <i className="bi bi-list-check"></i> List
                    </a>
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1"
                      onClick={() => handleOpenEditModal(tutoring)}>
                      <i className="bi bi-pencil-square"></i> Edit
                    </a>
                    <button className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                        onClick={() =>{
                        setSelectedTutoringId(tutoring.id); 
                        {handleConfirmButtonClick();};
                        }} 
                    >
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
                  <p><i className="bi bi-calendar-event"></i> <strong>Date:</strong> {tutoring.date}</p>
                  <p><i className="bi bi-clock"></i> <strong>Time:</strong> {tutoring.time}</p>
                  <p><i className="bi bi-geo-alt"></i> <strong>Classroom:</strong> {tutoring.classroom}</p>
                  <p><i className="bi bi-mortarboard"></i> <strong>Semester:</strong> {tutoring.semester}</p>
                  <p><i className="bi bi-people"></i> <strong>Students:</strong> {tutoring.students}</p>
                  <p><i className="bi bi-person-dash"></i> <strong>Spots left:</strong> {tutoring.spots}</p>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1" 
                    onClick={() => handleOpenModal(tutoring.id)}>
                      <i className="bi bi-list-check"></i> List
                    </a>
                    <a className="btn btn-sm btn-secondary d-flex align-items-center gap-1"
                    onClick={() => handleOpenEditModal(tutoring)}
                    >
                      <i className="bi bi-pencil-square"></i> Edit
                    </a>
                    <button className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                        onClick={() =>{
                        setSelectedTutoringId(tutoring.id); 
                        {handleConfirmButtonClick();};
                        }} 
                    >

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
          href="/past_tutorings"
          className="btn btn-outline-secondary gap-1"
        >
          <i className="bi bi-journal-text"></i>
          Past tutorings
        </a>
    </div>

    <footer className="custom-footer container mt-4">
      <small>&copy; 2025 Tutora</small>
    </footer>

    <AttendanceModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal}
      tutoringId={selectedTutoringId}
    />

    <EditTutoringModal
      isOpen={isEditModalOpen}
      onClose={handleCloseEditModal}
      tutoringData={tutoringToEdit}
      onUpdate={() => window.location.reload()} // Recarga la página después de editar
    />

    {/* El Modal de Confirmación */}
    {showConfirmModal && (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>Confirm Cancellation</h2>
                <p>¿Are you sure you want to cancel this tutoring?</p>
                <p>You cannot undo this action.</p>
                <div className="mb-3 d-flex gap-2 justify-content-center">
                  <button
                      onClick={() => handleCancelConfirmation(selectedTutoringId)}
                      className="btn btn-danger"
                  >
                      Yes, Cancel
                  </button>
                  <button
                      onClick={() => setShowConfirmModal(false)} // Cierra el modal sin cancelar
                      className="btn btn-signup w-auto"
                  >
                      No, Go back
                  </button>
                </div>
            </div>
        </div>
    )}

    </div>
    

  );
}

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    zIndex: 1001,
};

