//initialize all the variables needed and hide everything that needs to be hidden
//const words = ["à la carte","aardvark","Abadan","abate","abhorrence","able-bodied","abscissa","absorbefacient","acanthus","acciaccatura","acclimatization","accumbent","acerbity","achondroplasia","acolyte","actinomycosis","ad hominem","ad nauseam","adamant","addlepated","adenoma","admiralty","adulate","adumbration","adventuresome","adynamia","aerophobia","affianced","agglomerate","aggravation","agitato","agog","aileron","akinesia","albuterol","aldermancy","algebraic","aliment","alla breve","allude","altazimuth","altruistic","Alzheimer’s disease","amarelle","Americanize","amoxicillin","amperage","amphisbaena","amulet","amygdaline","anacrusis","analogous","anaphylaxis","anathematize","andesite","Andorra","anemia","anemometry","Anglophile","anguished","ankylosis","annular ligament","anopheles","Antarctica","antepenultimate","anthropometry","anticyclone","antimacassar","antinome","antiphony","antiphrasis","aortography","aperçu","aplomb","apolitical","appertain","appoggiatura","apprehensible","aquamarine","Aquarius","Aramaic","archaeopteryx","archdiocese","arenaceous","argumentation","Aristophanes","arrogance","artifact","ascetic","asocial","aspidistra","assimilable","astragal","atamasco lily","atomism","au courant","aubergine","Auckland","Augean","auricular","auspice","australopithecine","automatism","Averno","aversion","avionics","avoirdupois"];
let temp = Object.keys(words);
let word = "";
let round = 0;
let correct = 0;
let wrong = 0;
let streak = 0;
let utterancesInitialized = false;
let currentWordIncorrect = false;
$("#stats").hide();
$("#playList").hide();

//function for starting a new round
function startRound() {
  round++;
  $("#main, #roundComponents, #stats, #navbar").hide();
  $("#startRound, #playList, #startRoundHeading").show();
  $("#startRoundHeading").text(`Round ${round}`);
  setTimeout(() => { $("#startRoundHeading").text(`Round ${round}.`); $("#startRoundHeading").addClass("text-error"); }, 1500)
  setTimeout(() => { $("#startRoundHeading").text(`Round ${round}..`); $("#startRoundHeading").removeClass("text-error"); $("#startRoundHeading").addClass("text-warning"); }, 2000)
  setTimeout(() => { $("#startRoundHeading").text(`Round ${round}...`); $("#startRoundHeading").removeClass("text-warning"); $("#startRoundHeading").addClass("text-success"); }, 2500)
  setTimeout(() => { $("#startRound, #startRoundHeading").hide(); $("#startRoundHeading").removeClass("text-success"); $("#roundComponents, #stats").show(); $("#roundNumber").text(`Round ${round}`); generateWord(); }, 3000)
}

//generate a word and play its audio
function generateWord() {
    $("#playWord").text("Word is playing...");
    if (temp.length == 0) {
        temp = words;
        startRound();
    } else {
        word = temp[Math.floor(Math.random() * temp.length)];
        $('#pronunciation').attr('src', `data:audio/mp3;base64,${words[word]}`);
        $("#pronunciation")[0].play();
        temp = temp.filter(string => string !== word);
        $("#pronunciation").on("ended", () => {
            if (!currentWordIncorrect) {
                $("#playWord").html("Click <span onclick='playWord()' class='text-success'>me</span> to play word again");
                $("#answer").focus();
            }
        });
    }
}

//function to play a word again if the user didn't understand it the first time
function playWord() {
    $('#pronunciation').attr('src', `data:audio/mp3;base64,${words[word]}`);
    $("#pronunciation")[0].play();
    $("#answer").focus();
}

