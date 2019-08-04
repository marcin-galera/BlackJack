let wrapper = document.querySelector("#wrapper");
let output = document.querySelector("#context");

let cards = [];
let playerCard = [];
let dealerCard = [];
let cardCount = 0;
let myDollars = 100;
let endPlay = false;
let dealerHolder = document.querySelector("#dealerHolder");
let playerHolder = document.querySelector("#playerHolder");
let pValue = document.querySelector("#pValue");
let dValue = document.querySelector("#dValue");
let randomNumber = Math.floor(Math.random() * 52);
let suits = ["spades", "clubs", "hearts", "diams"];
let message = document.getElementById("message");
let dollarValue = document.getElementById("pln");
document.getElementById("btnRestart").style.display = "none";
let numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

document.getElementById("mybet").onchange = function() {
  if (this.value < 0) {
    this.value = 0;
  }
  if (this.value > myDollars) {
    this.value = myDollars;
  }
  message.innerHTML = "Zakład o " + this.value + " pln";
};

suits.forEach(s => {
  let suit = s[0].toUpperCase();
  let bgcolor = suit == "S" || suit == "C" ? "black" : "red";
  numb.forEach(n => {
    let cardValue =
      n === "A" ? 1 : n == "J" || n == "Q" || n == "K" ? 10 : parseInt(n);

    let card = {
      suit: suit,
      icon: s,
      bgcolor: bgcolor,
      cardnum: n,
      cardvalue: cardValue
    };
    cards.push(card);
  });
});

function Start() {
  shuffleDeck(cards);
  dealNew();
  document.getElementById("start").style.display = "none";
  dollarValue.innerHTML = myDollars;
}

function restartGame() {
  if (myDollars < 0) {
    document.getElementById("btnRestart").style.display = "block";
    document.getElementById("btnDeal").style.display = "none";
    document.getElementById("myActions").style.display = "none";
    message.innerHTML =
      "<span  style=color:red;font-size:50px>Przegrałeś!  Zacznij od nowa!</span>";
    myDollars = 100;
    dollarValue.innerHTML = 100;
    document.getElementById("mybet").value = 5;
  } }

function dealNew() {
  cards = cards;
  playerCard = [];
  dealerCard = [];
  dealerHolder.innerHTML = "";
  playerHolder.innerHTML = "";

  let betValue = document.getElementById("mybet").value;
  myDollars = myDollars - betValue;
  dollarValue.innerHTML = myDollars;
  document.querySelector("#btnDeal").style.display = "none";
  document.getElementById("myActions").style.display = "block";


  message.innerHTML =
    "Get up to 21 and bet the dealer<br>Aktualny zakład o " + betValue + " pln";
  document.getElementById("mybet").disabled = true;
  document.getElementById("maxBet").disabled = true;
  deal();


  restartGame();
}

function reDeal() {
  cardCount++;
  if (cardCount > 45) {
    shuffleDeck(cards);
    cardCount = 0;
    message.innerHTML = "Nowa talia kart!";
  }
}

function deal() {
  for (x = 0; x < 2; x++) {
    dealerCard.push(cards[cardCount]);
    dealerHolder.innerHTML += cardOutput(cardCount, x);

    x === 0
      ? (dealerHolder.innerHTML += '<div id="cover" style="left:43%"></div>')
      : null;

    reDeal();
    playerCard.push(cards[cardCount]);
    playerHolder.innerHTML += cardOutput(cardCount, x);
    reDeal();
  }
  let playerValue = checkTotal(playerCard)
  if (playerValue === 21 && playerCard.length === 2) {
    message.innerHTML = "Black Jack !!";
    playEnd();
    document.querySelector("#myActions").style.display = "none"
    document.querySelector("#btnDeal").style.display = "block"
  }

  pValue.innerHTML = checkTotal(playerCard);
  dValue.innerHTML = " ? ";
}

