console.log("Starting");
let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext('2d');
let startButton = document.getElementById("startButton");
let setupButton = document.getElementById("setupButton");
let inputTabSizeX = document.getElementById("gridX");
let inputTabSizeY = document.getElementById("gridY");
let inputSqrSize = document.getElementById("sqrSize");
let inputRepeatTime = document.getElementById("iterTime");
let aliveColor = document.getElementById("aliveColor");
let deadColor = document.getElementById("deadColor");
let gridTogle = document.getElementById("gridToggle");
let paintButton = document.getElementById("paintButton");

let sqrSize;
let tabSizeX;
let tabSizeY;
let currentSqrArray;
let nextSqrArray;
let repeatTime;// time for life loop iteration in miliseconds
let aliveColorValue;
let deadColorValue;
let isMouseButtonDown0 = false;
let isMouseButtonDown1 = false;

let sqrXPos;
let sqrYPos;
let sqrOldXPos;
let sqrOldYPos;
let liveNeighbours =0;
let isRunning = false;
let idInterval;
let canvasOffsetX=0;//canvas offsets when scrolling or zooming
let canvasOffsetY=0;
let isGridOn;
let isPainting = true;

SetupGame();// setups the start values

function Main()// this function is running when You press the start simulation button
{
    CalculateLife(); 
    RewriteArrays(nextSqrArray, currentSqrArray);
    DrawGridFromArray(currentSqrArray);
}

startButton.addEventListener("click",ToggleSimulation);// this portion of code toggles if Main() i running when start button is pressed
function ToggleSimulation()
{
    repeatTime = parseInt(inputRepeatTime.value);
    if(isRunning == false)
    {
        isRunning = true;
        //console.log("Running 1: "+isRunning);
        startButton.innerText = "Stop simulaiton"
        idInterval = setInterval(Main, repeatTime);
    }
    else if(isRunning == true)
    {
        isRunning = false;
        //console.log("Running 2: "+isRunning);
        startButton.innerText = "Start simulaiton"
        clearInterval(idInterval);
    }
}

paintButton.addEventListener("click",TogglePainting);// toggles the isPainting when clicking the paint button and changes the button text
function TogglePainting(){
    isPainting = !isPainting;
    if(isPainting == true){
        paintButton.innerText = "Painting";
    }
    else if(isPainting == false){
        paintButton.innerText ="Erasing";
    }
    console.log("isPainging: "+isPainting);
}

window.onscroll=function(e){ RecalculateOffset(); } // recalculates the game canvas size when scrolling or zooming the window
window.onresize=function(e){ RecalculateOffset(); }
function RecalculateOffset(){
    var BB=canvas.getBoundingClientRect();
    canvasOffsetX=BB.left;
    canvasOffsetY=BB.top;
}

// sets a 1 in currentSqrArray at the cell x and y position and paints the whole grid
canvas.onmousedown = e=>{
    
    if(e.button == 0){
        isMouseButtonDown0 = true;
    }
    
    sqrXPos = Math.floor((e.clientX- canvasOffsetX)/sqrSize);
    sqrYPos = Math.floor((e.clientY - canvasOffsetY)/sqrSize);

    if(e.button == 0 && isPainting == true){
        currentSqrArray[sqrXPos][sqrYPos] = 1
    }
    if(e.button == 0 && isPainting == false){
        currentSqrArray[sqrXPos][sqrYPos] = 0
    }

    DrawGridFromArray(currentSqrArray);
}

// sets the isMouseButtonDown0 to false when mouse button released
canvas.onmouseup = e=>{
    if(e.button == 0){
        isMouseButtonDown0 = false;
    }
}

// sets a 0 or 1 depending on the isPainting while the mouse is moving over canvas in the currnetSqrArray and draws it
canvas.onmousemove = e=>{

    if(isRunning == false)
    {
        sqrXPos = Math.floor((e.clientX- canvasOffsetX)/sqrSize);
        sqrYPos = Math.floor((e.clientY - canvasOffsetY)/sqrSize);

        if((sqrXPos != sqrOldXPos) || (sqrYPos != sqrOldYPos))
        {
            if(isMouseButtonDown0 == true && isPainting == true){
                currentSqrArray[sqrXPos][sqrYPos] = 1
            }
            else if(isMouseButtonDown0 == true && isPainting == false){
                currentSqrArray[sqrXPos][sqrYPos] = 0
            }

            sqrOldXPos = sqrXPos;
            sqrOldYPos = sqrYPos;

            DrawGridFromArray(currentSqrArray);
        }
    }
}

