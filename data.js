const report = {
  cutoff: '2026-09-12 interim checkpoint',
  sizes: ['360×800','390×844','768×1024','1024×768','1280×800','1440×900'],
  scenarios: [
    [1,'Employee authentication and session boundaries','FAIL · Sign-in works after stale-state recovery; wrong-password response is generic.','Complete session-expiry and boundary checks.','dashboard inspected'],
    [2,'Queue status counts, search and pagination','FAIL · Five status counts and filters inspected; unique exact search returned the same applicant three times.','Complete pagination, empty and boundary cases.','incomplete'],
    [3,'Assignment overview and dashboard metrics','IN PROGRESS · Dashboard metrics and time-range controls inspected.','Complete metric reconciliation and accessibility checks.','six sizes inspected'],
    [4,'Submitted facts and individual evidence','IN PROGRESS · Submitted facts and required evidence inspected.','Complete every field and evidence branch.','incomplete'],
    [5,'Sensitive reveal reasons and audit','IN PROGRESS · Reveal reason length, whitespace, valid reveal and remasking observed.','Verify complete audit history and role boundaries.','incomplete'],
    [6,'Document preview failure and owner isolation','FAIL · Passport preview was black, photograph blank, and Open document did not navigate.','Retest fixed previews and complete isolation checks.','incomplete'],
    [7,'Field decisions, comments and draft persistence','NOT RUN','Execute full scenario.','not run'],
    [8,'Professional qualifications and optional evidence','IN PROGRESS · Qualification and optional-evidence surfaces inspected.','Complete decisions, persistence and boundaries.','incomplete'],
    [9,'Financial identifiers and declarations','IN PROGRESS · Financial identifier and declaration surfaces inspected.','Complete masking, decisions and validation.','incomplete'],
    [10,'Referee response and refresh lifecycle','BLOCKED · Controlled referee mailbox was unavailable.','Provide a controlled mailbox and complete lifecycle.','blocked'],
    [11,'Email verification resend and proof of control','NOT RUN','Execute full scenario.','not run'],
    [12,'Concurrent review and stale-record protection','NOT RUN','Execute full scenario.','not run'],
    [13,'Network interruption and resumable work','NOT RUN','Execute full scenario.','not run'],
    [14,'Keyboard, screen reader and responsive workbench','NOT RUN','Execute full scenario.','not run'],
    [15,'First review assignment and start','NOT RUN','Execute full scenario.','not run'],
    [16,'Submit reviewed individual for approval','NOT RUN','Execute full scenario.','not run'],
    [17,'Rejected evidence blocks submit','NOT RUN','Execute full scenario.','not run'],
    [18,'Reject application and applicant resubmission','NOT RUN','Execute full scenario.','not run'],
    [19,'Approver return and reviewer rework','NOT RUN','Execute full scenario.','not run'],
    [20,'Current validity and new requirements','NOT RUN','Execute full scenario.','not run'],
    [21,'Corporate submission to mark reviewed','NOT RUN','Execute full scenario.','not run'],
    [22,'Corporate reject, correct and resubmit','NOT RUN','Execute full scenario.','not run'],
    [23,'AIR queue search, filters and evidence','NOT RUN','Execute full scenario.','not run'],
    [24,'AIR approve and withdrawal release','NOT RUN','Execute full scenario.','not run'],
    [25,'AIR reject and corrective response','NOT RUN','Execute full scenario.','not run'],
    [26,'Correction case claim, query and member response','NOT RUN','Execute full scenario.','not run'],
    [27,'Correction case resolution and release','NOT RUN','Execute full scenario.','not run'],
    [28,'Appeal lifecycle and independent outcome','NOT RUN','Execute full scenario.','not run'],
    [29,'Full individual onboarding to investment','NOT RUN','Execute full scenario.','not run'],
    [30,'Full corporate KYB and compliance closeout','NOT RUN','Execute full scenario.','not run']
  ],
  findings: [
    {id:'KYCR-F005',severity:'Critical',scenario:'KYCR-004 / KYCR-006 / KYCR-009',area:'Document review',title:'Required applicant documents remain unreadable',steps:'Open an assigned individual review and inspect the passport PDF, photograph, and Open document action.',description:'The passport PDF preview remained black, the photograph preview was blank, and Open document did not navigate.',expected:'Required evidence must render legibly or open through an authorized fallback so a reviewer can make an evidence-based decision.',evidenceStatus:'Observed defect'},
    {id:'KYCR-F003',severity:'High',scenario:'KYCR-002',area:'Reviewer queue',title:'Unique exact queue search returns the same applicant three times',steps:'Search the reviewer queue using a unique exact applicant value and inspect the result rows.',description:'The same applicant appeared three times for a search that should identify one queue record.',expected:'A unique exact search must return one canonical queue record without duplicate rows.',evidenceStatus:'Observed defect'},
    {id:'KYCR-F002',severity:'High',scenario:'KYCR-001 / KYCR-002',area:'Responsive queue',title:'Mobile queue actions are off-screen',steps:'Open the reviewer queue in Chrome at 360×800 and 390×844 and inspect row actions.',description:'Queue actions extended beyond the visible mobile viewport and were not readily reachable.',expected:'Primary queue actions must remain visible and operable at supported mobile widths.',evidenceStatus:'Observed defect'},
    {id:'KYCR-F001',severity:'High',scenario:'KYCR-001',area:'Authentication',title:'Stale member state redirects reviewer login to the wrong portal',steps:'With stale member state present, navigate to /kyc-login and attempt to use valid reviewer credentials.',description:'The route redirected to member login, where valid reviewer credentials could not work; a second direct navigation was required.',expected:'Reviewer login must clear or override incompatible member state and present the reviewer authentication path directly.',evidenceStatus:'Observed defect'},
    {id:'KYCR-F004',severity:'Medium',scenario:'KYCR-003',area:'Dashboard accessibility',title:'Time-range change gives Request Distribution the wrong accessible name',steps:'Change the Your Progress time range and inspect the accessible name of the Request Distribution control.',description:'The Request Distribution control inherited the wrong accessible name after the time-range change.',expected:'Each dashboard control must retain an accurate, unique accessible name after state changes.',evidenceStatus:'Observed defect'}
  ],
  gaps: [
    ['Cross-browser coverage','Safari and Edge','Only Google Chrome is available in the current execution environment.'],
    ['Real-device coverage','iPhone and Android','Exact Chrome CSS viewports were used; physical mobile devices remain unavailable.'],
    ['Referee lifecycle','KYCR-010','Controlled referee mailboxes are required to prove delivery, response and refresh behavior.'],
    ['Destructive and isolated fixtures','Correction, rejection and appeal flows','Safe disposable fixture clones and independent employee/Admin profiles are not yet reliable or available.'],
    ['Remaining execution','21 scenarios','Scenarios KYCR-011 through KYCR-030 plus KYCR-007 have not started; no final score is assigned.'],
    ['Public visual evidence','Current interim findings','Private run records exist, but sanitized screenshot export is still pending.']
  ]
};

const escapeText = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
window.PR_REVIEW_DATA = {
  meta: {commit:'08af53f6',generatedAt:'2026-09-12T05:30:00Z',checkpoint:report.cutoff,url:'https://github.com/capitalinvestmentclub/kyc-reviewer-uat-report'},
  findings: report.findings.map(finding => ({...finding,type:'Defect',status:'Open',visuals:[]}))
};
document.getElementById('scenarios').innerHTML = report.scenarios.map(([number,title,observed,needed,sizeRecord]) => `<tr id="scenario-${number}"><td>KYCR-${String(number).padStart(3,'0')}<br>${escapeText(title)}<br><span class="history">${escapeText(observed.split(' · ')[0])}</span></td><td>${escapeText(observed)}</td><td>${escapeText(needed)}</td><td><div class="cells">${report.sizes.map(size => `<span>${size} · ${escapeText(sizeRecord)}</span>`).join('')}</div></td></tr>`).join('');
document.getElementById('gaps').innerHTML = report.gaps.map(([title,scope,body]) => `<article><h3>${escapeText(title)}</h3><small>${escapeText(scope)}</small><p>${escapeText(body)}</p></article>`).join('');
