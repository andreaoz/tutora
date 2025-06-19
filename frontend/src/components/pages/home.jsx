import { useState } from 'react';
import'../style/style.css'

export default function Home() {
        
    const [showStudentOptions, setShowStudentOptions] = useState(false);

    return (
    <div className="bg-chalkboard vstack">
      <div className="chalkboard-white">
        {!showStudentOptions ? (
          <>
            <h1 className="mb-4">Welcome to Tutora</h1>
            <h2 className="mb-4">Identify yourself</h2>
            <div className="d-grid gap-3">
              <button
                onClick={() => setShowStudentOptions(true)}
                className="btn btn-secondary btn-lg"
              >
                I'm a student
              </button>
              <a href="/login" className="btn btn-secondary btn-lg">
                I'm a teacher
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Botón Atrás */}
            <div className="d-flex justify-content-start mb-3">
              <button onClick={() => setShowStudentOptions(false)} className="btn btn-back">
                Go back
              </button>
            </div>

            <div className="text-center">
              <h1 className="mb-4">Tutora</h1>
              <h5>What do you want to do?</h5>
              <br />
              <div className="d-grid gap-3 mx-auto" style={{ maxWidth: '250px' }}>
                <a href="/tutoring_calendar" className="btn btn-login">
                  Book a Tutoring
                </a>
                <a href="/cancel_reservation" className="btn btn-signup">
                  Cancel a Tutoring
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="custom-footer">
        <small>&copy; 2025 Tutora</small>
      </footer>
    </div>
  );


};