function cardOutput(num, x) {
  let hpos = x > 0 ? x * 5 + 42 : 43;

  return (
    '<div class="icard ' +
    cards[cardCount].icon +
    '" style="left:' +
    hpos +
    '%;"><div class="top-card suit">' +
    cards[cardCount].cardnum +
    '<br></div><div class="content-card suit"></div><div class="bottom-card suit">' +
    cards[cardCount].cardnum +
    "<br></div></div>"
  );
}

function maxbet() {
  mybet.value = myDollars;
  message.innerHTML = "Postawiłeś " + myDollars + " pln";
}

function cardAction(a) {
  switch (a) {
    case "hit":
      playuCard();
      break;
    case "hold":
      playEnd();

      break;
    case "double":
      let betValue = parseInt(document.getElementById("mybet").value);
      if (myDollars - betValue < 0) {
        betValue = betValue + myDollars;
        myDollars = 0;
      } else {
        myDollars = myDollars - betValue;
        betValue = betValue * 2;
      }
      document.getElementById("pln").innerHTML = myDollars;
      document.getElementById("mybet").value = betValue;
      playuCard();
      playEnd();

      break;
    default:
      break;
  }
}

function playuCard() {
  playerCard.push(cards[cardCount]);
  playerHolder.innerHTML += cardOutput(cardCount, playerCard.length - 1);
  reDeal();
  let rValu = checkTotal(playerCard);
  pValue.innerHTML = rValu;

  if (rValu > 21) {
    message.innerHTML = "Za dużo!";
    playEnd();
  }
}

function playEnd() {
  endPlay = true;
  document.querySelector("#cover").style.display = "none";
  document.querySelector("#myActions").style.display = "none";
  document.querySelector("#btnDeal").style.display = "block";
  document.querySelector("#mybet").style.display = false;
  document.querySelector("#maxBet").style.display = false;
  let payoutJack = 1;

  let dealerValue = checkTotal(dealerCard);
  dValue.innerHTML = dealerValue;

  while (dealerValue < 17) {
    dealerCard.push(cards[cardCount]);
    dealerHolder.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
    reDeal();
    dealerValue = checkTotal(dealerCard);
    dValue.innerHTML = dealerValue;
  }

  let playerValue = checkTotal(playerCard);
  if (playerValue === 21 && playerCard.length === 2) {
    message.innerHTML = "Black Jack !!";
    payoutJack = 1.25;
  }

  let betValue = parseInt(document.getElementById("mybet").value) * payoutJack;

  if (
    (playerValue < 22 && playerValue > dealerValue) ||
    (dealerValue > 21 && playerValue < 22)
  ) {
    message.innerHTML +=
      '<div style="color:green;">Wygrałeś! ' + betValue * 2 + " pln</div>";
    myDollars = myDollars + betValue * 2 ;
  } else if (playerValue > 21) {
    message.innerHTML +=
      '<div style="color:red;">Przegrałeś! ' + betValue + " pln</div>";
    myDollars = myDollars - betValue;
  } else if (playerValue === dealerValue) {
    message.innerHTML +=
      '<div style="color:blue;">Remis! ' + betValue + " pln</div>";
    myDollars = myDollars + betValue;
  } else {
    message.innerHTML +=
      '<div style="color:red;">Przegrałeś! ' + betValue + " pln</div>";
  }

  pValue.innerHTML = playerValue;
  dollarValue.innerHTML = myDollars;
  document.getElementById("mybet").disabled = false;
  document.getElementById("maxBet").disabled = false;
}

function checkTotal(arr) {
  let rValue = 0;
  let aceAdjust = false;
  for (let i in arr) {
    if (arr[i].cardnum == "A" && !aceAdjust) {
      aceAdjust = true;
      rValue = rValue + 10;
    }
    rValue = rValue + arr[i].cardvalue;
  }
  if (aceAdjust && rValue > 21) {
    rValue = rValue - 10;
  }
  return rValue;
}

function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
