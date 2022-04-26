"use strict";

import domManipulations from './domManipulations.js';

const $ticTacToeArea = document.querySelector("#ticTacToe");
const errorMessageNotFounded = "Area for game not founded. Create html node with id=ticTacToe";

class ticTacToeGame {
    constructor (gameBlock) {
        this.gameBlock = gameBlock;
        this.gameContinue = true; 
        this.areaSize = 0;
        this.countUncheckCell = 0;
        this.allGameCount = 0;
        this.fstPlayer = {
            id: 'human',
            name: 'крестики',
            ai: false,
            value: 'X',
            count: 0,
        };
        this.sndPlayer = {
            id: 'computer',
            name: 'нолики',
            ai: true,
            value: '0',
            count: 0,
        };
        this.currentPlayer = this.fstPlayer;
        this.winCombinations = {
            winRows: [],
            winColumns: [],
            winDiagonal: '',
            winDiagonalReverse: ''
        };

        this.buttonGroup = this.createButtonGroup();
        this.infoGroup = this.createInfoGroup();
        this.fstScreen = this.createFstScreen();
        this.sndScreen = this.createSndScreen();
        
        gameBlock.appendChild(this.fstScreen);
        gameBlock.appendChild(this.sndScreen);

    }
    
    // +++++++++++++++++++++++++++++++++++++++++++++++++++Создание блоков
    createInfoGroup () {
        const infoGroup = domManipulations.createBlock('div', '', 'infoGroup');
        return infoGroup; 
    }

    createButtonGroup() {
        const buttonGroup = domManipulations.createBlock('div', '', 'buttonGroup');
        buttonGroup.appendChild(domManipulations.createButton('Заново', 'ticTacToe__button', 'outline', this.clearTicTacToeArea.bind(this), '', 'buttonGroup__button'));
        buttonGroup.appendChild(domManipulations.createButton('Назад', 'ticTacToe__button', 'outline', this.goBack.bind(this), '', 'buttonGroup__button'));
        return buttonGroup;
    }

    createFstScreen () {
        const fstScreen = domManipulations.createBlock('div', '', ['ticTacToe__screen', 'ticTacToe__screen--active']);
        fstScreen.appendChild(domManipulations.createBlock('h2', 'Выберите количество ячеек', 'ticTacToe__header'));
        fstScreen.appendChild(domManipulations.createBlock('p', 'минимум 3x3', 'ticTacToe__sign'));
        fstScreen.appendChild(this.createInputForSizeArea(3));
        fstScreen.appendChild(domManipulations.createBlock('h2', 'Кто играет ?', 'ticTacToe__header'));        
        fstScreen.appendChild(domManipulations.createSelect ('ticTacToe__inputGroup' ,'ticTacToe__labelInput', 'Крестики: ', 'fstPlayer', 'ticTacToe__input', 'human', this.changeTypePlayer.bind(this)));
        fstScreen.appendChild(domManipulations.createSelect ('ticTacToe__inputGroup' ,'ticTacToe__labelInput', 'Нолики: ' , 'sndPlayer', 'ticTacToe__input', 'computer', this.changeTypePlayer.bind(this)));
        fstScreen.appendChild(domManipulations.createButton('Играть', 'ticTacToe__button', '', this.toPlay.bind(this), true));
        return fstScreen; 
    }

    createSndScreen () {
        const sndScreen = domManipulations.createBlock('div', '', 'ticTacToe__screen');   
        sndScreen.appendChild(this.infoGroup);
        sndScreen.appendChild(this.buttonGroup);
        return sndScreen;
    }

    createInputForSizeArea(defaultValue = 3) {
        const div = domManipulations.createBlock('div', '', 'ticTacToe__inputAreaContainer');
        div.appendChild(domManipulations.createInput(3, 'text', 'ticTacToe__inputArea', this.inputSizeArea.bind(this), this.BlurSizeArea.bind(this)));
        div.appendChild(domManipulations.createBlock('span', ' X ', ['ticTacToe__bigText','ticTacToe__crossArea'])); 
        div.appendChild(domManipulations.createInput(3, 'text', 'ticTacToe__inputArea', this.inputSizeArea.bind(this), this.BlurSizeArea.bind(this)));
        this.areaSize = defaultValue;
        this.countUncheckCell = this.areaSize * this.areaSize;
        return (div);   
    }

// ----------------------------------------------------------Создание блоков






// +++++++++++++++++++++++++++++++++++++++++++++++++++Обработчики событий
    changeTypePlayer (e) {
        this[e.target.id].id = e.target.value;
        this[e.target.id].ai = e.target.value === 'computer';
    }

