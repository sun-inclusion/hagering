'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  HageOyajiSvg,
  ChapterIconSvg,
  StagePreviewSvg,
  drawStageBackground,
  drawFloorGimmicks,
  drawHouseTarget,
  drawObstacleVector,
  drawHeroStone,
  drawComicEffects,
} from './graphics';

const CHAPTERS = [
  {
    id: 1,
    shortName: '1.銭湯',
    name: '第1章：銭湯の洗い場（標的撃破でゴール開放！）',
    stageTitles: ['1-1：ケロリン桶の壁', '1-2：アヒル大行進', '1-3：ツルツル石鹸罠', '1-4：湯けむり地獄', '1-5：番台のカツラ大王'],
    prologueTitle: '📖 プロローグ 〜ツルピカからの大逆転〜',
    prologueText: '赤枠の「TARGET」をすべて弾き飛ばすとゴールが開放！滑走中に長押しで急ブレーキをかけて、動くサークルのど真ん中を狙え！',
    outerBg: '#dbeafe',
    floor: '#eff6ff',
    border: '#3b82f6',
    gridColor: 'rgba(59, 130, 246, 0.15)',
    obstacles: ['DUCK', 'BUCKET', 'SOAP'],
    friction: 0.985,
  },
  {
    id: 2,
    shortName: '2.満員電車',
    name: '第2章：朝の満員電車（標的撃破でゴール開放！）',
    stageTitles: ['2-1：カバンの防波堤', '2-2：揺れるつり革', '2-3：居眠りサラリーマン', '2-4：急ブレーキの嵐', '2-5：車掌カツラ大王'],
    prologueTitle: '📖 第2章 〜通勤ラッシュ突破作戦〜',
    prologueText: '朝の山手線は戦場だ！超加速床と反発バンパーを乗りこなし、標的を吹っ飛ばしてから特等席へ急ブレーキで滑り込め！',
    outerBg: '#e2e8f0',
    floor: '#f8fafc',
    border: '#64748b',
    gridColor: 'rgba(100, 116, 139, 0.15)',
    obstacles: ['BAG', 'STRAP', 'SLEEPER'],
    friction: 0.982,
  },
  {
    id: 3,
    shortName: '3.ブラック企業',
    name: '第3章：ブラック企業の廊下（標的撃破でゴール開放！）',
    stageTitles: ['3-1：赤い督促状の壁', '3-2：崩れる書類の山', '3-3：激怒上司の説教', '3-4：サービス残業の罠', '3-5：ブラック社長カツラ王'],
    prologueTitle: '📖 第3章 〜社畜からの下剋上〜',
    prologueText: '山積みの書類に理不尽な怒り上司！「定時退社ァ！」の気合いで赤枠の標的を全員吹っ飛ばし、動く社長室を奪い取れ！',
    outerBg: '#f3e8ff',
    floor: '#faf5ff',
    border: '#9333ea',
    gridColor: 'rgba(147, 51, 234, 0.14)',
    obstacles: ['BILL', 'DOCS', 'BOSS_MAN'],
    friction: 0.980,
  },
  {
    id: 4,
    shortName: '4.銀座クラブ',
    name: '第4章：銀座の高級クラブ（標的撃破でゴール開放！）',
    stageTitles: ['4-1：シャンパンタワー', '4-2：一万円札束の壁', '4-3：グラサン黒服軍団', '4-4：VIPルームの攻防', '4-5：ドンペリカツラ大王'],
    prologueTitle: '📖 第4章 〜成金VIPの夜〜',
    prologueText: 'ついに辿り着いた銀座のネオン！高速で左右に動くVIPサークルを見極め、黄金の輝きで一発逆転を決めろ！',
    outerBg: '#fef3c7',
    floor: '#fffbeb',
    border: '#d97706',
    gridColor: 'rgba(217, 119, 6, 0.15)',
    obstacles: ['CHAMPAGNE', 'MONEY', 'HOST'],
    friction: 0.988,
  },
  {
    id: 5,
    shortName: '5.宇宙',
    name: '第5章：宇宙ステーション（標的撃破でゴール開放！）',
    stageTitles: ['5-1：漂う隕石群', '5-2：人工衛星の軌道', '5-3：謎の円盤UFO', '5-4：無重力ワープ', '5-5：銀河皇帝カツラ大王'],
    prologueTitle: '📖 最終章 〜宇宙一のツルピカ伝説〜',
    prologueText: '摩擦ゼロに近い無重力空間！長押しブレーキを駆使しないと宇宙の果てまで滑っていくぞ！全宇宙の頂点へ君臨せよ！',
    outerBg: '#e0e7ff',
    floor: '#eef2ff',
    border: '#4f46e5',
    gridColor: 'rgba(79, 70, 229, 0.15)',
    obstacles: ['METEOR', 'SATELLITE', 'UFO'],
    friction: 0.994,
  },
];

const ONOMATOPOEIA = ['バチコーン!!', 'スカッ!!', 'ズシャア!!', 'ドゴォォン!!', 'ツルピカッ!!'];

