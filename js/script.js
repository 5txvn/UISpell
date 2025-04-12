let word = "";
let tempAltSpelling = "";
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
$("#buttonGrid").hide();
toastr.options.closeEasing = "swing";
toastr.options.progressBar = true;
toastr.options.positionClass = "toast-top-full-width";
//$("#select").hide();
//$("#startRoundHeading").hide();


const letters = [..."abcdefghijklmnopqrstuvwxyz"];

letters.forEach(letter => {
  $("#buttonGrid").append(`<button class="btn btn-primary btn-bordered w-72 text-3xl h-auto font-extrabold">Starts with ${letter.toUpperCase()}</button>`)
});

//set up the settings panel
let successAudioVolume;
if(!localStorage.getItem("successAudioVolume")) {
  $("#successAudioVolume").val("80");
  $("#successAudioVolumeText").text("Success Audio Volume: 80%");
  successAudioVolume = 0.8;
} else {
  $("#successAudioVolume").val(localStorage.getItem("successAudioVolume"));
  $("#successAudioVolumeText").text(`Success Audio Volume: ${localStorage.getItem("successAudioVolume")}%`);
  successAudioVolume = parseFloat(localStorage.getItem("successAudioVolume") / 100);
}
$("#successAudioVolume").on("input", () => {
  localStorage.setItem("successAudioVolume", $("#successAudioVolume").val());
  $("#successAudioVolumeText").text(`Success Audio Volume: ${localStorage.getItem("successAudioVolume")}%`);
  successAudioVolume = parseFloat(localStorage.getItem("successAudioVolume") / 100);
})

let wrongAudioVolume;
if(!localStorage.getItem("wrongAudioVolume")) {
  $("#wrongAudioVolume").val("80");
  $("#wrongAudioVolumeText").text("Incorrect Audio Volume: 80%");
  wrongAudioVolume = 0.8;
} else {
  $("#wrongAudioVolume").val(localStorage.getItem("wrongAudioVolume"));
  $("#wrongAudioVolumeText").text(`Incorrect Audio Volume: ${localStorage.getItem("wrongAudioVolume")}%`);
  wrongAudioVolume = parseFloat(localStorage.getItem("wrongAudioVolume") / 100);
}
$("#wrongAudioVolume").on("input", () => {
  localStorage.setItem("wrongAudioVolume", $("#wrongAudioVolume").val());
  $("#wrongAudioVolumeText").text(`Incorrect Audio Volume: ${localStorage.getItem("wrongAudioVolume")}%`);
  wrongAudioVolume = parseFloat(localStorage.getItem("wrongAudioVolume") / 100);
})

let successAudioDisabled;
if(!localStorage.getItem("successAudioDisabled")) {
  $("#playSuccessAudio").attr("checked", "");
  successAudioDisabled = false;
} else {
  if(localStorage.getItem("successAudioDisabled") == "false") {
    $("#playSuccessAudio").attr("checked", "");
    successAudioDisabled = false;
  } else {
    successAudioDisabled = true;
  }
}
$("#playSuccessAudio").on("input", () => {
  successAudioDisabled = !$("#playSuccessAudio").prop("checked");
  localStorage.setItem("successAudioDisabled", String(!successAudioDisabled))
})


let code;
let temp;
$("#select").on("change", () => {
  code = $("#select").find(":selected").val();
  if (code == "all") {
    $("#listTitle").text(`List of All Words`);
    $("title").text(`List of All Words | UISpell`);
    $("#mainScript").prepend(`<script src="${rootPath}24-25/data/all.js"></script>`);
  } else if (code == "outside") {
    $("#listTitle").text(`List of Outside Words`);
    $("title").text(`List of Outside Words | UISpell`);
    $("#mainScript").prepend(`<script src="${rootPath}24-25/data/outside-words.js"></script>`);
  } else {
    $("#listTitle").text(`Words that Start with ${code}`);
    $("title").text(`Words Starting With ${code} | UISpell`);
    $("#mainScript").prepend(`<script src="${rootPath}24-25/data/startWith${code}.js"></script>`);
  }
  $("#mainScript").prepend(`<script src="${rootPath}24-25/data/alternativeSpellings.js"></script>`);
  temp = Object.keys(words);
  $("#select").hide();
  $("#main").show();
});

