let currentQuestion = 0;
let questions = [];
let selectedLanguage = "en";

//working for only one
// async function startInteraction() {
//   selectedLanguage = document.getElementById("languageSelect").value;
//   const res = await fetch("/questions");
//   questions = await res.json();
//   askNextQuestion();
// }
//
async function startInteraction() {
  selectedLanguage = document.getElementById("languageSelect").value;
  localStorage.setItem("langUsed", selectedLanguage); // 👈 Store selected language
  const res = await fetch("/questions");
  questions = await res.json();
  askNextQuestion();
}

//
async function askNextQuestion() {
  if (currentQuestion >= questions.length) {
    document.getElementById("questionBox").innerHTML =
      "<strong>All questions completed!</strong>";
    document.getElementById("recorder").innerHTML = "";
    document.getElementById("statusText").textContent = "";
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("questionBox").innerHTML = `<p><strong>Q:</strong> ${
    q[`text_${selectedLanguage}`]
  }</p>`;

  // Play audio
  const audio = new Audio(`/audio_questions/q${q.id}_${selectedLanguage}.mp3`);
  audio.play();

  audio.onended = () => {
    recordAnswer(q.id);
  };
}

function recordAnswer(questionId) {
  const recorderDiv = document.getElementById("recorder");
  const statusText = document.getElementById("statusText");
  recorderDiv.innerHTML = `
    <button id="startBtn">🎙️ Start Recording</button>
    <button id="stopBtn" disabled>🛑 Stop</button>
  `;
  statusText.textContent = "";

  let mediaRecorder;
  let audioChunks = [];

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    mediaRecorder = new MediaRecorder(stream);

    document.getElementById("startBtn").onclick = () => {
      mediaRecorder.start();
      audioChunks = [];
      document.getElementById("stopBtn").disabled = false;

      const startBtn = document.getElementById("startBtn");
      startBtn.textContent = "🔴 Recording…";
      startBtn.style.backgroundColor = "red";
      statusText.textContent = "🎙️ Recording in progress...";
    };

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    document.getElementById("stopBtn").onclick = () => {
      mediaRecorder.stop();
      statusText.textContent = "⏹️ Stopped. Uploading...";
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, `answer_q${questionId}.webm`);
      formData.append("question_id", questionId);
      formData.append("language", selectedLanguage);

      const response = await fetch("/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        recorderDiv.innerHTML = `<p>✅ Answer saved.</p>`;
        statusText.textContent = "";
        currentQuestion += 1;
        setTimeout(askNextQuestion, 1500);
      } else {
        recorderDiv.innerHTML = `<p>❌ Error saving answer.</p>`;
        statusText.textContent = "";
      }
    };
  });
}
// comment1
// async function fetchAnswers() {
//   const res = await fetch("/answers");
//   const answers = await res.json();

//   let html = "<h3>📝 Your Answers:</h3><ul>";
//   for (const ans of answers) {
//     html += `<li><strong>Q${ans.question_id}:</strong> ${
//       ans.transcription
//     } <br/><em>🕒 ${new Date(ans.timestamp).toLocaleString()}</em></li>`;
//   }
//   html += "</ul>";

//   document.getElementById("answersBox").innerHTML = html;
// }

//comment2
// async function fetchAnswers() {
//   const res = await fetch("/answers");
//   const answers = await res.json();

//   const container = document.createElement("div");
//   container.innerHTML = "<h3>📝 Your Answers:</h3>";

//   answers.forEach((ans) => {
//     const item = document.createElement("div");
//     item.style.marginBottom = "20px";
//     item.innerHTML = `
//       <strong>Q${ans.question_id}:</strong> ${ans.question_text}<br/>
//       <strong>Answer:</strong> ${ans.transcription || "(No response)"}<br/>
//       🕒 ${new Date(ans.timestamp).toLocaleString()}
//     `;
//     container.appendChild(item);
//   });

//   document.querySelector(".container").appendChild(container);
// }
async function fetchAnswers() {
  const res = await fetch("/answers");
  const answers = await res.json();

  const container = document.createElement("div");
  container.innerHTML = "<h3>📝 Your Answers:</h3>";

  // Define question texts in both languages
  const questionTexts = {
    en: {
      1: "What is your full name?",
      2: "What is your age?",
      3: "What symptoms are you experiencing today?",
      4: "Do you have any existing medical conditions?",
      5: "Are you currently taking any medications?",
    },
    hi: {
      1: "आपका पूरा नाम क्या है?",
      2: "आपकी उम्र क्या है?",
      3: "आपको आज क्या लक्षण महसूस हो रहे हैं?",
      4: "क्या आपको कोई पुरानी बीमारी है?",
      5: "क्या आप वर्तमान में कोई दवा ले रहे हैं?",
    },
  };

  // Use the language selected at the time of starting
  // const lang = selectedLanguage || "en";

  const lang = localStorage.getItem("langUsed") || "en";

  answers.forEach((ans) => {
    const qText =
      questionTexts[lang][ans.question_id] || `Question ${ans.question_id}`;
    const item = document.createElement("div");
    item.style.marginBottom = "20px";
    item.innerHTML = `
      <strong>Q${ans.question_id}:</strong> ${qText}<br/>
      <strong>Answer:</strong> ${ans.transcription || "(No response)"}<br/>
      🕒 ${new Date(ans.timestamp).toLocaleString()}
    `;
    container.appendChild(item);
  });

  document.querySelector(".container").appendChild(container);
}
