const buttonEle = document.getElementById('actionbutton');
const copyButtonEle = document.getElementById('copybutton');
const copyTextEle = document.getElementById('copytext');
const toastEle = document.getElementById('toast');
const resultEle = document.getElementById('result');
const lengthEle = document.getElementById('length');
const lengthEle2 = document.getElementById('length2')
const lowercase = document.getElementById('lowercase');
const uppercase = document.getElementById('uppercase');
const numbers = document.getElementById('numbers');
const punctuation = document.getElementById('punctuation');
const toast = document.getElementById('toast');

function isNumber(char) {
    if (typeof char == 'undefined')
        return false;

    if (isNaN(char)) {
        return false;
    } else {
        return true;
    }
}

function isPunctuation(char) {
    if (typeof char == 'undefined')
        return false;

    return '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.includes(char);
}

function isLetter(char) {
    if (typeof char == 'undefined')
        return false;

    let code = char.charCodeAt(0);
    if (code >= 65 && code <= 90)
        return true;
    if (code >= 97 && code <= 122)
        return true
    return false;
}

/**
 * Returns true if the two input are he same character type, otherwie false
 * @param {string} a The first character to compare.
 * @param {string} b The second character to compare.
 * @return {boolean} The result determining if the inputs are of the same type.
 */
function sameType(a, b) {
    if (typeof a == 'undefined')
        return false;

    return isNumber(a) && isNumber(b) || isPunctuation(a) && isPunctuation(b) || isLetter(a) && isLetter(b);
}

/**
 * Presents the password to the user adding colorto different character types
 */
function setPassword(password) {
    let output = '';
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        let prevChar;
        let nextChar;
        if (i > 0) prevChar = password[i - 1];
        if (i < password.length) nextChar = password[i + 1];

        if (!sameType(prevChar, char)) {
            if (isNumber(char)) {
                output += '<span class="number">';
            } else if (isPunctuation(char)) {
                output += '<span class="punctuation">';
            }
        }

        output += char;

        if (!sameType(char, nextChar)) {
            if (!isLetter(char))
                output += '</span>';
        }
    }

    resultEle.innerHTML = output;
}

/**
 * Shuffles an array using the Fisher-Yates Shuffle
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array#6274398
 * @param {object} array The array to shuffle.
 * @return {object} Returns the new array.
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Displays and hides a toast message.
 * @param {string} message The message content of the toast notification.
 * @param {boolean} error Is the toast an error message? Default: false.
 */
function raiseToast(message, error = false) {
    toast.innerHTML = message;

    toast.classList.add('show')

    if (error) {
        toastEle.classList.add('error');
    }

    setTimeout(() => {
        toastEle.classList.remove('show');
        toastEle.classList.remove('error');
    }, 7000);
}

/**
 * Validates that the chosen length of the password is equal to or
 * greater than the number of selected char types in the password.
 */
function validateLength() {
    let numSelected = 0;
    for (const element of [lowercase, uppercase, numbers, punctuation]) {
        if (element.checked)
            numSelected++;
    }

    if (numSelected > Number(lengthEle.value)) {
        raiseToast('The length must be at least the number of checked options.', error = true);
    }

    resultEle.innerHTML = '&nbsp;'
}

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String(Math.floor(Math.random() * 10));
}

function getRandomPunctuation() {
    const p = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    return p[Math.floor(Math.random() * p.length)];
}

const randomMethods = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    punctuation: getRandomPunctuation
};

copyButtonEle.addEventListener('click', () => {
    copyTextEle.value = resultEle.innerText;

    if (copyTextEle.value && copyTextEle.value !== '&nbsp;') {
        copyTextEle.select();
        copyTextEle.setSelectionRange(0, 99999);
        document.execCommand('copy');

        raiseToast('The password has been copied.');
    }
});

buttonEle.addEventListener('click', () => {
    const numChars = Number(lengthEle.value);

    if (numChars > 0) {
        let password = '';

        let methods = [];
        if (lowercase.checked)
            methods[methods.length] = randomMethods.lower;
        if (uppercase.checked)
            methods[methods.length] = randomMethods.upper;
        if (numbers.checked)
            methods[methods.length] = randomMethods.number;
        if (punctuation.checked)
            methods[methods.length] = randomMethods.punctuation;

        while (methods.length < numChars) {
            let choice = Math.floor(Math.random() * methods.length);
            methods[methods.length] = methods[choice];
        }

        methods = shuffle(methods);
        for (let i = 0; i < methods.length; i++) {
            password += methods[i]();
        }

        setPassword(password);
    } else {
        resultEle.innerHTML = '&nbsp;';
    }
});

lowercase.addEventListener('change', validateLength);
uppercase.addEventListener('change', validateLength);
numbers.addEventListener('change', validateLength);
punctuation.addEventListener('change', validateLength);
lengthEle.addEventListener('change', validateLength);

lengthEle.addEventListener('change', () => {
    lengthEle2.value = lengthEle.value
})

lengthEle2.addEventListener('change', () => {
    lengthEle.value = lengthEle2.value
})