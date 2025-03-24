function check(timestamp){
  time = Date.now() - timestamp;
  correct = 0;
  for(i in letters){
    if(letters[i][1]==true){correct++;}
  }
  document.getElementById("wpm").innerHTML +=  10 / time * 1000 * 60 * correct / sentence.length;
}

alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
sentence = "";
words = ["primate", "monkey", "ape", "nimble", "cheeky", "tree", "nut", "nuts", "trees", "gorilla", "gorillas", "primates", "monkeys", "apes", "dexterous"];
for(let i = 0; i < 10; i++){
  sentence += words[Math.floor(Math.random() * words.length)] + " ";
}
sentence = sentence.trim();
letters = {};
for (let i = 0; i < sentence.length; i++){
  letters["letter" + (i+1)] = [sentence[i], false];
}
/*letters = {
    "letter1": ["p", false],
    "letter2": ["r", false],
    "letter3": ["i", false],
    "letter4": ["m", false]
};*/
for(i in letters){
  document.getElementById("words").innerHTML += `<span id="${i}">${letters[i][0]}</span>`
}
letter = 1;
started = false;
var timestamp;
var time;
document.addEventListener(
  "keydown",
  (event) => {
    if(started == false){started = true; timestamp = Date.now();}
    if(letter == sentence.length){check(timestamp);}
    const keyName = event.key;
    if(keyName == "Backspace"){
      if(letter > 1){letter-=1}
      document.getElementById("letter" + letter).style.color="white";
      document.getElementById("letter" + letter).style.background="none";
      document.getElementById("letter" + (letter -1)).style["border-right"] = "1px solid white";
      document.getElementById("letter" + letter).style["border-right"] = "medium none black";
      letters["letter" + letter][1] = false;
    }else{
      if (keyName == letters["letter" + letter][0]){
        letters["letter" + letter][1] = true;
        document.getElementById("letter" + letter).style.color="var(--primate)";
        document.getElementById("letter" + letter).style["border-right"] = "1px solid white";
        if(letter!=1){document.getElementById("letter" + (letter-1)).style["border-right"] = "medium none black";}
      }else{
        letters["letter" + letter][1] = keyName;
        document.getElementById("letter" + letter).style.color="white";
        document.getElementById("letter" + letter).style.background="red";
        document.getElementById("letter" + letter).style["border-right"] = "1px solid white";
        if(letter!=1){document.getElementById("letter" + (letter-1)).style["border-right"] = "medium none black";}
      }
      letter += 1;
    }

  },
  false,
);