import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TeacherHeader from './TeacherHeader';
import '../style/style.css';
import avatars from '../avatars/avatar_list';

const EditTeacher = () => {
  const { teacherId } = useParams();

  const [teacher, setTeacher] = useState({
    name: '',
    last_name: '',
    email: '',
    avatar: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = `/backend/edit_profile/${teacherId}`;

  useEffect(() => {
    // Función para cargar los datos del profesor
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(API_URL, {
        });
        setTeacher(response.data);
      } catch (err) {
        setError("Error al cargar los datos del profesor.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [API_URL]);

  // Función para manejar los cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher(prevTeacher => ({
      ...prevTeacher,
      [name]: value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // Resetear el estado de éxito
    try {
      await axios.put(API_URL, teacher, {

      });
      setSuccess(true); // Indicar que la actualización fue exitosa
      console.log('Datos actualizados correctamente.');
      
    // Esperar 3 segundos y luego recargar
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 3000 milisegundos = 3 segundos


    } catch (err) {
      setError("Error al actualizar los datos.");
      console.error(err);
    }
  };

  const handleIconSelect = (iconUrl) => {
      setTeacher(prevTeacher => ({
          ...prevTeacher,
          avatar: iconUrl
      }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <TeacherHeader/>
      <div className='edit-profile-container'>
      <div className='edit-box-big'>
      <h2 className="text-left mb-4">Edit Profile</h2>
      {success && <p style={{ color: 'green' }}>Changes saved successfully. Updating profile ...</p>}
      
      <form onSubmit={handleSubmit}>

        <div className='just'>
        <div className="edit-labels">
          <label htmlFor="name" className='edit-label'>Name</label>
          <label htmlFor="last_name" className='edit-label'>Last name</label>
          <label htmlFor="email" className='edit-label'>Email</label>
        </div>

        <div className="edit-inputs">
          <input type="text" id="name" name="name" className='edit-box' value={teacher.name} onChange={handleChange}/>
          <input type="text" id="last_name" name="last_name" className='edit-box' value={teacher.last_name} onChange={handleChange} />
          <input type="email" id="email" name="email" className='edit-box' value={teacher.email} onChange={handleChange}/>
        </div>
        </div>

        <div className="d-flex flex-column align-items-center mt-3">
            <label className='edit-label'>Select an icon:</label>
            <div className="icon-selector d-flex justify-content-center gap-3 mt-2">
                {avatars.map(icon => (
                    <img
                        key={icon.id}
                        src={icon.src}
                        alt={`Icono ${icon.id}`}
                        className={`icon-option ${teacher.avatar === icon.id ? 'selected' : ''}`}
                        onClick={() => handleIconSelect(icon.id)}
                        style={{
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            border: teacher.avatar === icon.id ? '2px solid #007bff' : 'none',
                            borderRadius: '50%'
                        }}
                    />
                ))}
            </div>
        </div>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button type="submit" className="btn btn-back">
            Save Changes     
          </button>
        </div>

      </form>
      </div>
      </div>
    </div>
  );
};

export default EditTeacher;