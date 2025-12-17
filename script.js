// ==================== 사운드 시스템 ====================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let bgmOscillator = null;
let bgmGain = null;
let isBgmPlaying = false;

// 오디오 컨텍스트 초기화
function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 효과음: 말풍선 팝업 (귀여운 팝 사운드)
function playPopSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
}

// 효과음: 버튼 클릭
function playClickSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
}

// 효과음: 장면 전환 (스위시 사운드)
function playSceneChangeSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.4);
}

// 효과음: 타이핑 틱
function playTypingSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(1000 + Math.random() * 200, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.03);
}

// 효과음: 축하 팡파레
function playFanfareSound() {
    if (!audioCtx) return;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.5);
        }, index * 150);
    });
}

// 배경음악 시작
function startBgm() {
    if (!audioCtx || isBgmPlaying) return;

    isBgmPlaying = true;
    bgmGain = audioCtx.createGain();
    bgmGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    bgmGain.connect(audioCtx.destination);

    playBgmLoop();
}

// BGM 루프 (간단한 멜로디)
function playBgmLoop() {
    if (!isBgmPlaying || !audioCtx) return;

    const melody = [
        { freq: 392, dur: 0.5 },  // G4
        { freq: 440, dur: 0.5 },  // A4
        { freq: 494, dur: 0.5 },  // B4
        { freq: 523, dur: 1 },    // C5
        { freq: 494, dur: 0.5 },  // B4
        { freq: 440, dur: 0.5 },  // A4
        { freq: 392, dur: 1 },    // G4
        { freq: 330, dur: 0.5 },  // E4
        { freq: 392, dur: 0.5 },  // G4
        { freq: 440, dur: 1 },    // A4
    ];

    let time = audioCtx.currentTime;

    melody.forEach(note => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc.connect(noteGain);
        noteGain.connect(bgmGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, time);

        noteGain.gain.setValueAtTime(0.5, time);
        noteGain.gain.setValueAtTime(0.5, time + note.dur * 0.7);
        noteGain.gain.exponentialRampToValueAtTime(0.01, time + note.dur);

        osc.start(time);
        osc.stop(time + note.dur);

        time += note.dur;
    });

    // 멜로디 끝나면 다시 반복
    setTimeout(() => {
        if (isBgmPlaying) {
            playBgmLoop();
        }
    }, 6000);
}

// 배경음악 정지
function stopBgm() {
    isBgmPlaying = false;
    if (bgmGain) {
        bgmGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    }
}