// sets up the start values and arrays
setupButton.addEventListener("click", SetupGame);
function SetupGame()
{
    RecalculateOffset();
    aliveColorValue = aliveColor.value;
    deadColorValue = deadColor.value;
    isGridOn = gridTogle.checked;

    sqrSize = parseInt(inputSqrSize.value);
    if(sqrSize <5){
        sqrSize = 5;
        inputSqrSize.value = 5;
    }
    tabSizeX = parseInt(inputTabSizeX.value);
    if(tabSizeX <10){
        tabSizeX = 10;
        inputTabSizeX.value = 10;
    }
    tabSizeY = parseInt(inputTabSizeY.value);
    if(tabSizeY <10){
        tabSizeY = 10;
        inputTabSizeY.value = 10;
    }
    repeatTime = parseInt(inputRepeatTime.value);// time for life loop iteration in miliseconds

    canvas.width = sqrSize * tabSizeX;
    canvas.height = sqrSize * tabSizeY;

    currentSqrArray = new Array(tabSizeX);
    nextSqrArray = new Array(tabSizeX);

    for (var i = 0; i < currentSqrArray.length; i++) { 
        currentSqrArray[i] = new Array(tabSizeY); 
    }
    for (var i = 0; i < nextSqrArray.length; i++) { 
        nextSqrArray[i] = new Array(tabSizeY); 
    }

    PopulateSqrArray(0,currentSqrArray);
    PopulateSqrArray(0,nextSqrArray);
    DrawGridFromArray(currentSqrArray);
}

// draws the grid with or withouth the grid lines
function DrawGridFromArray(inputArray)
{
    if(isGridOn == true){
        for(let i = 0; i< tabSizeX; i++){
            for(let j = 0; j< tabSizeY; j++){
                if(inputArray[i][j] == 0){
                    ctx.fillStyle = deadColorValue;
                    ctx.fillRect(i*sqrSize-1, j*sqrSize-1, sqrSize-1,sqrSize-1);
                }
                else if(inputArray[i][j] == 1){
                    ctx.fillStyle = aliveColorValue;
                    ctx.fillRect(i*sqrSize-1, j*sqrSize-1, sqrSize-1,sqrSize-1);
                }
            }
        }
    }
    else if(isGridOn == false){
        for(let i = 0; i< tabSizeX; i++){
            for(let j = 0; j< tabSizeY; j++){
                if(inputArray[i][j] == 0){
                    ctx.fillStyle = deadColorValue;
                    ctx.fillRect(i*sqrSize, j*sqrSize, sqrSize,sqrSize);
                }
                else if(inputArray[i][j] == 1){
                    ctx.fillStyle = aliveColorValue;
                    ctx.fillRect(i*sqrSize, j*sqrSize, sqrSize,sqrSize);
                }
            }
        }
    }
}

// sets the inputArray with values value
function PopulateSqrArray(value, inputArray)
{
    for(let i = 0; i< tabSizeX; i++){
        for(let j = 0; j< tabSizeY; j++){
            inputArray[i][j] = value;
        }
    }
}

// calculates the states of the nextSqrArray depending on the live cells positions in the currentSqrArray
function CalculateLife(){
    for(let i = 0; i< tabSizeX; i++)
    {
        for(let j = 0; j< tabSizeY; j++)
        {
            FindAdjLife(currentSqrArray, i, j);
            
            // the laws of life
            if(currentSqrArray[i][j] == 0 && liveNeighbours == 3){
                nextSqrArray[i][j] = 1;
            }
            else if(currentSqrArray[i][j] == 1 && (liveNeighbours <2 || liveNeighbours >3)){
                nextSqrArray[i][j] = 0;
            }
            else{
                nextSqrArray[i][j] = currentSqrArray[i][j];
            }
            liveNeighbours = 0;
        }
    }
}

// calculates the live cells adjacent to the xpos and ypos positions in the searchArray
function FindAdjLife(searchArray, xpos,ypos)
{
    for(let i = -1; i<= 1; i++)
    {
        for(let j = -1; j<= 1; j++)
        {
            if(i == 0 && j == 0){
               continue;
            }
            let col = (xpos + i + tabSizeX) % tabSizeX;
            let row = (ypos + j + tabSizeY) % tabSizeY;

            liveNeighbours += searchArray[col][row];
        }
    }
}

// rewrites values from aray from to aray to
function RewriteArrays(from, to)
{
    for(let i = 0; i< tabSizeX; i++){
        for(let j = 0; j< tabSizeY; j++){
            to[i][j] = from[i][j];
        }
    }
}
