/*global Phaser*/

/*=================================================================
                            Variables
=================================================================*/

var game = new Phaser.Game(960, 640, Phaser.AUTO, "", {preload: preload, create: create, update: update, render: render});
var gameState = "";
var tileGroup, tileSS, bombsNearClick, boardWidth, boardHeight, totalGridTiles, clickedTile, winGame, bgBox, counter, counterText, counterLoop;
var tileBorderTop,tileBorderBottom, tileBorderRight, tileBorderLeft, tileIndex, canLoop = true, numberOfCorrectFlags, numberOfBombs, rnd;

// 1:easy   2:med   3:hard
var difficulty = 2;
var titleText, difficultyText, easyButton, easyText, medButton, medText, hardButton, hardText, sizeText, oneButton, oneText, twoButton, twoText, startGameButton,
startGameText, boardSizeDisplayText, difficultyDisplayText, topBox, winLoseText, restartButton, restartText, toTitleScreenButton, toTitleScreenText,
bombsOnScreenText, flagsOnScreenText, numberOfFlags, customButton, customText, inputX, inputY;

boardWidth = 10;
boardHeight = 10;



/*=================================================================
                        Phaser Functions
=================================================================*/

function preload(){
    game.load.spritesheet("tileSS", "assets/tileSS.png", 32, 32);
    game.load.spritesheet("buttonSS", "assets/buttons.png", 192, 64);
    game.load.bitmapFont("title", "assets/title100.png", "assets/title100.fnt");
    game.load.bitmapFont("small", "assets/text32.png", "assets/text32.fnt");
}