// ==================== 장면 및 대화 데이터 ====================
const scenes = [
    {
        id: 'entrance',
        title: '🏢 이음누리 센터 입구',
        background: 'entrance',
        dialogues: [
            { speaker: 'nuri', text: '와~ 이음아! 여기가 이음누리 센터야! 정말 예쁘다!' },
            { speaker: 'ieum', text: '맞아 누리야! 이음누리는 서울광역면접교섭센터의 이름이래. 여기서 가족들이 만나는 곳이야!' }
        ]
    },
    {
        id: 'playroom',
        title: '🎠 놀이방',
        background: 'playroom',
        dialogues: [
            { speaker: 'ieum', text: '누리야, 여기 봐! 놀이방이야! 장난감도 많고 정말 재미있겠다!' },
            { speaker: 'nuri', text: '우와~ 인형도 있고, 블록도 있어! 여기서 엄마 아빠랑 같이 놀 수 있는 거야?' },
            { speaker: 'ieum', text: '응! 부모님이랑 함께 즐거운 시간을 보낼 수 있는 공간이래. 안전하고 편안하게 놀 수 있어!' }
        ]
    },
    {
        id: 'counseling',
        title: '💬 상담실',
        background: 'counseling',
        dialogues: [
            { speaker: 'nuri', text: '이음아, 여기는 뭐 하는 곳이야? 소파가 푹신해 보여!' },
            { speaker: 'ieum', text: '여기는 상담실이야! 전문 상담사 선생님이 계셔서 어려운 이야기도 편하게 할 수 있어.' },
            { speaker: 'nuri', text: '마음이 힘들 때 이야기하면 기분이 나아질 것 같아! 따뜻한 느낌이 들어~' }
        ]
    },
    {
        id: 'meeting',
        title: '👨‍👩‍👧‍👦 면접교섭실',
        background: 'meeting',
        dialogues: [
            { speaker: 'ieum', text: '누리야, 여기가 바로 면접교섭실이야! 가족들이 편안하게 만나는 공간이래.' },
            { speaker: 'nuri', text: '면접교섭이 뭐야?' },
            { speaker: 'ieum', text: '엄마 아빠가 따로 살아도, 아이들이 부모님 모두를 만날 수 있게 도와주는 거야!' },
            { speaker: 'nuri', text: '아~ 그래서 이름이 "이음"이구나! 가족을 이어주는 곳이네!' }
        ]
    },
    {
        id: 'kitchen',
        title: '🍳 조리 체험실',
        background: 'kitchen',
        dialogues: [
            { speaker: 'nuri', text: '와! 주방이다! 요리도 할 수 있어?' },
            { speaker: 'ieum', text: '응! 여기서 부모님이랑 같이 쿠키도 만들고, 간식도 만들 수 있대!' },
            { speaker: 'nuri', text: '맛있는 거 만들면서 같이 시간 보내면 정말 행복하겠다~' },
            { speaker: 'ieum', text: '맞아! 함께 요리하면서 추억도 만들고, 더 가까워질 수 있어!' }
        ]
    },
    {
        id: 'garden',
        title: '🌳 야외 정원',
        background: 'garden',
        dialogues: [
            { speaker: 'ieum', text: '마지막으로 야외 정원이야! 날씨 좋은 날 산책하기 딱 좋지?' },
            { speaker: 'nuri', text: '나비도 있고 꽃도 예쁘게 피어있어! 자연 속에서 놀 수 있어서 좋다~' },
            { speaker: 'ieum', text: '이음누리에는 이렇게 좋은 시설들이 많아! 모든 가족이 행복하게 만날 수 있도록 도와주는 곳이야.' },
            { speaker: 'nuri', text: '정말 따뜻하고 좋은 곳이네! 이음누리 최고~! 💕' }
        ]
    }
];

// 상태 관리
let currentSceneIndex = 0;
let currentDialogueIndex = 0;
let isAnimating = false;

// DOM 요소
const introScreen = document.getElementById('intro-screen');
const animationScreen = document.getElementById('animation-screen');
const endingScreen = document.getElementById('ending-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const sceneBackground = document.getElementById('scene-background');
const sceneTitle = document.getElementById('scene-title');
const ieumBubble = document.querySelector('.ieum-bubble');
const nuriBubble = document.querySelector('.nuri-bubble');
const ieumText = document.getElementById('ieum-text');
const nuriText = document.getElementById('nuri-text');
const ieumChar = document.getElementById('ieum');
const nuriChar = document.getElementById('nuri');
const progressBar = document.getElementById('progress-bar');

// 화면 전환
function switchScreen(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
        from.style.display = 'none';
        to.style.display = 'flex';
        setTimeout(() => {
            to.classList.add('active');
        }, 50);
    }, 500);
}

// 장면 로드
function loadScene(sceneIndex) {
    const scene = scenes[sceneIndex];

    // 장면 전환 사운드
    playSceneChangeSound();

    // 배경 전환
    sceneBackground.className = 'scene-bg ' + scene.background;
    sceneTitle.textContent = scene.title;

    // 대화 초기화
    currentDialogueIndex = 0;
    hideAllBubbles();

    // 첫 대화 표시
    setTimeout(() => {
        showDialogue();
    }, 500);

    // 진행바 업데이트
    updateProgress();

    // 버튼 상태 업데이트
    updateButtons();
}

// 대화 표시
function showDialogue() {
    if (isAnimating) return;

    const scene = scenes[currentSceneIndex];
    if (currentDialogueIndex >= scene.dialogues.length) return;

    isAnimating = true;

    const dialogue = scene.dialogues[currentDialogueIndex];

    // 말풍선 숨기기
    hideAllBubbles();

    setTimeout(() => {
        // 말풍선 팝업 사운드
        playPopSound();

        if (dialogue.speaker === 'ieum') {
            ieumText.textContent = dialogue.text;
            ieumBubble.classList.remove('hidden');
            ieumChar.classList.add('speaking');
            nuriChar.classList.remove('speaking');
        } else {
            nuriText.textContent = dialogue.text;
            nuriBubble.classList.remove('hidden');
            nuriChar.classList.add('speaking');
            ieumChar.classList.remove('speaking');
        }

        // 타이핑 효과
        typeText(dialogue.speaker === 'ieum' ? ieumText : nuriText, dialogue.text);

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }, 300);
}

