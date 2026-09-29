// src/App.jsx
import React, { useState } from 'react';
import { calculateAcademicDetails } from './academicLogic';
import './App.css';

function App() {
  const [dob, setDob] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-27');

  const results = calculateAcademicDetails(dob, academicYear);

  return (
    <div className="container">
      <header className="header">
        <h1>Age Grid</h1>
        <p className="subtitle">For Year Group & Assessments</p>
      </header>

      <main className="card">
        {/* Input Fields */}
        <div className="form-group">
          <label htmlFor="dob-input">Date of Birth</label>
          <input
            id="dob-input"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ay-input">Target Academic Year</label>
          <div className="select-wrapper">
            <select
              id="ay-input"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="input-field"
            >
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
            </select>
          </div>
        </div>

        {/* Dynamic Display */}
        {results && results.yearGroup !== "Out of Range" ? (
          <div className="results-container">
            
            {/* Age Banner */}
            <div className="age-banner">
              <span className="banner-label">Calculated Age</span>
              {results.ageBreakdown ? (
                <div className="age-badges-row">
                  <div className="badge"><span className="num">{results.ageBreakdown.years}</span><span className="unit">yrs</span></div>
                  <div className="badge"><span className="num">{results.ageBreakdown.months}</span><span className="unit">mos</span></div>
                  <div className="badge"><span className="num">{results.ageBreakdown.days}</span><span className="unit">days</span></div>
                </div>
              ) : (
                <span className="na-text">N/A</span>
              )}
            </div>

            {/* Academic Year Banner */}
            <div className="group-banner">
              <span className="banner-label">Academic Year Group</span>
              <span className={`group-value ${results.yearGroup === 'Too old' ? 'alert' : ''}`}>
                {results.yearGroup}
              </span>
            </div>

            {/* Assessment Section */}
            <div className="assessment-section">
              <h3>Required Assessments</h3>
              <div className="assessment-stack">
                <div className="assessment-item">
                  <span className="test-name">CAT4</span>
                  <span className="test-value">{results.assessments.cat4}</span>
                </div>
                <div className="assessment-item">
                  <span className="test-name">PTE/PTM I</span>
                  <span className="test-value">{results.assessments.pte1}</span>
                </div>
                <div className="assessment-item">
                  <span className="test-name">PTE/PTM II</span>
                  <span className="test-value">{results.assessments.pte2}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="placeholder-text">
            {results?.yearGroup === "Out of Range" 
              ? "Date of birth falls out of supported academic ranges."
              : "Select a valid birthdate to instantly calculate placement metrics."}
          </div>
        )}
      </main>

      <footer className="footer">
        <b>Dev:</b> Felix (FNg) • Copyright © 2026 • 
      </footer>
    </div>
  );
}

export default App;
