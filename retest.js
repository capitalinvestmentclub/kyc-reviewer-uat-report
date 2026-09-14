// Prepared overlay only. Original campaign findings and scores remain authoritative.
// Do not set Fixed/verifiedAt until deployed real-API Chrome evidence is reviewed.
(() => {
  const sizes = ['360×800', '390×844', '768×1024', '1024×768', '1280×800', '1440×900'];
  const commits = {
    webapp: null,
    webapi: null,
    notificationservice: null,
  };
  window.PR_REVIEW_RETEST_PLAN = {
    state: 'Historical exhaustive matrix remains open; current targeted deployed results are shown separately.',
    browser: 'Chrome',
    sizes,
    commits,
    deployment: null,
    scope: 'Four critical/high defect regressions × six Chrome sizes. Original 30-scenario campaign remains unchanged; no campaign-wide completion claim.',
    acceptanceMatrix: 'deployed-retest-matrix.json',
    scoringEvidence: [],
    localReadiness: 'Focused unit/integration tests and a mocked Chromium regression passed. Local readiness only; not UAT evidence and not proof of this exact six-size matrix.',
    scenarios: Array.from({length: 30}, (_, index) => ({
      id: 'KYCR-' + String(index + 1).padStart(3, '0'),
      sizes: sizes.map(size => ({size, status: 'PENDING', evidence: []})),
    })),
  };
  const summaries = {
    "KYCR-F001": "Clear incompatible member session state before reviewer authentication.",
    "KYCR-F002": "Keep the primary Review action visible in the sticky first queue column.",
    "KYCR-F003": "Return one newest canonical record per applicant; preserve unrelated legacy orphan rows and reject duplicate creation.",
    "KYCR-F005": "Prefer authorized signed document URLs with safe legacy fallback for readable Chrome evidence."
};

window.CHROME_RETEST_SIZES = sizes;
const targetFindings = window.PR_REVIEW_DATA.findings.filter(finding => Object.prototype.hasOwnProperty.call(summaries, finding.id));
const pendingCell = 'PENDING';
const pendingStatus = 'Open — original finding closure pending';
const pendingResolution = 'Fixes are merged and deployed. Current targeted outcomes are recorded in the dated retest section; original finding closure remains pending where full acceptance evidence is incomplete.';
const pendingBrowser = 'Chrome';
const pendingEnvironment = 'Deployment identifier and real API target pending';
const pendingCheck = 'PENDING — no deployed verification recorded';
const pendingFix = finding => ({fix: {summary: summaries[finding.id], evidence: []}});
const verificationEvidence = evidence => ({verificationEvidence: evidence});

const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const isoDate = (value) => nonempty(value)
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  && Number.isFinite(Date.parse(value));
window.DEPLOYED_RETEST_RESULTS = window.DEPLOYED_RETEST_RESULTS || {};
window.buildChromeRetestUpdates = (results = {}) => Object.fromEntries(
  targetFindings.map((finding) => {
    const result = results?.[finding.id] || {};
    const suppliedSizes = Array.isArray(result.sizes) ? result.sizes.filter(item => item && typeof item === 'object') : [];
    const cells = window.CHROME_RETEST_SIZES.map(size => {
      const supplied = suppliedSizes.find(item => item.size === size);
      return {size, status: ['Pass', 'Fail', 'Blocked'].includes(supplied?.status) ? supplied.status : pendingCell};
    });
    const visuals = window.CHROME_RETEST_SIZES.flatMap(size => {
      const evidence = suppliedSizes.find(item => item.size === size)?.evidence;
      return nonempty(evidence?.src) && nonempty(evidence?.caption) && isoDate(evidence?.capturedAt)
        ? [{...evidence, size}] : [];
    });
    const complete = result.browser === 'Google Chrome'
      && result.environment === 'deployed development'
      && result.frontend === 'https://planar-truck-361704.uc.r.appspot.com'
      && result.api === 'https://cicdevapi.uc.r.appspot.com'
      && isoDate(result.verifiedAt) && nonempty(result.summary)
      && ['webapp', 'webapi', 'notificationservice'].every(repo =>
        /^[a-f0-9]{40}$/i.test(result.deployments?.[repo]?.commit || '')
        && nonempty(result.deployments?.[repo]?.version))
      && suppliedSizes.length === window.CHROME_RETEST_SIZES.length
      && window.CHROME_RETEST_SIZES.every(size => suppliedSizes.filter(item => item.size === size).length === 1)
      && cells.every(cell => cell.status === 'Pass')
      && visuals.length === window.CHROME_RETEST_SIZES.length;
    const evidence = visuals.map(item => ({label: item.size + ' Chrome evidence', url: item.src, note: item.caption}));
    return [finding.id, {
      status: complete ? 'Fixed' : pendingStatus,
      resolution: complete ? result.summary : pendingResolution,
      ...(complete ? {verifiedAt: result.verifiedAt} : {}),
      retest: {
        browser: complete ? 'Google Chrome' : pendingBrowser,
        environment: complete ? 'deployed development' : pendingEnvironment,
        check: result.check || pendingCheck || finding.remediation || finding.expected,
        sizes: cells,
        ...(complete ? {frontend: result.frontend, api: result.api, deployments: result.deployments} : {}),
      },
      visuals: [...(finding.visuals || []), ...visuals],
      ...(complete ? {fix: {summary: result.summary, evidence}} : pendingFix(finding)),
      ...verificationEvidence(evidence),
    }];
  })
);
window.chromeRetestSummary = (updates = window.PR_REVIEW_UPDATES) => {
  const entries = Object.values(updates || {});
  const verified = entries.filter(item => item.status === 'Fixed').length;
  const complete = entries.length > 0 && verified === entries.length;
  return 'Deployed defect retest · ' + verified + '/' + entries.length
    + ' critical/high findings verified · Chrome only × six exact sizes. '
    + (complete ? 'Defect retest complete; historical campaign results unchanged.'
      : 'Deployed verification ' + (verified ? 'is partial' : 'is pending')
        + '; remaining findings are open; no release-pass claim or historical score change is made.');
};
window.PR_REVIEW_UPDATES = window.buildChromeRetestUpdates(window.DEPLOYED_RETEST_RESULTS);
const pendingNotice = document.createElement('div');
pendingNotice.className = 'campaign-note';
pendingNotice.id = 'pending-retest-summary';
pendingNotice.textContent = window.chromeRetestSummary();
document.querySelector('.metrics').insertAdjacentElement('afterend', pendingNotice);
const verified = Object.values(window.PR_REVIEW_UPDATES).filter(item => item.status === 'Fixed').length;
if (verified > 0) window.PR_REVIEW_RETEST_PLAN.state = window.chromeRetestSummary();
})();
