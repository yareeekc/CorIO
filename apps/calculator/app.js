const buttons = document.querySelectorAll('.btn');
const result = document.getElementById('result');

let value = '';

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const btnValue = button.textContent;
        if (btnValue === '←') {
            value = value.slice(0, -1);
        } else if (btnValue === 'C') {
            value = '';
        } else if (btnValue === '=') {
            value = eval(value).toString();
        } else {
            value += btnValue;
        }
        result.textContent = value || '0';
    });
});