    inputSizeArea (e) {
        const regExp = /^\d{1,2}$/;
        const allInput = document.querySelectorAll('.ticTacToe__inputArea');
        const newValue = e.target.value; 
        if (newValue.match(regExp) || newValue === '') {
            allInput.forEach(input => input.value = newValue);
            this.areaSize = Number(newValue);
            this.countUncheckCell = this.areaSize * this.areaSize;
        } else {
            allInput.forEach(input => input.value = this.areaSize);
            console.log('Вводите число больше 3 и меньшее 99');
        }
    }

    BlurSizeArea (e) {
        if (e.target.value === '' || Number(e.target.value) < 3) {
            console.log(2);
            const allInput = document.querySelectorAll('.ticTacToe__inputArea');
            allInput.forEach(input => input.value = 3);
        } 
    }

    cancelClick (e) {
        e.stopPropagation();
    }

    clearTicTacToeArea() {
        const allCell = document.querySelectorAll('.ticTacToe__cell');
        allCell.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('ticTacToe__cell--check');
            this.setPlayersWinCombinations();
            this.countUncheckCell = this.areaSize * this.areaSize;
        });
    }

// -----------------------------------------------------------------Обработчики событий
   





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Управление игрой
    toPlay () {
        domManipulations.changeScreen(this.gameBlock,'ticTacToe__screen--active', 'next');
        this.updateInfoBlock();
        this.sndScreen.insertBefore(this.createArea(), this.infoGroup); 
        this.sndScreen.style.height = (1024 > Number(this.sndScreen.scrollHeight)) ? `${1024}px` : `${this.sndScreen.scrollHeight}px`;
        if (this.currentPlayer.ai) {
            this.makeAIMove();
        }
    }

    makeMoveHuman (e) {
        if (e.target.innerHTML === '') {
            this.gameContinue = true;
            this.makeMove (e.target);
        }   
    }

    makeMove (pressCell) {
        this.countUncheckCell -= 1;
        pressCell.innerHTML = this.currentPlayer.value; 
        setTimeout(() => pressCell.classList.add('ticTacToe__cell--check'), 200); 
        this.checkWinCombinations (pressCell.id.trim(), this.currentPlayer.winCombinations);
        if (this.countUncheckCell === 0) {
            this.gameContinue = false;
            this.winGame(true);
        }
        if (this.gameContinue) {
            this.changeCurrentPlayer();
        }     
    }

    winGame(nobodyWin = false) {
        setTimeout(() => {
            if (nobodyWin) {
                alert (`Ничья!`);
            }
            else {
                alert (`Выиграл ${this.currentPlayer.name}!`);
                this.currentPlayer.count += 1;
            }
            this.allGameCount += 1;
            this.resetGame();
            this.updateInfoBlock();          
        }, 200);
    }

    resetGame () {
        this.clearArea();
        this.currentPlayer = this.fstPlayer;   
    }

    clearArea() {
        const allCell = document.querySelectorAll('.ticTacToe__cell');
        allCell.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('ticTacToe__cell--check');
            this.setPlayersWinCombinations();
            this.countUncheckCell = this.areaSize * this.areaSize;
        });
    }

    makeAIMove () {
        document.body.classList.add('waiting');
        document.body.addEventListener('click' , this.cancelClick, {capture: true});
        setTimeout(() => {
            document.body.classList.remove('waiting');
            document.body.removeEventListener('click' , this.cancelClick, {capture: true}); 
            const cell = this.getRandomCell();
            this.makeMove(cell);
        }, 1000);
    }   

    checkWinCombinations (number, combinations) { 
        for (let key in combinations) {
            if (typeof combinations[key] === 'string') {
                combinations[key] = this.checkCell (number, combinations[key]);
            } else if (Array.isArray(combinations[key]))  {
                combinations[key] = combinations[key].map(str => {
                    return this.checkCell(number, str)
                });
            }
        }
    }

    checkCell (number, str) {
        if (str.indexOf(number) === 0 || (str.indexOf(number) && str.indexOf(number)>-1)) {  
            str = str.replace(number, '');
        }  
        if (str.trim() === '') {
            this.gameContinue = false;
            this.winGame();
        }    
        return str;
    }

    changeCurrentPlayer () {
        const infoPlayerMove = document.querySelector('#ticTacToePlayerMove');  
        this.currentPlayer = (this.currentPlayer === this.fstPlayer) ? this.sndPlayer : this.fstPlayer;       
        if (infoPlayerMove) {
            infoPlayerMove.innerHTML = `Ходит ${this.currentPlayer.name} (${this.currentPlayer.value})`                
        }
        if (this.currentPlayer.ai && this.gameContinue) {
            this.makeAIMove();
        }
    }

    goBack () {
        this.countUncheckCell = this.areaSize * this.areaSize;
        this.clearWinCombinations();
        domManipulations.destroyBlock('.ticTacToe__area');
        domManipulations.changeScreen(this.gameBlock, 'ticTacToe__screen--active', 'back');
        this.sndScreen.style.height = '';
    }  
    //------------------------------------------------------------------------Управление игрой





    getRandomCell () {
        const allCell = document.querySelectorAll('.ticTacToe__cell:not(.ticTacToe__cell--check)');
        const NumberCell = this.randomNumber();
        const cell = allCell[NumberCell];
        return cell;      
    }

    randomNumber () {
        return Math.floor(Math.random() * (this.countUncheckCell - 1));
    }

    setPlayersWinCombinations () { 
        this.fstPlayer.winCombinations = {...this.winCombinations};    
        this.sndPlayer.winCombinations = {...this.winCombinations}; 
    }

    updateInfoBlock() {
        const infoGroup = this.infoGroup;
        infoGroup.innerHTML = '';
        infoGroup.appendChild(domManipulations.createBlock('p', `(${this.fstPlayer.name}): ${this.fstPlayer.count}`, 'infoGroup--text'));
        infoGroup.appendChild(domManipulations.createBlock('p', `(${this.sndPlayer.name}): ${this.sndPlayer.count}`, 'infoGroup--text'));
        infoGroup.appendChild(domManipulations.createBlock('p', `Всего игр: ${this.allGameCount}`, 'infoGroup--text'));
        infoGroup.appendChild(domManipulations.createBlock('p', `Ходит: ${this.currentPlayer.name} (${this.currentPlayer.value})`, 'infoGroup--text', 'ticTacToePlayerMove'));
        this.sndScreen.insertBefore(infoGroup, this.buttonGroup);
    }

    

    clearWinCombinations() {
        this.winCombinations.winRows = [];
        this.winCombinations.winColumns = [];
        this.winCombinations.winDiagonal = '';
        this.winCombinations.winDiagonalReverse = '';
    } 

 //!!!!!!!!!!!!!!!!!!!Переделать!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    stepDiagonalWinCombination () {
        for (let i=1; i<=this.areaSize; i++) {
            this.winCombinations.winColumns[i-1] = '';
            this.winCombinations.winDiagonal +=  `cell-${i}-${i} `;
        }
    }

    createArea() {
        let rowNumber = 1;
        let columnNumber = 1;
        
        let winRow = '';
        let stepDiagonalReverse = this.areaSize;
        const div = domManipulations.createBlock('div', '', 'ticTacToe__area');
        let row = domManipulations.createBlock('div', '', 'ticTacToe__areaRow'); 

        this.stepDiagonalWinCombination(); 

        for (let i = 1; i<=this.countUncheckCell; i++) {
            const cell = domManipulations.createBlock('div', '', 'ticTacToe__cell', `cell-${rowNumber}-${columnNumber}`);
            cell.addEventListener('click', this.makeMoveHuman.bind(this));
            row.appendChild(cell);

            winRow += `${cell.id} `;

            if (columnNumber === stepDiagonalReverse) {
                this.winCombinations.winDiagonalReverse += `${cell.id} `;
                stepDiagonalReverse -= 1;
            }

            this.winCombinations.winColumns[columnNumber-1] += `${cell.id} `;
            columnNumber+=1;

            if (i > 0 && i % this.areaSize === 0) {
                div.appendChild(row);  
                this.winCombinations.winRows.push(winRow);
                winRow = '';
                rowNumber +=1;
                columnNumber = 1;
                row = domManipulations.createBlock('div', '', 'ticTacToe__areaRow');  
            }
        }
    
        this.setPlayersWinCombinations();
        return div;
    }

}


if ($ticTacToeArea) {
    console.log(new ticTacToeGame($ticTacToeArea));
} else {
    console.error (errorMessageNotFounded);
}

