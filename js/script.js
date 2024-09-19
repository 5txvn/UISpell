//initialize all the variables needed and hide everything that needs to be hidden
//const words = ["à la carte","aardvark","Abadan","abate","abhorrence","able-bodied","abscissa","absorbefacient","acanthus","acciaccatura","acclimatization","accumbent","acerbity","achondroplasia","acolyte","actinomycosis","ad hominem","ad nauseam","adamant","addlepated","adenoma","admiralty","adulate","adumbration","adventuresome","adynamia","aerophobia","affianced","agglomerate","aggravation","agitato","agog","aileron","akinesia","albuterol","aldermancy","algebraic","aliment","alla breve","allude","altazimuth","altruistic","Alzheimer’s disease","amarelle","Americanize","amoxicillin","amperage","amphisbaena","amulet","amygdaline","anacrusis","analogous","anaphylaxis","anathematize","andesite","Andorra","anemia","anemometry","Anglophile","anguished","ankylosis","annular ligament","anopheles","Antarctica","antepenultimate","anthropometry","anticyclone","antimacassar","antinome","antiphony","antiphrasis","aortography","aperçu","aplomb","apolitical","appertain","appoggiatura","apprehensible","aquamarine","Aquarius","Aramaic","archaeopteryx","archdiocese","arenaceous","argumentation","Aristophanes","arrogance","artifact","ascetic","asocial","aspidistra","assimilable","astragal","atamasco lily","atomism","au courant","aubergine","Auckland","Augean","auricular","auspice","australopithecine","automatism","Averno","aversion","avionics","avoirdupois"];
let word = "";
let round = 0;
let correct = 0;
let wrong = 0;
let streak = 0;
let utterancesInitialized = false;
let currentWordIncorrect = false;
const rootPath = window.location.href.split("/")[3].toLowerCase() === "uispell" ? "/UISpell/" : "/";
$("#stats").hide();
$("#playList").hide();
$("#incorrectWord").hide();
$("#main").hide();


let code;
let temp;
$("#select").on("change", () => {
  code = $("#select").find(":selected").val();
  $("#listTitle").text(`Words that Start with ${code}`);
  $("title").text(`Words Starting With ${code} | UISpell`);
  $("#mainScript").prepend(`<script src="${rootPath}24-25/data/startWith${code}.js"></script>`);
  temp = Object.keys(words);
  $("#select").hide();
  $("#main").show();
});

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
        while (words[word] == "") {
          temp = temp.filter(removedWord => removedWord != word)
          word = temp[Math.floor(Math.random() * temp.length)];
        }
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
    currentWordIncorrect = true;
    incorrectAnimation();
    $("#submit").removeClass("btn-success").addClass("btn-error").text("Retry answer");
    //$("#answer").removeClass("input-success").addClass("input-neutral")
    //$("#playWord").removeClass("#text-7xl").addClass("text-4xl").addClass("w-1/2").addClass("text-center").html(`<span class='text-error'>Incorrect answer</span><br>The correct spelling is <u>${word}</u><br>Please re-type your answer`);
    playWord();
}

//incorrect word animation
function incorrectAnimation() {
  $("#body").hide();
  $("#incorrectWord").show();
  $("#correctSpelling").text(word)
  $("#incorrectWord > h1").hide();
  $("#incorrectWord > h1").fadeIn(750);
  $("#incorrectWord > p").hide();
  $("#incorrectWord > p").fadeIn(1000);
  setTimeout(() => {
    $("#incorrectWord").fadeOut(500);
    setTimeout(() => {
      $("#body").show();
      $("input").focus();
    }, 500)
  }, 3000)
}