export default function HageringGame() {
  const [screen, setScreen] = useState('TITLE');
  const [mode, setMode] = useState('STORY');
  const [chapterIdx, setChapterIdx] = useState(0);
  const [stageNum, setStageNum] = useState(1);
  const [unlockedStage, setUnlockedStage] = useState(1);
  const [isDebug, setIsDebug] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(3);
  const [targetsLeft, setTargetsLeft] = useState(1);
  const [feverGauge, setFeverGauge] = useState(0);
  const [isFever, setIsFever] = useState(false);
  const [resultInfo, setResultInfo] = useState({ clear: false, msg: '', bonus: 0 });
  const [endlessWave, setEndlessWave] = useState(1);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  const gameRef = useRef({
    width: 360,
    height: 640,
    tick: 0,
    stone: { x: 180, y: 520, vx: 0, vy: 0, r: 23, state: 'READY', angle: 0, trail: [] },
    house: { x: 180, y: 130, baseX: 180, r: 58, moveRange: 0, moveSpeed: 0 },
    obstacles: [],
    gimmicks: [],
    particles: [],
    confetti: [],
    comicEffects: [],
    speedLinesTimer: 0,
    dragStart: null,
    dragCurrent: null,
    lastBrushPos: null,
    isBraking: false,
    shake: 0,
    hitStop: 0,
    combo: 0,
    feverGauge: 0,
    isFever: false,
    score: 0,
    shotsLeft: 3,
    chapterIdx: 0,
    stageNum: 1,
    mode: 'STORY',
    endlessWave: 1,
    soundOn: true,
  });

  useEffect(() => {
    gameRef.current.soundOn = soundOn;
  }, [soundOn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('key') === 'sun777hage') {
        setIsDebug(true);
        setUnlockedStage(25);
      } else {
        const saved = localStorage.getItem('hagering_unlocked');
        if (saved) {
          const val = Math.min(25, Math.max(1, parseInt(saved, 10)));
          setUnlockedStage(val);
          setChapterIdx(Math.floor((val - 1) / 5));
          setStageNum(((val - 1) % 5) + 1);
        }
      }
      const savedBest = localStorage.getItem('hagering_best');
      if (savedBest) setBestScore(parseInt(savedBest, 10));
    }
  }, []);

  const playSound = (type) => {
    if (!gameRef.current.soundOn) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'shoot') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360 + Math.random() * 140, now);
        osc.frequency.exponentialRampToValueAtTime(85, now + 0.15);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'fever') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'brush') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750 + Math.random() * 350, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'brake') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'reject') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.setValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'clear') {
        osc.type = 'triangle';
        [523, 659, 784, 1046].forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        });
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {}
  };

  const setupStage = (cIdx, sNum, gameMode = 'STORY', wave = 1) => {
    const g = gameRef.current;
    const w = window.innerWidth > 480 ? 420 : window.innerWidth;
    const h = window.innerHeight;
    g.width = w;
    g.height = h;
    g.chapterIdx = cIdx;
    g.stageNum = sNum;
    g.mode = gameMode;
    g.endlessWave = wave;
    g.isBraking = false;

    g.stone = { x: w / 2, y: h - 115, vx: 0, vy: 0, r: 23, state: 'READY', angle: 0, trail: [] };

    // サークル（ハウス）の移動設定（ステージが進むほど大きく速く左右に揺れる）
    const levelFactor = gameMode === 'ENDLESS' ? wave : cIdx * 5 + sNum;
    const moveRange = levelFactor === 1 ? 35 : Math.min(w * 0.32, 45 + levelFactor * 4.5);
    const moveSpeed = 0.022 + Math.min(0.045, levelFactor * 0.0022);
    g.house = {
      x: w / 2,
      baseX: w / 2,
      y: 132,
      r: Math.max(42, 62 - Math.floor(levelFactor * 0.7)),
      moveRange,
      moveSpeed,
    };

    // ギミック床・バンパー配置
    const gimmicks = [];
    if (levelFactor >= 2) {
      gimmicks.push({
        type: 'ACCEL',
        x: w * (sNum % 2 === 0 ? 0.32 : 0.68),
        y: h * 0.56,
        w: 66,
        h: 74,
      });
    }
    if (levelFactor >= 3) {
      gimmicks.push({
        type: 'BUMPER',
        x: w * (sNum % 2 === 0 ? 0.72 : 0.28),
        y: h * 0.42,
        r: 21,
      });
    }
    if (levelFactor >= 8) {
      gimmicks.push({
        type: 'BUMPER',
        x: w * 0.5,
        y: h * 0.34,
        r: 19,
      });
    }
    g.gimmicks = gimmicks;

    // 障害物＆撃破必須ターゲット生成
    const obsList = [];
    const chap = CHAPTERS[cIdx];
    const count = gameMode === 'ENDLESS' ? Math.min(16, 5 + wave) : 4 + cIdx + sNum;
    const targetQuota = gameMode === 'ENDLESS' ? Math.min(4, 1 + Math.floor(wave / 2)) : Math.min(3, 1 + Math.floor((cIdx + sNum) / 3));

    for (let i = 0; i < count; i++) {
      const kind = chap.obstacles[i % chap.obstacles.length];
      const ox = 52 + ((i * 79 + sNum * 37) % Math.max(120, w - 104));
      const oy = 215 + ((i * 63 + cIdx * 29) % Math.max(140, h - 385));
      const isBoss = i === 0 && (sNum === 5 || wave % 3 === 0);
      const isTarget = i < targetQuota;
      const patrolSpeed = isTarget && levelFactor >= 4 ? (i % 2 === 0 ? 1.4 : -1.4) : 0;

      obsList.push({
        id: i,
        x: ox,
        y: oy,
        vx: patrolSpeed,
        vy: 0,
        r: isBoss ? 28 : 20,
        kind: isBoss ? 'WIG_KING' : kind,
        isBoss,
        isTarget,
        blasted: false,
        rot: 0,
        vrot: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }

    g.obstacles = obsList;
    g.particles = [];
    g.confetti = [];
    g.comicEffects = [];
    g.speedLinesTimer = 0;
    g.dragStart = null;
    g.dragCurrent = null;
    g.shake = 0;
    g.hitStop = 0;

    if (gameMode === 'STORY' || wave === 1) {
      g.shotsLeft = 3;
      g.combo = 0;
      g.feverGauge = 0;
      g.isFever = false;
      if (gameMode === 'ENDLESS') g.score = 0;
    } else {
      g.shotsLeft = Math.min(4, g.shotsLeft + 1);
    }

    setShotsLeft(g.shotsLeft);
    setTargetsLeft(targetQuota);
    setFeverGauge(g.feverGauge);
    setIsFever(g.isFever);
    if (gameMode === 'ENDLESS' && wave === 1) setScore(0);
  };

  const startStoryStage = (cIdx, sNum) => {
    setMode('STORY');
    setChapterIdx(cIdx);
    setStageNum(sNum);
    setScore(0);
    gameRef.current.score = 0;
    setupStage(cIdx, sNum, 'STORY', 1);
    setScreen('PLAY');
  };

  const startEndless = () => {
    setMode('ENDLESS');
    setChapterIdx(0);
    setEndlessWave(1);
    setScore(0);
    gameRef.current.score = 0;
    setupStage(0, 1, 'ENDLESS', 1);
    setScreen('PLAY');
  };

  useEffect(() => {
    if (screen !== 'PLAY') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const handleResize = () => {
      const w = window.innerWidth > 480 ? 420 : window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gameRef.current.width = w;
      gameRef.current.height = h;
      gameRef.current.house.baseX = w / 2;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnParticles = (x, y, color, count = 16) => {
      const g = gameRef.current;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 8;
        g.particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1.0,
          color,
          size: 3.5 + Math.random() * 5.5,
        });
      }
    };

    const spawnConfetti = (x, y, count = 45) => {
      const g = gameRef.current;
      const colors = ['#facc15', '#f43f5e', '#38bdf8', '#4ade80', '#a855f7'];
      for (let i = 0; i < count; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const spd = 4 + Math.random() * 9;
        g.confetti.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.3,
          color: colors[i % colors.length],
          life: 1.4,
        });
      }
    };

    const addComicEffect = (x, y, text, subText, color = '#fde047') => {
      gameRef.current.comicEffects.push({
        x,
        y,
        text,
        subText,
        color,
        life: 1.0,
        scale: 0.3,
      });
    };

    const update = () => {
      const g = gameRef.current;
      g.tick += 1;
      const chap = CHAPTERS[g.chapterIdx];

      if (g.hitStop > 0) {
        g.hitStop -= 1;
        return;
      }

      if (g.shake > 0) {
        g.shake *= 0.84;
        if (g.shake < 0.5) g.shake = 0;
      }

      if (g.speedLinesTimer > 0) {
        g.speedLinesTimer -= 1;
      }

      // 1. サークル（ハウス）の左右移動アニメーション
      if (g.house.moveRange > 0) {
        g.house.x = g.house.baseX + Math.sin(g.tick * g.house.moveSpeed) * g.house.moveRange;
      }

      // 2. パトロールする障害物の左右移動
      g.obstacles.forEach((obs) => {
        if (!obs.blasted && obs.vx !== 0) {
          obs.x += obs.vx;
          if (obs.x < 42 || obs.x > g.width - 42) {
            obs.vx *= -1;
          }
        }
      });

      const st = g.stone;

      if (st.state === 'MOVING') {
        st.trail.push({ x: st.x, y: st.y, alpha: 0.65 });
        if (st.trail.length > 10) st.trail.shift();
        st.trail.forEach((t) => (t.alpha *= 0.86));

        st.x += st.vx;
        st.y += st.vy;

        // 長押し急ブレーキ適用
        const currentFriction = g.isBraking ? 0.88 : chap.friction;
        st.vx *= currentFriction;
        st.vy *= currentFriction;
        st.angle += Math.hypot(st.vx, st.vy) * 0.045;

        if (g.isBraking && g.tick % 4 === 0) {
          playSound('brake');
          spawnParticles(st.x, st.y + 14, '#ef4444', 3);
        }

        // ギミック床＆バンパー判定
        g.gimmicks.forEach((gm) => {
          if (gm.type === 'ACCEL') {
            if (Math.abs(st.x - gm.x) < gm.w / 2 && Math.abs(st.y - gm.y) < gm.h / 2) {
              st.vy -= 0.75;
              if (g.tick % 5 === 0) spawnParticles(st.x, st.y, '#38bdf8', 4);
            }
          } else if (gm.type === 'BUMPER') {
            const dx = st.x - gm.x;
            const dy = st.y - gm.y;
            const dist = Math.hypot(dx, dy);
            if (dist < st.r + gm.r && dist > 0) {
              const nx = dx / dist;
              const ny = dy / dist;
              st.x = gm.x + nx * (st.r + gm.r + 2);
              st.y = gm.y + ny * (st.r + gm.r + 2);
              const spd = Math.max(11, Math.hypot(st.vx, st.vy) * 1.15);
              st.vx = nx * spd;
              st.vy = ny * spd;
              g.shake = 10;
              playSound('hit');
              spawnParticles(gm.x, gm.y, '#f43f5e', 14);
            }
          }
        });

        // 壁バウンド
        if (st.x - st.r < 14) {
          st.x = 14 + st.r;
          st.vx = Math.abs(st.vx) * 0.85;
          playSound('hit');
        } else if (st.x + st.r > g.width - 14) {
          st.x = g.width - 14 - st.r;
          st.vx = -Math.abs(st.vx) * 0.85;
          playSound('hit');
        }
        if (st.y - st.r < 56) {
          st.y = 56 + st.r;
          st.vy = Math.abs(st.vy) * 0.75;
        }

        // 障害物衝突判定
        g.obstacles.forEach((obs) => {
          if (obs.blasted) return;
          const dx = obs.x - st.x;
          const dy = obs.y - st.y;
          const dist = Math.hypot(dx, dy);
          const minDist = st.r + obs.r;

          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const impact = Math.max(11, Math.hypot(st.vx, st.vy) * 1.5);

            obs.blasted = true;
            obs.vx = nx * impact * 1.9 + (Math.random() - 0.5) * 6;
            obs.vy = ny * impact * 1.9 - 4;
            obs.vrot = (Math.random() > 0.5 ? 1 : -1) * 0.4;

            if (!g.isFever) {
              st.vx -= nx * 2.2;
              st.vy -= ny * 2.2;
            }

            const remainTargets = g.obstacles.filter((o) => o.isTarget && !o.blasted).length;
            setTargetsLeft(remainTargets);

            g.combo += 1;
            const gainPts = (obs.isBoss ? 500 : obs.isTarget ? 300 : 150) * g.combo * (g.isFever ? 2 : 1);
            g.score += gainPts;
            g.shake = obs.isBoss ? 18 : 11;
            g.hitStop = obs.isBoss ? 4 : 2;
            g.speedLinesTimer = 14;

            if (!g.isFever) {
              g.feverGauge = Math.min(100, g.feverGauge + (obs.isBoss ? 50 : 25));
              if (g.feverGauge >= 100) {
                g.isFever = true;
                playSound('fever');
                addComicEffect(st.x, st.y - 35, '黄金増毛MAX!!', '無敵貫通モード!!', '#facc15');
                spawnParticles(st.x, st.y, '#facc15', 32);
              } else {
                playSound('hit');
              }
            } else {
              playSound('hit');
            }

            const sfxWord = obs.isTarget ? '標的撃破!!' : ONOMATOPOEIA[Math.floor(Math.random() * ONOMATOPOEIA.length)];
            spawnParticles(obs.x, obs.y, g.isFever ? '#facc15' : '#f97316', 18);
            addComicEffect(obs.x, obs.y - 12, sfxWord, `+${gainPts} pt`, obs.isTarget ? '#4ade80' : '#ffffff');

            setScore(g.score);
            setFeverGauge(g.feverGauge);
            setIsFever(g.isFever);
          }
        });

        // 停止判定
        const speed = Math.hypot(st.vx, st.vy);
        if (speed < 0.35 || st.y > g.height + 40) {
          st.vx = 0;
          st.vy = 0;
          st.state = 'STOPPED';
          st.trail = [];
          g.isBraking = false;

          const remainTargets = g.obstacles.filter((o) => o.isTarget && !o.blasted).length;
          const distToHouse = Math.hypot(st.x - g.house.x, st.y - g.house.y);
          const inHouse = distToHouse <= g.house.r + st.r * 0.35;

          if (inHouse && remainTargets === 0) {
            const centerBonus = Math.round(Math.max(300, (1 - distToHouse / g.house.r) * 1500));
            g.score += centerBonus;
            setScore(g.score);
            playSound('clear');
            spawnConfetti(g.house.x, g.house.y, 55);
            addComicEffect(g.house.x, g.house.y, 'ナイスイン!!', `BONUS +${centerBonus}`, '#4ade80');

            setTimeout(() => {
              if (g.mode === 'ENDLESS') {
                const nextW = g.endlessWave + 1;
                setEndlessWave(nextW);
                const nextChap = (nextW - 1) % CHAPTERS.length;
                setChapterIdx(nextChap);
                setupStage(nextChap, ((nextW - 1) % 5) + 1, 'ENDLESS', nextW);
              } else {
                const currentTotal = g.chapterIdx * 5 + g.stageNum;
                if (currentTotal >= unlockedStage && currentTotal < 25) {
                  const nextUnl = currentTotal + 1;
                  setUnlockedStage(nextUnl);
                  localStorage.setItem('hagering_unlocked', String(nextUnl));
                }
                if (g.score > bestScore) {
                  setBestScore(g.score);
                  localStorage.setItem('hagering_best', String(g.score));
                }
                setResultInfo({
                  clear: true,
                  msg: distToHouse < 20 ? 'ど真ん中！神業ツルピカショット！' : '標的撃破＆見事ハウスイン！',
                  bonus: centerBonus,
                });
                setScreen('RESULT');
              }
            }, 1100);
          } else {
            if (inHouse && remainTargets > 0) {
              playSound('reject');
              addComicEffect(g.house.x, g.house.y, 'ノルマ未達成!!', `残り標的 ${remainTargets}体！`, '#f87171');
            }

            const nextShots = g.shotsLeft - 1;
            g.shotsLeft = nextShots;
            setShotsLeft(nextShots);

            if (nextShots > 0) {
              setTimeout(() => {
                g.stone = { x: g.width / 2, y: g.height - 115, vx: 0, vy: 0, r: 23, state: 'READY', angle: 0, trail: [] };
                g.isFever = false;
                setIsFever(false);
              }, 650);
            } else {
              if (g.score > bestScore) {
                setBestScore(g.score);
                localStorage.setItem('hagering_best', String(g.score));
              }
              setTimeout(() => {
                setResultInfo({
                  clear: false,
                  msg: remainTargets > 0 ? '赤枠の「TARGET」を全部倒してからゴールや！' : '動くサークルにピタッと止めろ！',
                  bonus: 0,
                });
                setScreen('RESULT');
              }, 800);
            }
          }
        }
      }

      g.obstacles.forEach((obs) => {
        if (obs.blasted) {
          obs.x += obs.vx;
          obs.y += obs.vy;
          obs.rot += obs.vrot;
        }
      });

      g.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.032;
      });
      g.particles = g.particles.filter((p) => p.life > 0);

      g.confetti.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.22;
        c.rot += c.vrot;
        c.life -= 0.018;
      });
      g.confetti = g.confetti.filter((c) => c.life > 0);

      g.comicEffects.forEach((ce) => {
        ce.y -= 1.0;
        ce.scale = Math.min(1.0, ce.scale + 0.18);
        ce.life -= 0.025;
      });
      g.comicEffects = g.comicEffects.filter((ce) => ce.life > 0);
    };

    const draw = () => {
      const g = gameRef.current;
      const chap = CHAPTERS[g.chapterIdx];
      const w = g.width;
      const h = g.height;

      ctx.save();
      if (g.shake > 0) {
        ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
      }

      drawStageBackground(ctx, chap, w, h, g.tick);
      drawFloorGimmicks(ctx, g.gimmicks, g.tick);

      const allTargetsCleared = g.obstacles.filter((o) => o.isTarget && !o.blasted).length === 0;
      drawHouseTarget(ctx, g.house, allTargetsCleared, g.tick);

      g.obstacles.forEach((obs) => {
        if (obs.x < -80 || obs.x > w + 80 || obs.y < -80 || obs.y > h + 80) return;
        drawObstacleVector(ctx, obs, g.tick);
      });

      const st = g.stone;
      const isPulling = st.state === 'READY' && g.dragStart && g.dragCurrent;
      let pullDx = 0;
      let pullDy = 0;
      if (isPulling) {
        pullDx = g.dragStart.x - g.dragCurrent.x;
        pullDy = g.dragStart.y - g.dragCurrent.y;
        const pullX = st.x - pullDx * 0.45;
        const pullY = st.y - pullDy * 0.45;

        ctx.save();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 8]);
        ctx.lineDashOffset = -g.tick * 1.5;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x + pullDx * 1.7, st.y + pullDy * 1.7);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(st.x - 32, st.y);
        ctx.lineTo(pullX, pullY);
        ctx.lineTo(st.x + 32, st.y);
        ctx.stroke();
      }

      drawHeroStone(ctx, st, isPulling, pullDx, pullDy, g.isFever, g.isBraking, g.tick);

      if (st.state === 'MOVING') {
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▲ 長押しで急ブレーキ！ ／ コスコスで微調整！ ▲', w / 2, h - 26);
      }

      g.particles.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      g.confetti.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = Math.min(1, c.life);
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-5, -3, 10, 6);
        ctx.restore();
      });

      drawComicEffects(ctx, g.speedLinesTimer, g.comicEffects, w, h, g.tick);

      ctx.restore();
    };

    const loop = () => {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [screen]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onPointerDown = (e) => {
    const g = gameRef.current;
    const pos = getPos(e);
    if (g.stone.state === 'READY') {
      g.dragStart = pos;
      g.dragCurrent = pos;
    } else if (g.stone.state === 'MOVING') {
      g.lastBrushPos = pos;
      g.isBraking = true; // タッチ押下中は急ブレーキ発動
    }
  };

  const onPointerMove = (e) => {
    const g = gameRef.current;
    const pos = getPos(e);
    if (g.stone.state === 'READY' && g.dragStart) {
      g.dragCurrent = pos;
    } else if (g.stone.state === 'MOVING' && g.lastBrushPos) {
      const dx = pos.x - g.lastBrushPos.x;
      const dist = Math.hypot(dx, pos.y - g.lastBrushPos.y);
      // 指を動かしてコスコスしている間はブレーキ解除＆控えめな微調整
      if (dist > 8) {
        g.isBraking = false;
        g.stone.vy -= 0.08;
        g.stone.vx += dx * 0.0065; // 横曲げ補正を控えめに調整
        g.lastBrushPos = pos;
        playSound('brush');
        g.particles.push({
          x: g.stone.x + (Math.random() - 0.5) * 26,
          y: g.stone.y + 18,
          vx: (Math.random() - 0.5) * 2.2,
          vy: 2.0,
          life: 0.7,
          color: '#38bdf8',
          size: 3,
        });
      }
    }
  };

  const onPointerUp = () => {
    const g = gameRef.current;
    g.isBraking = false;
    if (g.stone.state === 'READY' && g.dragStart && g.dragCurrent) {
      const dx = g.dragStart.x - g.dragCurrent.x;
      const dy = g.dragStart.y - g.dragCurrent.y;
      const power = Math.hypot(dx, dy);

      if (power > 18) {
        const capped = Math.min(power, 160);
        const angle = Math.atan2(dy, dx);
        const speed = (capped / 160) * 19.5 + 5.5;
        g.stone.vx = Math.cos(angle) * speed;
        g.stone.vy = Math.sin(angle) * speed;
        g.stone.state = 'MOVING';
        playSound('shoot');
      }
    }
    g.dragStart = null;
    g.dragCurrent = null;
    g.lastBrushPos = null;
  };

  const shareToLine = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://hagering.vercel.app';
    const text = `【SUNミニゲーム第3弾】『ハゲリング』で最高 ${bestScore.toLocaleString()}pt 達成！愛らしいハゲオヤジで邪魔者を吹っ飛ばせ！\n${url}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
  };

  const currentChap = CHAPTERS[chapterIdx];
  const currentStageTitle = currentChap.stageTitles[stageNum - 1] || `${chapterIdx + 1}-${stageNum}`;

  if (screen === 'PLAY') {
    return (
      <div style={styles.playWrapper}>
        <div style={styles.hudBar}>
          <div>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 'bold' }}>
              {mode === 'ENDLESS' ? `∞ エンドレス WAVE ${endlessWave}` : currentStageTitle}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b' }}>
              {score.toLocaleString()}pt
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: targetsLeft === 0 ? '#16a34a' : '#dc2626' }}>
              {targetsLeft === 0 ? '✅ ゴール開放!' : `🎯 残り標的: ${targetsLeft}`}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: isFever ? '#d97706' : '#64748b' }}>
              {isFever ? '🔥黄金増毛MAX!' : `増毛: ${feverGauge}%`}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>
              {'🟡'.repeat(shotsLeft)}
            </div>
            <button onClick={() => setScreen('TITLE')} style={styles.quitBtn}>
              戻る
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          style={{ display: 'block', margin: '0 auto', touchAction: 'none' }}
        />
      </div>
    );
  }

  return (
    <div style={styles.pageBg}>
      <div style={styles.handheldBody}>
        <div style={styles.topStatusRow}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>{currentChap.name}</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span>🪣</span>
            <span>🐤</span>
            <span>👑</span>
          </div>
        </div>

        <div style={styles.innerScreenCard}>
          {screen === 'TITLE' && (
            <>
              <div style={styles.titleHeaderRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🏮</span>
                  <h1 style={styles.gameTitle}>ハゲリング</h1>
                </div>
                <span style={styles.stagePill}>{currentStageTitle}</span>
              </div>

              <div style={styles.prologueBox}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                  <HageOyajiSvg mood="normal" size={68} />
                  <StagePreviewSvg chapterId={currentChap.id} />
                </div>
                <div style={styles.prologueTitle}>{currentChap.prologueTitle}</div>
                <p style={styles.prologueText}>{currentChap.prologueText}</p>
              </div>

              <div style={styles.chapterGrid}>
                {CHAPTERS.map((ch, idx) => {
                  const isSelected = idx === chapterIdx;
                  const chapUnlocked = unlockedStage >= idx * 5 + 1;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        if (chapUnlocked) {
                          setChapterIdx(idx);
                          setStageNum(1);
                        }
                      }}
                      style={{
                        ...styles.chapterTabBtn,
                        borderColor: isSelected ? '#d97706' : '#e2e8f0',
                        backgroundColor: isSelected ? '#fffbeb' : '#ffffff',
                        opacity: chapUnlocked ? 1 : 0.45,
                      }}
                    >
                      <ChapterIconSvg chapterId={ch.id} size={26} />
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#334155', marginTop: '2px' }}>
                        {ch.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={styles.stageSelectRow}>
                {[1, 2, 3, 4, 5].map((s) => {
                  const globalIdx = chapterIdx * 5 + s;
                  const unlocked = globalIdx <= unlockedStage;
                  const active = s === stageNum;
                  return (
                    <button
                      key={s}
                      disabled={!unlocked}
                      onClick={() => setStageNum(s)}
                      style={{
                        ...styles.stageNumPill,
                        backgroundColor: !unlocked ? '#e2e8f0' : active ? '#d97706' : '#fef3c7',
                        color: !unlocked ? '#94a3b8' : active ? '#ffffff' : '#92400e',
                      }}
                    >
                      {unlocked ? `${chapterIdx + 1}-${s}` : '🔒'}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => startStoryStage(chapterIdx, stageNum)} style={styles.startOrangeBtn}>
                挑戦をスタートする！ →
              </button>

              <button onClick={shareToLine} style={styles.lineGreenBtn}>
                💬 LINEで友達にシェアする
              </button>

              <div style={styles.utilityRow}>
                <div style={styles.utilPill}>🏆 最高 {bestScore.toLocaleString()}pt</div>
                <button onClick={() => setSoundOn(!soundOn)} style={styles.utilPillBtn}>
                  {soundOn ? '🔊 音ON' : '🔇 音OFF'}
                </button>
                <button onClick={() => setShowGuide(true)} style={styles.utilPillBtn}>
                  📖 遊び方・図鑑
                </button>
              </div>

              <button onClick={startEndless} style={styles.endlessSubBtn}>
                ∞ エンドレス無限滑走モードで遊ぶ
              </button>

              {isDebug && (
                <div style={styles.debugPanel}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#be123c', marginBottom: '6px' }}>
                    🔧 管理者デバッグ（すーさん専用）
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '6px' }}>
                    {[1, 2, 3, 4, 5].map((cNum) => (
                      <button
                        key={cNum}
                        onClick={() => {
                          setChapterIdx(cNum - 1);
                          setStageNum(1);
                          setUnlockedStage(25);
                        }}
                        style={styles.debugChapBtn}
                      >
                        {cNum}章
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setUnlockedStage(25);
                      localStorage.setItem('hagering_unlocked', '25');
                    }}
                    style={styles.debugAllClearBtn}
                  >
                    全章クリア済みにする
                  </button>
                </div>
              )}
            </>
          )}

          {screen === 'RESULT' && (
            <div style={{ textAlign: 'center', padding: '10px 4px' }}>
              <HageOyajiSvg mood={resultInfo.clear ? 'happy' : 'pull'} size={96} />
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: resultInfo.clear ? '#16a34a' : '#dc2626',
                  marginTop: '6px',
                }}
              >
                {resultInfo.clear ? 'ステージ達成！お見事！' : '惜しい！挑戦失敗！'}
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: '6px 0 12px' }}>{resultInfo.msg}</p>

              <div style={styles.resultScoreBox}>
                <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 'bold' }}>今回獲得スコア</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#d97706' }}>
                  {score.toLocaleString()}pt
                </div>
              </div>

              {resultInfo.clear && chapterIdx * 5 + stageNum < 25 && (
                <button
                  onClick={() => {
                    const nextG = chapterIdx * 5 + stageNum + 1;
                    const nextC = Math.floor((nextG - 1) / 5);
                    const nextS = ((nextG - 1) % 5) + 1;
                    startStoryStage(nextC, nextS);
                  }}
                  style={styles.startOrangeBtn}
                >
                  次のステージへ進む！ →
                </button>
              )}

              <button onClick={() => startStoryStage(chapterIdx, stageNum)} style={styles.retryBtn}>
                ↻ もう一度挑戦する
              </button>

              <button onClick={shareToLine} style={styles.lineGreenBtn}>
                💬 LINEで友達にシェアする
              </button>

              <button onClick={() => setScreen('TITLE')} style={styles.backTitleLink}>
                ← トップ画面に戻る
              </button>
            </div>
          )}
        </div>

        <div style={styles.bottomDecoBar}>
          <ChapterIconSvg chapterId={1} size={22} />
          <ChapterIconSvg chapterId={2} size={22} />
          <ChapterIconSvg chapterId={3} size={22} />
          <ChapterIconSvg chapterId={4} size={22} />
          <ChapterIconSvg chapterId={5} size={22} />
        </div>
      </div>

      <div id="ad-banner-slot" style={styles.adBannerBox}>
        <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#64748b' }}>
          SPONSORED LINK / 広告スペース
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
          （ここに無料広告バナーコードを配置できます）
        </div>
      </div>

      <div style={styles.seriesNavCard}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>🎮 SUN ミニゲームシリーズ</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="https://okura-tataki.vercel.app/" target="_blank" rel="noopener noreferrer" style={styles.seriesAnchor}>
            第1弾『オクラたたき』
          </a>
          <a href="https://bin-ball.vercel.app/" target="_blank" rel="noopener noreferrer" style={styles.seriesAnchor}>
            第2弾『びんぼ～る』
          </a>
        </div>
      </div>

      <div style={styles.footerLinks}>
        <button onClick={() => setShowGuide(true)} style={styles.footerTextBtn}>
          遊び方・図鑑
        </button>
        <span>運営者情報・プライバシーポリシー</span>
        <span>© SUN</span>
      </div>

      {showGuide && (
        <div style={styles.modalOverlay} onClick={() => setShowGuide(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: '900', fontSize: '16px', color: '#b45309' }}>📖 遊び方・ハゲオヤジ図鑑</span>
              <button onClick={() => setShowGuide(false)} style={styles.closeModalBtn}>
                ✕
              </button>
            </div>

            <div style={styles.guideSection}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
                ① 赤枠の「TARGET」を先に弾き飛ばせ！
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                ステージ内の赤枠ターゲットをすべて吹っ飛ばすと奥のサークル（ゴール）が開放！反発バンパーや壁反射も使って狙い撃て！
              </p>
            </div>

            <div style={styles.guideSection}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b', marginBottom: '4px' }}>
                ② 長押し急ブレーキ＆コスコス微調整！
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                滑走中に画面を<strong>長押し</strong>すると踏ん張って急ブレーキ！指で軽くこすると軌道微調整もできるで！
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '10px' }}>
              <div style={styles.zukanCard}>
                <HageOyajiSvg mood="normal" size={52} />
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155' }}>通常おやじ</div>
              </div>
              <div style={styles.zukanCard}>
                <HageOyajiSvg mood="pull" size={52} />
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155' }}>踏ん張り顔</div>
              </div>
              <div style={styles.zukanCard}>
                <HageOyajiSvg mood="fever" size={52} />
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#d97706' }}>黄金増毛MAX</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageBg: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#fefce8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 10px 24px',
    overflowY: 'auto',
    touchAction: 'auto',
  },
  handheldBody: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#e2e8f0',
    borderRadius: '26px',
    padding: '12px 12px 10px',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
    border: '2px solid #cbd5e1',
  },
  topStatusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 6px 8px',
  },
  innerScreenCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    border: '3px solid #d97706',
    padding: '12px',
  },
  titleHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  gameTitle: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: '0.5px',
  },
  stagePill: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#b45309',
    backgroundColor: '#fef3c7',
    border: '1.5px solid #f59e0b',
    borderRadius: '999px',
    padding: '3px 10px',
  },
  prologueBox: {
    background: 'linear-gradient(180deg, #e0f2fe 0%, #fef08a 100%)',
    borderRadius: '14px',
    border: '1.5px solid #fcd34d',
    padding: '10px 12px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  prologueTitle: {
    fontSize: '12px',
    fontWeight: '900',
    color: '#b45309',
    marginBottom: '4px',
  },
  prologueText: {
    fontSize: '11px',
    color: '#334155',
    lineHeight: '1.5',
  },
  chapterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '5px',
    marginBottom: '8px',
  },
  chapterTabBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 2px',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
  },
  stageSelectRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '5px',
    marginBottom: '10px',
  },
  stageNumPill: {
    padding: '5px 0',
    borderRadius: '8px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  startOrangeBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '900',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #78350f',
    marginBottom: '8px',
  },
  lineGreenBtn: {
    width: '100%',
    padding: '11px',
    backgroundColor: '#06c755',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '900',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 3px 0 #047857',
    marginBottom: '10px',
  },
  utilityRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '6px',
    marginBottom: '8px',
  },
  utilPill: {
    flex: 1.2,
    backgroundColor: '#fef9c3',
    border: '1.5px solid #facc15',
    borderRadius: '999px',
    padding: '6px 4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#854d0e',
    textAlign: 'center',
  },
  utilPillBtn: {
    flex: 1,
    backgroundColor: '#fef9c3',
    border: '1.5px solid #facc15',
    borderRadius: '999px',
    padding: '6px 4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#854d0e',
    cursor: 'pointer',
  },
  endlessSubBtn: {
    width: '100%',
    padding: '7px',
    backgroundColor: '#eff6ff',
    border: '1.5px solid #93c5fd',
    borderRadius: '10px',
    color: '#1d4ed8',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  debugPanel: {
    marginTop: '10px',
    backgroundColor: '#fff1f2',
    border: '2px solid #fda4af',
    borderRadius: '12px',
    padding: '10px',
  },
  debugChapBtn: {
    padding: '7px 0',
    backgroundColor: '#e11d48',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  debugAllClearBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#b45309',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  bottomDecoBar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: '8px',
  },
  adBannerBox: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    border: '1.5px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '10px',
    textAlign: 'center',
    marginTop: '10px',
  },
  seriesNavCard: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '10px 12px',
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center',
  },
  seriesAnchor: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0d9488',
    textDecoration: 'none',
    backgroundColor: '#f0fdfa',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid #99f6e4',
  },
  footerLinks: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    fontSize: '11px',
    color: '#64748b',
    alignItems: 'center',
  },
  footerTextBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    textDecoration: 'underline',
    fontSize: '11px',
    cursor: 'pointer',
  },
  resultScoreBox: {
    backgroundColor: '#fffbeb',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '10px',
    marginBottom: '12px',
  },
  retryBtn: {
    width: '100%',
    padding: '11px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  backTitleLink: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '4px',
  },
  playWrapper: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#fefce8',
    position: 'relative',
    overflow: 'hidden',
  },
  hudBar: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '420px',
    height: '52px',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 12px',
    zIndex: 10,
    borderBottom: '2px solid #fcd34d',
  },
  quitBtn: {
    padding: '4px 10px',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modalCard: {
    width: '100%',
    maxWidth: '370px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    border: '3px solid #d97706',
    padding: '16px',
  },
  closeModalBtn: {
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  guideSection: {
    backgroundColor: '#fffbeb',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '8px',
    border: '1px solid #fde68a',
  },
  zukanCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '8px 4px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
};
