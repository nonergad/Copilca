
function create(elementType, elementClass) {
    let newElement = document.createElement(elementType);
    if (elementClass) {
        newElement.classList.add(elementClass);
    }
    return newElement
  }

// ======= CREATION ARRAY=====///
let allCards = [];
let id = 0;
let sum = 0 ; 
let numberOfCards = 0;


window.addEventListener('load', init)

function init() {
    createCard()
    let addButton = document.querySelector('.addButton');
    const resRegSum = document.querySelector('.totalAmount');

    addButton.addEventListener('click', createCard);

    function createCard() {

        let card = create('div', 'card');
        card.id = id;
        numberOfCards++;

        let nameDate = create("div", "nameDate");
        card.append(nameDate);

        let goalName = create("input", "goalName");
        goalName.placeholder = "Название цели";
        nameDate.append(goalName);

        let date = create('input', 'date');
        date.type = "date";
        nameDate.append(date);

        let expand = create('button', 'expand');
        expand.innerHTML = "Ʌ";

        nameDate.append(expand);


        let cardInner = create('div', 'cardInner');
        card.append(cardInner);

        let requiredAmount = create('div', 'requiredAmount');
        requiredAmount.type = "number";
        let reqInput = create('input', 'reqInput');
        let tagReqP = document.createElement("p");
        tagReqP.innerText = "Требуемая сумма (₽):";
        requiredAmount.append(tagReqP);
        requiredAmount.append(reqInput);

        cardInner.append(requiredAmount);

        let startAmount = create('div', 'startAmount');
        let tagStartP = document.createElement("p");
        tagStartP.innerText = "Стартовая сумма (₽):";
        let startAmountInput = create('input', 'startAmountInput');
        startAmount.append(tagStartP);
        startAmount.append(startAmountInput);
        cardInner.append(startAmount);

        let regAmount = create('div', 'regAmount');
        let tagRegP = document.createElement('p');
        let regAmountResult = create('div', 'regAmountResult');
        regAmountResult.innerText = "0₽";
        tagRegP.innerText = "Размер регулярных пополнений:";
        regAmount.append(tagRegP);
        regAmount.append(regAmountResult);
        cardInner.append(regAmount);

        let delButton = create('button', 'delButton');
        card.append(delButton);
        delButton.innerText = "X";

        if (numberOfCards == 1) {
            document.querySelector('.container').append(card);
        } else if (numberOfCards > 1) {
        document.querySelectorAll('.card').forEach((element) => {
            element.children[1].style.display = 'none';
            element.lastElementChild.style.display = 'none';
            element.firstElementChild.lastChild.innerHTML = "V";
            element.firstElementChild.lastChild.style.borderBottomRightRadius = '5px';
            element.firstElementChild.lastChild.style.border = 'none';
        })
            document.querySelector('.container').insertBefore(card, document.querySelector('.card'));
        }

        // ====== OBJECTS CREATION====//

        let cardObj = {
            name: "",
            date: "",
            startAmountInput: "",
            reqInput: "",
            regAmount: "",
            id: id
        }

        //V-----------Shadow Box-----------V

        delButton.addEventListener('mouseover', (event) => {
            const shadowBox = document.createElement('div');
            shadowBox.classList.add('shadowBox');
            delButton.style.color = '#602b7a';
            delButton.style.backgroundColor = '#ffd847'
            card.append(shadowBox);
            delButton.addEventListener('mouseout', (event) => {
                shadowBox.remove();
                delButton.style.removeProperty('color');
                delButton.style.removeProperty('background-color');
            })
        })
        //V-------------Expand-------------V
        expand.addEventListener('mouseover', (event) => {
            expand.style.color = '#602b7a';
            expand.style.backgroundColor = '#ffd847'
            expand.addEventListener('mouseout', (event) => {
                expand.style.removeProperty('color');
                expand.style.removeProperty('background-color');
            })
        })

        expand.addEventListener('click', (event) => {
            if (expand.innerHTML == "Ʌ") {
                cardInner.style.display = 'none';
                delButton.style.display = 'none';
                expand.innerHTML = "V";
                expand.style.borderBottomRightRadius = '5px';
                expand.style.border = 'none';
            } else if (expand.innerHTML == "V") {
                expand.innerHTML = "Ʌ";
                cardInner.style.removeProperty('display');
                delButton.style.removeProperty('display');
                expand.style.removeProperty('border-bottom-right-radius');
                expand.style.removeProperty('border')
            }
        })
        //----------------Deleting cards-------------

        delButton.addEventListener('click', (event) => {
            const deleteBlock = allCards.findIndex((objElement) => {
                return objElement.id == event.target.parentElement.id;
            })
            allCards.splice(deleteBlock, 1)
            event.currentTarget.parentElement.remove()
            numberOfCards--
            regAmountAll();
        })
        //---------------------------------
        allCards.push(cardObj)
        goalName.addEventListener('keyup', changeObj)
        reqInput.addEventListener('keyup', changeObj)
        startAmountInput.addEventListener('keyup', changeObj)
        date.addEventListener('change', changeObj)
        id++
    }

    // ============================SUM OF ALL REG.AMOUNTS

    function regAmountAll(){

        allCards.forEach(element => {
            sum += +element.regAmount;
        })
        resRegSum.innerText = sum;
        sum = 0;
        comparingLimit()

    }

    let limitNumber = document.querySelector('.limitBlock input');
    limitNumber.addEventListener('change', comparingLimit);
    function comparingLimit() {
        resRegSum.style.color = '#000000';
        if (limitNumber.value == "") {
        }
        else if (+resRegSum.innerText > +limitNumber.value) {
            resRegSum.style.color = '#FF0000';
       }
    }
    
// ================

function changeObj(event) {
    let currentCard = ''
    let regAmountDiv = ''
    let activeInput = event.currentTarget

    currentCard = allCards.find(element => {
        regAmountDiv = activeInput.closest('.card').querySelector('.regAmountResult');
        return +activeInput.closest('.card').id === element.id
    })

    activeInput.className === 'goalName' 
        ? currentCard.name = activeInput.value 
        : regAmountDiv.innerText = regularRecord(currentCard, activeInput.className, activeInput)

    function regularRecord(currentCard, value, activeInput){
        currentCard[value] = activeInput.value;
        currentCard.regAmount = regularCalculate(currentCard);
        if (currentCard.date !== ''){
            regAmountAll();
            return currentCard.regAmount;
        } else {
            return ''
        }

function regularCalculate(card) {
    let now = new Date()
    let thenYear = card.date.charAt(0) + card.date.charAt(1) + card.date.charAt(2) + card.date.charAt(3);
    let thenMounth = card.date.charAt(5) + card.date.charAt(6) - 1;
    let thenDay = card.date.charAt(8) + card.date.charAt(9);
    if (+thenYear > now.getFullYear()) {
        thenMounth = 11 - now.getMonth() + thenMounth;
        if (+thenYear - now.getFullYear() > 1) {
            thenMounth = thenMounth * (+thenYear - now.getFullYear());
        }
    } else {
        thenMounth = +thenMounth - now.getMonth();
    }
    let percent = 6.5;
    let iteration = thenMounth;
    let percentFinal = 0;
    let start = card.startAmountInput;
    let final = card.reqInput;
    let monthAmount = 0;
    percent = percent / 100 / 12 + 1;
    for (let i = 0; i < iteration; i++) {
        percentFinal = percentFinal + Math.pow(percent, i + 1)
        start = start * percent;
    }
   return Math.floor(monthAmount = (final - start) / percentFinal);
}
}
}
}

