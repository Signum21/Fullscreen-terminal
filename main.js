import { myConsole } from "./objects.js";

const $text = document.getElementById("text");
$text.setAttribute("data-content", myConsole.pre);
$text.focus();
let command;

$text.addEventListener('keydown', function (event) {
    switch(event.key){
        case "Enter":
            myConsole.addPre(this);
            const lines = this.innerHTML.split("<div>");
            command = lines[lines.length - 1].replace(/&nbsp;|<br>|<\/div>/g, "").trim();
            break;

        case "Backspace":
            if (this.innerHTML == "&nbsp;") {
                this.innerHTML = "&nbsp;";
            }
            else if (this.innerHTML.slice(-15) == "<div><br></div>") {
                this.innerHTML += "<div><br></div>";
                myConsole.setCaretToEnd(this);
            }
            break;

        case "ArrowUp":
            myConsole.showHistory(this, -1);
            break;

        case "ArrowDown":
            myConsole.showHistory(this, 1);
            break;
    }
})

$text.addEventListener('keyup', function (event) {
    if (event.key == "Enter") {
        fixWordSplit(this);

        if(command != ""){
            myConsole.history.push(command);
            myConsole.historyPos = myConsole.history.length;  
            this.removeChild(this.lastChild);      
            const output = myConsole.validateCommand(command);
            const outputA = output.split('\n');
            
            for(let out of outputA){
                myConsole.addPre(this);
                this.innerHTML += "<div>" + out + "</div>";
            }
            this.innerHTML += "<div><br></div>";
        }
        myConsole.setCaretToEnd(this); 
    }
    else if(myConsole.historyCheck){
        myConsole.historyCheck = false;
        myConsole.setCaretToEnd(this); 
        this.classList.remove("history");
    }
})

function fixWordSplit($obj) {
    const lines = $obj.innerHTML.split("<div>");

    if(lines[lines.length - 1] != "<br></div>"){
        $obj.removeChild($obj.lastChild);
        $obj.removeChild($obj.lastChild);
        $obj.innerHTML += (lines.length > 2 ? "<div>" + command + "</div>" : command + "&nbsp;") + "<div><br></div>";
    }
}