// 타이핑 효과
function typeText(element, text) {
    element.textContent = '';
    let i = 0;
    let typingCount = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            // 3글자마다 타이핑 사운드 (너무 시끄럽지 않게)
            if (typingCount % 3 === 0) {
                playTypingSound();
            }
            typingCount++;
            i++;
        } else {
            clearInterval(interval);
        }
    }, 40);
}

// 모든 말풍선 숨기기
function hideAllBubbles() {
    ieumBubble.classList.add('hidden');
    nuriBubble.classList.add('hidden');
    ieumChar.classList.remove('speaking');
    nuriChar.classList.remove('speaking');
}

// 다음 버튼
function goNext() {
    if (isAnimating) return;

    const scene = scenes[currentSceneIndex];

    // 현재 장면에서 다음 대화가 있으면
    if (currentDialogueIndex < scene.dialogues.length - 1) {
        currentDialogueIndex++;
        showDialogue();
    }
    // 다음 장면으로
    else if (currentSceneIndex < scenes.length - 1) {
        currentSceneIndex++;
        loadScene(currentSceneIndex);
    }
    // 마지막 장면이면 엔딩
    else {
        showEnding();
    }

    updateButtons();
}

// 이전 버튼
function goPrev() {
    if (isAnimating) return;

    // 현재 장면에서 이전 대화가 있으면
    if (currentDialogueIndex > 0) {
        currentDialogueIndex--;
        showDialogue();
    }
    // 이전 장면으로
    else if (currentSceneIndex > 0) {
        currentSceneIndex--;
        const prevScene = scenes[currentSceneIndex];
        currentDialogueIndex = prevScene.dialogues.length - 1;
        loadScene(currentSceneIndex);
        setTimeout(() => {
            currentDialogueIndex = prevScene.dialogues.length - 1;
            showDialogue();
        }, 600);
    }

    updateButtons();
}

// 버튼 상태 업데이트
function updateButtons() {
    prevBtn.disabled = (currentSceneIndex === 0 && currentDialogueIndex === 0);
}

// 진행률 업데이트
function updateProgress() {
    let totalDialogues = 0;
    let completedDialogues = 0;

    scenes.forEach((scene, index) => {
        totalDialogues += scene.dialogues.length;
        if (index < currentSceneIndex) {
            completedDialogues += scene.dialogues.length;
        } else if (index === currentSceneIndex) {
            completedDialogues += currentDialogueIndex + 1;
        }
    });

    const progress = (completedDialogues / totalDialogues) * 100;
    progressBar.style.width = progress + '%';
}

// 엔딩 화면
function showEnding() {
    switchScreen(animationScreen, endingScreen);
    createConfetti();
    // 축하 팡파레
    stopBgm();
    playFanfareSound();
}

// 컨페티 효과
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 3 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 3) + 's';
        confettiContainer.appendChild(piece);
    }
}

// 재시작
function restart() {
    currentSceneIndex = 0;
    currentDialogueIndex = 0;
    playClickSound();
    switchScreen(endingScreen, introScreen);
    stopBgm();
}

// 시작
function startAnimation() {
    // 오디오 초기화 (사용자 상호작용 필요)
    initAudio();
    playClickSound();

    switchScreen(introScreen, animationScreen);
    setTimeout(() => {
        loadScene(0);
        // 배경음악 시작
        startBgm();
    }, 600);
}

// 이벤트 리스너
startBtn.addEventListener('click', startAnimation);
nextBtn.addEventListener('click', () => {
    playClickSound();
    goNext();
});
prevBtn.addEventListener('click', () => {
    playClickSound();
    goPrev();
});
restartBtn.addEventListener('click', restart);

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (animationScreen.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            goNext();
        } else if (e.key === 'ArrowLeft') {
            goPrev();
        }
    }
});
