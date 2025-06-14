import { useState } from 'react';
import'../style/style.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    school_password: ""
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

    const res = await fetch("/backend/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.success) {
      setMessage({ type: "success", text: data.message });
      // opcional: redirigir al login
      window.location.href = "/login";
    } else {
      setMessage({ type: "danger", text: data.error });
    }
  };

  return (
    <div className="bg-chalkboard vstack">
    <div className="chalkboard-white">
      <div className="d-flex justify-content-start mb-3">
        <a href="/login" className="btn btn-back">Go back</a>
      </div>

      <h3 className="card-title text-center mb-4">New Teacher Registration</h3>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 row text-center text-sm-start">
          <label className="col-12 col-sm-3 col-form-label">Name</label>
          <div className="col-12 col-sm-9">
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row text-center text-sm-start">
          <label className="col-12 col-sm-3 col-form-label">Last Name</label>
          <div className="col-12 col-sm-9">
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row text-center text-sm-start">
          <label className="col-12 col-sm-3 col-form-label">Email</label>
          <div className="col-12 col-sm-9">
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row text-center text-sm-start">
          <label className="col-12 col-sm-3 col-form-label">Password</label>
          <div className="col-12 col-sm-9">
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>School Password</strong></label>
          <input
            type="password"
            className="form-control"
            name="school_password"
            value={formData.school_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-grid mx-auto" style={{ maxWidth: "250px" }}>
          <button type="submit" className="btn btn-secondary">Register</button>
        </div>
      </form>
    </div>

        <footer className="custom-footer">
            <small>&copy; 2025 Tutora</small>
        </footer>

    </div>
  );
}