function create(){ 
    //prevent prompt on right click
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
    game.stage.backgroundColor = 0x777777;
    
    tileGroup = game.add.group();
    tileGroup.inputEnableChildren = true;
    
    titleText = game.add.bitmapText(game.width/2, 60, "title", "MINESWEEPER", 70);
    titleText.anchor.setTo(0.5);
    titleText.kill();
    
        difficultyText = game.add.bitmapText(160, 182, "small", "DIFFICULTY", 32);
        difficultyText.anchor.setTo(0.5);
        difficultyText.kill();
        
            easyButton = game.add.button(160, 270, "buttonSS", function(){difficulty = 1; updateWindow();}, this, 1, 0, 2 );
            easyButton.anchor.setTo(0.5);
            easyText = game.add.bitmapText(160, 270, "small", "EASY", 26);
            easyText.anchor.setTo(0.5);
            easyButton.kill();
            easyText.kill();
            
            medButton = game.add.button(160, 370, "buttonSS", function(){difficulty = 2; updateWindow();}, this, 1, 0, 2 );
            medButton.anchor.setTo(0.5);
            medText = game.add.bitmapText(160, 370, "small", "NORMAL", 26);
            medText.anchor.setTo(0.5);
            medButton.kill();
            medText.kill();
            
            hardButton = game.add.button(160, 470, "buttonSS", function(){difficulty = 3; updateWindow();}, this, 1, 0, 2 );
            hardButton.anchor.setTo(0.5);
            hardText = game.add.bitmapText(160, 470, "small", "HARD", 26);
            hardText.anchor.setTo(0.5);
            hardButton.kill();
            hardText.kill();
        
        
        sizeText = game.add.bitmapText(game.width-160, 182, "small", "BOARD SIZE", 32);
        sizeText.anchor.setTo(0.5);
        sizeText.kill();
        
            oneButton = game.add.button(game.width-160, 270, "buttonSS", function(){boardWidth = 10; boardHeight = 10; updateWindow();}, this, 1, 0, 2 );
            oneButton.anchor.setTo(0.5);
            oneText = game.add.bitmapText(game.width-160, 270, "small", "10x10", 26);
            oneText.anchor.setTo(0.5);
            oneButton.kill();
            oneText.kill();
            
            twoButton = game.add.button(game.width-160, 370, "buttonSS", function(){boardWidth = 25; boardHeight = 15; updateWindow();}, this, 1, 0, 2 );
            twoButton.anchor.setTo(0.5);
            twoText = game.add.bitmapText(game.width-160, 370, "small", "25x15", 26);
            twoText.anchor.setTo(0.5);
            twoButton.kill();
            twoText.kill();
            
            customButton = game.add.button(game.width-160, 470, "buttonSS", customBoardSize, this, 1, 0, 2, 0);
            customButton.anchor.setTo(0.5);
            customText = game.add.bitmapText(game.width-160, 470, "small", "CUSTOM", 26);
            customText.anchor.setTo(0.5);
            customButton.kill();
            customText.kill();
        
        bgBox = game.add.graphics(0, 0);
        bgBox.beginFill(0x555555);
        bgBox.drawRect(game.width/2 -100, game.height/2 -10, 200, 200);
        bgBox.endFill();
        bgBox.kill();
        
        difficultyDisplayText = game.add.bitmapText(game.width/2, game.height/2 + 60, "small", "update me :p", 32);
        difficultyDisplayText.anchor.setTo(0.5);
        boardSizeDisplayText = game.add.bitmapText(game.width/2, game.height/2 + 120, "small", "update me :p", 32);
        boardSizeDisplayText.anchor.setTo(0.5);
        difficultyDisplayText.kill();
        boardSizeDisplayText.kill();
        updateWindow();
        
        startGameButton = game.add.button(game.width/2, game.height-60, "buttonSS", function(){startState("GET_READY")}, this, 1, 0, 2, 0 );
        startGameButton.anchor.setTo(0.5);
        startGameText = game.add.bitmapText(game.width/2, game.height-60, "small", "START", 26);
        startGameText.anchor.setTo(0.5);
        startGameButton.kill();
        startGameText.kill();
        
        
        topBox = game.add.graphics(0, 0);
        topBox.beginFill(0x606060);
        topBox.drawRect(0, 0, game.width, 140);
        topBox.endFill();
        topBox.kill();
        
            counterText = game.add.bitmapText(game.width/2, 45, "small", "0s", 32);
            counterText.anchor.setTo(0.5);
            counterText.kill();
            
            winLoseText = game.add.bitmapText(game.width/2, 110, "small", "", 26);
            winLoseText.anchor.setTo(0.5);
            winLoseText.kill();
            
            toTitleScreenButton = game.add.button(160, 45, "buttonSS", function(){startState("TITLE_SCREEN")}, this, 1, 0, 2, 0);
            toTitleScreenButton.anchor.setTo(0.5);
            toTitleScreenText = game.add.bitmapText(160, 45, "small", "Title Screen", 24);
            toTitleScreenText.anchor.setTo(0.5);
            toTitleScreenButton.kill();
            toTitleScreenText.kill();
            
            restartButton = game.add.button(game.width-160, 45, "buttonSS", function(){startState("GET_READY")}, this, 1, 0, 2, 0);
            restartButton.anchor.setTo(0.5);
            restartText = game.add.bitmapText(game.width-160, 45, "small", "Restart", 26);
            restartText.anchor.setTo(0.5);
            restartButton.kill();
            restartText.kill();
            
            
            
            bombsOnScreenText = game.add.bitmapText(160, 110, "small", "BOMBS", 26);
            bombsOnScreenText.anchor.setTo(0.5);
            flagsOnScreenText = game.add.bitmapText(game.width-160, 110, "small", "FLAGS", 26);
            flagsOnScreenText.anchor.setTo(0.5);
            bombsOnScreenText.kill();
            flagsOnScreenText.kill();
            
    tileGroup.onChildInputDown.add(changeTile, this);
    
    game.input.onTap.add(onTapClick);
    
    startState("TITLE_SCREEN");
}

function update(){
    switch(gameState){
        case"PLAY_GAME":
            if(canLoop){
                tileGroup.forEach(function(tile){
                    if(tile.data.newTile && !tile.data.finished){
                        tile.data.newTile = false;
                        checkForBombs(tile);
                        
                    }
                });
            }
                
            break;
    }
}