//handles if the user has entered an incorrect word
function incorrectWord() {
    console.log("reached")
    currentWordIncorrect = true;
    $("#submit").removeClass("bg-success").addClass("bg-error").text("Retry answer");
    $("#answer").removeClass("input-success").addClass("input-error")
    $("#playWord").removeClass("#text-7xl").addClass("text-4xl").addClass("w-1/2").addClass("text-center").html(`<span class='text-error'>Incorrect answer</span><br>The correct spelling is <u>${word}</u><br>Please re-type your answer`);
    playWord();
}

$("#answer").on("keydown", (event) => {
  if (event.key === "Enter") {
    if (!currentWordIncorrect) {
      if ($("#answer").val().trim() === word) {
        correct++; streak++;
        $("#correct").html(correct + '<i class="fa fa-check pl-1"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
        $("#answer").val("").blur();
        const correctAudio = new Audio("../assets/correct.mp3");
        correctAudio.addEventListener("ended", () => {
          generateWord();
        })
        correctAudio.play();
      } else {
        wrong++; streak = 0;
        $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
        $("#answer").val("").blur();
        const wrongAudio = new Audio("../assets/wrong.mp3");
        wrongAudio.addEventListener("ended", () => {
          incorrectWord();
        });
        wrongAudio.volume = 0.6;
        wrongAudio.play();
      }
    } else {
      if ($("#answer").val().trim() === word) {
        temp.push(word);
        $("#answer").val("").blur();
        currentWordIncorrect = false;
        const correctAudio = new Audio("../assets/correct.mp3");
        correctAudio.addEventListener("ended", () => {
          $("#submit").addClass("bg-success").removeClass("bg-error").text("Submit Answer");
          $("#answer").addClass("input-success").removeClass("input-error");
          $("#playWord").addClass("#text-7xl").removeClass("text-4xl").removeClass("w-1/2").removeClass("text-center").text("Word is playing...");
          generateWord();
        })
        correctAudio.play();
      } else {
        wrong++; streak = 0;
        $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
        $("#answer").val("").blur();
        const wrongAudio = new Audio("../assets/wrong.mp3");
        wrongAudio.addEventListener("ended", () => {
          incorrectWord();
        });
        wrongAudio.volume = 0.6;
        wrongAudio.play();
      }
    }
  }
})

//alternatively handle submit button presses in the same way that enter keypresses are handled
$("#submit").click(() => {
  if (!currentWordIncorrect) {
    if ($("#answer").val().trim() === word) {
      correct++; streak++;
      $("#correct").html(correct + '<i class="fa fa-check pl-1"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
      $("#answer").val("").blur();
      const correctAudio = new Audio("../assets/correct.mp3");
      correctAudio.addEventListener("ended", () => {
        generateWord();
      })
      correctAudio.play();
    } else {
      wrong++; streak = 0;
      $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
      $("#answer").val("").blur();
      const wrongAudio = new Audio("../assets/wrong.mp3");
      wrongAudio.addEventListener("ended", () => {
        incorrectWord();
      });
      wrongAudio.volume = 0.6;
      wrongAudio.play();
    }
  } else {
    if ($("#answer").val().trim() === word) {
      temp.push(word);
      $("#answer").val("").blur();
      currentWordIncorrect = false;
      const correctAudio = new Audio("../assets/correct.mp3");
      correctAudio.addEventListener("ended", () => {
        $("#submit").addClass("bg-success").removeClass("bg-error").text("Submit Answer");
        $("#answer").addClass("input-success").removeClass("input-error");
        $("#playWord").addClass("#text-7xl").removeClass("text-4xl").removeClass("w-1/2").removeClass("text-center").text("Word is playing...");
        generateWord();
      })
      correctAudio.play();
    } else {
      wrong++; streak = 0;
      $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
      $("#answer").val("").blur();
      const wrongAudio = new Audio("../assets/wrong.mp3");
      wrongAudio.addEventListener("ended", () => {
        incorrectWord();
      });
      wrongAudio.volume = 0.6;
      wrongAudio.play();
    }
  }
})

//start the round when the user clicks on the start round button
$("#startRound").click(() => { startRound(); })