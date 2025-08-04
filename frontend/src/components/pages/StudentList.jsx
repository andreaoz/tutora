import { useEffect, useState } from 'react';
import'../style/style.css'
import TeacherHeader from './TeacherHeader';

export default function StudentList() {
    const [allReservations, setAllReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
    fetch('/backend/student_list')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((json) => {
        if (json) {
          const reservations = json.past_reservations;
          setAllReservations(reservations);
        }
      })
      .catch((error) => {
        console.error("Error al verificar sesión:", error);
      });
    }, []);

    const filteredReservations = allReservations.filter((reservation) => {
            const studentName = `${reservation.student.name} ${reservation.student.last_name}`.toLowerCase();
            return studentName.includes(searchTerm.toLowerCase());
        });

return(
    <div>
        <TeacherHeader/>
        <div className="container mt-4">
            <h2 className="text-success d-flex align-items-center gap-2">
                <i className="bi bi-journal-text"></i> Student List
            </h2>
            <br />
            
            {/* Barra de búsqueda */}
            <div className="input-group mb-4">
                <span className="input-group-text">
                    <i className="bi bi-search"></i>
                </span>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Filter by student name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className='table-responsive'> 
                {filteredReservations.length > 0 ? (
                <table className="table table-bordered border-success-subtle align-middle table-green">
                    <thead className='table-success'>
                    <tr>
                        <th>Reservation ID</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Teacher</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Classroom</th>
                        <th>Semester</th>
                    </tr>
                    </thead>
            
                    <tbody>
                        {filteredReservations.map((reservation, i) => (
                            <tr key={i}>
                                <td>{reservation.id}</td>
                                <td>{reservation.student.name} {reservation.student.last_name}</td>
                                <td>{reservation.tutoring.course}</td>
                                <td>{reservation.tutoring.teacher.name} {reservation.tutoring.teacher.last_name}</td>
                                <td>{reservation.tutoring.tutoring_date}</td>
                                <td>{reservation.tutoring.tutoring_time}</td>
                                <td>{reservation.tutoring.classroom}</td>
                                <td>{reservation.tutoring.semester}</td>
                                
                            </tr>
                        ))} 
                    </tbody>
                    </table>
                    ):(
                        <h4 className="text-dark d-flex align-items-center">
                            {allReservations.length > 0 ? 'No students found with that name.' : 'No students registered.'}
                        </h4>
                    )}
                {allReservations.length == 0 && (
                    <h4 className="text-dark d-flex align-items-center">
                        No students registered.
                    </h4>
                )}
                </div>
        <br />
        </div>

    <footer className="custom-footer container mt-4">
      <small>&copy; 2025 Tutora</small>
    </footer>

    </div>
  );
};