function render(){
    
}
/*=================================================================
                        Custom Functions
=================================================================*/


function startState(newState){
    switch(newState){
        case "TITLE_SCREEN": //choose level size. easy med hard bomb #. 
            //revive
            titleText.revive();
            difficultyText.revive();
            easyButton.revive();
            easyText.revive();
            medButton.revive();
            medText.revive();
            hardButton.revive();
            hardText.revive();
            sizeText.revive();
            oneButton.revive();
            oneText.revive();
            twoButton.revive();
            twoText.revive();
            //customButton.revive();
            //customText.revive();
            startGameButton.revive();
            startGameText.revive();
            difficultyDisplayText.revive();
            boardSizeDisplayText.revive();
            bgBox.revive();
            
            //kill
            counterText.kill();
            topBox.kill();
            winLoseText.kill();
            toTitleScreenButton.kill();
            toTitleScreenText.kill();
            tileGroup.kill();
            bombsOnScreenText.kill();
            flagsOnScreenText.kill();
            restartButton.kill();
            restartText.kill();
            numberOfFlags = 0;
            
            if(counterLoop){
                game.time.events.remove(counterLoop);
            }
            
            gameState = "TITLE_SCREEN";
            break;
        case "GET_READY": //click to start.
            //revive
            
            tileGroup.removeAll();
            tileGroup.revive();
            counterText.revive();
            topBox.revive();
            winLoseText.revive();
            toTitleScreenButton.revive();
            toTitleScreenText.revive();
            bombsOnScreenText.revive();
            flagsOnScreenText.revive();
            restartButton.revive();
            restartText.revive();
            
            //kill
            customButton.kill();
            customText.kill();
            titleText.kill();
            difficultyText.kill();
            easyButton.kill();
            easyText.kill();
            medButton.kill();
            medText.kill();
            hardButton.kill();
            hardText.kill();
            sizeText.kill();
            oneButton.kill();
            oneText.kill();
            twoButton.kill();
            twoText.kill();
            startGameButton.kill();
            startGameText.kill();
            difficultyDisplayText.kill();
            boardSizeDisplayText.kill();
            bgBox.kill();
            
            if(counterLoop){
                game.time.events.remove(counterLoop);
            }
            
            numberOfCorrectFlags = 0;
            counter = 0;
            counterText.text = "0s";
            winLoseText.text = "";
          
            flagsOnScreenText.text = numberOfFlags + " FLAGS";
            
            tileGroup.forEach(function(tile){
                tile.data.flagged = false;
                tile.data.isBomb = false;
                tile.data.finished = false;
                tile.data.newTile = false;
                tile.data.clickedBomb = false;
                tile.frame = 0;
            });
            
            drawBoard();
            console.log(tileGroup.children.length);
            gameState = "GET_READY";
            break;
        case "PLAY_GAME": //gameplay
            
            gameState = "PLAY_GAME";
            break;
        case "GAME_OVER": //endgame play. click to continue. Go back to titlescreen
            if(!winGame){
                tileGroup.forEach(showBombs);
                winLoseText.text = "YOU LOST :(";
            }
            else{
                winLoseText.text = "YOU WON!";
            }
            if(counterLoop){
                game.time.events.remove(counterLoop);
            }
            gameState = "GAME_OVER";
            break;
    }
}

