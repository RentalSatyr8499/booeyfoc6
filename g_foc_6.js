/* constants :) */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var ghostSpeed = 2;
var ghostSizeMultiplier = .6;

var ghostImgWidths = 500; // need to be obtained manually
var ghostSize = ghostSizeMultiplier*ghostImgWidths; 
var booeyX = (canvas.width / 2) - ghostSizeMultiplier*(ghostImgWidths / 2);
var booeyY = (canvas.height*.66) - ghostSizeMultiplier*(ghostImgWidths / 2);

var bgSize = .5;

var levelChangeInterval = 300; // The time interval at which opacity changes (in milliseconds)
var levelMax = 4;
var levelMin = 0;   

var partyGuests = ["Jamahat", "Kawely", "Mogleun", "Natiqn", "Sugulny"];
var guestProfs = ['./art/Jamahat1.png', './art/Kawely1.png', './art/Mogleun1.png', './art/Natiqn1.png', './art/Sugulny1.png'];
var instructionContainer;
var mingled = [0, 0, 0, 0, 0]

function getRandomInt(max, min=0) {
    return Math.floor(Math.random() * max) + min;
  }
function initializeGhost(imgArr, pathBaseString, foc=0, x=booeyX, y=booeyY, dx=1){
    if (imgArr) {
        for (var i = 0; i < imgArr.length; i++) {
            temp = new Image();
            w = i + 1
            if (foc != -1){
                temp.src = './art/' + pathBaseString + w + ' foc'+ foc + '.png';
            } else {
                temp.src = './art/' + pathBaseString + w + '.png';
            }
            
            imgArr[i] = temp;
    }}
    return {
        "currentImg": null,
        "x": x, 
        "y": y, 
        "dx": dx, 
        "dy": 0,
        "distanceMoved": 0,
        "currentImgIndex": 0
    }
}

function dialogue(guestIndex, imageSrc, text, stay, leave) {
    text = text.replace(/\n/g, "<br>");
    var level6Container = document.createElement("div");
    level6Container.id = "level6-dialogue";

    // Create a new p element for the text
    var ghostPicture = document.createElement("img");
    ghostPicture.src = imageSrc;
    ghostPicture.style.width, ghostPicture.style.height = "60px";
    level6Container.appendChild(ghostPicture);

    var textElement = document.createElement("p");
    textElement.innerHTML = text;
    textElement.style.margin = "10px";  // Add margin to the text
    level6Container.appendChild(textElement);

    var stayButton = document.createElement("button");
    stayButton.innerHTML = stay;
    stayButton.style.margin = "10px";  // Add margin to the button1
    level6Container.appendChild(stayButton);

    var leaveButton = document.createElement("button");
    leaveButton.innerHTML = leave;
    leaveButton.style.margin = "10px";  // Add margin to the button2
    level6Container.appendChild(leaveButton);

    // Add the container to the body
    document.body.appendChild(level6Container);

    // Add event listener to button2
    stayButton.addEventListener("click", function() {
        if (mingled.reduce((a, b) => a + b, 0) < 4){
            alert("Mingle with everyone first before choosing this button!");
            partyGuestMovingStats[guestIndex]["dx"] = 0.5;
            mingled[guestIndex] = 1;

            // Remove the container from the body
            document.body.removeChild(level6Container);
            instruction();
        } else {
            document.body.removeChild(level6Container);
            endGame(guestIndex);
        }
    });
    leaveButton.addEventListener("click", function() {
        partyGuestMovingStats[guestIndex]["dx"] = 0.5;
        mingled[guestIndex] = 1;

        // Remove the container from the body
        document.body.removeChild(level6Container);
        instruction();
    });
}

function endGame(guest){
    var endGameContainer = document.createElement("div");
    endGameContainer.id = "endGame";

    var textElement = document.createElement("p");
    textElement.innerHTML = "Congralutations! You and " + partyGuests[guest] + " are now engaged!";
    textElement.style.margin = "40px";  // Add margin to the text
    document.body.appendChild(endGameContainer);
    endGameContainer.appendChild(textElement);

}
function instruction() {
    instructionContainer = document.createElement("div");
    instructionContainer.id = "instruction-Container";

    var textElement = document.createElement("p");
    textElement.innerHTML = "Welcome to the party! It's time for Booey to mingle. Navigate through the crowd to meet everyone here. Press the space bar when Booey is within the vicinity of a guest to talk to them. Use the up and down arrows to move backwards and forwards into the crowd.";
    textElement.style.margin = "10px";  // Add margin to the text
    instructionContainer.appendChild(textElement);

    // Loop over each guest
    for (var i = 0; i < partyGuests.length; i++) {
        // Create a new div for the guest
        var guestDiv = document.createElement("div");
        guestDiv.style.display = "flex";
        guestDiv.style.alignItems = "center";

        // Create an img element for the guest's image
        var guestImage = document.createElement("img");
        guestImage.src = guestProfs[i];
        guestImage.style.width, guestImage.style.height = "40px";
        guestDiv.appendChild(guestImage);

        // Create a p element for the guest's name
        var guestName = document.createElement("p");
        guestName.innerHTML = partyGuests[i];
        guestName.style.fontSize = "20px";
        guestDiv.appendChild(guestName);

        var check = document.createElement("img");
        if (mingled[i] == 1){
            check.src = './art/check.png';
        } else {
            check.src = './art/noCheck.png';
        }
        check.style.width, check.style.height = "10px";
        guestDiv.appendChild(check);


        // Add the guest div to the instruction container
        instructionContainer.appendChild(guestDiv);
    }

    // Add the container to the body
    document.body.appendChild(instructionContainer);
}



