(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SmokyPractice=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const base='https://sd334.github.io/smoky-papits-site/';
 const pages=[
 {id:'index',file:'index.html',name:'Главная',purpose:'Формат бара и переходы в разделы',topic:/(?:^|[^а-я])бар(?:а|е|у|ом)?(?=$|[^а-я])/i},
 {id:'menu',file:'menu.html',name:'Меню',purpose:'Обзор блюд и напитков',topic:/меню/i},
 {id:'cocktails',file:'cocktails.html',name:'Коктейли',purpose:'Состав напитков',topic:/коктейл|напитк/i},
 {id:'kitchen',file:'kitchen.html',name:'Кухня',purpose:'Блюда и кухня',topic:/кухн|блюд/i},
 {id:'events',file:'events.html',name:'Афиша',purpose:'События и даты',topic:/афиш|событи/i},
 {id:'contacts',file:'contacts.html',name:'Контакты',purpose:'Адрес и график',topic:/контакт|адрес/i}];
 const structure=[['structure-main','Что это за бар и какие разделы есть?','index','Главная представляет проект и направляет в нужный раздел.'],['structure-menu','Где посмотреть общее меню блюд и напитков?','menu','menu.html — обзор меню; подробности вынесены в отдельные разделы.'],['structure-drinks','Какой состав у коктейлей?','cocktails','Состав напитков ищем в cocktails.html.'],['structure-food','Какие блюда есть на кухне?','kitchen','Блюда и описание кухни размещены в kitchen.html.'],['structure-events','Какие события показаны в афише?','events','events.html — события и даты в учебном макете.'],['structure-address','Где адрес и график?','contacts','contacts.html — страница учебных контактов.']];
 const keywords=[['keyword-main','бар Smoky Papits Уфа','index','Общий запрос о баре соответствует главной.'],['keyword-menu','Smoky Papits меню цены','menu','Посетитель хочет увидеть меню; цены проекта демонстрационные.'],['keyword-drinks','Smoky Papits коктейли состав','cocktails','Задача — состав напитков, поэтому cocktails.html.'],['keyword-food','Smoky Papits кухня блюда','kitchen','Запрос о блюдах направляем в kitchen.html.'],['keyword-events','Smoky Papits афиша','events','События ищут в events.html.'],['keyword-address','Smoky Papits адрес часы работы','contacts','Адрес и график — contacts.html.'],['keyword-article','как выбрать безалкогольный коктейль','article','Это совет, а не меню конкретного бара. Возможная тема полезной статьи.'],['keyword-job','вакансия бармена Уфа','exclude','На этом сайте нет вакансий; запрос относится к поиску работы.']];
 const auditQuestions=[['audit-http','Меню открывается с кодом 200. Что это доказывает?',[['available','Страница доступна'],['indexed','Страница уже есть в индексе']],'available','200 подтверждает успешный ответ, но не индексацию.'],['audit-canonical','У menu.html и menu.html?utm_source=lesson одно содержимое. Какой canonical выбрать?',[['clean',base+'menu.html'],['home',base]],'clean','Чистый адрес меню описывает этот документ. Главная не является canonical всех разных разделов.'],['audit-priority','В условной неисправности меню отдаёт 404; у афиши общий H1. Что исправить первым?',[['menu','Недоступное меню'],['heading','Формулировку H1']],'menu','Сначала подтвердите и восстановите доступ к важному меню, затем улучшайте содержание.']];
 const steps=['structure','keywords','titles','links','audit','rewrite','metrics','case'];
 const staticFields=[...structure,...keywords,...auditQuestions].map(row=>row[0]).concat(['meta-page','link-target','link-anchor','rewrite-text','metric-ctr','metric-conversion','metric-meaning','case-problem','case-change','case-check','case-result','case-next','practice-notes']);
 const allowedFields=new Set(staticFields.concat(pages.flatMap(p=>['title','h1','description'].map(type=>`meta-${type}-${p.id}`))));
 const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/ё/g,'е').trim().replace(/\s+/g,' ');
 const empty=()=>({version:2,project:'smoky-papits-site',fields:{'meta-page':'index'},checked:{},audit:null});
 function item(ok,message,key,success){return {ok:Boolean(ok),message:ok?(success||message):message,key};}
 function grade(step,state){const f=state.fields||{},checks=[];
  if(step==='structure'||step==='keywords')for(const [key,label,answer,why] of step==='structure'?structure:keywords)checks.push(item(f[key]===answer,`${label}: ${f[key]===answer?'верно.':f[key]?'выбран другой раздел.':'выберите ответ.'} ${why}`,key));
  if(step==='titles'){
   const page=pages.find(p=>p.id===f['meta-page'])||pages[0];const title=norm(f['meta-title-'+page.id]);const h1=norm(f['meta-h1-'+page.id]);const desc=norm(f['meta-description-'+page.id]);
   const titleKey='practice-title';
   checks.push(item(title.includes('smoky papits'),'Title: укажите бренд Smoky Papits.',titleKey,'Title: бренд Smoky Papits указан.'));
   checks.push(item(page.topic.test(title),`Title: опишите тему страницы «${page.name}».`,titleKey,`Title: тема «${page.name}» отражена.`));
   checks.push(item(/(?:^|[^а-я])уф(?:а|е|ы|у|ой)(?=$|[^а-я])/i.test(title),'Title: добавьте Уфа или «в Уфе».',titleKey,'Title: город Уфа указан.'));
   if(page.id==='index')checks.push(item((title.match(/(?:^|[^а-я])бар(?:а|е|у|ом)?(?=$|[^а-я])/g)||[]).length===1,'Title главной: слово «бар» должно встречаться один раз.',titleKey,'Title: слово «бар» встречается один раз.'));
   checks.push(item(page.topic.test(h1),`H1: заголовок должен объяснять тему «${page.name}».`,'practice-h1','H1: тема страницы понятна.'));
   checks.push(item(desc.includes('smoky papits')&&page.topic.test(desc),'Description: добавьте бренд и содержание выбранной страницы.','practice-description','Description: бренд и тема страницы указаны.'));
   checks.push(item(/учеб|демонстрац/.test(desc),'Description: укажите учебный или демонстрационный характер проекта.','practice-description','Description: учебный характер проекта обозначен.'));
  }
  if(step==='links'){
   checks.push(item(f['link-target']==='cocktails','Адрес: для состава напитков выберите cocktails.html.','link-target','Адрес: выбран раздел коктейлей.'));
   checks.push(item(/коктейл|напитк/.test(norm(f['link-anchor'])),'Анкор: объясните, что ссылка ведёт к коктейлям или напиткам.','link-anchor','Анкор: понятно, что откроются напитки или коктейли.'));
  }
  if(step==='audit'){
   checks.push(item(Boolean(state.audit),'Сначала запустите проверку сайта. Найденные проблемы не мешают разбирать результат.'));
   for(const [key,label,options,answer,why] of auditQuestions)checks.push(item(f[key]===answer,`${label} ${why}`,key));
  }
  if(step==='rewrite'){
   const text=norm(f['rewrite-text']);
   checks.push(item(text.includes('smoky papits'),'Оставьте название Smoky Papits.','rewrite-text'));
   checks.push(item(/учеб/.test(text),'Объясните, что это учебный проект.','rewrite-text'));
   checks.push(item(/меню/.test(text),'Предложите посетителю посмотреть меню.','rewrite-text'));
   checks.push(item(!/лучш(?:ий|его|ая|ее)\s+бар/.test(text),'Уберите неподтверждённое «лучший бар».','rewrite-text'));
   checks.push(item(!/10[\s.,]*000/.test(text),'Уберите выдуманное число 10 000 гостей.','rewrite-text'));
   checks.push(item(!/гарантир\w*\s+брон|гарантир[а-я]*\s+брон|брон[а-я]*\s+за\s+минут/.test(text),'Уберите обещание гарантированной брони за минуту.','rewrite-text'));
   checks.push(item(!/(?:^|[^а-я])леч(?:ат|ит|ит[а-я]*|ени[а-я]*)/.test(text),'Уберите лечебные обещания о коктейлях.','rewrite-text'));
  }
  if(step==='metrics'){
   const number=key=>{const raw=String(f[key]||'').trim();return raw?Number(raw.replace(/[\s%]/g,'').replace(',','.')):NaN;};
   checks.push(item(Math.abs(number('metric-ctr')-5)<0.001,'CTR: 100 / 2000 × 100 = 5%.','metric-ctr'));
   checks.push(item(Math.abs(number('metric-conversion')-4)<0.001,'Доля нажатий: 20 / 500 × 100 = 4%.','metric-conversion'));
   checks.push(item(f['metric-meaning']==='demo','Нажатия в макете — учебные действия, а не настоящие бронирования.','metric-meaning'));
  }
  if(step==='case')for(const [key,label] of [['case-problem','найденная проблема'],['case-change','изменение или предложение'],['case-check','способ проверки'],['case-result','подтверждённый результат'],['case-next','следующий шаг']])checks.push(item(Boolean(norm(f[key])),`Заполните раздел «${label}».`,key));
  return {passed:checks.length>0&&checks.every(c=>c.ok),score:checks.filter(c=>c.ok).length,total:checks.length,checks};
 }
 function validate(data){
  if(!data||data.project!=='smoky-papits-site')throw Error('Нужен файл практики Smoky Papits.');
  if(data.version===1&&typeof data.notes==='string'&&data.notes.length<=12000){const state=empty();state.fields['practice-notes']=data.notes;return state;}
  if(data.version!==2||!data.fields||typeof data.fields!=='object'||Array.isArray(data.fields))throw Error('Неизвестный формат файла практики.');
  const state=empty();
  for(const [key,value] of Object.entries(data.fields))if(allowedFields.has(key)){if(typeof value!=='string'||value.length>(key==='practice-notes'?12000:2000))throw Error('В файле слишком длинный или некорректный ответ.');state.fields[key]=value;}
  if(!pages.some(p=>p.id===state.fields['meta-page']))state.fields['meta-page']='index';
  for(const step of steps)state.checked[step]=data.checked?.[step]===true;
  if(data.audit&&Number.isInteger(data.audit.total)&&Number.isInteger(data.audit.passed)&&data.audit.total>=0&&data.audit.total<=50&&data.audit.passed>=0&&data.audit.passed<=data.audit.total&&typeof data.audit.date==='string'&&Number.isFinite(Date.parse(data.audit.date)))state.audit={total:data.audit.total,passed:data.audit.passed,date:data.audit.date.slice(0,60)};
  return state;
 }
 function report(state){const f=state.fields;const done=steps.filter(s=>state.checked[s]&&grade(s,state).passed).length;return ['УЧЕБНЫЙ SEO-КЕЙС · SMOKY PAPITS',base,'Создан: '+new Date().toLocaleDateString('ru-RU'),'','Проверенные упражнения: '+done+'/8 (учебные ответы, не факт внедрения)','',...['case-problem','case-change','case-check','case-result','case-next'].flatMap((key,i)=>[['Проблема','Изменение или предложение','Способ проверки','Подтверждённый результат','Следующий шаг'][i],f[key]||'Пока не заполнено','']),state.audit?`Проверка HTML: ${state.audit.passed}/${state.audit.total}, ${state.audit.date}`:'Автоматический аудит ещё не запускался.','','Заголовки и тексты из тренажёра — черновики. Фактическое внедрение и статистику подтверждайте отдельно.'].join('\n');}
 return {base,pages,steps,structure,keywords,auditQuestions,empty,grade,validate,report};
});