//handle accent input and also word skipping commands
$("#answer").on("keyup", () => {
  if (["/aa", "/ag", "/ea", "/eg", "/ia", "/ig", "/oa", "/og", "/ua", "/ug", "/ac", "/ec", "/ic", "/oc", "/uc"].some(accentBind => $("#answer").val().includes(accentBind))) {
    $("#answer").val(
      $("#answer").val()
      .replace("/aa", "á").replace("/ag", "à").replace("/ac", "â")
      .replace("/ea", "é").replace("/eg", "è").replace("/ec", "ê")
      .replace("/ia", "í").replace("/ig", "ì").replace("/ic", "î")
      .replace("/oa", "ó").replace("/og", "ò").replace("/oc", "ô")
      .replace("/ua", "ú").replace("/ug", "ù").replace("/uc", "û")
    );
  } else if ($("#answer").val().toLowerCase() === "/skip") {
    $("#answer").blur().val("");
    generateWord();
  } else if ($("#answer").val().toLowerCase() === "/remove") {
    $("#answer").blur().val("");
    temp = temp.filter(removedWord => removedWord != word);
    generateWord();
  }
})

$("#answer").on("keydown", (event) => {
  if (event.key === "Enter") {
    if (!currentWordIncorrect) {
      if ($("#answer").val().trim() === word) {
        correct++; streak++;
        $("#correct").html(correct + '<i class="fa fa-check pl-1"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
        $("#answer").val("").blur();
        const correctAudio = new Audio(`${rootPath}assets/correct.mp3`);
        correctAudio.addEventListener("ended", () => {
          generateWord();
        })
        correctAudio.play();
      } else {
        wrong++; streak = 0;
        $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
        $("#answer").val("").blur();
        const wrongAudio = new Audio(`${rootPath}assets/wrong.mp3`);
        wrongAudio.addEventListener("ended", () => {
          incorrectWord();
        });
        wrongAudio.volume = 0.45;
        wrongAudio.play();
      }
    } else {
      if ($("#answer").val().trim() === word) {
        temp.push(word);
        $("#answer").val("").blur();
        currentWordIncorrect = false;
        const correctAudio = new Audio(`${rootPath}assets/correct.mp3`);
        correctAudio.addEventListener("ended", () => {
          $("#submit").addClass("btn-success").removeClass("btn-error").text("Submit Answer");
          $("#playWord").addClass("#text-7xl").removeClass("text-4xl").removeClass("w-1/2").removeClass("text-center").text("Word is playing...");
          generateWord();
        })
        correctAudio.play();
      } else {
        wrong++; streak = 0;
        $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
        $("#answer").val("").blur();
        const wrongAudio = new Audio(`${rootPath}assets/wrong.mp3`);
        wrongAudio.addEventListener("ended", () => {
          incorrectWord();
        });
        wrongAudio.volume = 0.45;
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
      const correctAudio = new Audio(`${rootPath}assets/correct.mp3`);
      correctAudio.addEventListener("ended", () => {
        generateWord();
      })
      correctAudio.play();
    } else {
      wrong++; streak = 0;
      $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
      $("#answer").val("").blur();
      const wrongAudio = new Audio(`${rootPath}assets/wrong.mp3`);
      wrongAudio.addEventListener("ended", () => {
        incorrectWord();
      });
      wrongAudio.volume = 0.45;
      wrongAudio.play();
    }
  } else {
    if ($("#answer").val().trim() === word) {
      temp.push(word);
      $("#answer").val("").blur();
      currentWordIncorrect = false;
      const correctAudio = new Audio(`${rootPath}assets/correct.mp3`);
      correctAudio.addEventListener("ended", () => {
        $("#submit").addClass("btn-success").removeClass("btn-error").text("Submit Answer");
        $("#playWord").addClass("#text-7xl").removeClass("text-4xl").removeClass("w-1/2").removeClass("text-center").text("Word is playing...");
        generateWord();
      })
      correctAudio.play();
    } else {
      wrong++; streak = 0;
      $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
      $("#answer").val("").blur();
      const wrongAudio = new Audio(`${rootPath}assets/wrong.mp3`);
      wrongAudio.addEventListener("ended", () => {
        incorrectWord();
      });
      wrongAudio.volume = 0.45;
      wrongAudio.play();
    }
  }
})

//start the round when the user clicks on the start round button
$("#startRound").click(() => { startRound(); })