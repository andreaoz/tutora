import { useState } from 'react';
import'../style/style.css'
import TeacherHeader from './TeacherHeader';

export default function AddTutoring() {
    const [formData, setFormData] = useState({
        course: "",
        tutoring_date: "",
        tutoring_time: "",
        classroom: "",
        semester: "",
        max_students: ""
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/backend/add_tutoring", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.success) {
      setMessage({ type: "success", text: data.message });
      window.location.href = "/dashboard";
    } else {
      setMessage({ type: "danger", text: data.error });
    }
  };

  return(
    <div>
     <TeacherHeader/>
    <div className="bg-chalkboard vstack">
       
        <div className="chalkboard-white">
            <div className="d-flex justify-content-start mb-3">
                <a href="/dashboard" className="btn btn-back">Go back</a>
            </div>

            <h3 className="card-title text-center mb-4">Add New Tutoring Schedule</h3>
            {message && (
                <div className={`alert alert-${message.type}`}>
                {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3 row text-center text-sm-start">
                <label className="col-12 col-sm-3 col-form-label">Class</label>
                <div className="col-12 col-sm-9">
                    <input
                    type="text"
                    className="form-control"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className="mb-3 row text-center text-sm-start">
                <label className="col-12 col-sm-3 col-form-label">Date</label>
                <div className="col-12 col-sm-9">
                    <input
                    type="date"
                    className="form-control"
                    name="tutoring_date"
                    value={formData.tutoring_date}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className="mb-3 row text-center text-sm-start">
                <label className="col-12 col-sm-3 col-form-label">Time</label>
                <div className="col-12 col-sm-9">
                    <input
                    type="time"
                    className="form-control"
                    name="tutoring_time"
                    value={formData.tutoring_time}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className="mb-3 row text-center text-sm-start">
                <label className="col-12 col-sm-3 col-form-label">Classroom</label>
                <div className="col-12 col-sm-9">
                    <input
                    type="text"
                    className="form-control"
                    name="classroom"
                    value={formData.classroom}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className="mb-3 row text-center text-sm-start">
                <label className="col-12 col-sm-3 col-form-label">Semester</label>
                <div className="col-12 col-sm-9">
                    <select className="form-select" name="semester" value={formData.semester} onChange={handleChange} required>
                        <option value=""> Select Semester</option>
                        <option value="1st">01</option>
                        <option value="2nd">02</option>
                        <option value="3rd">03</option>
                        <option value="4th">04</option>
                        <option value="5th">05</option>
                        <option value="6th">06</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                </div>

                <div className="mb-3 row text-center text-sm-start">
                <label className="col-12 col-sm-3 col-form-label">Slots Available</label>
                <div className="col-12 col-sm-9">
                    <input
                    type="number"
                    className="form-control"
                    name="max_students"
                    value={formData.max_students}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>

                <div className="d-grid mx-auto" style={{ maxWidth: "250px" }}>
                <button type="submit" className="btn btn-secondary">Add Tutoring</button>
                </div>
            </form>

        </div>

        <footer className="custom-footer">
            <small>&copy; 2025 Tutora</small>
        </footer>
    </div>
    </div>
  );



};