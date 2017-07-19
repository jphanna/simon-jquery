$(document).ready(function() {
  var sequence = []; // array to hold sequence
  var playerSequence = 0; // Count position in sequence player is testing
  var playerGo = false; // Player's turn?
  var computerGo = true; // Computer's turn?
  var round = 0; // counter on display
  var strict = false; // Strict game?
  var $startButton = $("#startButton");
  var $strictButton = $("#strictButton");
  var $buttons = $(".pad");
  var $roundDisplay = $("#round");
  var $youWin = $("#youWin");
  var $yourTurn = $("#yourTurn");
  var $tryAgain = $("#tryAgain");
  var $strictError = $("#strictError");
  $startButton.on("click", start);
  $strictButton.on("click", () => {
    strict = !strict;
    if (strict) {
      $strictButton.css({background: "#b71c1c"});
    } else {
      $strictButton.css({background: "#2c3e50"});
    }
  });
  $buttons.on("click", (event) => {
    if (event.target.id === "b1" ||
        event.target.id === "b2" ||
        event.target.id === "b3" ||
        event.target.id === "b4") {
          playersTurn(event);
    }
  });

  /* Simon chooses next number to add to sequence and runs the round*/
  function getSimon() {
    round++;
    $roundDisplay.text(addZero(round));
    sequence.push(Math.floor(Math.random() * (5 - 1)) + 1);
    activate(sequence);
  }

  function addZero(num) {
    return (num < 10) ? "0" + num : num;
  }

  /* Simon show sequence */
  function activate(sequence) {
    var i = 0;
    var timing = setInterval(() => {
      lightButton(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(timing);
        computerGo = false;
        playerGo = true;
        setTimeout(() => {$yourTurn.css({display: "initial"})}, 700);
      }
    }, 700);
  }
  /* Simon button activation */
  function lightButton(number) {
    var $sound = $("#tone" + number);
    var $button = $("#b" + number);
    $sound.get(0).play();
    $button.removeClass("off").addClass("on");
    setTimeout(() => {
      $button.removeClass("on").addClass("off");
    }, 350);
  }

  function playersTurn(event) {
    if (playerGo === true) {
      var playerButton = event;
      bleep(playerButton);
    }
  }

  /* Player button activation */
  function bleep(e) {
    var element = $(e.target);
    if (playerGo === true) {
      var number = Number(e.target.dataset.number);
      var $sound = $("#tone" + number);
      $sound.currentTime = 0;
      $sound.get(0).play();
      $buttons.off("click", bleep);
      element.removeClass("off").addClass("on");
      testSeq(number);
      setTimeout(() => {
        element.removeClass("on").addClass("off");
        $buttons.on("click", bleep);
      }, 350);
    }
  }

  /* Test player sequence */
  function testSeq(number) {
    if (number === sequence[playerSequence]) {
      playerSequence++;
      if (playerSequence === sequence.length) {
        if (playerSequence === 20) {
          $youWin.css({display: "initial"});
          playerGo = false;
          computerGo = true;
          setTimeout(() => {$youWin.css({display: "none"}); start();}, 2000);
        } else {
          playerSequence = 0;
          playerGo = false;
          computerGo = true;
          $yourTurn.css({display: "none"});
          setTimeout(getSimon, 1000);
        }
      }
    } else {
      if (strict) {
        $strictError.css({display: "initial"});
        $yourTurn.css({display: "none"});
      } else {
        $yourTurn.css({display: "none"});
        $tryAgain.cs({display: "initial"});
        playerGo = false;
        computerGo = true;
        playerSequence = 0;
        setTimeout(() => {$tryAgain.css({display: "none"}); activate(sequence)}, 2000);
      }
    }
  }

  function start() {
    sequence = [];
    round = 0;
    playerSequence = 0;
    $strictError.css({display: "none"});
    $yourTurn.css({display: "none"});
    $tryAgain.css({display: "none"});
    $youWin.css({display: "none"});
    $roundDisplay.text("00");
    setTimeout(getSimon, 1000);
  }
});

/* BEGIN GAME
  and if player gets sequence correct,
  get another number in the sequence
  and show the sequence */
// getSimon();

/* If player is wrong, try again */
// activate(sequence);
