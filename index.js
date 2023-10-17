const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = `~@#$%^&*()-_=+\|]}[{'";:}]/?.>,<`;
 
let password = "";  
let passwordLenght = 10;
let checkCount = 0;
handleSlider();
//set strenght color to grey
setIndicator("#ccc");
 
//set passwordLength
function handleSlider(){
    inputSlider.value = passwordLenght;
    lengthDisplay.innerText = passwordLenght; 

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLenght-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxshadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
   return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateupperCase(){
    return String.fromCharCode(getRndInteger(65,91)); 
}

function generateSymbol(){
    const randNum = (0, Symbol.length);
    return symbols.charAt(randNum);
}

function calcstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLenght >= 8) {
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLenght >= 6
    ) {
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add ("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflepassword(array){
    //Fisher Yetes Method
    for(let i = array.length-1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(passwordLenght < checkCount){
        passwordLenght = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLenght = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copycontent();
})

generateBtn.addEventListener('click', () => {
    //no checkbox selected
    if(checkCount <=0) return;

    if(passwordLenght < checkCount){
        passwordLenght = checkCount;
        handleSlider();
    }

    // find new password
    // remome old password
    password = "";

    //put the stuff mentioned by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateupperCase();
    // }  
    
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }  
    
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }  
    
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
 

    let funcArr = [];

    if(uppercaseCheck.checked)
       funcArr.push(generateupperCase);

    if(lowercaseCheck.checked)
       funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
       funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
       funcArr.push(generateSymbol);


    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remainig addition
    for(let i=0; i<passwordLenght-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflepassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    //calculate strenghth;
    calcstrength();
     
});  