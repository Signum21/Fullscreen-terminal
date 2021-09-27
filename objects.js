const myCalc = {
    sum : (x, y) => (+x) + (+y),
    sub : (x, y) => x - y,
    mult : (x, y) => x * y,
    div : (x, y) => x / y,
    opS : ['+', '-', '*', '/']
};

export const myConsole = {
    pre : "signum@desktop:",
    history : [],
    historyPos : 0,
    historyCheck : false,
    commandTemp : "",

    validateCommand : function(com){
        const commands = com.split(' ');

        switch(commands[0]){        
            case "echo":
                if(commands[1] != undefined){
                    return com.substr(5);
                }
                return "The echo command takes at least one parameter";
            
            case "datetime":
                if(commands[1] == undefined){
                    const dateObj = new Date();
                    const time = dateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
                    const date = dateObj.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
                    return time + " ~ " + date;
                }
                return "The datetime command doesn't take any parameter";
            
           case "expr":
                const n1 = +commands[1];
                const n2 = +commands[3];
                const operation = Object.values(myCalc);

                if(!isNaN(n1) && myCalc.opS.includes(commands[2]) && !isNaN(n2) && commands[4] == undefined){
                    return operation[myCalc.opS.indexOf(commands[2])](n1, n2).toString();
                }  

                try{
                    return eval(com.substr(5)).toString();
                }
                catch{
                    return "Insert a valid expression"; 
                } 
            
            case "history":
                if(commands[1] == undefined){
                    let counter = 1;
                    return this.history.reduce((acc, s) => acc += counter++ + " ~ " + s + '\n', "").slice(0, -1);
                }
                else if(commands[1] != undefined && commands[2] == undefined){
                    if(commands[1] == "-l" || commands[1] == "--length"){
                        return this.history.length.toString();
                    }
                    else if(commands[1] == "-c" || commands[1] == "--clear"){
                        this.history = [];
                        this.historyPos = 0;
                        return "Command history emptied";
                    }
                    else if(commands[1] == "--help"){
                        return "The history command takes these parameters: \n-l or --length ~ Print history length \n-c or --clear ~ Empty the command history";
                    }
                    return "Parameter of the history command not recognised"
                }
                return "The history command takes at max one parameter";
            
            case "hedgehog":
                if(commands[1] == undefined){
                    return "&#129428";
                }
                return "The hedgehog command doesn't take any parameter";

            default:
                return "Command not found";
        }
    },

    addPre : function ($obj) {
        const data = $obj.getAttribute("data-content");
        $obj.setAttribute("data-content", data + "\n" + this.pre);
    },

    showHistory : function($obj, dir){
        const inner = $obj.innerHTML.split("<div>");
        
        if(inner.length <= 1){
            return;
        }
        $obj.classList.add("history");
        this.historyCheck = true; 
        const condition = (dir > 0) ? (this.historyPos < this.history.length - 1) : (this.historyPos > 0);

        if(dir < 0 && this.historyPos == this.history.length){
            this.commandTemp = inner[inner.length - 1];
        }

        if(this.history.length > 0 && condition){
            this.historyPos += dir;
            $obj.removeChild($obj.lastChild);
            $obj.innerHTML += "<div>" + this.history[this.historyPos] + "</div>";
        }
        else if(dir > 0 && this.historyPos == this.history.length - 1){
            this.historyPos++;
            $obj.removeChild($obj.lastChild);
            $obj.innerHTML += "<div>" + this.commandTemp;
        }
    },

    setCaretToEnd : ($obj) => {
        const range = document.createRange();
        const lines = $obj.innerHTML.split("<div>").length;
        range.setStart($obj.childNodes[lines-1], 1);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
};