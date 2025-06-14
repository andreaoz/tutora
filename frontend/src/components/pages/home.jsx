import { useState } from 'react';
import'../style/style.css'

export default function Home() {
      
    return (
    <div className="bg-chalkboard vstack">
      <div className="chalkboard-white">

        <h1 className="mb-4">Welcome to Tutora</h1>
        <h2 className="mb-4">Identify yourself</h2>

        <div className="d-grid gap-3">
            <a href="{% url 'student_options' %}" class="btn btn-secondary btn-lg">I'm a student</a>
            <a href="/login" className="btn btn-secondary btn-lg">I'm a teacher</a>
        </div>
      </div>

      
      <footer className="custom-footer">
        <small>&copy; 2025 Tutora</small>
      </footer>
    </div>
  );


};
