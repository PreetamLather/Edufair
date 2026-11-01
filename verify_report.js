const fs = require('fs');

const html = fs.readFileSync('edufair_report.html', 'utf8');

const forbidden = [
  'Assignment Marks',
  'Internal Marks',
  'Exam Results',
  'Demo Score',
  'Overall Performance Score'
];

let allPassed = true;
forbidden.forEach(phrase => {
  const present = html.toLowerCase().includes(phrase.toLowerCase());
  console.log(`${phrase} present: ${present}`);
  if (present) allPassed = false;
});

// Check that warning appears on cover and every page
const warningMatches = html.match(/DEMO DATA &ndash; NOT OFFICIAL \/ NOT VERIFIED/g);
console.log(`Warning count: ${warningMatches ? warningMatches.length : 0}`);

// Check student count
const stMatches = html.match(/<td style="font-weight: 600; color: #0f172a;">/g);
console.log(`Student table rows count: ${stMatches ? stMatches.length : 0}`);

// Check all 6 teachers
const teacherNames = [
  'Ashish Patil',
  'Silla Ann Regi',
  'Pushpander Kumar',
  'Rahul Purohit',
  'Komal Sharma',
  'Sourabh Kumar'
];
teacherNames.forEach(t => {
  console.log(`Teacher '${t}': ${html.includes(t)}`);
});

// Check subjects & salaries
const subjects = ['OOPJ', 'DSA', 'DMS', 'DLD', 'ISC', 'IOPS'];
subjects.forEach(s => {
  console.log(`Subject '${s}': ${html.includes(s)}`);
});

const salaries = ['&#8377;80,000', '&#8377;1,00,000', '&#8377;85,000', '&#8377;50,000'];
salaries.forEach(sal => {
  console.log(`Salary '${sal}': ${html.includes(sal)}`);
});

console.log('All checks passed successfully:', allPassed && warningMatches.length >= 6 && stMatches.length === 61);
