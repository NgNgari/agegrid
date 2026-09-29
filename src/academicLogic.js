// src/academicLogic.js

// 1. Define the age group rules based on DOB ranges
export const academicYearRules = [
  { from: "2004-09-01", to: "2005-08-31", "2026-27": "Too old", "2027-28": "Too old" },
  { from: "2005-09-01", to: "2006-08-31", "2026-27": "Too old", "2027-28": "Too old" },
  { from: "2006-09-01", to: "2007-08-31", "2026-27": "Too old", "2027-28": "Too old" },
  { from: "2007-09-01", to: "2008-08-31", "2026-27": "Too old", "2027-28": "Too old" },
  { from: "2008-09-01", to: "2009-08-31", "2026-27": "Year 13",      "2027-28": "Too old" },
  { from: "2009-09-01", to: "2010-08-31", "2026-27": "Year 12",      "2027-28": "Year 13" },
  { from: "2010-09-01", to: "2011-08-31", "2026-27": "Year 11",      "2027-28": "Year 12" },
  { from: "2011-09-01", to: "2012-08-31", "2026-27": "Year 10",      "2027-28": "Year 11" },
  { from: "2012-09-01", to: "2013-08-31", "2026-27": "Year 9",       "2027-28": "Year 10" },
  { from: "2013-09-01", to: "2014-08-31", "2026-27": "Year 8",       "2027-28": "Year 9" },
  { from: "2014-09-01", to: "2015-08-31", "2026-27": "Year 7",       "2027-28": "Year 8" },
  { from: "2015-09-01", to: "2016-08-31", "2026-27": "Year 6",       "2027-28": "7" },
  { from: "2016-09-01", to: "2017-08-31", "2026-27": "Year 5",       "2027-28": "Year 6" },
  { from: "2017-09-01", to: "2018-08-31", "2026-27": "Year 4",       "2027-28": "Year 5" },
  { from: "2018-09-01", to: "2019-08-31", "2026-27": "Year 3",       "2027-28": "Year 4" },
  { from: "2019-09-01", to: "2020-08-31", "2026-27": "Year 2",       "2027-28": "Year 3" },
  { from: "2020-09-01", to: "2021-08-31", "2026-27": "Year 1",       "2027-28": "Year 2" },
  { from: "2021-09-01", to: "2022-08-31", "2026-27": "Reception",       "2027-28": "Year 1" },
  { from: "2022-09-01", to: "2023-08-31", "2026-27": "Nursery",       "2027-28": "Reception" },
];

// 2. Define the assessment values mapped directly to the calculated Academic Year Group
export const assessmentMatrix = {
  "R":  { cat4: "N/A",       pte1: "N/A",         pte2: "N/A" },
  "1":  { cat4: "N/A",       pte1: "N/A",         pte2: "N/A" },
  "2":  { cat4: "Level X",   pte1: "N/A",         pte2: "Level 7 A" },
  "3":  { cat4: "Pre A",     pte1: "Level 7 B",   pte2: "Level 8 A" },
  "4":  { cat4: "A",         pte1: "Level 8 B",   pte2: "Level 9 A" },
  "5":  { cat4: "B",         pte1: "Level 9 B",   pte2: "Level 10 A" },
  "6":  { cat4: "C",         pte1: "Level 10 B",  pte2: "Level 11 A" },
  "7":  { cat4: "D",         pte1: "Level 11T A", pte2: "Level 12 A" },
  "8":  { cat4: "E",         pte1: "Level 12 B",  pte2: "Level 13 A" },
  "9":  { cat4: "F",         pte1: "Level 13 B",  pte2: "Level 14 A" },
  "10": { cat4: "F",         pte1: "Level 14 B",  pte2: "Level 15 Int A" },
  "11": { cat4: "G",         pte1: "N/A",         pte2: "N/A" },
  "12": { cat4: "G",         pte1: "N/A",         pte2: "N/A" },
  "13": { cat4: "N/A",       pte1: "N/A",         pte2: "N/A" },
  "N":  { cat4: "N/A",       pte1: "N/A",         pte2: "N/A" },
  "Too old": { cat4: "N/A",  pte1: "N/A",         pte2: "N/A" }
};

// Safety helper to enforce clean UTC execution
function parseToUTCDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// 3. Main processing function 
export function calculateAcademicDetails(dobString, selectedAcademicYear) {
  if (!dobString || !selectedAcademicYear) return null;

  const birthDate = parseToUTCDate(dobString);

  // Find the matching range row with clean UTC comparisons
  const matchedRow = academicYearRules.find(rule => {
    const fromDate = parseToUTCDate(rule.from);
    const toDate = parseToUTCDate(rule.to);
    return birthDate >= fromDate && birthDate <= toDate;
  });

  if (!matchedRow) {
    return {
      yearGroup: "Out of Range",
      ageBreakdown: null,
      assessments: { cat4: "N/A", pte1: "N/A", pte2: "N/A" }
    };
  }

  const yearGroup = matchedRow[selectedAcademicYear];
  const assessments = assessmentMatrix[yearGroup] || { cat4: "N/A", pte1: "N/A", pte2: "N/A" };

  // Calculate chronological countdown targets
  const academicStartYear = parseInt(selectedAcademicYear.split('-'), 10);
  const targetYear = academicStartYear;
  const targetMonth = 8; // September (0-based)
  const targetDay = 1;

  const birthYear = birthDate.getUTCFullYear();
  const birthMonth = birthDate.getUTCMonth();
  const birthDay = birthDate.getUTCDate();

  let years = targetYear - birthYear;
  let months = targetMonth - birthMonth;
  let days = targetDay - birthDay;

  // Handle days borrowing
  if (days < 0) {
    const previousMonthDays = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
    days += previousMonthDays;
    months--;
  }

  // Handle months borrowing
  if (months < 0) {
    months += 12;
    years--;
  }

  return {
    yearGroup,
    ageBreakdown: { years, months, days },
    assessments
  };
}
