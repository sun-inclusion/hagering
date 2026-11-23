'use client';

import React, { useState, useEffect, useRef } from 'react';

const CHAPTERS = [
  {
    id: 1,
    name: '第1章：銭湯の洗い場',
    bg: '#1e3a5f',
    floor: '#2b547e',
    line: '#60a5fa',
    obstacles: ['桶', 'アヒル', '石鹸'],
    friction: 0.985,
  },
  {
    id: 2,
    name: '第2章：朝の満員電車',
    bg: '#334155',
    floor: '#475569',
    line: '#94a3b8',
    obstacles: ['カバン', 'つり革', '居眠り客'],
    friction: 0.982,
  },
  {
    id: 3,
    name: '第3章：ブラック企業の廊下',
    bg: '#3f2e3e',
    floor: '#5c3d58',
    line: '#f472b6',
    obstacles: ['督促状', '書類の山', '怒り上司'],
    friction: 0.980,
  },
  {
    id: 4,
    name: '第4章：銀座の高級クラブ',
    bg: '#422006',
    floor: '#713f12',
    line: '#facc15',
    obstacles: ['シャンパン', '札束', '黒服'],
    friction: 0.988,
  },
  {
    id: 5,
    name: '第5章：宇宙ステーション',
    bg: '#090d16',
    floor: '#1e1b4b',
    line: '#a855f7',
    obstacles: ['隕石', '人工衛星', 'UFO'],
    friction: 0.994,
  },
];

