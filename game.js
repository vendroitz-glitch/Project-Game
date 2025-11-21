// Trivia Tarik Tambang - game.js
const TURN_SECONDS = 30;
let questions = []; // will be filled by getQuestions()
let qIndex = 0;
let turn = 1; // 1 = player1 (blue), 2 = player2 (red)
let timer = TURN_SECONDS;
let timerInterval = null;
let gameRunning = false;

// positions: 0 = start, negative = blue moved left (safe), positive = red moved right (closer to pit)
const positions = { p1: 0, p2: 0 };
const MOVE_STEP = window.innerWidth * 0.03;
const MAX_PUSH = 250; // if car crosses this into pit zone, it falls

// elements
const carBlue = document.getElementById('carBlue');
const carRed = document.getElementById('carRed');
const pit = document.getElementById('pit');
const p1PosText = document.getElementById('p1-pos');
const p2PosText = document.getElementById('p2-pos');

const q1Text = document.getElementById('q1-text');
const q2Text = document.getElementById('q2-text');
const q1Input = document.getElementById('q1-answer');
const q2Input = document.getElementById('q2-answer');
const q1btn = document.getElementById('q1-submit');
const q2btn = document.getElementById('q2-submit');

const p1Time = document.getElementById('p1-time');
const p2Time = document.getElementById('p2-time');

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

function getQuestions() {
  // Soal pengetahuan umum (Q & A)
  const bankSoal = [
    { q: "Kota Surabaya disebut apa?", a: "Kota Pahlawan" },
    { q: "Ibukota provinsi Jawa Timur?", a: "Surabaya" },
    { q: "Kepala UPT TIKP Dinas Pendidikan Provinsi Jatim?", a: "Mustakim" },
    { q: "Siapa gubernur Jatim saat ini?", a: "Khofifah" },
    { q: "Kerajaan terbesar di Jatim?", a: "Majapahit" },
    { q: "Binatang khas Jawa Timur?", a: "bekisar" },
    { q: "Pulau di seberang Suramadu adalah...", a: "Madura" },
    { q: "Kota kecil kelahiran Susilo Bambang Yudhoyono ", a: "Pacitan" },
    { q: "Makanan khas Madiun", a: "pecel" },
    { q: "Gunung tertinggi di Jawa Timur", a: "Semeru" },
    { q: "Ibukota Jawa Timur adalah?", a: "Surabaya" },
    { q: "Pahlawan nasional asal Surabaya?", a: "Bung Tomo" },
    { q: "Kesenian khas Ponorogo", a: "Reog" },
    { q: "Kota kelahiran presiden RI pertama", a: "Blitar" },
    { q: "Kawah terkenal di ujung timur Jatim", a: "Ijen" },
    { q: "Pelabuhan terkenal di Banyuwangi", a: "Ketapang" },
    { q: "Kesenian asal Madura?", a: "Karapan sapi" },
    { q: "Presiden pertama Republik Indonesia adalah?", a: "Ir. Soekarno" },
    { q: "Suku yang tinggal di kawasan Bromo?", a: "Tengger" },
    { q: "Suku asli dari kota Banyuwangi?", a: "Oseng" },
    { q: "Tempat wisata terkenal di Batu?", a: "Jatim Park" },
    { q: "Pahlawan nasional Suryo berasal dari kota?", a: "Ngawi" },
    { q: "Kota di Jatim yang berada di lereng gunung Lawu?", a: "Magetan" },
    { q: "Tempat wisata terkenal di Magetan?", a: "Sarangan" },
    { q: "Danau di lereng gunung Semeru?", a: "Ranu Kumbolo" },
    { q: "Jawa Timur berbatasan langsung (darat) dengan provinsi?", a: "Jawa Tengah" },
    { q: "Jawa Timur berbatasan laut dengan provinsi?", a: "Bali" },
    { q: "Kesenian (drama) khas Jawa Timur?", a: "Ludruk" },
    { q: "Perguruan tinggi negeri terbesar di kota Malang", a: "Universitas Brawijaya" },
    { q: "Sebutan kelompok suporter sepak bola terbesar di Malang?", a: "Aremania" },
    { q: "Suporter setia Persebaya Surabaya?", a: "Bonek" },
    { q: "Plat nomor untuk karesidenan Madiun?", a: "AE" },
    { q: "Kandungan minyak bumi Blok Cepu terbesar di kota?", a: "Bojonegoro" },
    { q: "Simpang lima Gumul terletak di kota?", a: "Kediri" },
    { q: "Terkenal dengan kampung inggris adalah", a: "Pare" },
    { q: "Bendungan Karangkates terletak di wilayah...", a: "Malang" },
    { q: "Jembatan antar pulau di Jatim", a: "Suramadu" },
    { q: "Sungai terpanjang yang melewati Tuban?", a: "Bengawan Solo" },
    { q: "Gunung yang berbatasan dengan Jawa Tengah?", a: "Lawu" },
    { q: "Marsinah seorang pahlawan nasional berasal dari...", a: "Nganjuk" },
    { q: "Pantai terkenal di Pacitan adalah...", a: "Klayar" },
    { q: "Lontong balap asli dari kota?", a: "Surabaya" },
    { q: "Minuman khas Tuban?", a: "Tuak" },
    { q: "Tahu takwa berasal dari", a: "Kediri" },
    { q: "Kota gadis adalah sebutan kota", a: "Madiun" },
    { q: "Kuliner dari Trenggalek?", a: "Nasi Lodo" },
    { q: "Rumah khas Jawa Timur", a: "Joglo" },
    { q: "Trowulan terletak di kota", a: "Mojokerto" },
    { q: "Sungai terbesar di Jawa Timur?", a: "Brantas" }
  ];

  // ambil 50 soal (jika soal kurang dari 50 tetap aman)
  const arr = bankSoal.slice(0, 50);

  // acak soal
  shuffle(arr);

  return arr;
}