/* load images!*/
// GHOSTS
var booeyImages = [0, 0, 0, 0];
var booeyStats = initializeGhost(booeyImages, "ghost", -1, booeyX, booeyY, 0);
booeyStats["currentImg"] = booeyImages[0];

var partyGuestImages = []; // a 2D array where each element is a level of blur an each element of the element is a guest
var partyGuestMovingStats = [];
var movingStats, u;
for (var j = 0; j < 5; j++){ // loops thru different levels of focus
    partyGuestImages.push([0, 0, 0, 0]);
    for (var i = 0; i < partyGuests.length; i++) { // loops thru different guests
        partyGuestImages[j][i] = [0, 0, 0, 0];
        initializeGhost(partyGuestImages[j][i], partyGuests[i], j);
    }
}    
console.log(partyGuestImages);
for (var i = 0; i < partyGuests.length; i++) {
    u = Math.random() < 0.5 ? -1 : 1;
    movingStats = initializeGhost(null, partyGuests[i], 0, getRandomInt(400), booeyY, u);
    // movingStats["currentImg"] = partyGuestImages[i][0];
    partyGuestMovingStats.push(movingStats);
}


// throw 'deez nuts';
var level = 0;
/* draw images!*/
instruction();
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas

    ctx.font = '20px Arial'; // Set the font size and family
    ctx.fillStyle = 'black'; // Set the text color
    ctx.fillText('level: ' + level, 10, 50); // Draw the text on the canvas */

    /* GUESTS BEFORE BOOEY */
    for (var i = partyGuests.length - 1; i >= level; i--) {
        var focIndex = i - level;
        var thisGhost = partyGuestMovingStats[i];
        console.log(partyGuests[i]+": ["+ focIndex + "]["+i+"]["+thisGhost["currentImgIndex"]+"]");
        let thisImage = partyGuestImages[focIndex][i][thisGhost["currentImgIndex"]];
        ctx.drawImage(thisImage, thisGhost["x"], thisGhost["y"], ghostSize, ghostSize);
    }

    /* BOOEY */     
    ctx.drawImage(booeyStats["currentImg"], booeyStats["x"], booeyStats["y"], ghostSize, ghostSize); // Draw the ghost
   
    /* GUESTS AFTER BOOEY */
    for (var i = level; i >= 0; i--) {
        var focIndex = level - i;
        console.log(partyGuests[i]+": ["+ focIndex + "]["+i+"]["+thisGhost["currentImgIndex"]+"]");
        var thisGhost = partyGuestMovingStats[i];
        let thisImage = partyGuestImages[focIndex][i][thisGhost["currentImgIndex"]];
        
        ctx.globalAlpha = 0.6*Math.abs(1/(level - i));
        ctx.drawImage(thisImage, thisGhost["x"], thisGhost["y"], ghostSize, ghostSize);
        ctx.globalAlpha = 1.0;
    }
     
    /* GHOST ANIMATIONS */
    booeyStats["x"] += booeyStats["dx"];
    booeyStats["y"] += booeyStats["dy"];
    booeyStats["distanceMoved"] += Math.abs(booeyStats["dx"]) + Math.abs(booeyStats["dy"]);
    if (booeyStats["distanceMoved"] >= 20) { // changes image if ghost moves 20 pixels
        booeyStats["distanceMoved"] = 0;
        booeyStats["currentImg"] = booeyImages[(booeyImages.indexOf(booeyStats["currentImg"]) + 1) % booeyImages.length];
    }
    for (var i = 0; i < partyGuests.length; i++){
        w = partyGuestMovingStats[i];
        if (w["x"] == canvas.width-100){
            w["dx"] = -1;
        } else if (w["x"] == -100) {
            w["dx"] = 1;
        }
        w["x"] += w["dx"];
        w["distanceMoved"] += Math.abs(w["dx"]) + Math.abs(w["dy"]);
        if (w["distanceMoved"] >= 20) { // changes image if ghost moves 20 pixels
            w["distanceMoved"] = 0;
            if (w["currentImgIndex"] >= 3) {
                w["currentImgIndex"] = 0;
            } else {
                w["currentImgIndex"] += 1;
            };
            // w["currentImg"] = partyGuestImages[i][(partyGuestImages[i].indexOf(w["currentImg"]) + 1) % partyGuestImages[i].length];
        }
    }
    
}
setInterval(draw, 10);

