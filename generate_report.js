const fs = require('fs');
const path = require('path');

// 1. Read student master data file
const tsvPath = path.join(__dirname, 'src/main/resources/data/student_master_data.tsv');
const tsvRaw = fs.readFileSync(tsvPath, 'utf8');
const lines = tsvRaw.trim().split(/\r?\n/);
const header = lines[0].split('\t');

// Identify duplicate roll numbers across the source records
const rollCounts = {};
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split('\t');
  const cleanRoll = parts[1].replace(/[\$,]/g, '').trim();
  rollCounts[cleanRoll] = (rollCounts[cleanRoll] || 0) + 1;
}

// 2. Realistic, deterministic sample values for demonstration
const feedbackBank = [
  "Consistently demonstrates strong analytical reasoning in coursework.",
  "Punctual and attentive; active contributor in lab exercises.",
  "Shows strong grasp of algorithmic concepts; submits work on time.",
  "Engaged during mentoring sessions; recommended for peer study groups.",
  "Regular attendance; shows steady improvement in problem-solving speed.",
  "Attentive listener; demonstrates disciplined academic work ethic.",
  "Good conceptual clarity; recommended for advanced seminar topics.",
  "Exhibits keen interest in practical labs and project implementation.",
  "Cooperative in group workshops; maintains positive classroom engagement.",
  "Displays diligent study habits; shows high potential in logic design."
];

const students = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split('\t');
  const sNo = parts[0] || (i).toString();
  const rawRoll = parts[1] || '';
  const cleanRoll = rawRoll.replace(/[\$,]/g, '').trim();
  const name = parts[2] ? parts[2].replace(/\s+/g, ' ').trim() : 'Not Provided';
  const mentor = parts[3] ? parts[3].replace(/\s+/g, ' ').trim() : 'Hemant Kr Kushwaha';

  // Seed deterministic demo attendance (76% - 96%) and CGPA (7.2 - 9.4)
  const seed = (parseInt(cleanRoll.slice(-3)) || (i * 17)) % 100;
  const attendance = (76 + (seed % 20) + ((seed * 7) % 10) * 0.1).toFixed(1);
  const cgpa = (7.1 + ((seed % 23) * 0.1) + ((seed % 5) * 0.02)).toFixed(2);

  // Simple recommendation labels
  let scholarshipRec;
  let recClass;
  if (parseFloat(cgpa) >= 8.5 && parseFloat(attendance) >= 85) {
    scholarshipRec = "High &ndash; Eligible for Committee Review";
    recClass = "badge-high";
  } else if (parseFloat(cgpa) >= 7.6 && parseFloat(attendance) >= 78) {
    scholarshipRec = "Standard &ndash; Continue / Review";
    recClass = "badge-standard";
  } else {
    scholarshipRec = "Needs Review &ndash; Support Plan";
    recClass = "badge-review";
  }

  const feedback = feedbackBank[(i + seed) % feedbackBank.length];

  // Note duplicate or formatted roll
  let rollFlag = "";
  if (rawRoll.includes('$') || rawRoll.includes(',')) {
    rollFlag = "formatted";
  } else if (rollCounts[cleanRoll] > 1) {
    rollFlag = "duplicate";
  }

  students.push({
    sNo,
    rawRoll,
    name,
    mentor,
    attendance: `${attendance}% (Demo)`,
    cgpa: `${cgpa} (Demo)`,
    scholarshipRec,
    recClass,
    feedback,
    rollFlag
  });
}

