class CalcController {

    constructor() {

        this._lastOperator = '';
        this._lastNumber = '';
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;

        this._operation = [];
        this._locale = 'pt';
        this._displayCalcEl = document.querySelector('input[type="text"]');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('input[type="time"]');
        this._currentDate;

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    } 
    
    copyToClipboard() {

    }
    
    initialize() {

        this.setDisplayDateTime();

        setInterval( ()=> {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();

        document.querySelectorAll('.all-clear_AC').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio(); 
            });
        });
    }

    toggleAudio() { // metodo que vai controlar o atribudo para saber se o audio esta ligado ao não
        this._audioOnOff = (this._audioOnOff) ? false : true;
    }

    playAudio() { // metodo que toca o som
        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    // capturar evento de teclado
    initKeyboard() {
        document.addEventListener('keyup', e=> {

            this.playAudio();

            switch(e.key) {
                case 'Escape':
                    this.clearAll();
                break;
                case 'Backspace':
                    this.clearEntry();
                break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                break;
                case '.':
                case ',':
                    this.addDot('.');
                break;
                case 'Enter':
                case '=':
                    this.calc();
                break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                break;
            }
        });
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event=> {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay(); // mostrar na tela a operacão feita
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay(); // mostrar na tela a operacão feita
    }
    /** verificar o ultimo elemento */
    getLastOperation() {
        return this._operation[this._operation.length-1]; // pegar o ultimo elemento do arry
    }

    setLastOperation(value) {
        this._operation[this._operation.length-1] = value; // passar um valor na posicao de uma outra que ja existia (o que ja existia deixa de existir, dando lugar a outra nova valor)
                                                           // ex: coloca-> "3" proximo coloca "4" ele tira "3" e coloca-> "34"
    }

    isOperator(value) { // verificar se o value é um operador
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1) // indexOf() percore o array, se o valor do value for igual ao algum elemento que se
                                                               // encontra dentro do array, vai retornar o index do elemento se não retorna (-1)
    }

    pushOperation(value) {//verificar se tem três elementos dentro de array (validacão)
        this._operation.push(value); // só é responsavel para fazer o push

        if(this._operation.length > 3) { // se (numero operador numero) -> se for colocar mais um operador, fazer a operacao
                                         //  de (numero operador numero = resultado), então: resultado operador novoNumero 
            this.calc();  
            console.log(this._operation)
        }
    }

    getResult () {
        return eval(this._operation.join(""));
    }

    // this._operation que tem toda a nossa operacao guardada. vamos calcula-lo
    calc(){
        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop(); // tirar e guardar a ultima operacao

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
        }
        
        let result = this.getResult(); // a funcao 'eval()' é quem faz as operacões

        if (last == "%") { //verificar se ultimo é simbolo %

            result /= 100;

            this._operation = [result];
            	
        } else {
            
            this._operation = [result]; // atribuir novos valores ao array this._operation
            
            if (last) this._operation.push(last);
        }
        this.setLastNumberToDisplay(); // mostrar na tela a operacão feita
    }

    getLastItem(isOperator = true) { // metodo que vai pegar por patrão o ultimo operador
        let lastItem;

        for(let i = this._operation.length - 1; i >= 0; i--) {

            if(this.isOperator(this._operation[i]) == isOperator) { // o resultado do metodo isOperation tem de ser igual ao parametro
                lastItem = this._operation[i]; // se o i for um operator quer dizer que ja encotrei um Operator, e vou colocar o operator na minha variavel
                break;
            }            
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() { // o metodo que vai mostrar o ultimo numero no display
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        // para colocar esse ultimo numero na tela, é basta chamar o objecto this.displayCalc e colocar igual ao lasNumber
        this.displayCalc = lastNumber;
    }

    addOperation(value) { // aqui eu mexo nos numeros (adicionando uma nova operacão)

        if(isNaN(this.getLastOperation())) { //string ( + - / * % . )

            if(this.isOperator(value)){
                this.setLastOperation(value); // concatenar valores (ex: "2" "5" "6" -> 256)
            } else if(isNaN(value)) {
                console.log("outra coisa", value)
            } else {
                this.pushOperation(value); // fazer push
                this.setLastNumberToDisplay(); // inserir o primeiro numero na tela
            }
            
        } else {

            if (this.isOperator(value)) { // o que entrou é operador??
                this.pushOperation(value); //sim. adiciona no array, em uma outra posicão então (fazer push)
            } else {
                let newValue = this.getLastOperation().toString() + value.toString(); //number (concatenar-> "3 5 -> 35")  -> aqui mexo nos numeros: estou modificando o numero
                this.setLastOperation(newValue);// newValue-> vai ser o valor final,  ("6" "2" "4"   624 <--newValue)
                
                // Atualizar o dilplay
                this.setLastNumberToDisplay(); // mostra o ultimo numero no display
            }
        }
        console.log(this._operation);
    }

    setError() {
        this.displayCalc = "ERROR"; //mensagem de erro
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; // impessa que se coloca ponto mais de um vez

        if ( this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setLastNumberToDisplay(); //atualizar a tela
    }

    execBtn(value) {

        this.playAudio(); //toda vez que qualquer botão é precionado "toca som"

        switch(value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case '+':
                this.addOperation('+');
                break;
            case '-':
                this.addOperation('-');
                break;
            case '/':
                this.addOperation('/');
                break;
            case '*':
                this.addOperation('*');
                break;
            case '%':
                this.addOperation('%');
                break;
            case '.':
                this.addDot('.');
                break;
            case '=':
                this.calc();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
            break;
        }

    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll('.calculator-keys > button');
        
        buttons.forEach((btns, index) => {
            this.addEventListenerAll(btns, "click drag", e => {
                let textBtn = btns.value

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btns, "mouseover mouseup mousedow", e =>{ 
                btns.style.cursor = "pointer";// pointer -> colocar sinal de mão ao passar em cima de butões
            });
        });    
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, { //formatar data
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale); 
    }

    get displayTime(){
        return this._timeEl.value;
    }

    set displayTime(value) {
        return this._timeEl.value = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.value;
    }

    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.value = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
    
}