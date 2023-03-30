"use strict";

import domManipulations from './domManipulations.js';

const $pizzaPacMan = document.querySelector("#pizzaPacMan");
const errorMessageNotFounded = "Area for game not founded. Create html node with id=pizzaPacMan";

class pizzaPacMan {
    constructor (gameBlock, autoMove = false, speed = 10, sizeCell = 50) {
        this.gameBlock = gameBlock;
        this.areaHeight = this.gameBlock.clientHeight-sizeCell;
        this.areaWidth = this.gameBlock.clientWidth-sizeCell;
        this.sizeCell = sizeCell; 
        this.sizeCellString = `${this.sizeCell}px`;  
        this.mainHeroBlock = this.createMainHero();
        this.finishCordLeft = 0;
        this.finishCordTop = 0;
        this.currentCell = '0-0__PizzaPacMan';
        this.currentRow = 0;
        this.currentColumn = 0;
        this.nextColumn = 1;
        this.nextRow = 1;
        this.finishCoordinate = 0;
        this.numOfColumns = 0;
        this.numOfRow = 0;
        this.gameBlock.appendChild(this.mainHeroBlock);
        this.autoMove = autoMove;
        this.speed = speed;
        this.currentDirection = 'horizontal';
        this.currentAction = 'moveRight';

        this.mainHero = this.createStartParamsMainHero();

        this.createLayouts();

        this.fixInfo = this.createFixBlock();
        this.fixInfo.innerHTML =  'current column = 0, current corw = 0, current direction = 0';
        
        window.addEventListener('keyup', this.keyHandler.bind(this));

        if (this.autoMove) {
            this.moveInterval = setInterval(this.moveRight.bind(this), this.speed);
        }

    }    

    createFixBlock() {
        this.gameBlock.appendChild(domManipulations.createBlock('div', '0','fixBlock', 'fixInfo'));
        const fixInfo = document.getElementById('fixInfo');      
        return fixInfo;
    }