// 3. Teacher master records
const teachers = [
  {
    name: "Ashish Patil",
    subject: "OOPJ",
    salary: "&#8377;80,000",
    period: "Period Unspecified",
    tQual: "4.6 / 5.0 (Demo)",
    sComp: "94% (Demo)",
    sFeed: "4.5 / 5.0 (Demo)",
    dSolve: "4.5 / 5.0 (Demo)",
    pCond: "4.8 / 5.0 (Demo)",
    note: "Demonstrates high pedagogical mastery in Object-Oriented Programming (Java). Laboratory engagement and student code reviews are conducted with exceptional rigor. Advisory recommendation: Maintain high standing; final compensation changes require Review Committee approval."
  },
  {
    name: "Silla Ann Regi",
    subject: "DSA",
    salary: "&#8377;1,00,000",
    period: "Period Unspecified",
    tQual: "4.8 / 5.0 (Demo)",
    sComp: "96% (Demo)",
    sFeed: "4.8 / 5.0 (Demo)",
    dSolve: "4.7 / 5.0 (Demo)",
    pCond: "4.9 / 5.0 (Demo)",
    note: "Exceptional depth of instruction in Data Structures & Algorithms. High student comprehension in algorithmic complexity analysis and problem-solving workshops. Advisory recommendation: Exemplary standing; final compensation changes require Review Committee approval."
  },
  {
    name: "Pushpander Kumar",
    subject: "DMS",
    salary: "&#8377;85,000",
    period: "Period Unspecified",
    tQual: "4.4 / 5.0 (Demo)",
    sComp: "91% (Demo)",
    sFeed: "4.3 / 5.0 (Demo)",
    dSolve: "4.2 / 5.0 (Demo)",
    pCond: "4.7 / 5.0 (Demo)",
    note: "Thorough coverage of Discrete Mathematics syllabus with well-structured relational models and graph theory assignments. Advisory recommendation: Commendable performance; final compensation changes require Review Committee approval."
  },
  {
    name: "Rahul Purohit",
    subject: "DLD",
    salary: "&#8377;80,000",
    period: "Period Unspecified",
    tQual: "4.3 / 5.0 (Demo)",
    sComp: "88% (Demo)",
    sFeed: "4.2 / 5.0 (Demo)",
    dSolve: "4.1 / 5.0 (Demo)",
    pCond: "4.6 / 5.0 (Demo)",
    note: "Clear delivery of Digital Logic Design principles, truth tables, and combinational circuits. Laboratory simulation sessions well attended. Advisory recommendation: Solid standing; final compensation changes require Review Committee approval."
  },
  {
    name: "Komal Sharma",
    subject: "ISC",
    salary: "&#8377;50,000",
    period: "Period Unspecified",
    tQual: "4.1 / 5.0 (Demo)",
    sComp: "85% (Demo)",
    sFeed: "4.0 / 5.0 (Demo)",
    dSolve: "3.9 / 5.0 (Demo)",
    pCond: "4.5 / 5.0 (Demo)",
    note: "Comprehensive curriculum coverage in Information Security & Cyber Ethics. Students benefit from case study discussions and security protocols. Advisory recommendation: Satisfactory standing; final compensation changes require Review Committee approval."
  },
  {
    name: "Sourabh Kumar",
    subject: "IOPS",
    salary: "&#8377;80,000",
    period: "Period Unspecified",
    tQual: "4.4 / 5.0 (Demo)",
    sComp: "89% (Demo)",
    sFeed: "4.3 / 5.0 (Demo)",
    dSolve: "4.3 / 5.0 (Demo)",
    pCond: "4.7 / 5.0 (Demo)",
    note: "Effective instruction in Input/Output & Operating Systems architecture, thread management, and memory paging concepts. Advisory recommendation: Commendable performance; final compensation changes require Review Committee approval."
  }
];

// Chunk students into pages: 16, 16, 16, 13 = 61 total across exactly 4 pages
const studentPages = [
  students.slice(0, 16),
  students.slice(16, 32),
  students.slice(32, 48),
  students.slice(48, 61)
];

const totalPages = 1 + studentPages.length + 1; // 1 Cover + 4 Student + 1 Teacher = 6 pages

