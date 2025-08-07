import { useEffect, useState } from 'react';
import'../style/style.css'

export default function EditTutoringModal({ isOpen, onClose, tutoringData, onUpdate }) {
  const [formData, setFormData] = useState({
    course: '',
    tutoring_date: '',
    tutoring_time: '',
    classroom: '',
    semester: '',
    spots: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);


  useEffect(() => {
    // Si el modal está abierto y hay datos de tutoría, prellena el formulario
    if (isOpen && tutoringData) {
      setFormData({
        course: tutoringData.course || '',
        classroom: tutoringData.classroom || '',
        semester: tutoringData.semester || '',
      });
    }
  }, [isOpen, tutoringData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const getCookie = (name) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const csrftoken = getCookie('csrftoken');

    try {
      const response = await fetch(`/backend/edit_tutoring/${tutoringData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tutoring.');
      }

      const updatedData = await response.json();
      setSuccess(updatedData.message);
      onUpdate(updatedData.tutoring); // Llama a la función del padre para actualizar la lista
      setTimeout(() => {
        onClose();
      }, 1500); // Cierra el modal después de 1.5 segundos
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

    const tooltipStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '60%',
    //transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.53)',
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
    //whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 1002,
    marginBottom: '5px',
  };


  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 className="text-center mb-4">Edit Tutoring</h2>
        <form onSubmit={handleSubmit} >
          <div className="form-group mb-3">
            <label htmlFor="course" className="fw-bold">Course</label>
            <input type="text" name="course" className="form-control" value={formData.course} onChange={handleChange} />
          </div>


          <div className="form-group mb-3 position-relative">
            <label htmlFor="tutoring_date" className="fw-bold">Date</label>
            <span
              onMouseOver={() => setShowTooltip('date')}
              onMouseLeave={() => setShowTooltip(false)}
            >
            <input type='text' className="form-control" value={tutoringData.date} readOnly/>

            {showTooltip === 'date' && (
                <div style={tooltipStyle}>
                  To change the date, please delete the tutoring and create a new one.
                </div>
              )}
            </span>
          </div>

          <div className="form-group mb-3 position-relative">
            <label htmlFor="tutoring_time" className="fw-bold">Time</label>
            <span
              onMouseOver={() => setShowTooltip('time')}
              onMouseLeave={() => setShowTooltip(false)}
            >
            <input type='text' className="form-control" value={tutoringData.time} readOnly/>

            {showTooltip === 'time' && (
                <div style={tooltipStyle}>
                  To change the time, please delete the tutoring and create a new one.
                </div>
              )}
            </span>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="classroom" className="fw-bold">Classroom</label>
            <input type="text" name="classroom" className="form-control" value={formData.classroom} onChange={handleChange} />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="semester" className="fw-bold">Semester</label>
            <input type="text" name="semester" className="form-control" value={formData.semester} onChange={handleChange} />
          </div>

          <div className="form-group mb-3 position-relative">
            <label htmlFor="spots" className="fw-bold">Spots</label>
            <span
              onMouseOver={() => setShowTooltip('spots')}
              onMouseLeave={() => setShowTooltip(false)}
            >
            <input type='text' className="form-control" value={tutoringData.spots} readOnly/>

            {showTooltip === 'spots' && (
                <div style={tooltipStyle}>
                  To change the amount of spots, please delete the tutoring and create a new one.
                </div>
              )}
            </span>
          </div>

          <div className="d-flex justify-content-center gap-2 mt-3">
            <button type="submit" className="d-flex justify-content-center gap-2 mt-3">Save Changes</button>
            <button type="button" className="btn btn-signup w-auto" onClick={onClose}>Cancel</button>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </form>
      </div>
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