function drawBoard(){

    totalGridTiles = boardWidth * boardHeight;
    tileGroup.createMultiple(totalGridTiles, "tileSS", [0], true);
    tileGroup.forEach(tileGroupInit);
    tileGroup.align(boardWidth, boardHeight, 32,32);
    tileGroup.x = game.width/2 - (boardWidth*16);
    tileGroup.y = game.height/2 + 70 - (boardHeight *32)/2;
    
    numberOfBombs = Math.floor(Math.sqrt(totalGridTiles))*difficulty; 
    bombsOnScreenText.text = numberOfBombs + " BOMBS";
    
    for(var i = 0; i < numberOfBombs; i++){
        rnd = game.rnd.integerInRange(0, totalGridTiles-1);
        if(!childAt(rnd).data.isBomb){
            childAt(rnd).data.isBomb = true;
        }
        else{
            i--;
        }
    }
    //console.log(numberOfBombs);
}
function onTapClick(pointer, doubleTap){
    if(gameState === "GET_READY" ){
        startState("PLAY_GAME");
        counter = 0;
        if(counterLoop){
            game.time.events.remove(counterLoop);
        }
        updateCounter();
        counterLoop = game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
    }
}

function updateCounter(){
    counter++;
    counterText.text = counter + "s";
}
function tileGroupInit(tile){
    tile.height = 32;
    tile.width = 32;
}

function customBoardSize(){
    inputX = prompt("Enter WIDTH of game. MAX:29, MIN:5", "");
    inputY = prompt("Enter HEIGHT of game. MAX: 15, MIN:5", "");
    if(inputX <= 29 && inputX >= 5 && inputY <= 15 && inputY >= 5){
        boardWidth = inputX; 
        boardHeight = inputY; 
    }
    else{
        boardHeight = 10;
        boardWidth = 10;
    }
    updateWindow();
}