//function for checking alternative spellings
function hasAlternativeSpellings(checkWord) {
  let result = false;
  for(const alternativeSpelling of alternativeSpellings) {
    if(alternativeSpelling.includes(checkWord)) {
      result = alternativeSpelling.filter(spelling => spelling != checkWord)[0];
    }
  }
  return result
}

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
    if (temp.length == 0) {
        temp = Object.keys(words);
        startRound();
    } else {
        word = temp[Math.floor(Math.random() * temp.length)];
        while (words[word] == "") {
          temp = temp.filter(removedWord => removedWord != word)
          word = temp[Math.floor(Math.random() * temp.length)];
        }
        $('#pronunciation').attr('src', `data:audio/mp3;base64,${words[word]}`);
        $("#pronunciation")[0].play();
        $("#answer").focus();
        temp = temp.filter(string => string !== word);
        $("#pronunciation").on("ended", () => {
            if (!currentWordIncorrect) {
                $("#playWord").html("Click <span onclick='playWord()' class='text-success'>me</span> to play word again");
            }
        });
    }
}

const playWord = () => { $('#pronunciation').attr('src', `data:audio/mp3;base64,${words[word]}`); $("#pronunciation")[0].play(); $("#answer").focus(); }
const incorrectWord = () => { currentWordIncorrect = true; incorrectAnimation(); $("#submit").removeClass("btn-success").removeClass("btn-warning").addClass("btn-error").text("Retry answer"); playWord(); }

const accentedLetters = [["Á", "á", "À", "à", "Â", "â", "Ä", "ä", "Ã", "ã", "Å", "å"], ["É", "é", "È", "è", "Ê", "ê", "Ë", "ë"], ["Í", "í", "Ì", "ì", "Î", "î", "Ï", "ï"], ["Ó", "ó", "Ò", "ò", "Ô", "ô", "Ö", "ö", "Õ", "õ", "Ø", "ø"], ["Ú", "ú", "Ù", "ù", "Û", "û", "Ü", "ü"], ["Æ", "æ", "Ç", "ç", "Ñ", "ñ", "Œ", "œ", "ß"]]
let currentlyPrimary = true;
accentedLetters.forEach((group, index, arr) => {
  let buttonsString = "";
  //let count = 1;
  group.forEach(letter => {
    buttonsString += `<button class="btn btn-${currentlyPrimary ? "success" : "warning"} text-white btn-bordered font-black w-[6%]" onclick="updateAccent('${letter}')">${letter}</button>`
  })
  $("#accentButtons").append(`
    <div class="flex flex-row justify-center items-center gap-2">
        ${buttonsString}
    </div>
    ${index === arr.length - 1 ? '<div class="mb-12"></div>' : '<hr class="mt-6 mb-6">'}
  `);
  currentlyPrimary = currentlyPrimary ? false : true;
})

//updates for accentation marks
const updateAccent = letter => $("#answer").val($("#answer").val() + letter);

//incorrect word animation
function incorrectAnimation() {
  $("#body").hide(); $("#incorrectWord").show(); let tempString = !hasAlternativeSpellings(word) ? "" : ` (or ${hasAlternativeSpellings(word)})`; $("#correctSpelling").text(word + tempString); $("#incorrectWord > h1").hide(); $("#incorrectWord > h1").fadeIn(750); $("#incorrectWord > p").hide(); $("#incorrectWord > p").fadeIn(1000);
  setTimeout(() => {
    $("#incorrectWord").fadeOut(500);
    setTimeout(() => {
      $("#body").show();
      setTimeout(() => {
        $("#answer").focus();
      }, 250);
    }, 500)
  }, 3000)
}

