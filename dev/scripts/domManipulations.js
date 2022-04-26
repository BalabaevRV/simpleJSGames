
export default class domManipulations {

    static createBlock (type = 'p', text = '', classBlock = '', id = '') {
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
    
    static createButton (sign, classButton = 'btn', typeButton = '', clckFunction, clckFunctionParams, classBtn = '') {
        const btn = document.createElement('button');
        btn.innerHTML = sign;
        if (typeButton) {
            const typeBtn = `${classBtn}${(typeButton) ? '--' : ''}`;
            btn.classList.add(typeBtn);
        }
        if (classBtn) {
            btn.classList.add(classBtn);
        }
        btn.classList.add(classButton);
        btn.addEventListener('click', () => clckFunction(clckFunctionParams));
        return btn;     
    }
   
    static createInput(value = '', type = 'text', classInput = '', inputFunction = null, BlurFunction = null) {
        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.classList.add(classInput);  
    
        if (inputFunction) {
            input.addEventListener('input', inputFunction);
        }
        if (BlurFunction) {
            input.addEventListener('blur', BlurFunction);
        }
    
        return input;     
    }
        

    static createOptionForSelect (value, nameText, selectedItem) {
        const option = document.createElement('option');
        option.value = value;
        option.innerHTML = nameText;
        option.selected = value === selectedItem; 
        return option;
    }

    static createSelect (groupClass = '', labelClass = '' , labelText = '', idInput = '', selectClass = '', selectedItem = '', changeMethod = null) {
        const div = domManipulations.createBlock('div', '', groupClass);
        const label = domManipulations.createBlock('label', labelText, labelClass, groupClass);
    
        div.appendChild(label);
        const select = domManipulations.createBlock('select', '','', idInput);
        
        const optionHuman = domManipulations.createOptionForSelect('human', 'Человек', selectedItem);
        const optionComp = domManipulations.createOptionForSelect('computer', 'Компьютер', selectedItem);
    
        
        select.appendChild(optionHuman);
        select.appendChild(optionComp);
        select.classList.add(selectClass);
        div.appendChild(select);
    
        if (changeMethod) {
            select.addEventListener("change", changeMethod);
        }
    
        return div;
    
    }

    static createchoosePlayerInput (groupClass) {
        const div = domManipulations.createBlock('div', '', 'ticTacToe__inputGroup');
        const label = domManipulations.createBlock('label', type, 'ticTacToe__labelInput');
    }



    static destroyBlock (blockClass) {
        const block = document.querySelector(blockClass);  
        if (block) {   
            block.remove();
        }
    }

    static changeScreen (mainBlock = document, activeClass, step = 'next') {
        const currentScreen = mainBlock.querySelector(`.${activeClass}`);
        let newScreen;

        currentScreen.classList.toggle(activeClass);
        setTimeout(() => {
            if ( step === 'next') {
                newScreen = currentScreen.nextSibling;  
            } else {
                newScreen = currentScreen.previousSibling; 
            }     
            newScreen.classList.toggle(activeClass);  
        }, 500);
    }

}   