    changeFixInfo (ddir) {
        this.fixInfo.innerHTML =  `current row = ${this.currentRow}, current column = ${this.currentColumn}, current direction = ${ddir}, current coordination = ${this.mainHero.left}px--${this.mainHero.top}px`;
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++Создание блоков
    createMainHero (sizeCell) {
        const mainHero = domManipulations.createBlock('div', '', '', 'pizzaPacMan__mainHero');
        mainHero.style.width = this.sizeCellString;
        mainHero.style.height = this.sizeCellString;
        //TODO
        // Разобраться почему 10px
        mainHero.style.top = '10px';
        return mainHero; 
    }

    addMarginsToMainArea() {
        const paddingX = (this.gameBlock.clientWidth % this.sizeCell) / 2;
        const paddingY = (this.gameBlock.clientHeight % this.sizeCell) / 2;
        if (paddingX > 0) {
            this.gameBlock.style.paddingLeft = `${paddingX}px`; 
            this.gameBlock.style.paddingRight = `${paddingX}px`; 
        }

        if (paddingY > 0) {
            this.gameBlock.style.paddingTop = `${paddingY}px`; 
            this.gameBlock.style.paddingBottom = `${paddingY}px`; 
        }
    }

    createLayouts () {
        this.numOfColumns = Math.floor(this.gameBlock.clientWidth/this.sizeCell);
        this.numOfRow = Math.floor(this.gameBlock.clientHeight/this.sizeCell);
        const numOfCell = this.numOfColumns * this.numOfRow;
        let i = 0;
        let column = 0;
        let row = 0;
        this.addMarginsToMainArea();
        do {
            i = i + 1;
            const cell = domManipulations.createBlock ('div', '', 'pizzaPacMan__cell', ''); 
            cell.style.width = this.sizeCellString;
            cell.style.height = this.sizeCellString;
            cell.id = `${row}-${column}__PizzaPacMan`;
            this.gameBlock.appendChild (cell);
            column++;
            if (column > this.numOfColumns-1) {
                column = 0;
                row++;
            }
      } while (i < numOfCell);

      this.addWall();

    }

    addWall () {
        const cells = document.getElementsByClassName('pizzaPacMan__cell');
        const cellsArray = Array.from(cells);
        cellsArray[2].classList.add('pizzaPacMan__cell--wall'); 
        cellsArray[12].classList.add('pizzaPacMan__cell--wall'); 
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Управление параметрами 
    createStartParamsMainHero() {
        return {
            'left': 0,
            //todo
            //почему 10
            'top': 10,
        }
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Управление игроком
    changeAutoMove (direction) {
        clearInterval(this.moveInterval);
        this.moveInterval = setInterval(this[direction].bind(this), this.speed);

    }


    moveRight () {
        if (this.CheckRightWall()) {

            (this.mainHero.left < this.areaWidth) ? this.mainHero.left++  : this.mainHero.left = this.areaWidth;
            this.mainHeroBlock.style.left = `${this.mainHero.left}px`;  
            this.nextColumn = this.currentColumn+1;
            (this.currentColumn < this.numOfColumns) ? this.nextColumn = this.currentColumn+1 : this.nextColumn = this.numOfColumns;
        } 

        this.setCurrentCell();
        this.changeFixInfo('moveRight');

        this.checkChangeDirection ();
    }

   
    moveLeft () {
        if (this.CheckLeftWall()) {
            (this.mainHero.left > 0) ? this.mainHero.left-- : this.mainHero.left = 0;
            this.mainHeroBlock.style.left = `${this.mainHero.left}px`;
            (this.currentColumn > 0) ? this.nextColumn = this.currentColumn-1 : this.nextColumn = 0;
        }    

        this.setCurrentCell();
        this.changeFixInfo('left');

        this.checkChangeDirection ();

}

    moveTop () {
        //ПРОДОЛЖИТЬ ОТСЮДА, Врезается в стену и не едет дальше
        (this.currentRow > 0) ? this.nextRow = this.currentRow-1 : this.nextRow = 0;
        if (this.CheckTopWall()) {
                        //TODO
            //Почему 10
            (this.mainHero.top > 10) ? this.mainHero.top-- : this.mainHero.top = 10;
            this.mainHeroBlock.style.top = `${this.mainHero.top}px`;
            console.log('nextRow = ' + this.nextRow);
        }
        this.setCurrentCell();
        this.changeFixInfo('top');

        this.checkChangeDirection2 ();
    }

    moveBottom () {
        (this.currentRow === this.numOfRow-1) ? this.nextRow = this.numOfRow-1 : this.nextRow = this.currentRow+1;
        if (this.CheckBottomWall()) {
            (this.mainHero.top < this.areaHeight) ? this.mainHero.top++ : this.mainHero.top = this.areaHeight;
            this.mainHeroBlock.style.top = `${this.mainHero.top}px`;
        }
        this.setCurrentCell();
        this.changeFixInfo('bottom');

        this.checkChangeDirection2 ();
    }


    checkChangeDirection () {
        if (this.changeDirection) {
            if (this.finishCordLeft === this.mainHero.left) {
                this.changeAutoMove(this.currentAction);
                this.changeDirection = false;
            }
        }
    }

    checkChangeDirection2 () {
        if (this.changeDirection) {
            if (this.finishCordTop === this.mainHero.top) {
                console.log(this.currentAction);
                this.changeAutoMove(this.currentAction);
                this.changeDirection = false;
            }
        }
    }


    CheckRightWall () {
        const nextColumn = this.currentColumn + 1;
        let nextCellId = `${this.currentRow}-${nextColumn}__PizzaPacMan`;
        this.currentCell = document.getElementById(nextCellId); 
        if (this.currentColumn === this.numOfColumns-1 || this.currentCell.classList.contains('pizzaPacMan__cell--wall')) {
            return false;
        }  else {
            return true;
        }
    }

    CheckLeftWall () {
        const prevColumn = this.currentColumn;
        let nextCellId = `${this.currentRow}-${prevColumn}__PizzaPacMan`;
        this.currentCell = document.getElementById(nextCellId); 
        if (this.currentCell.classList.contains('pizzaPacMan__cell--wall')) {
            return false;
        }  else {
            return true;
        }
    }


    CheckTopWall () {
        let nextCellId = `${this.nextRow}-${this.currentColumn}__PizzaPacMan`;
        this.currentCell = document.getElementById(nextCellId); 
        if (this.currentCell.classList.contains('pizzaPacMan__cell--wall')) {
            return false;
        }  else {
            return true;
        }
    }


    CheckBottomWall () {
        let nextCellId = `${this.nextRow}-${this.currentColumn}__PizzaPacMan`;
        this.currentCell = document.getElementById(nextCellId); 
        if ( this.currentRow === this.numOfRow-1  || this.currentCell.classList.contains('pizzaPacMan__cell--wall')) {
            return false;
        }  else {
            return true;
        }
    }


    setCurrentCell () {
        this.currentRow = Math.floor((this.mainHero.top-10)/50); 
        this.currentColumn = Math.floor(this.mainHero.left/50);
    }



    keyHandler (e) {
            switch(e.keyCode) {
                case 39:
                case 68:
                        this.mainHeroBlock.style.transform = 'rotate(0)';
                        this.currentAction = 'moveRight';
                        break;
                case 37:
                case 65:
                    this.mainHeroBlock.style.transform = 'rotate(180deg)';
                    this.currentAction = 'moveLeft';
                    break;
                case 38:
                case 87:
                        this.mainHeroBlock.style.transform = 'rotate(-90deg)';
                        this.currentAction = 'moveTop';
                        break;
                case 40:
                case 83:    
                        this.mainHeroBlock.style.transform = 'rotate(90deg)';
                        this.currentAction = 'moveBottom';
                        break;                                   
                                                                
                default: 
                    break;
            } 
        if (e.code == 'KeyZ' && (e.ctrlKey || e.metaKey)) {
            alert('Отменить!')
          
        }
        this.changeDirection = true;
        this.finishCurrentCell();
    }

    finishCurrentCell() {
        this.finishCordLeft = this.nextColumn*this.sizeCell;
        this.finishCordTop = (this.nextRow*this.sizeCell)+10;
    }

}

if ($pizzaPacMan) {
    console.log(new pizzaPacMan($pizzaPacMan, true));
} else {
    console.error (errorMessageNotFounded);
}