/* listen for user input!*/
var keyDownTime = null;
document.onkeydown = function(e) {
    var shiftPressed = e.shiftKey; // Check if the shift key is pressed
    switch (e.keyCode) {
        case 37:
            booeyStats["dx"] = -ghostSpeed;
            booeyStats["dy"] = 0;
            break;
        case 38:
            if (shiftPressed) {
                booeyStats["dy"] = -ghostSpeed;
            
            } else {
                dx = 0;
                dy = 0;
                if (keyDownTime === null && level <= levelMax) {
                    keyDownTime = Date.now();
                    increaseLevel(); // Call increaseLevel when the up key is pressed
            }
        }
            break;
        case 39:
            booeyStats["dx"] = ghostSpeed;
            booeyStats["dy"] = 0;
            break;
        case 40:
            if (shiftPressed) {
                booeyStats["dy"] = ghostSpeed;
            } else {
                booeyStats["dx"] = 0;
                booeyStats["dy"] = 0;
                if (keyDownTime === null && level >= levelMin) {
                    keyDownTime = Date.now();
                    decreaseLevel(); // Call decreaseLevel when the down key is pressed
                }
        }
            break;
        case 32: // Space bar
        for (let i = 0; i < partyGuests.length; i++) {
            if ((level == i) && (Math.abs(partyGuestMovingStats[i]["x"] - booeyStats["x"]) <= 100)) {
                document.body.removeChild(instructionContainer);
                partyGuestMovingStats[i]["dx"] = 0;
                if (i == 0){
                    dialogue(i, './art/Jamahat1.png', "Here's a bit of poetry I've been working on. \n \n At twilight, the turtle watches the dance of the tiger. In the roar, silence echoes. \n \n I wrote it for you. Do you like it?", "Woah! Can I hear the whole poem? (stay)", "Wow...sounds great...(leave)");
                } else if (i == 1){
                    dialogue(i, './art/Kawely1.png', "Wanna get out of here and hang out in my basement? I love bringing back my victi--- my dates and turning on a nice, relaxing movie and falling asleeo together.", "Heck yeah! What movie are we watching? (stay)", "I'll get back to you on that.. (leave)");
                } else if (i==2){
                    dialogue(i, './art/Mogleun1.png', "...", "(Mew back.) (stay)", "Sorry, I'm just trying to reach the drinks behind you...(leave)");
                } else if (i == 3) {
                    dialogue(i, './art/Natiqn1.png', "Did you know? Monaco ith incredibly thmall! Only about 2 thquare kilometerth! The Monaco-Monte Carlo thtation, opened in 1866, ith therved by the Martheille Ventimiglia railway line. Ath for airportth, while Monaco itthelf doethnt have one due to itth thize, the Nithe Côte dAzur Airport in neighboring Franthe ith only a thort dithtance away and therveth ath the main air gateway for Monacos rethidentth and vithitorth. Additionally, Monaco hath a heliport, Monaco Heliport, which provideth regular therviceth to and from Nithe airport. Tho, dethpite itth thmall thize, Monaco ith quite well connected!", "Actually, the Monaco-Monte Carlo station opened in 1867, not 1866! (stay)", "Great...(leave)");
                } else if (i == 4){
                    dialogue(i, './art/Sugulny1.png', "Sometimes, I take stuff off the store shelves to the return counter and pretend to try to return it. When they ask for the reciept I say I forgot it and take the stuff home.", "Wait, I should try that. (stay)", "That's crazy. (leave)");
                }
            }

        }
        break;
    }
};

document.onkeyup = function(e) {
    booeyStats["dx"] = 0;
    booeyStats["dy"] = 0;
    keyDownTime = null;
};

function decreaseLevel() {
    if (level <= levelMin) { // If level is already at the minimum, return without changing level
        return;
    }
    if (keyDownTime !== null && level <= levelMax) {
        level -= 1;
        setTimeout(decreaseLevel, levelChangeInterval);
    }
}

function increaseLevel() {
    if (level >= levelMax) { // If level is already at the maximum, return without changing level
        return;
    }
    if (keyDownTime !== null && level >= levelMin) {
        level += 1;
        setTimeout(increaseLevel, levelChangeInterval);
    }
}

function createImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}