function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadGame() {
  questions = getQuestions();
  shuffle(questions);
  qIndex = 0;
  turn = 1;
  timer = TURN_SECONDS;
  updateUI();
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  spawnClouds();
  loadGame();
  nextQuestion();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerUI();
    if (timer <= 0) {
      // switch turn and next question
      switchTurn();
    }
  }, 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  gameRunning = false;
  timer = TURN_SECONDS;
  positions.p1 = 0; positions.p2 = 0;
  respawnCars();
  moveCars();
  loadGame();
  updateUI();
}

function updateTimerUI(){
  if (turn === 1) {
    p1Time.textContent = timer;
    p2Time.textContent = 0;
  } else {
    p2Time.textContent = timer;
    p1Time.textContent = 0;
  }
}

function updateUI() {
  // enable/disable boxes based on turn
  if (!gameRunning) {
    q1Input.disabled = true; q1btn.disabled = true;
    q2Input.disabled = true; q2btn.disabled = true;
  } else if (turn === 1) {
    q1Input.disabled = false; q1btn.disabled = false;
    q2Input.disabled = true; q2btn.disabled = true;
  } else {
    q1Input.disabled = true; q1btn.disabled = true;
    q2Input.disabled = false; q2btn.disabled = false;
  }
  p1PosText.textContent = positions.p1;
  p2PosText.textContent = positions.p2;
  updateTimerUI();
}

function nextQuestion() {
  if (qIndex >= questions.length) {
    // no more questions
    endGame();
    return;
  }
  const q = questions[qIndex++];
  if (turn === 1) {
    q1Text.textContent = q.q;
    q1Input.value = '';
    q1Input.focus();
  } else {
    q2Text.textContent = q.q;
    q2Input.value = '';
    q2Input.focus();
  }
}

function checkAnswer(player, given) {
  // check against last shown question
  const lastQ = questions[qIndex-1];
  if (!lastQ) return false;
  const correct = lastQ.a.trim().toLowerCase() === given.trim().toLowerCase();
  return correct;
}

function applyCorrect(player) {
  if (player === 1) {
    // blue moves left (safe), red moves right (toward pit)
    positions.p1 -= 1;
    positions.p2 += 1;
    moveCars();
  } else {
    // for player2 (red): mundur = move right away, blue moves left toward pit
    positions.p2 -= 1;
    positions.p1 += 1;
    moveCars();
  }
  p1PosText.textContent = positions.p1;
  p2PosText.textContent = positions.p2;
}

function moveCars() {
  const blueOffset = positions.p1 * MOVE_STEP; 
  const redOffset = positions.p2 * MOVE_STEP;  // diperbaiki: tidak dibalik

  // mobil biru → normal
  carBlue.style.transform = `translateX(${blueOffset}px)`;

  // mobil merah → rotasi tetap, tetapi translasi harus dibalik
  carRed.style.transform = `translateX(${-redOffset}px)`;

  // cek mobil jatuh ke jurang
  const pitRect = pit.getBoundingClientRect();
  const blueRect = carBlue.getBoundingClientRect();
  const redRect = carRed.getBoundingClientRect();

  const blueCenterX = blueRect.left + blueRect.width / 2;
  const redCenterX = redRect.left + redRect.width / 2;

  if (blueCenterX > pitRect.left && blueCenterX < pitRect.right) {
    triggerFall(carBlue, 1);
  }
  if (redCenterX > pitRect.left && redCenterX < pitRect.right) {
    triggerFall(carRed, 2);
  }
}



