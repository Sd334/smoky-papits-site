(() => {
  'use strict';
  const base='https://sd334.github.io/smoky-papits-site/';
  const pages=['index.html','menu.html','cocktails.html','kitchen.html','events.html','contacts.html'];
  const byId=id=>document.getElementById(id);
  const title=byId('practice-title');
  title.addEventListener('input',()=>{
    byId('title-count').textContent=`${title.value.trim().length} символов. Универсального лимита SEO в символах нет. Код страницы не меняется.`;
    byId('title-result').replaceChildren();
  });
  byId('check-title').addEventListener('click',()=>{
    const raw=title.value.trim();
    const normalized=raw.normalize('NFKC').toLowerCase().replace(/ё/g,'е');
    const barWords=normalized.match(/(^|[^а-я])бар(?:а|е|у|ом)?(?=$|[^а-я])/giu)||[];
    const checks=[
      [Boolean(raw),'Заголовок заполнен.','Сначала напишите заголовок страницы.'],
      [barWords.length===1,'Тип заведения указан один раз.','Добавьте слово «бар» один раз. Если оно повторяется, уберите повтор.'],
      [normalized.includes('smoky papits'),'Бренд Smoky Papits указан.','Не найден бренд «Smoky Papits». Проверьте обе части названия и пробел между ними.'],
      [/(^|[^а-я])уф(?:а|е|ы|у|ой)(?=$|[^а-я])/iu.test(normalized),'Город Уфа указан.','Не найден город Уфа. Напишите «в Уфе» и проверьте буквы в названии города.'],
    ];
    const list=document.createElement('ul');list.className='criteria-list';
    for(const [passed,yes,no] of checks){const li=document.createElement('li');li.className=passed?'pass':'fail';li.textContent=(passed?'✓ ':'→ ')+(passed?yes:no);list.append(li);}
    const summary=document.createElement('p');summary.className='feedback-summary';summary.textContent=checks.every(c=>c[0])?'Формальные условия упражнения выполнены. Теперь проверьте, соответствует ли заголовок реальному содержанию страницы.':'Вот конкретные пункты, которые нужно исправить. После правки проверьте снова.';
    byId('title-result').replaceChildren(summary,list);
  });
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
        const response=await fetch(page,{cache:'no-store'});
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
        const statuses=await Promise.all(assets.map(async url=>{try{return [url,(await fetch(url,{cache:'no-store'})).ok];}catch{return [url,false];}}));
        checks.push([statuses.every(([,ok])=>ok),'Подключённые файлы: '+(statuses.filter(([,ok])=>!ok).map(([url])=>url).join(', ')||'все доступны.')]);
        total+=checks.length;passed+=checks.filter(([ok])=>ok).length;byId('audit-results').append(resultRow(page,checks));
      } catch(error){total++;byId('audit-results').append(resultRow(page,[[false,error.message||'Не удалось прочитать страницу.']]));}
    }
    try {
      const r=await fetch('sitemap.xml',{cache:'no-store'});if(!r.ok)throw new Error('Sitemap недоступен.');
      const doc=new DOMParser().parseFromString(await r.text(),'application/xml');
      const urls=[...doc.getElementsByTagName('loc')].map(el=>el.textContent.trim());
      const expected=pages.map(p=>base+(p==='index.html'?'':p));
      const ok=!doc.querySelector('parsererror')&&expected.every(u=>urls.includes(u))&&urls.length===expected.length&&urls.every(u=>expected.includes(u));
      total++;passed+=Number(ok);byId('audit-results').append(resultRow('sitemap.xml',[[ok,ok?'Адреса совпадают с шестью страницами проекта.':'Исправьте XML и адреса: ожидаются шесть URL проекта на sd334.github.io.']]));
    } catch(e){total++;byId('audit-results').append(resultRow('sitemap.xml',[[false,e.message||'Не удалось проверить Sitemap.']]));}
    byId('audit-status').textContent=`Пройдено ${passed} из ${total} проверок. ${passed===total?'Учебный чек-лист выполнен; индексация и удобство требуют отдельной проверки.':'Посмотрите пункты со стрелкой и исправьте их.'}`;audit.disabled=false;
  });
  const notes=byId('practice-notes'),status=byId('notes-status'),key='smoky-seo-notes-v1';
  try{const stored=localStorage.getItem(key);if(stored)notes.value=stored.slice(0,12000);}catch{status.textContent='Хранилище браузера недоступно. Используйте скачивание тетради.';}
  notes.addEventListener('input',()=>{status.textContent='Изменения ещё не сохранены. Сохраните запись или скачайте файл.';});
  byId('save-notes').addEventListener('click',()=>{try{localStorage.setItem(key,notes.value);status.textContent='Сохранено в этом браузере. Для другого устройства скачайте тетрадь.';}catch{status.textContent='Не удалось сохранить. Скачайте тетрадь, чтобы сохранить запись.';}});
  byId('export-notes').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,project:'smoky-papits-site',notes:notes.value},null,2)],{type:'application/json;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='smoky-seo-notes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Тетрадь скачана. Импортируйте файл на другом устройстве.';
  });
  byId('import-notes').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try{if(file.size>60000)throw new Error('Файл слишком большой.');const data=JSON.parse(await file.text());if(data.version!==1||data.project!=='smoky-papits-site'||typeof data.notes!=='string'||data.notes.length>12000)throw new Error('Нужен файл тетради, скачанный с этой страницы.');if(notes.value.trim()&&notes.value!==data.notes&&!window.confirm('Заменить текущий текст импортированной записью? Сначала скачайте текущую запись, если хотите её сохранить.'))return;notes.value=data.notes;try{localStorage.setItem(key,data.notes);status.textContent='Тетрадь импортирована и сохранена в этом браузере.';}catch{status.textContent='Тетрадь импортирована. Хранилище недоступно — сохраните файл.';}}
    catch(error){status.textContent='Импорт не выполнен: '+error.message;}finally{event.target.value='';}
  });
})();