export default function HageringGame() {
  const [screen, setScreen] = useState('TITLE'); // TITLE, STAGE_SELECT, PLAY, RESULT
  const [mode, setMode] = useState('STORY'); // STORY, ENDLESS
  const [chapterIdx, setChapterIdx] = useState(0);
  const [stageNum, setStageNum] = useState(1); // 1..5
  const [unlockedStage, setUnlockedStage] = useState(1); // 1..25
  const [isDebug, setIsDebug] = useState(false);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(3);
  const [combo, setCombo] = useState(0);
  const [feverGauge, setFeverGauge] = useState(0);
  const [isFever, setIsFever] = useState(false);
  const [resultInfo, setResultInfo] = useState({ clear: false, msg: '', bonus: 0 });
  const [endlessWave, setEndlessWave] = useState(1);

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // ゲーム物理状態（Canvasループ内で直接参照）
  const gameRef = useRef({
    width: 360,
    height: 640,
    stone: { x: 180, y: 520, vx: 0, vy: 0, r: 22, state: 'READY', angle: 0 },
    house: { x: 180, y: 130, r: 65 },
    obstacles: [],
    particles: [],
    floatingTexts: [],
    dragStart: null,
    dragCurrent: null,
    lastBrushPos: null,
    shake: 0,
    hitStop: 0,
    combo: 0,
    feverGauge: 0,
    isFever: false,
    score: 0,
    shotsLeft: 3,
    stageCleared: false,
    stageFailed: false,
    chapterIdx: 0,
    stageNum: 1,
    mode: 'STORY',
    endlessWave: 1,
  });

  // 初期化（デバッグキー・セーブデータ読込）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('key') === 'sun777hage') {
        setIsDebug(true);
        setUnlockedStage(25);
      } else {
        const saved = localStorage.getItem('hagering_unlocked');
        if (saved) setUnlockedStage(Math.min(25, Math.max(1, parseInt(saved, 10))));
      }
      const savedBest = localStorage.getItem('hagering_best');
      if (savedBest) setBestScore(parseInt(savedBest, 10));
    }
  }, []);

  // Web Audio API 効果音ジェネレーター
  const playSound = (type) => {
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
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320 + Math.random() * 150, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
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
        osc.frequency.setValueAtTime(700 + Math.random() * 300, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
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
    } catch (e) {
      // 音声再生エラーは無視
    }
  };

  // ステージ初期化
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

    g.stone = { x: w / 2, y: h - 110, vx: 0, vy: 0, r: 22, state: 'READY', angle: 0 };
    g.house = {
      x: w / 2 + (gameMode === 'ENDLESS' ? (Math.random() - 0.5) * 100 : (sNum % 2 === 0 ? 45 : sNum === 3 ? -45 : 0)),
      y: 135,
      r: Math.max(46, 68 - sNum * 3),
    };

    const obsList = [];
    const chap = CHAPTERS[cIdx];
    const count = gameMode === 'ENDLESS' ? Math.min(18, 5 + wave * 2) : 4 + cIdx * 2 + sNum;

    for (let i = 0; i < count; i++) {
      const label = chap.obstacles[i % chap.obstacles.length];
      const ox = 45 + Math.random() * (w - 90);
      const oy = 210 + Math.random() * (h - 370);
      const isBoss = (i === 0 && (sNum === 5 || wave % 3 === 0));
      obsList.push({
        id: i,
        x: ox,
        y: oy,
        vx: 0,
        vy: 0,
        r: isBoss ? 26 : 18,
        label: isBoss ? 'カツラ大王' : label,
        isBoss,
        blasted: false,
        rot: 0,
        vrot: 0,
      });
    }

    g.obstacles = obsList;
    g.particles = [];
    g.floatingTexts = [];
    g.dragStart = null;
    g.dragCurrent = null;
    g.shake = 0;
    g.hitStop = 0;
    g.stageCleared = false;
    g.stageFailed = false;

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
    setCombo(g.combo);
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

  // メインゲームループ
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
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnParticles = (x, y, color, count = 14) => {
      const g = gameRef.current;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 7;
        g.particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1.0,
          color,
          size: 3 + Math.random() * 5,
        });
      }
    };

    const addFloatingText = (x, y, text, color = '#fde047') => {
      gameRef.current.floatingTexts.push({ x, y, text, color, life: 1.0 });
    };

    const update = () => {
      const g = gameRef.current;
      const chap = CHAPTERS[g.chapterIdx];

      if (g.hitStop > 0) {
        g.hitStop -= 1;
        return;
      }

      if (g.shake > 0) {
        g.shake *= 0.85;
        if (g.shake < 0.5) g.shake = 0;
      }

      const st = g.stone;

      // ストーン滑走中の物理演算
      if (st.state === 'MOVING') {
        st.x += st.vx;
        st.y += st.vy;
        st.vx *= chap.friction;
        st.vy *= chap.friction;
        st.angle += Math.hypot(st.vx, st.vy) * 0.04;

        // 左右壁バウンド
        if (st.x - st.r < 12) {
          st.x = 12 + st.r;
          st.vx = Math.abs(st.vx) * 0.85;
          playSound('hit');
        } else if (st.x + st.r > g.width - 12) {
          st.x = g.width - 12 - st.r;
          st.vx = -Math.abs(st.vx) * 0.85;
          playSound('hit');
        }

        // 上壁バウンド
        if (st.y - st.r < 55) {
          st.y = 55 + st.r;
          st.vy = Math.abs(st.vy) * 0.7;
        }

        // 障害物との衝突判定（爽快吹っ飛ばし）
        g.obstacles.forEach((obs) => {
          if (obs.blasted) return;
          const dx = obs.x - st.x;
          const dy = obs.y - st.y;
          const dist = Math.hypot(dx, dy);
          const minDist = st.r + obs.r;

          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const impact = Math.max(10, Math.hypot(st.vx, st.vy) * 1.45);

            obs.blasted = true;
            obs.vx = nx * impact * 1.8 + (Math.random() - 0.5) * 6;
            obs.vy = ny * impact * 1.8 - 4;
            obs.vrot = (Math.random() > 0.5 ? 1 : -1) * 0.35;

            // フィーバー中は減速せず貫通！通常時は少しだけ跳ね返り
            if (!g.isFever) {
              st.vx -= nx * 2.2;
              st.vy -= ny * 2.2;
            }

            g.combo += 1;
            const gainPts = (obs.isBoss ? 500 : 150) * g.combo * (g.isFever ? 2 : 1);
            g.score += gainPts;
            g.shake = obs.isBoss ? 16 : 9;
            g.hitStop = obs.isBoss ? 4 : 2;

            if (!g.isFever) {
              g.feverGauge = Math.min(100, g.feverGauge + (obs.isBoss ? 45 : 22));
              if (g.feverGauge >= 100) {
                g.isFever = true;
                playSound('fever');
                addFloatingText(st.x, st.y - 30, '黄金の増毛フィーバー!!', '#facc15');
                spawnParticles(st.x, st.y, '#facc15', 30);
              } else {
                playSound('hit');
              }
            } else {
              playSound('hit');
            }

            spawnParticles(obs.x, obs.y, g.isFever ? '#facc15' : '#38bdf8', 16);
            addFloatingText(obs.x, obs.y - 10, `スカッ! +${gainPts}`, g.isFever ? '#fde047' : '#ffffff');

            setScore(g.score);
            setCombo(g.combo);
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

          const distToHouse = Math.hypot(st.x - g.house.x, st.y - g.house.y);
          const inHouse = distToHouse <= g.house.r + st.r * 0.4;

          if (inHouse) {
            // ハウスインでクリア！
            const centerBonus = Math.round(Math.max(300, (1 - distToHouse / g.house.r) * 1500));
            g.score += centerBonus;
            setScore(g.score);
            playSound('clear');
            spawnParticles(g.house.x, g.house.y, '#facc15', 35);
            addFloatingText(g.house.x, g.house.y, `ナイスイン! +${centerBonus}`, '#4ade80');

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
                  msg: distToHouse < 22 ? 'ど真ん中！神業ツルピカショット！' : '見事ハウスイン！爽快クリア！',
                  bonus: centerBonus,
                });
                setScreen('RESULT');
              }
            }, 950);
          } else {
            // 残弾チェック
            const nextShots = g.shotsLeft - 1;
            g.shotsLeft = nextShots;
            setShotsLeft(nextShots);

            if (nextShots > 0) {
              setTimeout(() => {
                g.stone = { x: g.width / 2, y: g.height - 110, vx: 0, vy: 0, r: 22, state: 'READY', angle: 0 };
                g.isFever = false;
                setIsFever(false);
              }, 550);
            } else {
              if (g.score > bestScore) {
                setBestScore(g.score);
                localStorage.setItem('hagering_best', String(g.score));
              }
              setTimeout(() => {
                setResultInfo({
                  clear: false,
                  msg: 'ハウスに届かず！もう一丁磨いて挑戦や！',
                  bonus: 0,
                });
                setScreen('RESULT');
              }, 700);
            }
          }
        }
      }

      // 吹っ飛んだ障害物のアニメーション
      g.obstacles.forEach((obs) => {
        if (obs.blasted) {
          obs.x += obs.vx;
          obs.y += obs.vy;
          obs.rot += obs.vrot;
        }
      });

      // パーティクル更新
      g.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
      });
      g.particles = g.particles.filter((p) => p.life > 0);

      // フローティングテキスト更新
      g.floatingTexts.forEach((ft) => {
        ft.y -= 1.2;
        ft.life -= 0.025;
      });
      g.floatingTexts = g.floatingTexts.filter((ft) => ft.life > 0);
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

      // 背景＆レーン描画
      ctx.fillStyle = chap.bg;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = chap.floor;
      ctx.fillRect(14, 55, w - 28, h - 70);

      // レーン装飾ライン
      ctx.strokeStyle = chap.line;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(w / 2, 55);
      ctx.lineTo(w / 2, h - 15);
      ctx.moveTo(14, h - 110);
      ctx.lineTo(w - 14, h - 110);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // 的（ハウス）描画
      const hx = g.house.x;
      const hy = g.house.y;
      const hr = g.house.r;
      const rings = [
        { r: hr, color: '#ef4444' },
        { r: hr * 0.68, color: '#ffffff' },
        { r: hr * 0.36, color: '#3b82f6' },
        { r: hr * 0.14, color: '#facc15' },
      ];
      rings.forEach((rg) => {
        ctx.beginPath();
        ctx.arc(hx, hy, rg.r, 0, Math.PI * 2);
        ctx.fillStyle = rg.color;
        ctx.fill();
      });

      // 障害物描画
      g.obstacles.forEach((obs) => {
        if (obs.x < -80 || obs.x > w + 80 || obs.y < -80 || obs.y > h + 80) return;
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rot);

        ctx.beginPath();
        ctx.arc(0, 0, obs.r, 0, Math.PI * 2);
        ctx.fillStyle = obs.isBoss ? '#dc2626' : '#f59e0b';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#fef08a';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${obs.isBoss ? 11 : 10}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obs.label.slice(0, 4), 0, 0);
        ctx.restore();
      });

      // 引っ張りガイドライン
      const st = g.stone;
      if (st.state === 'READY' && g.dragStart && g.dragCurrent) {
        const dx = g.dragStart.x - g.dragCurrent.x;
        const dy = g.dragStart.y - g.dragCurrent.y;
        ctx.save();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x + dx * 1.8, st.y + dy * 1.8);
        ctx.stroke();
        ctx.restore();
      }

      // 主役ストーン（ツヤツヤおやじ頭ベクター風イラスト）描画
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(st.angle);

      // フィーバーオーラ
      if (g.isFever) {
        ctx.beginPath();
        ctx.arc(0, 0, st.r + 9 + Math.sin(Date.now() * 0.02) * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
        ctx.fill();
      }

      // 頭本体
      const grad = ctx.createRadialGradient(-6, -8, 3, 0, 0, st.r);
      grad.addColorStop(0, g.isFever ? '#fef08a' : '#ffedd5');
      grad.addColorStop(0.6, g.isFever ? '#eab308' : '#fdba74');
      grad.addColorStop(1, g.isFever ? '#ca8a04' : '#ea580c');

      ctx.beginPath();
      ctx.arc(0, 0, st.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#7c2d12';
      ctx.stroke();

      // 側頭部のサザエさん風3本毛
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.moveTo(side * (st.r - 2), -4);
        ctx.lineTo(side * (st.r + 5), -7);
        ctx.moveTo(side * (st.r - 1), 0);
        ctx.lineTo(side * (st.r + 6), 0);
        ctx.moveTo(side * (st.r - 2), 4);
        ctx.lineTo(side * (st.r + 5), 7);
        ctx.stroke();
      });

      // ピカッ！の天使の輪（ハイライト）
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-7, -8, 7, 3.5, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // 気合いの眉毛＆目
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-9, 2);
      ctx.lineTo(-3, 5);
      ctx.moveTo(9, 2);
      ctx.lineTo(3, 5);
      ctx.stroke();

      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(-6, 7, 2, 0, Math.PI * 2);
      ctx.arc(6, 7, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 滑走中のブラッシングガイド表示
      if (st.state === 'MOVING') {
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▲ 画面をコスコスこすって加速＆軌道修正！ ▲', w / 2, h - 32);
      }

      // パーティクル描画
      g.particles.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // フローティングテキスト描画
      g.floatingTexts.forEach((ft) => {
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
      });
      ctx.globalAlpha = 1.0;

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

  // タッチ・マウス操作ハンドラ
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
    }
  };

  const onPointerMove = (e) => {
    const g = gameRef.current;
    const pos = getPos(e);
    if (g.stone.state === 'READY' && g.dragStart) {
      g.dragCurrent = pos;
    } else if (g.stone.state === 'MOVING' && g.lastBrushPos) {
      // カーリングのブラシ効果（こすると加速＆左右に少し曲がる）
      const dx = pos.x - g.lastBrushPos.x;
      const dist = Math.hypot(dx, pos.y - g.lastBrushPos.y);
      if (dist > 6) {
        g.stone.vy -= 0.16;
        g.stone.vx += dx * 0.015;
        g.lastBrushPos = pos;
        playSound('brush');
        g.particles.push({
          x: g.stone.x + (Math.random() - 0.5) * 24,
          y: g.stone.y + 18,
          vx: (Math.random() - 0.5) * 2,
          vy: 2,
          life: 0.7,
          color: '#bae6fd',
          size: 3,
        });
      }
    }
  };

  const onPointerUp = () => {
    const g = gameRef.current;
    if (g.stone.state === 'READY' && g.dragStart && g.dragCurrent) {
      const dx = g.dragStart.x - g.dragCurrent.x;
      const dy = g.dragStart.y - g.dragCurrent.y;
      const power = Math.hypot(dx, dy);

      if (power > 18) {
        const capped = Math.min(power, 160);
        const angle = Math.atan2(dy, dx);
        const speed = (capped / 160) * 19 + 5;
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

  // LINEシェア処理
  const shareToLine = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://hagering.vercel.app';
    const text = `【SUNミニゲーム第3弾】『ハゲリング』でスコア ${score.toLocaleString()} 点達成！ツルピカの頭で邪魔者を吹っ飛ばせ！\n${url}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
  };

  // プレイ画面（スマホ1画面フィットCanvas）
  if (screen === 'PLAY') {
    const chap = CHAPTERS[chapterIdx];
    return (
      <div style={styles.playWrapper}>
        {/* 上部ステータスバー */}
        <div style={styles.hudBar}>
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd' }}>
              {mode === 'ENDLESS' ? `エンドレス WAVE ${endlessWave}` : `${chap.name} - ${stageNum}`}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>SCORE: {score.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px' }}>残弾: {'🟡'.repeat(shotsLeft)}</div>
            <div style={{ fontSize: '11px', color: isFever ? '#facc15' : '#cbd5e1' }}>
              {isFever ? '🔥黄金増毛MAX!' : `増毛ゲージ: ${feverGauge}%`}
            </div>
          </div>
          <button onClick={() => setScreen('TITLE')} style={styles.quitBtn}>
            終了
          </button>
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

  // タイトル・ステージ選択・リザルト画面（携帯ゲーム機風ベゼルUI）
  return (
    <div style={styles.outerContainer}>
      <div style={styles.handheldBezel}>
        {/* 上部スピーカー穴風装飾 */}
        <div style={styles.bezelTop}>
          <span style={styles.powerLed} />
          <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#94a3b8' }}>
            SUN BOY POCKET - SERIES 03
          </span>
        </div>

        {/* 液晶スクリーンエリア */}
        <div style={styles.lcdScreen}>
          {screen === 'TITLE' && (
            <div style={styles.centerBox}>
              <div style={styles.badge}>SUNミニゲームシリーズ 第3弾</div>
              <h1 style={styles.titleLogo}>ハゲリング</h1>
              <p style={styles.subCopy}>〜磨け！滑れ！邪魔者を吹っ飛ばせ！〜</p>

              {/* アイコンイラスト風バッジ */}
              <div style={styles.heroIcon}>👴✨🥌</div>

              <div style={{ fontSize: '12px', color: '#fde047', marginBottom: '12px' }}>
                HIGH SCORE: {bestScore.toLocaleString()}
              </div>

              <button onClick={() => setScreen('STAGE_SELECT')} style={styles.primaryBtn}>
                ▶ ストーリーモード（全25面）
              </button>
              <button onClick={startEndless} style={styles.secondaryBtn}>
                ∞ エンドレス無限滑走
              </button>

              {isDebug && (
                <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '6px' }}>
                  🔧 管理者デバッグモード有効（全章開放済）
                </div>
              )}
            </div>
          )}

          {screen === 'STAGE_SELECT' && (
            <div style={styles.selectBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#facc15' }}>ステージ選択</span>
                <button onClick={() => setScreen('TITLE')} style={styles.smallBackBtn}>
                  戻る
                </button>
              </div>

              <div style={styles.chapterScroll}>
                {CHAPTERS.map((ch, cIdx) => (
                  <div key={ch.id} style={styles.chapterCard}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#e2e8f0' }}>
                      {ch.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((sNum) => {
                        const globalStage = cIdx * 5 + sNum;
                        const locked = globalStage > unlockedStage;
                        return (
                          <button
                            key={sNum}
                            disabled={locked}
                            onClick={() => startStoryStage(cIdx, sNum)}
                            style={{
                              ...styles.stageBtn,
                              backgroundColor: locked ? '#334155' : sNum === 5 ? '#dc2626' : '#2563eb',
                              opacity: locked ? 0.5 : 1,
                            }}
                          >
                            {locked ? '🔒' : sNum === 5 ? 'BOSS' : sNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === 'RESULT' && (
            <div style={styles.centerBox}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: resultInfo.clear ? '#4ade80' : '#f87171' }}>
                {resultInfo.clear ? 'STAGE CLEAR!!' : 'FAILED...'}
              </div>
              <p style={{ fontSize: '13px', margin: '8px 0', color: '#e2e8f0' }}>{resultInfo.msg}</p>

              <div style={styles.scoreCard}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>TOTAL SCORE</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#facc15' }}>
                  {score.toLocaleString()}
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
                  style={styles.primaryBtn}
                >
                  ▶ 次のステージへ進む
                </button>
              )}

              <button onClick={() => startStoryStage(chapterIdx, stageNum)} style={styles.secondaryBtn}>
                ↻ もう一度挑戦する
              </button>

              <button onClick={shareToLine} style={styles.lineBtn}>
                💬 LINEでスコアを自慢する
              </button>

              <button onClick={() => setScreen('TITLE')} style={styles.smallBackBtn}>
                タイトルへ戻る
              </button>
            </div>
          )}
        </div>

        {/* 広告スペース枠 */}
        <div id="ad-banner-slot" style={styles.adSlot}>
          <span>AD SPACE（広告バナー枠）</span>
        </div>

        {/* シリーズ相互リンク導線 */}
        <div style={styles.crossLinkBox}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>
            ▼ SUNミニゲームシリーズ好評配信中 ▼
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            <a href="https://okura-tataki.vercel.app/" target="_blank" rel="noopener noreferrer" style={styles.seriesLink}>
              ① オクラたたき
            </a>
            <a href="https://bin-ball.vercel.app/" target="_blank" rel="noopener noreferrer" style={styles.seriesLink}>
              ② びんぼ～る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  },
  handheldBezel: {
    width: '100%',
    maxWidth: '410px',
    backgroundColor: '#1e293b',
    borderRadius: '24px',
    border: '4px solid #334155',
    padding: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bezelTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '4px',
  },
  powerLed: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
  },
  lcdScreen: {
    backgroundColor: '#090d16',
    borderRadius: '12px',
    border: '3px solid #020617',
    padding: '14px',
    minHeight: '390px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  centerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '3px 10px',
    borderRadius: '999px',
    marginBottom: '6px',
  },
  titleLogo: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#facc15',
    textShadow: '0 3px 0 #b45309',
    letterSpacing: '2px',
  },
  subCopy: {
    fontSize: '12px',
    color: '#cbd5e1',
    marginBottom: '12px',
  },
  heroIcon: {
    fontSize: '42px',
    margin: '6px 0 12px',
  },
  primaryBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#eab308',
    color: '#0f172a',
    fontWeight: '900',
    fontSize: '14px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '8px',
    boxShadow: '0 4px 0 #a16207',
  },
  secondaryBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '13px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  lineBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#06c755',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '13px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  smallBackBtn: {
    padding: '6px 14px',
    backgroundColor: '#334155',
    color: '#e2e8f0',
    fontSize: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  selectBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '360px',
  },
  chapterScroll: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingRight: '2px',
  },
  chapterCard: {
    backgroundColor: '#1e293b',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  stageBtn: {
    padding: '8px 0',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  scoreCard: {
    backgroundColor: '#1e293b',
    padding: '10px 24px',
    borderRadius: '10px',
    margin: '10px 0 14px',
    border: '1px solid #334155',
  },
  adSlot: {
    height: '52px',
    backgroundColor: '#0f172a',
    border: '1px dashed #475569',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '11px',
    color: '#64748b',
  },
  crossLinkBox: {
    textAlign: 'center',
    backgroundColor: '#0f172a',
    padding: '8px',
    borderRadius: '10px',
  },
  seriesLink: {
    flex: 1,
    padding: '6px 8px',
    backgroundColor: '#1e293b',
    color: '#38bdf8',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: '1px solid #334155',
  },
  playWrapper: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#090d16',
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
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 12px',
    zIndex: 10,
    borderBottom: '1px solid #334155',
  },
  quitBtn: {
    padding: '5px 10px',
    backgroundColor: '#475569',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
};
