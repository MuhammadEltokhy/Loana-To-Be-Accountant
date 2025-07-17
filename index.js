document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', e => {
    e.preventDefault(); 

    const name       = document.querySelector('input[type="text"]').value.trim();
    const P          = parseFloat(document.querySelectorAll('input[type="number"]')[0].value);
    const r_percent  = parseFloat(document.querySelectorAll('input[type="number"]')[1].value);
    const n          = parseInt  (document.querySelectorAll('input[type="number"]')[2].value, 10);
    const t          = parseFloat(document.querySelectorAll('input[type="number"]')[3].value);

    const changeRadios = document.getElementsByName('change');
    let changeValue = null;
    for (let r of changeRadios) {
      if (r.checked) {
        changeValue = r.value;  
        break;
      }
    }
    if (!changeValue) {
      alert('Please choose Growth or Decay.');
      return;
    }
    const r = r_percent / 100;
    const base = changeValue === 'Growth'
      ? (1 + r / n)
      : (1 - r / n);
    const A = P * Math.pow(base, n * t);
    const A_fmt = A.toFixed(2);
    alert(`Hi ${name}, your ${changeValue} predicted loan is ${A_fmt}`);
  });
});