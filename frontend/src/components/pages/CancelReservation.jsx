import { useState, useEffect } from 'react';
import'../style/style.css'

function CancelReservationPage() {
    const [reservationId, setReservationId] = useState('');
    const [reservationDetails, setReservationDetails] = useState(null);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fetchReservationDetails = async () => {
        if (!reservationId) {
            setError('Please, enter a reservation ID.');
            setReservationDetails(null);
            return;
        }

        try {
            const response = await fetch(`/backend/cancel_reservation?reservation_id=${reservationId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo al obtener los detalles de la reservación.');
            }
            const data = await response.json();
            setReservationDetails(data.reservation);
            setError('');
        } catch (err) {
            setError(err.message);
            setReservationDetails(null);
        }
    };

    // Función para manejar el clic en el botón "Confirmar Delete"
    const handleConfirmButtonClick = () => {
        setShowConfirmModal(true); // Muestra el modal
    };

    const handleCancelConfirmation = async () => {
        if (!reservationDetails || !reservationDetails.id) {
            setError('No details found for this reservation ID.');
            return;
        }

        const csrftoken = getCookie('csrftoken'); // Función para obtener el token CSRF de la cookie

        try {
            const response = await fetch('/backend/cancel_reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({ confirm_cancel: reservationDetails.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo al cancelar la reservación.');
            }

            const data = await response.json();
            alert(data.success); 
            setReservationDetails(null);
            setReservationId('');
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

    return (
        <div className="bg-chalkboard vstack">
          <div className="chalkboard-white">
            <div className="d-flex justify-content-start mb-3">
              <a href="/" className="btn btn-back">Go back</a>
            </div>
            <h1 className="card-title mb-4 text-nowrap">Cancel a Tutoring</h1>

            <div className="mb-3 d-flex gap-2">
                <input
                    type="text"
                    placeholder="Reservation ID"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                />
                <button className="btn btn-login w-auto"  onClick={fetchReservationDetails}>Search</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reservationDetails && (
                <div>
                  <br />
                    <h2>Reservation details</h2>
                    <p><strong>ID:</strong> {reservationDetails.id}</p>
                    <p><strong>Student:</strong> {reservationDetails.student}</p>
                    <p><strong>Class:</strong> {reservationDetails.course}</p>
                    <p><strong>Teacher:</strong> {reservationDetails.teacher}</p>
                    <p><strong>Classroom:</strong> {reservationDetails.classroom}</p>
                    <p><strong>Date:</strong> {reservationDetails.reservation_date}</p>
                    <p><strong>Time:</strong> {reservationDetails.tutoring_time}</p>
                    <button
                        onClick={handleConfirmButtonClick} 
                        className="btn btn-danger"
                    >
                        Cancel reservation
                    </button>
                </div>
            )}

            {/* El Modal de Confirmación */}
            {showConfirmModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>Confirm Cancellation</h2>
                        <p>¿Are you sure you want to cancel reservation #<strong>{reservationDetails?.id}</strong>?</p>
                        <p>You cannot undo this action.</p>
                        <div className="mb-3 d-flex gap-2 align-center">
                        <button
                            onClick={handleCancelConfirmation} // Llama a la función de cancelación real
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

          <footer className="custom-footer">
            <small>&copy; 2025 Tutora</small>
          </footer>
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

export default CancelReservationPage;