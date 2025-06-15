import React, { useState, useEffect } from 'react';

export default function AttendanceModal({ show, onClose, tutoring, reservations, tutoringId }) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (reservations.length > 0) {
      const mapped = reservations.map(r => ({
        student_id: r.student.id,
        name: r.student.name,
        last_name: r.student.last_name,
        group: r.student.group,
        semester: r.student.semester,
        email: r.student.email,
        present: r.present || false,
      }));
      setAttendance(mapped);
    }
  }, [reservations]);

  const handleCheckboxChange = (index) => {
    const updated = [...attendance];
    updated[index].present = !updated[index].present;
    setAttendance(updated);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/backend/attendance_list/${tutoringId}/save/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si usas Django session auth, este header no es necesario
          // 'X-CSRFToken': csrf_token_here
        },
        body: JSON.stringify({ attendance }),
      });

      if (res.ok) {
        alert("✅ Attendance saved!");
        onClose();
      } else {
        const err = await res.json();
        alert("❌ Error saving attendance: " + err.error);
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
    }
  };

  if (!show || !tutoring) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content shadow">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Attendance – {tutoring.course}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <h6><strong>Date:</strong> {tutoring.date} at {tutoring.time}</h6>
            {attendance.length > 0 ? (
              <div className="table-responsive mt-3">
                <table className="table table-bordered table-striped align-middle shadow-sm">
                  <thead className="table-secondary">
                    <tr>
                      <th>Attendance</th>
                      <th>Name</th>
                      <th>Group</th>
                      <th>Semester</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((student, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.present}
                            onChange={() => handleCheckboxChange(i)}
                          />
                        </td>
                        <td>{student.name} {student.last_name}</td>
                        <td>{student.group}</td>
                        <td>{student.semester}</td>
                        <td>{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted mt-3">No reservations for this tutoring.</p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-success" onClick={handleSave}>💾 Save Attendance</button>
          </div>
        </div>
      </div>
    </div>
  );
}
