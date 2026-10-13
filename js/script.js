/* Demonstration only. No request is sent and no personal data is stored. */
(() => {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const output = document.getElementById('booking-result');
  const phone = form.elements.namedItem('phone');
  const date = form.elements.namedItem('date');
  const today = new Date();
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,16);
  date.min = local;
  const validatePhone = () => {
    const value=phone.value.trim();
    const digits=value.replace(/\D/g,'');
    phone.setCustomValidity(/^[+\d\s()-]+$/.test(value) && /^[78]\d{10}$/.test(digits) ? '' : 'Укажите 11 цифр с первой 7 или 8. Например: +7 900 000-00-00.');
  };
  phone.addEventListener('input',validatePhone);
  date.addEventListener('input',()=>date.setCustomValidity(''));
  form.addEventListener('submit',event=>{
    event.preventDefault(); validatePhone();
    const time = new Date(date.value).getTime();
    date.setCustomValidity(!Number.isFinite(time)||time<Date.now()?'Выберите будущие дату и время.':'');
    if(!form.reportValidity()) return;
    output.textContent='Поля заполнены правильно. Это учебная проверка: заявка не отправлена, бронирование не создано.';
  });
  form.addEventListener('input',()=>{output.textContent='';});
  document.getElementById('booking-submit').disabled=false;
})();
