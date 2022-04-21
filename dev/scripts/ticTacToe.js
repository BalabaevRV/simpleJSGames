"use strict";

const $ticTacToeArea = document.querySelector("#ticTacToe");
const errorMessageNotFounded = "Area for game not founded. Create html node with id=ticTacToe";


if ($ticTacToeArea) {

    let areaSize;
    let gameContinue = true;
    let countUncheckCell = 0;
    let allGameCount = 0;

    const playerNames = {
        player1: 'первый игрок',
        player2: 'второй игрок',
        computer: 'компьютер',
        count: 0,
    }
    const crossPlayer = {
        id: 'human',
        name: 'крестики',
        ai: false,
        value: 'X',
        count: 0,

    };
    const zeroPlayer = {
        id: 'computer',
        name: 'нолики',
        ai: true,
        value: '0',
        count: 0,
    };
    
    let currentPlayer = crossPlayer;

    const winCombinations = {
        winRows: [],
        winColumns: [],
        winDiagonal: '',
        winDiagonalReverse: ''
    };
    const fstScreen = createBlock('div', '', ['ticTacToe__screen', 'ticTacToe__screen--active']);
    const sndScreen = createBlock('div', '', 'ticTacToe__screen');


    fstScreen.appendChild(createBlock('h2', 'Выберите количество ячеек', 'ticTacToe__header'));
    fstScreen.appendChild(createBlock('p', 'минимум 3x3', 'ticTacToe__sign'));
    fstScreen.appendChild(createInputForSizeArea(3));
    fstScreen.appendChild(createBlock('h2', 'Кто играет ?', 'ticTacToe__header'));
    fstScreen.appendChild(createchoosePlayerInput('Крестики: ', 'player1', 'crossPlayer', changePlayer));
    fstScreen.appendChild(createchoosePlayerInput('Нолики: ', 'computer', 'zeroPlayer', changePlayer));
    fstScreen.appendChild(createButton('Играть', '', toPlay, true));
    const buttonGroup = createBlock('div', '', 'buttonGroup');
    const infoGroup = createBlock('div', '', 'infoGroup');
    infoGroup.appendChild(createBlock('p', `крестики: 0`, 'infoGroup--text'));
    infoGroup.appendChild(createBlock('p', `нолики: 0`, 'infoGroup--text'));
    infoGroup.appendChild(createBlock('p', `Всего игр: 0`, 'infoGroup--text'));
    infoGroup.appendChild(createBlock('p', `Ходит: ${crossPlayer.name} (${crossPlayer.value})`, 'infoGroup--text', 'ticTacToePlayerMove'));
    sndScreen.appendChild(infoGroup);
    buttonGroup.appendChild(createButton('Заново', 'outline', resetGame, '', 'buttonGroup__button'));
    buttonGroup.appendChild(createButton('Назад', 'outline', goBack, '', 'buttonGroup__button'));
    sndScreen.appendChild(buttonGroup);
    $ticTacToeArea.appendChild(fstScreen);
    $ticTacToeArea.appendChild(sndScreen);



    function changePlayer (e) {
        if (e.target.id === 'crossPlayer') {
            setPlayer(crossPlayer, e.target);
        } else if (e.target.id === 'zeroPlayer') {
            setPlayer(zeroPlayer, e.target);
        }    
    }


    function setPlayer (player, newValue) {
        player.id = newValue.value;
        player.name = playerNames[newValue.value];
        player.ai = player.id === 'computer';

    }

    function resetGame() {
        clearArea();
        currentPlayer = crossPlayer;   
    }

    function clearArea() {
        const allCell = document.querySelectorAll('.ticTacToe__cell');
        allCell.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('ticTacToe__cell--check');
            crossPlayer.winCombinations = {...winCombinations};    
            zeroPlayer.winCombinations = {...winCombinations}; 
            countUncheckCell = areaSize*areaSize;
        });
    }

    function toPlay () {
        sndScreen.insertBefore(createArea(), infoGroup); 
        changeScreen();
        document.addEventListener('keydown', pause);
        if (currentPlayer.ai) {
            makeAIMove();
        }
    }

    function pause(e) {
        console.log('pause');
        if (e.keyCode === 32) {
            console.log('pause');
        }
    }

    function createArea() {
        let rowNumber = 1;
        let columnNumber = 1;
        
        let winRow = '';
        let stepDiagonalReverse = areaSize;
        const div = createBlock('div', '', 'ticTacToe__area');
        let row = createBlock('div', '', 'ticTacToe__areaRow'); 

        for (let i=1; i<=areaSize; i++) {
            winCombinations.winColumns[i-1] = '';
            winCombinations.winDiagonal +=  `cell-${i}-${i} `;
        }

        for (let i = 1; i<=countUncheckCell; i++) {
            const cell = createBlock('div', '', 'ticTacToe__cell');
            cell.id = `cell-${rowNumber}-${columnNumber}`;
            winRow += `${cell.id} `;

            if (columnNumber === stepDiagonalReverse) {
                winCombinations.winDiagonalReverse += `${cell.id} `;
                stepDiagonalReverse -= 1;
            }
            winCombinations.winColumns[columnNumber-1] += `${cell.id} `;
            columnNumber+=1;
            cell.addEventListener('click', makeMoveHuman);
            row.appendChild(cell);
            if (i > 0 && i % areaSize === 0) {
                div.appendChild(row);  
                winCombinations.winRows.push(winRow);
                winRow = '';
                rowNumber +=1;
                columnNumber = 1;
                row = createBlock('div', '', 'ticTacToe__areaRow');  

            }
        }

        crossPlayer.winCombinations = {...winCombinations};    
        zeroPlayer.winCombinations = {...winCombinations}; 
        return div;
    }

    function makeMove(pressCell) {
        countUncheckCell -= 1;
        pressCell.innerHTML = currentPlayer.value; 
        setTimeout(() => pressCell.classList.add('ticTacToe__cell--check'), 200); 
        checkWinCombinations (pressCell.id.trim(), currentPlayer.winCombinations);
        if (countUncheckCell === 0) {
            winGame(true);
        }
        if (gameContinue) {
            changeCurrentPlayer();
        }     
    }

    function makeMoveHuman (e) {
        if (e.target.innerHTML === '') {
            gameContinue = true;
            makeMove (e.target);
        }   
    }

    function makeAIMove() {
        document.body.classList.add('waiting');
        document.body.addEventListener('click' ,cancelClick, {capture: true});
        setTimeout(() => {
            document.body.classList.remove('waiting');
            document.body.removeEventListener('click' ,cancelClick, {capture: true}); 
            const cell = getRandomCell();
            makeMove(cell);
        }, 1000);
    }

    function getRandomCell () {
        const allCell = document.querySelectorAll('.ticTacToe__cell:not(.ticTacToe__cell--check)');
        const r =randomNumber();
        const cell = allCell[r];
        return cell;      
    }

    function randomNumber () {
        return Math.floor(Math.random() * (countUncheckCell - 1));
    }

    function changeCurrentPlayer () {
        const infoPlayerMove = document.querySelector('#ticTacToePlayerMove');  
        currentPlayer = (currentPlayer === crossPlayer) ? zeroPlayer : crossPlayer;       
        if (infoPlayerMove) {
            infoPlayerMove.innerHTML = `Ходит ${currentPlayer.name} (${currentPlayer.value})`                
        }
        if (currentPlayer.ai && gameContinue) {
            makeAIMove();
        }
    }

    function cancelClick (e) {
        e.stopPropagation();
    }

    function checkWinCombinations (number, combinations) { 
        for (let key in combinations) {
            if (typeof combinations[key] === 'string') {
                combinations[key] = checkCell (number, combinations[key]);
            } else if (Array.isArray(combinations[key]))  {
                combinations[key] = combinations[key].map(str => {
                    return checkCell(number, str)
                });
            }
        }
    }

    function checkCell (number, str) {
        if (str.indexOf(number) === 0 || (str.indexOf(number) && str.indexOf(number)>-1)) {  
            str = str.replace(number, '');
        }  
        if (str.trim() === '') {
            winGame();
        }    
        return str;
    }

    function winGame(nobodyWin = false) {
        gameContinue = false;
        setTimeout(() => {
            if (nobodyWin) {
                alert (`Ничья!`);
            }
            else {
                alert (`Выиграл ${currentPlayer.name}!`);
                currentPlayer.count += 1;
            }
            allGameCount += 1;
            resetGame();
            updateInfoBlock();          
            crossPlayer.winCombinations = {...winCombinations};    
            zeroPlayer.winCombinations = {...winCombinations}; 
        }, 200);
    }

    function updateInfoBlock() {
        const infoGroup = document.querySelector('.infoGroup')
        infoGroup.innerHTML = '';
        infoGroup.appendChild(createBlock('p', `Крестики: ${crossPlayer.count}`, 'infoGroup--text'));
        infoGroup.appendChild(createBlock('p', `Нолики: ${zeroPlayer.count}`, 'infoGroup--text'));
        infoGroup.appendChild(createBlock('p', `Всего игр: ${allGameCount}`, 'infoGroup--text'));
        infoGroup.appendChild(createBlock('p', `Ходит: ${crossPlayer.name} игрок (${crossPlayer.value})`, 'infoGroup--text'));
        sndScreen.insertBefore(infoGroup, buttonGroup);
    }

    function createchoosePlayerInput (type, selectedItem = 'player1', id = '', changeMethod = null) {
        const div = document.createElement('div'); 
        div.classList.add('ticTacToe__inputGroup')
        const label = document.createElement('label');
        label.innerHTML = type;
        label.classList.add('ticTacToe__labelInput');
        div.appendChild(label);
        const select = document.createElement('select');
        select.id = id;
        const optionHuman = document.createElement('option');
        optionHuman.value = "human";
        optionHuman.innerHTML = 'Человек';
        optionHuman.selected = optionHuman.value === selectedItem; 
        const optionComp = document.createElement('option');
        optionComp.value = "computer";
        optionComp.innerHTML = "Компьютер";    
        optionComp.selected = optionComp.value === selectedItem;            
        select.appendChild(optionHuman);
        select.appendChild(optionComp);
        select.classList.add('ticTacToe__input');
        if (changeMethod) {
            select.addEventListener("change", changeMethod);
        }
        div.appendChild(select);
        return div;
    }

    function createButton (sign, typeButton = '', clckFunction, clckFunctionParams, classBtn = '') {
        const btn = document.createElement('button');
        btn.innerHTML = sign;
        if (typeButton) {
            const typeBtn = 'ticTacToe__button' + (typeButton) ? '--' + typeButton : ''; 
            btn.classList.add(typeBtn);
        }
        if (classBtn) {
            btn.classList.add(classBtn);
        }
        btn.classList.add('ticTacToe__button');
        btn.addEventListener('click', () => clckFunction(clckFunctionParams));
        return btn;     
    }

    function changeScreen () {
        const currentScreen = document.querySelector('.ticTacToe__screen--active');
        currentScreen.addEventListener('transitionend', addActiveScreen);
        currentScreen.classList.toggle('ticTacToe__screen--active');
    }
    
    function addActiveScreen(e) {
        let newScreen;
        const allScreen = document.querySelectorAll('.ticTacToe__screen');
        allScreen.forEach(screen => {
            if (screen !== e.target) {
                newScreen = screen; 
            }; 
        });
        if (newScreen) {
            newScreen.classList.add('ticTacToe__screen--active');   
        };

        e.target.removeEventListener('transitionend', addActiveScreen);
    }

    function clearWinCombinations() {
        winCombinations.winRows = [];
        winCombinations.winColumns = [];
        winCombinations.winDiagonal = '';
        winCombinations.winDiagonalReverse = '';
    } 

    function goBack () {
        countUncheckCell = areaSize * areaSize;
        clearWinCombinations();
        destroyArea();
        changeScreen();
    }   

    function destroyArea() {

        const area = document.querySelector('.ticTacToe__area');
        if (area) {
            destroyBlock(area);
        }
    }

    function destroyBlock (block) {
        block.remove();
    }

    function createBlock (type = 'p', text = '', classBlock = '', id = '') {
        const block = document.createElement(type);
        block.innerHTML = text;
        if (classBlock) {
            if (Array.isArray(classBlock)) {
                classBlock.forEach(classEl => {
                    block.classList.add(classEl); 
                });
            } else {
                block.classList.add(classBlock);         
            }     
        }
        if (id) {
            block.id = id;
        }
        return block;      
    }

    function createInputForSizeArea(defaultValue = 3) {
        createInputArea();
        const div = document.createElement('div');
        div.appendChild(createInputArea(defaultValue));
        div.appendChild(createBlock('span', ' X ', ['ticTacToe__bigText','ticTacToe__crossArea'])); 
        div.classList.add('ticTacToe__inputAreaContainer');
        div.appendChild(createInputArea(defaultValue));
        areaSize = defaultValue;
        countUncheckCell = areaSize * areaSize;
        return (div);   
        function createInputArea(value = 3) {
            const input = document.createElement("input");
            input.type = 'text';
            input.value = 3;
            input.classList.add('ticTacToe__inputArea');  
            input.addEventListener('input', inputSizeArea);
            input.addEventListener('blur', BlurSizeArea);
            return (input);  
        }

    }

    function inputSizeArea(e) {
        const regExp = /^\d{1,2}$/;
        const allInput = document.querySelectorAll('.ticTacToe__inputArea');
        const newValue = e.target.value; 
        if (newValue.match(regExp) || newValue === '') {
            allInput.forEach(input => input.value = newValue);
            areaSize = Number(newValue);
            countUncheckCell = areaSize * areaSize;
        } else {
            allInput.forEach(input => input.value = areaSize);
            console.log('Вводите число больше 3 и меньшее 99');
        }
    }

    function BlurSizeArea(e) {
        if (e.target.value === '' || e.target.value < 2) {
            const allInput = document.querySelectorAll('.ticTacToe__inputArea');
            allInput.forEach(input => input.value = 3);
        } 
    }


} else {
    console.error (errorMessageNotFounded);
}

