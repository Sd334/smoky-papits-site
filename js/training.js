(() => {
 'use strict';
 const M=window.SmokyPractice,byId=id=>document.getElementById(id),key='smoky-seo-practice-v2',legacyKey='smoky-seo-notes-v1';
 let state=M.empty(),active='structure';
 try{const stored=localStorage.getItem(key);if(stored)state=M.validate(JSON.parse(stored));else{const notes=localStorage.getItem(legacyKey);if(notes)state.fields['practice-notes']=notes.slice(0,12000);}}
 catch{byId('storage-status').textContent='Хранилище недоступно или запись не читается. Скачивайте ответы, чтобы сохранить работу.';}
 function options(select,extra=[]){select.replaceChildren();for(const [value,label] of [['','Выберите ответ…'],...M.pages.map(p=>[p.id,`${p.name} · ${p.file}`]),...extra]){const o=document.createElement('option');o.value=value;o.textContent=label;select.append(o);}}
 function rows(container,data,extra=[],custom=false){for(const row of data){const [id,label]=row,div=document.createElement('div');div.className='answer-row';const l=document.createElement('label');l.htmlFor=id;l.textContent=label;const select=document.createElement('select');select.id=id;select.dataset.save='';if(custom){for(const [value,text] of [['','Выберите ответ…'],...row[2]]){const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o);}}else options(select,extra);const feedback=document.createElement('p');feedback.id='field-feedback-'+id;feedback.className='field-feedback';feedback.setAttribute('aria-live','polite');div.append(l,select,feedback);byId(container).append(div);}}
 rows('structure-fields',M.structure);rows('keyword-fields',M.keywords,[['article','Отдельная полезная статья'],['exclude','Не подходит этому проекту']]);rows('audit-fields',M.auditQuestions,[],true);
 options(byId('meta-page'));byId('meta-page').firstElementChild.remove();options(byId('link-target'));
 for(const p of M.pages){const div=document.createElement('div'),a=document.createElement('a'),text=document.createElement('p');a.href=p.file;a.target='_blank';a.rel='noreferrer';a.textContent=p.name+' ↗';text.textContent=p.purpose;div.append(a,text);byId('page-map').append(div);}
 function titleKey(type){return `meta-${type}-${state.fields['meta-page']||'index'}`;}
 function pull(){for(const el of document.querySelectorAll('[data-save]'))if(!['practice-title','practice-h1','practice-description'].includes(el.id))state.fields[el.id]=el.value;for(const type of ['title','h1','description'])state.fields[titleKey(type)]=byId('practice-'+type).value;}
 function restore(){for(const el of document.querySelectorAll('[data-save]'))if(!['practice-title','practice-h1','practice-description'].includes(el.id))el.value=state.fields[el.id]||'';byId('meta-page').value=state.fields['meta-page']||'index';for(const type of ['title','h1','description'])byId('practice-'+type).value=state.fields[titleKey(type)]||'';preview();}
 function save(){try{localStorage.setItem(key,JSON.stringify(state));byId('storage-status').textContent='Сохранено на этом устройстве · '+new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});byId('notes-status').textContent='Все ответы и заметки сохранены в этом браузере.';}catch{byId('storage-status').textContent='Не удалось сохранить в браузере. Нажмите «Скачать всю практику».';byId('notes-status').textContent='Скачайте файл, чтобы не потерять работу.';}}
 function progress(){let done=0;for(const step of M.steps){const passed=state.checked[step]&&M.grade(step,state).passed;if(passed)done++;const link=document.querySelector(`[data-step="${step}"]`),icon=link.querySelector('.step-status');icon.textContent=passed?'✓':state.checked[step]?'↻':'○';icon.setAttribute('aria-label',passed?'Проверено':state.checked[step]?'Есть ошибки':'Не проверено');}byId('practice-progress').textContent=`${done} из 8 заданий проверено`;byId('practice-meter').value=done;const next=M.steps.find(s=>!state.checked[s]||!M.grade(s,state).passed)||'case';byId('continue-practice').href='#'+next;byId('continue-practice').textContent=done===8?'Посмотреть мой кейс →':done?'Продолжить практику →':'Начать практику →';}
 function renderResult(step){const host=byId('feedback-'+step);host.replaceChildren();for(const el of byId(step).querySelectorAll('[aria-invalid]'))el.removeAttribute('aria-invalid');for(const el of byId(step).querySelectorAll('.field-feedback'))el.textContent='';if(!state.checked[step])return;
 const result=M.grade(step,state),p=document.createElement('p'),ul=document.createElement('ul');p.className='feedback-summary';p.textContent=result.passed?`Условия упражнения выполнены · ${result.score}/${result.total}.`:`Верно ${result.score} из ${result.total}. Исправьте пункты со стрелкой и проверьте ещё раз.`;ul.className='criteria-list';
 for(const c of result.checks){const li=document.createElement('li');li.className=c.ok?'pass':'fail';li.textContent=(c.ok?'✓ ':'→ ')+c.message;ul.append(li);if(c.key&&!c.ok){const input=byId(c.key);if(input)input.setAttribute('aria-invalid','true');const inline=byId('field-feedback-'+c.key);if(inline){inline.textContent=c.message;inline.className='field-feedback fail';}}}
 const note=document.createElement('p');note.className='form-help';note.textContent=step==='case'?'Проверены заполненные разделы. Достоверность и качество кейса оцените по доказательствам.':'Проверяются условия учебной задачи. Это не оценка всей SEO-работы и не изменение сайта бара.';host.append(p,ul,note);
 }
 function preview(){const page=M.pages.find(p=>p.id===byId('meta-page').value)||M.pages[0];byId('preview-url').textContent=M.base+(page.id==='index'?'':page.file);byId('preview-title').textContent=byId('practice-title').value||'Здесь появится ваш title';byId('preview-h1').textContent=byId('practice-h1').value||'Ваш H1';byId('preview-description').textContent=byId('practice-description').value||'Здесь появится описание.';byId('title-count').textContent=`Title: ${byId('practice-title').value.trim().length} символов. Длина сама по себе не гарантирует позиции.`;const target=M.pages.find(p=>p.id===byId('link-target').value);byId('link-preview').textContent=byId('link-anchor').value||'Ваш текст ссылки';byId('link-preview').href=target?target.file:'cocktails.html';}
 function view(){const id=location.hash.slice(1);active=[...M.steps,'journal'].includes(id)?id:'structure';for(const el of document.querySelectorAll('.practice-panel'))el.hidden=el.id!==active;for(const a of document.querySelectorAll('[data-step]')){if(a.dataset.step===active)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');}const nav=document.querySelector('.practice-nav'),link=document.querySelector(`[data-step="${active}"]`);if(nav.scrollWidth>nav.clientWidth&&link)nav.scrollTo({left:link.offsetLeft-nav.offsetLeft-10,behavior:'smooth'});}
 window.addEventListener('hashchange',view);
 for(const el of document.querySelectorAll('[data-save]'))el.addEventListener('input',()=>{if(el.id==='meta-page'){state.fields['meta-page']=el.value;for(const type of ['title','h1','description'])byId('practice-'+type).value=state.fields[titleKey(type)]||'';byId('published-meta').replaceChildren();}pull();const step=el.closest('.practice-panel').id;if(M.steps.includes(step)){state.checked[step]=false;renderResult(step);}preview();progress();save();if(!byId('case-preview').hidden)byId('case-preview').textContent=M.report(state);});
 for(const b of document.querySelectorAll('[data-check]'))b.addEventListener('click',()=>{pull();state.checked[b.dataset.check]=true;renderResult(b.dataset.check);progress();save();byId('feedback-'+b.dataset.check).scrollIntoView({block:'nearest',behavior:'smooth'});});
 for(const b of document.querySelectorAll('[data-next]'))b.addEventListener('click',()=>{const i=M.steps.indexOf(b.dataset.next);location.hash=M.steps[i+1]||'journal';byId('heading-'+(M.steps[i+1]||'journal')).focus({preventScroll:true});});
 async function readFile(url){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{return await fetch(url,{cache:'no-store',signal:controller.signal});}finally{clearTimeout(timer);}}
 byId('load-page-meta').addEventListener('click',async()=>{const page=M.pages.find(p=>p.id===byId('meta-page').value)||M.pages[0],host=byId('published-meta');host.textContent='Читаю страницу…';try{const response=await readFile(page.file);if(!response.ok)throw Error('HTTP '+response.status);const doc=new DOMParser().parseFromString(await response.text(),'text/html');if(byId('meta-page').value!==page.id)return;host.textContent=`Текущий опубликованный вариант ${page.file}\n\nTitle: ${doc.title}\nH1: ${doc.querySelector('h1')?.textContent.trim()||'не найден'}\nDescription: ${doc.querySelector('meta[name="description"]')?.content||'не найден'}`;}catch{host.textContent='Не удалось прочитать страницу. Проверьте интернет и попробуйте снова.';}});
 function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function exportAll(){pull();save();download(JSON.stringify(state,null,2),'smoky-seo-practice.json','application/json;charset=utf-8');byId('notes-status').textContent='Файл со всеми ответами скачан. Загрузите его на другом устройстве в разделе «Тетрадь и перенос».';}
 for(const id of ['quick-export','export-notes'])byId(id).addEventListener('click',exportAll);
 byId('save-notes').addEventListener('click',()=>{pull();save();});
 byId('import-notes').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>150000)throw Error('Файл слишком большой.');const imported=M.validate(JSON.parse(await file.text()));if(Object.values(state.fields).some((v)=>v.trim()&&v!=='index')&&!confirm('Заменить все текущие ответы содержимым файла? Чтобы сохранить оба варианта, сначала скачайте текущую практику.'))return;state=imported;restore();for(const step of M.steps)renderResult(step);progress();save();restoreAudit();byId('notes-status').textContent='Файл загружен. Ответы и результаты восстановлены; проверки ответов пересчитаны.';}catch(error){byId('notes-status').textContent='Файл не загружен: '+error.message;}finally{event.target.value='';}});
 byId('build-case').addEventListener('click',()=>{pull();byId('case-preview').textContent=M.report(state);byId('case-preview').hidden=false;});byId('download-case').addEventListener('click',()=>{pull();save();download(M.report(state),'smoky-seo-case.txt','text/plain;charset=utf-8');});
 function restoreAudit(){byId('audit-results').replaceChildren();byId('audit-status').textContent=state.audit?`Сохранённая проверка: ${state.audit.passed}/${state.audit.total}, ${new Date(state.audit.date).toLocaleString('ru-RU')}. Для свежих подробностей запустите проверку снова.`:'Проверка ещё не запускалась.';}

 const base=M.base,pages=M.pages.map(p=>p.file);
  function resultRow(name,checks){
    const li=document.createElement('li');const h=document.createElement('h3');h.textContent=name;li.append(h);
    const list=document.createElement('ul');list.className='criteria-list';
    for(const [passed,text] of checks){const item=document.createElement('li');item.className=passed?'pass':'fail';item.textContent=(passed?'✓ ':'→ ')+text;list.append(item);}
    li.append(list);return li;
  }
  const audit=byId('check-site');
  audit.addEventListener('click',async()=>{
    audit.disabled=true;byId('audit-status').textContent='Читаю страницы и подключённые файлы…';byId('audit-results').replaceChildren();
    let passed=0,total=0;
    for(const page of pages){
      try {
        const response=await readFile(page);
        if(!response.ok)throw new Error('Страница недоступна: HTTP '+response.status);
        const doc=new DOMParser().parseFromString(await response.text(),'text/html');
        const expected=base+(page==='index.html'?'':page);
        const checks=[
          [doc.doctype?.name.toLowerCase()==='html','DOCTYPE html: стандартный режим отображения.'],
          [Boolean(doc.title.trim()),'Title: '+(doc.title.trim()||'добавьте название страницы.')],
          [Boolean(doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()),'Description: описание страницы заполнено.'],
          [doc.querySelectorAll('h1').length===1&&Boolean(doc.querySelector('h1')?.textContent.trim()),'H1: в этом учебном макете должен быть один непустой основной заголовок.'],
          [doc.querySelector('link[rel="canonical"]')?.getAttribute('href')===expected,'Canonical: ожидаемый адрес '+expected],
        ];
        const assets=[...doc.querySelectorAll('script[src],link[rel="stylesheet"],link[rel="icon"]')].map(el=>el.getAttribute('src')||el.getAttribute('href')).filter(url=>url&&!/^(https?:|data:|\/\/)/i.test(url));
        const statuses=await Promise.all(assets.map(async url=>{try{return [url,(await readFile(url)).ok];}catch{return [url,false];}}));
        checks.push([statuses.every(([,ok])=>ok),'Подключённые файлы: '+(statuses.filter(([,ok])=>!ok).map(([url])=>url).join(', ')||'все доступны.')]);
        total+=checks.length;passed+=checks.filter(([ok])=>ok).length;byId('audit-results').append(resultRow(page,checks));
      } catch(error){total++;byId('audit-results').append(resultRow(page,[[false,error.message||'Не удалось прочитать страницу.']]));}
    }
    try {
      const r=await readFile('sitemap.xml');if(!r.ok)throw new Error('Sitemap недоступен.');
      const doc=new DOMParser().parseFromString(await r.text(),'application/xml');
      const urls=[...doc.getElementsByTagName('loc')].map(el=>el.textContent.trim());
      const expected=pages.map(p=>base+(p==='index.html'?'':p));
      const ok=!doc.querySelector('parsererror')&&expected.every(u=>urls.includes(u))&&urls.length===expected.length&&urls.every(u=>expected.includes(u));
      total++;passed+=Number(ok);byId('audit-results').append(resultRow('sitemap.xml',[[ok,ok?'Адреса совпадают с шестью страницами проекта.':'Исправьте XML и адреса: ожидаются шесть URL проекта на sd334.github.io.']]));
    } catch(e){total++;byId('audit-results').append(resultRow('sitemap.xml',[[false,e.message||'Не удалось проверить Sitemap.']]));}
    byId('audit-status').textContent=`Пройдено ${passed} из ${total} проверок. ${passed===total?'Учебный чек-лист выполнен; индексация и удобство требуют отдельной проверки.':'Посмотрите пункты со стрелкой и исправьте их.'}`;state.audit={passed,total,date:new Date().toISOString()};state.checked.audit=false;renderResult('audit');progress();save();audit.disabled=false;
  });

 restore();restoreAudit();for(const step of M.steps)renderResult(step);progress();view();
})();