//handle accent input and also word skipping commands
$("#answer").on("keyup", () => {
  if ([
    "/aa", "/ag", "/ea", "/eg", "/ia", "/ig", "/oa", "/og", "/ua", "/ug", 
    "/ac", "/ec", "/ic", "/oc", "/uc", "/cd", "/au", "/eu", "/iu", "/ou", "/uu", "/nt"
    ].some(accentBind => $("#answer").val().includes(accentBind))) {
    $("#answer").val(
      $("#answer").val()
      .replace("/aa", "á").replace("/ag", "à").replace("/ac", "â").replace("/au", "ä")
      .replace("/ea", "é").replace("/eg", "è").replace("/ec", "ê").replace("/eu", "ë")
      .replace("/ia", "í").replace("/ig", "ì").replace("/ic", "î").replace("/iu", "ï")
      .replace("/oa", "ó").replace("/og", "ò").replace("/oc", "ô").replace("/ou", "ö")
      .replace("/ua", "ú").replace("/ug", "ù").replace("/uc", "û").replace("/uu", "ü")
      .replace("/cd", "ç").replace("/nt", "ñ")
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

//alternatively handle submit button presses in the same way that enter keypresses are handled
$("#submit").click(() => {
  if ($("#answer").val().trim() === word || $("#answer").val().trim() === hasAlternativeSpellings(word)) {
    if(!tempAltSpelling) {
      if(hasAlternativeSpellings($("#answer").val().trim())) {
        tempAltSpelling = hasAlternativeSpellings($("#answer").val().trim());
        $("#submit").removeClass("btn-success").removeClass("btn-error").addClass("btn-warning").text("Enter alt spelling"); $("#answer").val("").blur();
        playWord();
      } else {
        correct++; streak++;
        $("#correct").html(correct + '<i class="fa fa-check pl-1"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>'); $("#answer").val("").blur(); $("#submit").addClass("btn-success").removeClass("btn-error").removeClass("btn-warning").text("Submit Answer");
        if(!successAudioDisabled) { const correctAudio = new Audio(`${rootPath}assets/correct.mp3`); correctAudio.addEventListener("ended", () => { generateWord(); }); correctAudio.volume = successAudioVolume; correctAudio.play(); } else { generateWord(); }
      }
    } else {
      if(hasAlternativeSpellings($("#answer").val().trim()) == tempAltSpelling) {
        toastr.warning("Please enter the alternative spelling!", "Alternative Spelling Error"); $("#answer").val("").blur().focus();
      } else {
        tempAltSpelling = ""; correct++; streak++;
        $("#correct").html(correct + '<i class="fa fa-check pl-1"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>'); $("#answer").val("").blur(); $("#submit").addClass("btn-success").removeClass("btn-error").removeClass("btn-warning").text("Submit Answer");
        if(!successAudioDisabled) { const correctAudio = new Audio(`${rootPath}assets/correct.mp3`); correctAudio.addEventListener("ended", () => { generateWord(); }); correctAudio.volume = successAudioVolume; correctAudio.play(); } else { generateWord(); }
      }
    }
  } 
  else {
    wrong++; streak = 0;
    $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>'); $("#answer").val("").blur();
    const wrongAudio = new Audio(`${rootPath}assets/wrong.mp3`); wrongAudio.addEventListener("ended", () => { incorrectWord(); }); wrongAudio.volume = wrongAudioVolume; wrongAudio.play();
  }
  /*else {
    if ($("#answer").val().trim() === word || $("#answer").val().trim() === hasAlternativeSpellings(word)) {
      temp.push(word);
      $("#answer").val("").blur();
      currentWordIncorrect = false;

      //handle playing the success audio
      if(!successAudioDisabled) {
        const correctAudio = new Audio(`${rootPath}assets/correct.mp3`);
        correctAudio.addEventListener("ended", () => { $("#submit").addClass("btn-success").removeClass("btn-error").removeClass("btn-warning").text("Submit Answer"); generateWord(); })
        correctAudio.volume = successAudioVolume;
        correctAudio.play();
      } else {
        $("#submit").addClass("btn-success").removeClass("btn-error").removeClass("btn-warning").text("Submit Answer");
        generateWord();
      }
    } else {
      wrong++; streak = 0;
      $("#wrong").html(wrong + '<i class="fa fa-times pl-2"></i>'); $("#streak").html(streak + '<i class="fa fa-dashboard pl-2"></i>');
      $("#answer").val("").blur();
      const wrongAudio = new Audio(`${rootPath}assets/wrong.mp3`);
      wrongAudio.addEventListener("ended", () => {
        incorrectWord();
      });
      wrongAudio.volume = wrongAudioVolume;
      wrongAudio.play();
    }
  }
    */
})

$("#answer").on("keydown", (event) => {
  if (event.key === "Enter") {
    $("#submit").click();
  }
})

//start the round when the user clicks on the start round button
$("#startRound").click(() => { startRound(); })