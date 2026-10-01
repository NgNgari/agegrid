// src/App.jsx
import React, { useState } from "react";
import { calculateAcademicDetails } from "./academicLogic";
import "./App.css";

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function App() {
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  const [academicYear, setAcademicYear] = useState("2026-27");

  // Accordion Expand State
  const [showKeyStages, setShowKeyStages] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Assessment Security
  const [pinInput, setPinInput] = useState("");
  const isAssessmentVisible = pinInput === "20106";

  // Create YYYY-MM-DD format for academicLogic.js
  const dob =
    dobDay && dobMonth && dobYear
      ? `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(dobDay).padStart(2, "0")}`
      : "";

  const results = calculateAcademicDetails(dob, academicYear);

  // Generate day options
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  // Generate years
  const years = Array.from({ length: 41 }, (_, index) => 1990 + index);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Clear invalid day when changing month/year
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setDobMonth(newMonth);

    if (dobDay && newMonth && dobYear) {
      const daysInMonth = new Date(
        Number(dobYear),
        Number(newMonth),
        0,
      ).getDate();

      if (Number(dobDay) > daysInMonth) {
        setDobDay("");
      }
    }
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setDobYear(newYear);

    if (dobDay && dobMonth && newYear) {
      const daysInMonth = new Date(
        Number(newYear),
        Number(dobMonth),
        0,
      ).getDate();

      if (Number(dobDay) > daysInMonth) {
        setDobDay("");
      }
    }
  };

  return (
    <div className="container">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <h1>British Curriculum Age Grid</h1>

        <p className="subtitle">Calculate the Academic Year Group</p>
      </header>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <main className="card">
        {/* ===================================================
            DATE OF BIRTH
        ==================================================== */}

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="dob-day">Date of Birth</label>

            <span className="format-hint">Day / Month / Year</span>
          </div>

          <div className="date-select-row">
            {/* Day */}
            <select
              id="dob-day"
              value={dobDay}
              onChange={(e) => setDobDay(e.target.value)}
              className="date-part date-day"
              aria-label="Day of birth"
            >
              <option value="">Day</option>

              {days.map((day) => (
                <option key={day} value={day}>
                  {String(day).padStart(2, "0")}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              id="dob-month"
              value={dobMonth}
              onChange={handleMonthChange}
              className="date-part date-month"
              aria-label="Month of birth"
            >
              <option value="">Month</option>

              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              id="dob-year"
              value={dobYear}
              onChange={handleYearChange}
              className="date-part date-year"
              aria-label="Year of birth"
            >
              <option value="">Year</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Written Date */}

          {dob && <div className="formatted-date">{formatDate(dob)}</div>}
        </div>

        {/* ===================================================
            ACADEMIC YEAR
        ==================================================== */}

        <div className="form-group">
          <label htmlFor="ay-input">Academic Year</label>

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

        {/* ===================================================
            RESULTS
        ==================================================== */}

        {results && results.yearGroup !== "Out of Range" ? (
          <div className="results-container top-results">
            {/* AGE */}

            <div className="age-banner">
              <span className="banner-label">Age</span>

              {results.ageBreakdown ? (
                <div className="age-badges-row">
                  <div className="badge">
                    <span className="num">{results.ageBreakdown.years}</span>

                    <span className="unit">yrs</span>
                  </div>

                  <div className="badge">
                    <span className="num">{results.ageBreakdown.months}</span>

                    <span className="unit">mos</span>
                  </div>

                  <div className="badge">
                    <span className="num">{results.ageBreakdown.days}</span>

                    <span className="unit">days</span>
                  </div>
                </div>
              ) : (
                <span className="na-text">N/A</span>
              )}
            </div>

            {/* YEAR GROUP */}

            <div className="group-banner">
              <span className="banner-label">Year Group</span>

              <span
                className={`group-value ${
                  results.yearGroup === "Too old" ? "alert" : ""
                }`}
              >
                {results.yearGroup}
              </span>
            </div>
          </div>
        ) : (
          <div className="placeholder-text">
            {results?.yearGroup === "Out of Range"
              ? "This date of birth is outside the supported age range."
              : "Select a date of birth to calculate the age and Year Group."}
          </div>
        )}

        {/* ===================================================
            ADMINISTRATOR PORTAL
        ==================================================== */}

        <div className="accordion-section admin-auth-zone">
          <button
            type="button"
            className="accordion-trigger admin-trigger"
            onClick={() => setShowAdminPass(!showAdminPass)}
          >
            <span>🔒 Administrator Portal</span>

            <span className="toggle-icon">{showAdminPass ? "−" : "+"}</span>
          </button>

          {showAdminPass && (
            <div className="accordion-content fade-in">
              <div className="form-group" style={{ marginTop: "10px" }}>
                <label htmlFor="pin-input">Assessment Password</label>

                <input
                  id="pin-input"
                  type="password"
                  placeholder="Enter password to view assessments..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="input-field pin-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* ===================================================
            REQUIRED ASSESSMENTS
        ==================================================== */}

        {results && results.yearGroup !== "Out of Range" && (
          <div className="assessment-wrapper">
            {isAssessmentVisible ? (
              <div className="assessment-section fade-in">
                <h3>Required Assessments</h3>

                <div className="assessment-stack">
                  {/* CAT4 */}

                  <div className="assessment-item">
                    <span className="test-name">CAT4</span>

                    <span className="test-value">
                      {results.assessments.cat4}
                    </span>
                  </div>

                  {/* PTE / PTM I */}

                  <div className="assessment-item">
                    <span className="test-name">PTE/PTM I</span>

                    <span className="test-value">
                      {results.assessments.pte1}
                    </span>
                  </div>

                  {/* PTE / PTM II */}

                  <div className="assessment-item">
                    <span className="test-name">PTE/PTM II</span>

                    <span className="test-value">
                      {results.assessments.pte2}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="assessment-locked-notice">
                🔒 Assessments require a password to view.
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            BRITISH CURRICULUM STRUCTURE
        ==================================================== */}

        <div className="accordion-section">
          <button
            type="button"
            className="accordion-trigger"
            onClick={() => setShowKeyStages(!showKeyStages)}
          >
            <span>British Curriculum Structure</span>

            <span className="toggle-icon">{showKeyStages ? "−" : "+"}</span>
          </button>

          {showKeyStages && (
            <div className="accordion-content scale-down fade-in">
              {/* Key Stage Explanation */}

              <div className="ks-explanation-box">
                <p>
                  <strong>Key Stage 4 (Y10–11):</strong> Core subject selections
                  are finalized in Year 10, leading to official{" "}
                  <strong>IGCSE</strong> examinations at the end of Year 11.
                </p>

                <p>
                  <strong>Key Stage 5 (Y12–13 / Sixth Form):</strong> Advanced
                  academic specialization, sitting <strong>AS-Level</strong>{" "}
                  exams in Year 12 and final <strong>A-Level</strong> exams in
                  Year 13.
                </p>
              </div>

              {/* Key Stage Table */}

              <div className="ks-table">
                <div className="ks-row header-row">
                  <div>Key Stage</div>

                  <div>Year Groups</div>

                  <div>Ages</div>
                </div>

                <div className="ks-row">
                  <div>
                    <strong>EYFS</strong>
                  </div>

                  <div>Nursery - Reception</div>

                  <div>3 - 5 yrs</div>
                </div>

                <div className="ks-row">
                  <div>
                    <strong>KS1</strong>
                  </div>

                  <div>Year 1 - Year 2</div>

                  <div>5 - 7 yrs</div>
                </div>

                <div className="ks-row">
                  <div>
                    <strong>KS2</strong>
                  </div>

                  <div>Year 3 - Year 6</div>

                  <div>7 - 11 yrs</div>
                </div>

                <div className="ks-row">
                  <div>
                    <strong>KS3</strong>
                  </div>

                  <div>Year 7 - Year 9</div>

                  <div>11 - 14 yrs</div>
                </div>

                <div className="ks-row">
                  <div>
                    <strong>KS4</strong>
                  </div>

                  <div>Year 10 - Year 11</div>

                  <div>14 - 16 yrs</div>
                </div>

                <div className="ks-row">
                  <div>
                    <strong>KS5</strong>
                  </div>

                  <div>Year 12 - Year 13</div>

                  <div>16 - 18 yrs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer-modern">
        <div className="dev-info">
          <span className="dev-name">
            Felix <span className="dev-tag">(FNg)</span>
          </span>

          <span className="dev-copy">© 2026</span>
        </div>

        <a
          href="https://wa.me/254712135775"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <svg className="wa-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.521 1.222 3.504l-.803 2.934 3.011-.79c.947.517 2.019.79 3.134.791h.002c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.765-5.766-5.765zm3.412 8.163c-.145.41-.741.77-1.021.803-.274.032-.619.167-1.794-.321-1.378-.572-2.253-1.979-2.322-2.071-.069-.092-.559-.743-.559-1.417 0-.674.352-.1.479-.145.127-.046.277-.113.37-.265.093-.152.127-.291.069-.41-.058-.119-.519-1.25-.711-1.713-.188-.452-.378-.39-.519-.397-.133-.007-.289-.008-.445-.008-.156 0-.41.059-.624.291-.214.232-.816.797-.816 1.944 0 1.147.833 2.254.949 2.41.116.157 1.64 2.504 3.972 3.511.555.24 1.011.393 1.353.5.558.177 1.066.152 1.468.092.447-.066 1.377-.562 1.572-1.104.195-.542.195-1.008.137-1.104-.058-.096-.214-.152-.447-.269z" />
          </svg>

          <span>Chat Dev (on WhatsApp)</span>
        </a>
      </footer>
    </div>
  );
}

export default App;