// Generate HTML
let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>EduFair - Student &amp; Teacher Performance Evaluation Report</title>
<style>
  @page {
    size: A4 landscape;
    margin: 8mm 10mm 8mm 10mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    font-size: 8pt;
    line-height: 1.3;
    background: #ffffff;
  }
  .page {
    width: 277mm;
    height: 194mm;
    max-height: 194mm;
    overflow: hidden;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }
  .page:last-child {
    page-break-after: avoid;
  }

  /* Cover Page Styles */
  .cover-box {
    border: 2px solid #1e3a8a;
    border-radius: 8px;
    padding: 8mm 12mm;
    height: 184mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #eff6ff 100%);
  }
  .cover-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
  }
  .inst-title {
    font-size: 11pt;
    font-weight: 800;
    color: #1e3a8a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .inst-sub {
    font-size: 7.5pt;
    color: #64748b;
  }
  .cover-center {
    text-align: center;
    padding: 4mm 0;
  }
  .cover-tag {
    display: inline-block;
    background: #1e3a8a;
    color: #ffffff;
    font-size: 11pt;
    font-weight: 800;
    padding: 4px 14px;
    border-radius: 4px;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }
  .cover-h1 {
    font-size: 20pt;
    font-weight: 800;
    color: #0f172a;
    margin: 4px 0;
    letter-spacing: -0.4px;
  }
  .cover-h2 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #2563eb;
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .cover-desc {
    font-size: 8.5pt;
    color: #475569;
    max-width: 640px;
    margin: 0 auto;
    line-height: 1.35;
  }

  /* Warning Box */
  .warning-alert {
    background: #fef2f2;
    border: 2px solid #ef4444;
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
  }
  .warning-heading {
    font-size: 10pt;
    font-weight: 900;
    color: #b91c1c;
    letter-spacing: 0.8px;
  }
  .warning-text {
    font-size: 7.5pt;
    color: #991b1b;
    margin-top: 3px;
    line-height: 1.3;
  }

  .cover-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .metric-tile {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    padding: 6px 8px;
    text-align: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }
  .metric-label {
    font-size: 7pt;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
  }
  .metric-value {
    font-size: 9pt;
    font-weight: 800;
    color: #1e3a8a;
    margin-top: 2px;
  }

  .cover-sigs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    border-top: 1px dashed #cbd5e1;
    padding-top: 8px;
  }
  .sig-col {
    text-align: center;
  }
  .sig-dash {
    border-bottom: 1px solid #94a3b8;
    height: 20px;
    margin-bottom: 4px;
  }
  .sig-title {
    font-size: 7.2pt;
    font-weight: 700;
    color: #1e293b;
  }
  .sig-sub {
    font-size: 6.5pt;
    color: #64748b;
  }

  /* Running Header */
  .running-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1.5px solid #1e3a8a;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
  .rh-left {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .rh-brand {
    font-size: 11pt;
    font-weight: 800;
    color: #1e3a8a;
  }
  .rh-title {
    font-size: 8.5pt;
    font-weight: 700;
    color: #475569;
  }
  .rh-badge {
    background: #dc2626;
    color: #ffffff;
    font-weight: 800;
    font-size: 7pt;
    padding: 2px 8px;
    border-radius: 3px;
    letter-spacing: 0.6px;
  }

  /* Table */
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 7.5pt;
  }
  thead th {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 4px 6px;
    font-size: 7.3pt;
    border: 1px solid #1e3a8a;
    vertical-align: middle;
  }
  tbody td {
    padding: 3.8px 6px;
    border: 1px solid #cbd5e1;
    vertical-align: middle;
    word-wrap: break-word;
  }
  tbody tr:nth-child(even) {
    background-color: #f8fafc;
  }
  tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }

  /* Recommendation Badges */
  .badge-high {
    display: inline-block;
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
    font-size: 6.5pt;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    line-height: 1.2;
  }
  .badge-standard {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #7dd3fc;
    font-size: 6.5pt;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    line-height: 1.2;
  }
  .badge-review {
    display: inline-block;
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
    font-size: 6.5pt;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    line-height: 1.2;
  }
  .badge-audit {
    display: inline-block;
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fca5a5;
    font-size: 6pt;
    font-weight: 700;
    padding: 0.5px 3px;
    border-radius: 2px;
    margin-left: 2px;
    text-transform: uppercase;
  }

  /* Running Footer */
  .running-footer {
    border-top: 1px solid #cbd5e1;
    padding-top: 3px;
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 6.8pt;
    color: #64748b;
  }
  .rf-warn {
    color: #dc2626;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  /* Teacher Overview Cards */
  .t-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 6px;
  }
  .t-card {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 5px;
    padding: 4px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tc-lbl {
    font-size: 7pt;
    color: #1e40af;
    font-weight: 600;
  }
  .tc-val {
    font-size: 9.5pt;
    color: #1e3a8a;
    font-weight: 800;
  }

  .committee-box {
    background: #f8fafc;
    border-left: 4px solid #1e3a8a;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 6.8pt;
    color: #334155;
    margin-top: 5px;
    line-height: 1.3;
  }
</style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER PAGE ==================== -->
  <div class="page">
    <div class="cover-box">
      <div class="cover-header-bar">
        <div>
          <div class="inst-title">EduFair Performance Evaluation System</div>
          <div class="inst-sub">Autonomous Institutional Analytics &amp; Scholarship Review Portal</div>
        </div>
        <div style="text-align: right;">
          <span style="background: #1e3a8a; color: #fff; font-size: 7.2pt; font-weight: 700; padding: 2px 7px; border-radius: 3px;">
            ACADEMIC SESSION 2026&ndash;2027
          </span>
        </div>
      </div>

      <div class="cover-center">
        <div class="cover-tag">EDUFAIR ACADEMIC REGISTER</div>
        <h1 class="cover-h1">Student &amp; Teacher Performance Evaluation System</h1>
        <div class="cover-h2">Institutional Performance, Scholarship Screening &amp; Faculty Register</div>
        <p class="cover-desc">
          Consolidated performance metrics register compiling all 61 student master database records and 6 designated faculty appointments for the Department of Computer Science &amp; Engineering.
        </p>
      </div>

      <div class="warning-alert">
        <div class="warning-heading">⚠️ DEMO DATA &ndash; NOT OFFICIAL / NOT VERIFIED ⚠️</div>
        <div class="warning-text">
          <strong>Mandatory Notice:</strong> All student attendance figures, CGPA values, scholarship review recommendations, teacher evaluation criteria ratings, and review notes in this report are simulated demonstration values generated for system validation. They do <u>not</u> represent official institutional data. Scholarship awards and faculty salary adjustments require authorized human committee deliberation and official administrative approval.
        </div>
      </div>

      <div class="cover-metrics">
        <div class="metric-tile">
          <div class="metric-label">Total Student Records</div>
          <div class="metric-value">${students.length} Records (Preserved)</div>
        </div>
        <div class="metric-tile">
          <div class="metric-label">Faculty Appointments</div>
          <div class="metric-value">${teachers.length} Master Teachers</div>
        </div>
        <div class="metric-tile">
          <div class="metric-label">Base Faculty Salary Pool</div>
          <div class="metric-value">&#8377;4,75,000 INR</div>
        </div>
        <div class="metric-tile">
          <div class="metric-label">Report Classification</div>
          <div class="metric-value" style="color: #dc2626;">DEMO PROTOTYPE</div>
        </div>
      </div>

      <div class="cover-sigs">
        <div class="sig-col">
          <div class="sig-dash"></div>
          <div class="sig-title">Hemant Kr Kushwaha</div>
          <div class="sig-sub">Faculty Mentor (Ecode: J5177)</div>
        </div>
        <div class="sig-col">
          <div class="sig-dash"></div>
          <div class="sig-title">Head of Department</div>
          <div class="sig-sub">Computer Science &amp; Engineering</div>
        </div>
        <div class="sig-col">
          <div class="sig-dash"></div>
          <div class="sig-title">Dean of Academic Affairs</div>
          <div class="sig-dept">Academic Review Committee</div>
        </div>
        <div class="sig-col">
          <div class="sig-dash"></div>
          <div class="sig-title">Controller of Examinations</div>
          <div class="sig-dept">Scholarship Oversight Board</div>
        </div>
      </div>
    </div>

    <div class="running-footer">
      <div>EduFair Performance Evaluation System &bull; Academic Year 2026&ndash;2027</div>
      <div class="rf-warn">DEMO DATA &ndash; NOT OFFICIAL / NOT VERIFIED</div>
      <div>Page 1 of ${totalPages}</div>
    </div>
  </div>
`;

// ==================== PAGES 2 to 5: STUDENT PERFORMANCE REGISTER ====================
studentPages.forEach((pageStudents, pageIdx) => {
  const currentPageNum = 2 + pageIdx;
  const startNum = studentPages.slice(0, pageIdx).reduce((acc, p) => acc + p.length, 0) + 1;
  const endNum = startNum + pageStudents.length - 1;

  html += `
  <!-- ==================== PAGE ${currentPageNum}: STUDENT REGISTER ==================== -->
  <div class="page">
    <div>
      <div class="running-header">
        <div class="rh-left">
          <span class="rh-brand">EduFair System</span>
          <span class="rh-title">&bull; Student Performance Register (Records ${startNum}&ndash;${endNum} of ${students.length})</span>
        </div>
        <div>
          <span class="rh-badge">DEMO DATA &ndash; NOT OFFICIAL / NOT VERIFIED</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 3.5%; text-align: center;">#</th>
            <th style="width: 13.5%;">Roll Number</th>
            <th style="width: 16.5%;">Student Name</th>
            <th style="width: 15%;">Mentor Name</th>
            <th style="width: 10.5%; text-align: center;">Attendance %</th>
            <th style="width: 10%; text-align: center;">CGPA (out of 10)</th>
            <th style="width: 17%;">Scholarship Review Recommendation</th>
            <th style="width: 14%;">Teacher Feedback</th>
          </tr>
        </thead>
        <tbody>
`;

  pageStudents.forEach((st, idx) => {
    const globalIdx = startNum + idx;
    let rollDisplay = `<strong>${st.rawRoll}</strong>`;
    if (st.rollFlag === 'duplicate') {
      rollDisplay += ` <span class="badge-audit" title="Source Duplicate Entry">Duplicate</span>`;
    } else if (st.rollFlag === 'formatted') {
      rollDisplay += ` <span class="badge-audit" title="Source Raw Currency/Formatted String">Raw Source</span>`;
    }

    html += `
          <tr>
            <td style="text-align: center; color: #64748b; font-weight: 600;">${globalIdx}</td>
            <td>${rollDisplay}</td>
            <td style="font-weight: 600; color: #0f172a;">${st.name}</td>
            <td style="color: #334155;">${st.mentor}</td>
            <td style="text-align: center; font-weight: 600; color: #1e3a8a;">${st.attendance}</td>
            <td style="text-align: center; font-weight: 700; color: #0f172a;">${st.cgpa}</td>
            <td><span class="${st.recClass}">${st.scholarshipRec}</span></td>
            <td style="font-size: 7.2pt; color: #334155;">${st.feedback}</td>
          </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>

    <div>
      <div style="font-size: 6.5pt; color: #64748b; margin-top: 3px; border-top: 1px dotted #cbd5e1; padding-top: 2px; display: flex; justify-content: space-between;">
        <span>* Field Inclusions: Roll Number, Student Name, Mentor Name, Attendance %, CGPA (out of 10), Scholarship Review Recommendation, Teacher Feedback.</span>
        <span style="color: #b91c1c; font-weight: 700;">Zero unapproved marks or sensitive performance calculations included.</span>
      </div>
      <div class="running-footer">
        <div>EduFair Performance Evaluation System &bull; Student Performance Register</div>
        <div class="rf-warn">DEMO DATA &ndash; NOT OFFICIAL / NOT VERIFIED</div>
        <div>Page ${currentPageNum} of ${totalPages}</div>
      </div>
    </div>
  </div>
`;
});

// ==================== PAGE 6: TEACHER PERFORMANCE REGISTER ====================
html += `
  <!-- ==================== PAGE ${totalPages}: TEACHER REGISTER ==================== -->
  <div class="page">
    <div>
      <div class="running-header">
        <div class="rh-left">
          <span class="rh-brand">EduFair System</span>
          <span class="rh-title">&bull; Teacher Performance Register (Faculty Evaluation &amp; Salary Ledger)</span>
        </div>
        <div>
          <span class="rh-badge">DEMO DATA &ndash; NOT OFFICIAL / NOT VERIFIED</span>
        </div>
      </div>

      <div class="t-cards">
        <div class="t-card">
          <span class="tc-lbl">Faculty Members</span>
          <span class="tc-val">6 Teachers</span>
        </div>
        <div class="t-card">
          <span class="tc-lbl">Base Salary Pool</span>
          <span class="tc-val">&#8377;4,75,000 INR</span>
        </div>
        <div class="t-card">
          <span class="tc-lbl">Salary Period</span>
          <span class="tc-val" style="font-size: 8pt; font-weight: 700; color: #475569;">Unspecified</span>
        </div>
        <div class="t-card">
          <span class="tc-lbl">Compensation Review</span>
          <span class="tc-val" style="font-size: 7.5pt; font-weight: 700; color: #dc2626;">Human Committee Req.</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 13%;">Teacher Name</th>
            <th style="width: 6%; text-align: center;">Subject</th>
            <th style="width: 11%; text-align: right;">Salary (INR)</th>
            <th style="width: 9%; text-align: center;">Teaching Quality</th>
            <th style="width: 9%; text-align: center;">Syllabus Completion</th>
            <th style="width: 9%; text-align: center;">Student Feedback</th>
            <th style="width: 9%; text-align: center;">Doubt-Solving</th>
            <th style="width: 9%; text-align: center;">Professional Conduct</th>
            <th style="width: 25%;">Teacher Feedback / Review Note</th>
          </tr>
        </thead>
        <tbody>
`;

teachers.forEach((tch) => {
  html += `
          <tr>
            <td style="font-weight: 700; color: #0f172a; font-size: 8.2pt;">
              ${tch.name}
            </td>
            <td style="text-align: center; font-weight: 700; color: #1e3a8a;">
              <span style="background: #dbeafe; color: #1e40af; padding: 2px 5px; border-radius: 3px;">${tch.subject}</span>
            </td>
            <td style="text-align: right; font-weight: 800; color: #0f172a; font-size: 8.5pt;">
              ${tch.salary}
              <div style="font-size: 6.2pt; color: #64748b; font-weight: 500;">Period Unspecified</div>
            </td>
            <td style="text-align: center; font-weight: 600; color: #1e3a8a;">${tch.tQual}</td>
            <td style="text-align: center; font-weight: 600; color: #15803d;">${tch.sComp}</td>
            <td style="text-align: center; font-weight: 600; color: #1e3a8a;">${tch.sFeed}</td>
            <td style="text-align: center; font-weight: 600; color: #1e3a8a;">${tch.dSolve}</td>
            <td style="text-align: center; font-weight: 600; color: #1e3a8a;">${tch.pCond}</td>
            <td style="font-size: 7pt; color: #334155; line-height: 1.25;">
              ${tch.note}
            </td>
          </tr>
  `;
});

html += `
        </tbody>
      </table>

      <div class="committee-box">
        <strong>Administrative Review Committee Policy:</strong> In strict compliance with institutional guidelines, all teacher evaluation ratings, qualitative feedback, and advisory review notes are non-binding recommendations. The EduFair system does not automatically execute salary increments or decrements. Any modification to faculty remuneration requires formal evaluation and unanimous sign-off by the Institutional Compensation &amp; Review Committee.
      </div>
    </div>

    <div>
      <div style="font-size: 6.5pt; color: #64748b; margin-top: 3px; border-top: 1px dotted #cbd5e1; padding-top: 2px; display: flex; justify-content: space-between;">
        <span>* Field Inclusions: Teacher Name, Subject, Salary (INR; period unspecified), Teaching Quality, Syllabus Completion, Student Feedback, Doubt-Solving Performance, Professional Conduct, Review Note.</span>
        <span style="color: #b91c1c; font-weight: 700;">Zero unapproved marks or sensitive performance calculations included.</span>
      </div>
      <div class="running-footer">
        <div>EduFair Performance Evaluation System &bull; Teacher Performance Register</div>
        <div class="rf-warn">DEMO DATA &ndash; NOT OFFICIAL / NOT VERIFIED</div>
        <div>Page ${totalPages} of ${totalPages}</div>
      </div>
    </div>
  </div>

</body>
</html>
`;

// Write the HTML to file
const htmlPath = path.join(__dirname, 'edufair_report.html');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Successfully generated ${htmlPath} (Size: ${html.length} bytes, Pages: ${totalPages})`);