function changeTile(tile, pointer){
    if(gameState === "PLAY_GAME" || gameState === "GET_READY"){
        if(pointer.rightButton.isDown){ //Right click
            if(tile.frame === 0){
                tile.frame = 10;
                tile.data.flagged = true;
                numberOfFlags = 0;
                tileGroup.forEach(function(tile){ if(tile.data.flagged){numberOfFlags++}});
                flagsOnScreenText.text = numberOfFlags + " FLAGS";
                detectWin();
            }
            else if(tile.frame === 10){
                tile.frame = 0;
                tile.data.flagged = false;
            }
        }
        else{                           //Left click
            canLoop = true;
            clickedTile = tile;
            checkForBombs(clickedTile);
        }
    }
}
    function checkForBombs(tile){
        bombsNearClick = 0;
        tileBorderTop = false;
        tileBorderBottom = false;
        tileBorderRight = false;
        tileBorderLeft = false;
        
        tileIndex = tileGroup.getIndex(tile);
        //specials: walls/corners
        // marked position. Detect pos in general bomb detect
        
        if(tileIndex < boardWidth){ //Top wall
            tileBorderTop = true;
            //console.log("top");
        }
        else if(tileIndex > (totalGridTiles - (boardWidth + 1))){ //Bottom wall
            tileBorderBottom = true;
            //console.log("Bottom");
        }
        if(tileIndex % boardWidth === 0){ //Left wall
            tileBorderLeft = true;
            // console.log("left");
        }
        else if((tileIndex+1) % boardWidth === 0){//Right wall
             tileBorderRight = true;
             //console.log("right");
        }
        
        //Click a bomb
        if(tile.data.isBomb){
            tile.data.clickedBomb = true;
            startState("GAME_OVER");
        }
        

        
        //Bomb detect
        else if(!tile.data.flagged){
            //console.log(tileIndex);
            
            
            
            if(tileIndex-(boardWidth+1) >=0 && (!tileBorderTop && !tileBorderLeft)){ //TOP LEFT
                if((childAt((tileIndex-(boardWidth+1)))).data.isBomb){
                    bombsNearClick++;
                }
            }
            if((tileIndex - boardWidth) >=0){//TOP
               if(childAt(tileIndex-boardWidth).data.isBomb){
                   bombsNearClick++;
               } 
            }
            if(tileIndex-(boardWidth-1) >=0 && (!tileBorderTop && !tileBorderRight)){ //TOP RIGHT
                if((childAt((tileIndex-(boardWidth-1)))).data.isBomb){
                    bombsNearClick++;
                }
            }
            
            
            if(!tileBorderLeft){//LEFT
                if(childAt(tileIndex-1).data.isBomb){
                    bombsNearClick++;
                }
            }
            if(!tileBorderRight){//RIGHT
                if(childAt(tileIndex+1).data.isBomb){
                    bombsNearClick++;
                }
            }
            
            
            if(!tileBorderBottom && !tileBorderLeft){//BOTTOM LEFT
                if(childAt(tileIndex+(boardWidth-1)).data.isBomb){
                    bombsNearClick++;
                }
            }
            if(!tileBorderBottom){//BOTTOM
                if(childAt(tileIndex + boardWidth).data.isBomb){
                    bombsNearClick++;
                }
            }
            if(!tileBorderBottom && !tileBorderRight){//BOTTOM RIGHT
                if(childAt(tileIndex+(boardWidth+1)).data.isBomb){
                    bombsNearClick++;
                }
            }
            if(bombsNearClick>0){
                tile.frame = bombsNearClick;
            }
            else{
                tile.frame = 11;
                if(tileIndex-(boardWidth+1) >=0 && (!tileBorderTop && !tileBorderLeft)){ //TOP LEFT
                    if(!(childAt((tileIndex-(boardWidth+1)))).data.finished){
                        childAt((tileIndex-(boardWidth+1))).data.newTile = true;
                    }
                }
                if((tileIndex - boardWidth) >=0){//TOP
                    if(!childAt(tileIndex-boardWidth).data.finished){
                        childAt(tileIndex-boardWidth).data.newTile = true;
                   }
                }
                if(tileIndex-(boardWidth-1) >=0 && (!tileBorderTop && !tileBorderRight)){ //TOP RIGHT
                    if(!(childAt((tileIndex-(boardWidth-1)))).data.finished){
                        childAt((tileIndex-(boardWidth-1))).data.newTile = true;
                    }
                }
               if(!tileBorderLeft){//LEFT
                    if(!childAt(tileIndex-1).data.finished){
                        childAt(tileIndex-1).data.newTile = true;
                   }
                }
                if(!tileBorderRight){//RIGHT
                    if(!childAt(tileIndex+1).data.finished){
                        childAt(tileIndex+1).data.newTile = true;
                   }
                } 
                if(!tileBorderBottom && !tileBorderLeft){//BOTTOM LEFT
                    if(!childAt(tileIndex+(boardWidth-1)).data.finished){
                        childAt(tileIndex+(boardWidth-1)).data.newTile = true;
                    }
                }
               if(!tileBorderBottom){//BOTTOM
                    if(!childAt(tileIndex + boardWidth).data.finished){
                        childAt(tileIndex + boardWidth).data.newTile = true;
               }
            } 
            if(!tileBorderBottom && !tileBorderRight){//BOTTOM RIGHT
                if(!childAt(tileIndex+(boardWidth+1)).data.finished){
                    childAt(tileIndex+(boardWidth+1)).data.newTile = true;
                }
            }   
            }
            //console.log(`${bombsNearClick} bombs`);
            tile.data.finished = true;
        }
    }



function detectWin(){
    numberOfCorrectFlags = 0;
    tileGroup.forEach(function(tile){
       if(tile.data.isBomb && tile.data.flagged){
           numberOfCorrectFlags++;
       } 
    });
    if(numberOfCorrectFlags === numberOfBombs){
        winGame = true;
        startState("GAME_OVER");
    }
}


function childAt(index){
    return tileGroup.getChildAt(index);
}

function showBombs(tile){
    if(tile.data.clickedBomb){
        tile.frame = 12;
    }
    else if(tile.data.isBomb){
        tile.frame = 9;
    }
}

function updateWindow(){
    switch(difficulty){
        case 1:
            difficultyDisplayText.text = 'EASY';
            break;
        case 2:
            difficultyDisplayText.text = 'NORMAL';
            break;
        case 3:
            difficultyDisplayText.text = 'HARD';
            break;
    }
    
    boardSizeDisplayText.text =  boardWidth + " x " + boardHeight;
}

//          https://phaser.io/examples/v2/category/groups