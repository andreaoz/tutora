import { useEffect, useState } from 'react';
import'../style/style.css'
import TeacherHeader from './TeacherHeader';
import AttendanceModal from './AttendanceModal';

export default function PastTutorings() {
    const [allTutorings, setAllTutorings] = useState([]);
    const [filteredTutorings, setFilteredTutorings] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTutoringId, setSelectedTutoringId] = useState(null);

    useEffect(() => {
    fetch('/backend/past_tutorings')
      .then((res) => {
        if (res.status === 401) {
          // No hay sesión activa, redirige al login
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((json) => {
        if (json) {
          const tutorings = json.past_tutorings;
          setAllTutorings(tutorings);
          setFilteredTutorings(tutorings);

          // Extraer lista de maestros únicos
          const uniqueTeachers = Array.from(
            new Set(tutorings.map(t => t.teacher.name + ' ' + t.teacher.last_name))
          );
          setTeachers(uniqueTeachers);
        }
      })
      .catch((error) => {
        console.error("Error al verificar sesión:", error);
      });
    }, []);

    const filterByTeacher = (selectedName) => {
        if (selectedName === "All") {
        setFilteredTutorings(allTutorings);
        } else {
        const filtered = allTutorings.filter(t => 
            `${t.teacher.name} ${t.teacher.last_name}` === selectedName
        );
        setFilteredTutorings(filtered);
        }
    };

    if (filteredTutorings.length === 0 && allTutorings.length === 0) return <p>Loading...</p>;
  
      // Esta función se llamará al hacer clic en un botón
    const handleOpenModal = (tutoringId) => {
      setSelectedTutoringId(tutoringId);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedTutoringId(null); // Limpia el ID al cerrar
    };

return(
    <div>
        <TeacherHeader/>
        <div className="container mt-4">
            <h2 className="text-success d-flex align-items-center gap-2">
                <i className="bi bi-journal-text"></i> Past Tutorings
            </h2>
            <br />
            <div className='table-responsive'> 
                {allTutorings.length > 0 && (
                <table className="table table-bordered border-success-subtle align-middle table-green">
                    <thead className='table-success'>
                    <tr>
                        <th>Course</th>
                        <th>
                        <select 
                            className='teacher-select' 
                            name="teacher" 
                            id="teacher" 
                            onChange={(e) => filterByTeacher(e.target.value)} 
                            defaultValue={""}
                        >
                        <option value="" disabled hidden>Teacher</option>
                        <option value="All">All Teachers</option>
                        {teachers.map((t, i) => (
                            <option key={i} value={t}>{t}</option>
                        ))}
                        </select>        
                        </th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Classroom</th>
                        <th>Semester</th>
                        <th>Students</th>
                    </tr>
                    </thead>
            
                    <tbody>
                        {filteredTutorings.map((tutoring, i) => (
                            <tr key={i}>
                                <td>{tutoring.course}</td>
                                <td>{tutoring.teacher.name} {tutoring.teacher.last_name}</td>
                                <td>{tutoring.date}</td>
                                <td>{tutoring.time}</td>
                                <td>{tutoring.classroom}</td>
                                <td>{tutoring.semester}</td>
                                <td className='align-center'>
                                  <a 
                                    onClick={() => handleOpenModal(tutoring.id)} 
                                    style={{ cursor: 'pointer' }}
                                    className="text-primary text-decoration-underline"
                                  >
                                    {tutoring.students}
                                  </a>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                    </table>
                    )}
                {filteredTutorings.length == 0 && (
                    <h4 className="text-dark d-flex align-items-center">
                        No past tutorings registered.
                    </h4>
                )}
                </div>
        <br />
        </div>

    <footer className="custom-footer container mt-4">
      <small>&copy; 2025 Tutora</small>
    </footer>

    <AttendanceModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal}
      tutoringId={selectedTutoringId}
    />

    </div>
  );
};