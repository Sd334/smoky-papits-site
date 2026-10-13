const assert=require('node:assert/strict'),M=require('../js/practice-model.js');
const s=M.empty();
for(const row of [...M.structure,...M.keywords])s.fields[row[0]]=row[2];
for(const row of M.auditQuestions)s.fields[row[0]]=row[3];
s.fields['meta-title-index']='Бар Smoky Papits в Уфе — меню';s.fields['meta-h1-index']='Учебный бар Smoky Papits';s.fields['meta-description-index']='Учебный бар Smoky Papits: посмотрите меню и афишу.';
Object.assign(s.fields,{'link-target':'cocktails','link-anchor':'Коктейльное меню','rewrite-text':'Smoky Papits — учебный сайт бара. Посмотрите меню; форма демонстрационная и не принимает реальные брони.','metric-ctr':'5,0','metric-conversion':'4','metric-meaning':'demo','case-problem':'Непонятный анкор на главной','case-change':'Предложил понятный анкор, ещё не внедрял','case-check':'Проверил адрес и предпросмотр в тренажёре','case-result':'Готов черновик. Данных о трафике нет.','case-next':'Подготовить изменение на GitHub','practice-notes':'Старая заметка\nНовый вывод'});s.audit={passed:36,total:37,date:'2026-10-13T16:00:00Z'};
for(const step of M.steps){assert.equal(M.grade(step,s).passed,true,step);s.checked[step]=true;assert.equal(M.grade(step,M.empty()).passed,false,step+' accepts empty answers');}
assert.equal(M.grade('titles',{...s,fields:{...s.fields,'meta-title-index':'Бар Smoky Papits в Уфе — бар'}}).passed,false);
assert.equal(M.grade('titles',{...s,fields:{...s.fields,'meta-title-index':'Бар Smoky Papits'}}).passed,false);
for(const p of M.pages){const f={...s.fields,'meta-page':p.id};f['meta-title-'+p.id]=`${p.name} Smoky Papits в Уфе`;f['meta-h1-'+p.id]=p.name;f['meta-description-'+p.id]=`Учебный проект Smoky Papits: ${p.name}.`;if(p.id==='index'){f['meta-title-index']='Бар Smoky Papits в Уфе';f['meta-h1-index']='Бар';f['meta-description-index']='Учебный бар Smoky Papits';}assert.equal(M.grade('titles',{...s,fields:f}).passed,true,p.id);}
for(const bad of ['лучший бар','10 000 гостей','гарантированная бронь за минуту','коктейли лечат стресс'])assert.equal(M.grade('rewrite',{...s,fields:{...s.fields,'rewrite-text':s.fields['rewrite-text']+' '+bad}}).passed,false,bad);
assert.equal(M.grade('links',{...s,fields:{...s.fields,'link-target':'contacts'}}).passed,false);
assert.equal(M.grade('links',{...s,fields:{...s.fields,'link-anchor':'нажмите тут'}}).passed,false);
assert.equal(M.grade('metrics',{...s,fields:{...s.fields,'metric-ctr':''}}).checks[0].ok,false);
assert.equal(M.grade('metrics',{...s,fields:{...s.fields,'metric-meaning':'booking'}}).passed,false);
const restored=M.validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);for(const step of M.steps)assert.equal(M.grade(step,restored).passed,true);
assert.equal(M.validate({version:1,project:s.project,notes:'Мои старые заметки'}).fields['practice-notes'],'Мои старые заметки');
assert.throws(()=>M.validate({version:2,project:s.project,fields:{'practice-notes':'x'.repeat(12001)}}));assert.throws(()=>M.validate({version:2,project:s.project,fields:{'link-anchor':{html:'bad'}}}));assert.throws(()=>M.validate({version:99,project:s.project,fields:{}}));
const poisoned=M.validate({version:2,project:s.project,fields:JSON.parse('{"__proto__":"x","unknown":"x","meta-page":"bad"}'),checked:{audit:true},audit:{passed:999,total:1,date:'bad'}});assert.equal(poisoned.audit,null);assert.equal(poisoned.fields['meta-page'],'index');assert.equal(Object.prototype.x,undefined);assert.equal(M.grade('audit',poisoned).passed,false);
assert.match(M.report(s),/не факт внедрения/);assert.match(M.report(s),/Данных о трафике нет/);
console.log('PASS: 8 exercises, 6 page editors, concrete incorrect answers, numerical formats, import validation, legacy notes, portable results and honest case export.');
