const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8');
const data=fs.readFileSync('data.js','utf8');
const retest=fs.readFileSync('retest.js','utf8');
const app=fs.readFileSync('app.js','utf8');
function setup(query=''){
  const dom=new JSDOM(html,{url:'https://capitalinvestmentclub.github.io/kyc-reviewer-uat-report/'+query,runScripts:'outside-only'});
  const w=dom.window,d=w.document;
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.URL.createObjectURL=()=> 'blob:test'; w.URL.revokeObjectURL=()=>{};
  w.navigator.clipboard={writeText:async()=>{}};
  w.setTimeout=fn=>{fn();return 1;}; w.clearTimeout=()=>{};
  vm.runInContext(data,dom.getInternalVMContext());
  vm.runInContext(retest,dom.getInternalVMContext());
  vm.runInContext(app,dom.getInternalVMContext());
  return {dom,w,d,$:selector=>d.querySelector(selector),all:selector=>[...d.querySelectorAll(selector)]};
}
test('uses the established report template with the complete interim KYC ledger',()=>{
  const x=setup();
  assert.equal(x.all('.finding-row').length,5);
  assert.equal(x.all('#scenarios tr').length,30);
  assert.equal(x.all('.cells span').length,180);
  assert.equal(x.$('#metric-total').textContent,'5');
  assert.equal(x.$('#metric-urgent').textContent,'4');
  assert.equal(x.$('#metric-open').textContent,'5');
  assert.match(x.d.body.textContent,/Blocked · UAT in progress/);
  assert.match(x.d.body.textContent,/no final UAT score/i);
  assert.ok(!x.d.body.textContent.includes('Pitcher go-live findings'));
  x.dom.window.close();
});
test('filters, finding detail, deep links and coverage remain interactive',()=>{
  const x=setup();
  x.$('#search').value='documents';
  x.$('#search').dispatchEvent(new x.w.Event('input'));
  assert.equal(x.all('.finding-row').length,1);
  x.$('.finding-row').click();
  assert.ok(x.$('dialog').open);
  assert.match(x.$('#dialog-content').textContent,/passport PDF preview remained black/i);
  x.$('#dialog-close').click();
  assert.equal(x.w.location.hash,'');
  x.dom.window.close();
  const y=setup('#KYCR-F001');
  assert.ok(y.$('dialog').open);
  assert.match(y.$('#dialog-title').textContent,/Stale member state/);
  y.dom.window.close();
});
test('public artifact excludes credentials and unsupported completion claims',()=>{
  for(const file of ['index.html','data.js','app.js']){
    const value=fs.readFileSync(file,'utf8');
    assert.doesNotMatch(value,/password\s*[:=]/i);
    assert.doesNotMatch(value,/15\/15 passed|90\/90|gate passed/i);
  }
});