function triggerFall(carEl, player) {
  // stop game and animate fall
  clearInterval(timerInterval);
  gameRunning = false;

  // Animasi jatuh mobil
  carEl.classList.add('fall');

  // Tampilkan popup kalah
  showFallPopup(player);
}

/* ==========================================================
   CHECK FALL — DETEKSI MOBIL MASUK JURANG
   ========================================================== */

function checkFall() {
    const arenaRect = document.getElementById("arena").getBoundingClientRect();
    const holeRect = document.getElementById("hole").getBoundingClientRect();

    const blueRect = carBlue.getBoundingClientRect();
    const redRect = carRed.getBoundingClientRect();

    // batas jurang relative terhadap arena
    const holeLeft = holeRect.left - arenaRect.left;
    const holeRight = holeRect.right - arenaRect.left;

    // posisi mobil relative terhadap arena
    const blueLeft = blueRect.left - arenaRect.left;
    const redLeft = redRect.left - arenaRect.left;

    // LEBAR mobil (untuk akurasi)
    const blueWidth = blueRect.width;
    const redWidth = redRect.width;

    // Jika mobil biru masuk jurang
    if (blueLeft + blueWidth / 2 > holeLeft && blueLeft + blueWidth / 2 < holeRight) {
        triggerFall(carBlue, "Biru");
        gameRunning = false;
        return true;
    }

    // Jika mobil merah masuk jurang
    if (redLeft + redWidth / 2 > holeLeft && redLeft + redWidth / 2 < holeRight) {
        triggerFall(carRed, "Merah");
        gameRunning = false;
        return true;
    }

    return false;
}
function respawnCars() {
    // hapus class fall
    carBlue.classList.remove("fall");
    carRed.classList.remove("fall");

    // pastikan elemen muncul lagi
    carBlue.style.opacity = "1";
    carRed.style.opacity = "1";

    // reset posisi CSS bawaan
    carBlue.style.transform = "translateX(0)";
    carRed.style.transform = "translateX(0)";
}
function switchTurn() {
  turn = turn === 1 ? 2 : 1;
  timer = TURN_SECONDS;
  updateUI();
  nextQuestion();
}

function endGame() {
  clearInterval(timerInterval);
  gameRunning = false;
  alert('Semua pertanyaan selesai. Permainan berakhir.');
}
// ======================================
//  ROPE SYSTEM (TALI ANTAR MOBIL)
// ======================================
// Ketebalan tali
const ropeThickness = 16;

// Fungsi menggambar tali
function drawRope() {
    // Titik ikat tali pada mobil biru (bagian bumper kanan mobil biru)
    const blueAttachX = blueCar.x + blueCar.width;
    const blueAttachY = blueCar.y + (blueCar.height / 2);

    // Titik ikat tali pada mobil merah (bagian bumper kiri mobil merah)
    const redAttachX = redCar.x;
    const redAttachY = redCar.y + (redCar.height / 2);

    ctx.strokeStyle = "brown";
    ctx.lineWidth = ropeThickness;

    ctx.beginPath();
    ctx.moveTo(blueAttachX, blueAttachY);
    ctx.lineTo(redAttachX, redAttachY);
    ctx.stroke();
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawHole();
    drawRope();   // <--- panggil di sini
    drawCars();

    updateFalling(blueCar);
    updateFalling(redCar);

    requestAnimationFrame(gameLoop);
}
function spawnClouds() {
    const arena = document.getElementById("arena");

    for (let i = 0; i < 6; i++) {
        createCloud(arena);
    }

    // setiap 6 detik buat awan baru
    setInterval(() => {
        createCloud(arena);
    }, 6000);
}

function createCloud(arena) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";

    // posisi random
    const startY = 20 + Math.random() * 80;
    const scale = 0.6 + Math.random() * 0.7;
    const duration = 20 + Math.random() * 30; // 20–50 sec

    cloud.style.top = startY + "px";
    cloud.style.transform = `scale(${scale})`;
    cloud.style.animationDuration = duration + "s";

    // mulai dari kiri di luar layar
    cloud.style.left = "-200px";

    arena.appendChild(cloud);

    // hapus awan setelah selesai bergerak
    setTimeout(() => {
        cloud.remove();
    }, duration * 1000);
}

// event handlers
q1btn.addEventListener('click', () => {
  if (!gameRunning || turn !== 1) return;
  const ans = q1Input.value || '';
  const ok = checkAnswer(1, ans);
  if (ok) {
    applyCorrect(1);
    switchTurn();
  } else {
    switchTurn();
  }
});

q2btn.addEventListener('click', () => {
  if (!gameRunning || turn !== 2) return;
  const ans = q2Input.value || '';
  const ok = checkAnswer(2, ans);
  if (ok) {
    applyCorrect(2);
    switchTurn();
  } else {
    switchTurn();
  }
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// initialize
loadGame();
updateUI();
