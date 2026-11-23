// app/graphics.js
// SUNミニゲームシリーズ第3弾『ハゲリング』高精細ベクターSVG＆Canvas描画モジュール

import React from 'react';

// 愛らしいハゲオヤジ（SUNおやじ）SVGマスコット（表情: normal / pull / fever / happy）
export function HageOyajiSvg({ mood = 'normal', size = 84 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="oyajiSkin" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="55%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fb923c" />
        </radialGradient>
        <radialGradient id="feverAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {mood === 'fever' && <circle cx="60" cy="62" r="54" fill="url(#feverAura)" />}

      {/* 黄金増毛時の逆立ち黄金髪 */}
      {mood === 'fever' && (
        <g fill="#facc15" stroke="#b45309" strokeWidth="2" strokeLinejoin="round">
          <polygon points="36,34 26,12 46,26" />
          <polygon points="48,26 48,4 60,24" />
          <polygon points="60,24 72,4 72,26" />
          <polygon points="74,26 94,12 84,34" />
        </g>
      )}

      {/* 愛らしい耳 */}
      <circle cx="24" cy="66" r="9" fill="#fdba74" stroke="#7c2d12" strokeWidth="2.5" />
      <circle cx="96" cy="66" r="9" fill="#fdba74" stroke="#7c2d12" strokeWidth="2.5" />

      {/* 側頭部のフワッと3本毛 */}
      <g stroke="#334155" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M25,54 Q14,48 11,53" />
        <path d="M24,60 Q12,58 10,62" />
        <path d="M25,66 Q14,68 12,72" />
        <path d="M95,54 Q106,48 109,53" />
        <path d="M96,60 Q108,58 110,62" />
        <path d="M95,66 Q106,68 108,72" />
      </g>

      {/* ツヤツヤ丸顔本体 */}
      <ellipse
        cx="60"
        cy="63"
        rx="36"
        ry="39"
        fill={mood === 'fever' ? '#fef08a' : 'url(#oyajiSkin)'}
        stroke="#7c2d12"
        strokeWidth="3"
      />

      {/* 頭頂部の天使の輪ハイライト＆キラキラ */}
      <ellipse cx="47" cy="40" rx="13" ry="6" transform="rotate(-22 47 40)" fill="#ffffff" opacity="0.92" />
      <circle cx="64" cy="34" r="3" fill="#ffffff" opacity="0.85" />
      <path d="M84,22 L87,29 L94,32 L87,35 L84,42 L81,35 L74,32 L81,29 Z" fill="#facc15" stroke="#d97706" strokeWidth="1" />

      {/* ほっぺたの赤み */}
      <ellipse cx="38" cy="73" rx="6.5" ry="4" fill="#fca5a5" opacity="0.7" />
      <ellipse cx="82" cy="73" rx="6.5" ry="4" fill="#fca5a5" opacity="0.7" />

      {/* 表情パーツ */}
      {mood === 'pull' ? (
        <g stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" fill="none">
          {/* 踏ん張り＞＜目 */}
          <path d="M38,57 L48,62 L38,67" />
          <path d="M82,57 L72,62 L82,67" />
          {/* 食いしばり口 */}
          <rect x="49" y="79" width="22" height="8" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />
          <line x1="56" y1="79" x2="56" y2="87" strokeWidth="1.8" />
          <line x1="64" y1="79" x2="64" y2="87" strokeWidth="1.8" />
        </g>
      ) : mood === 'happy' ? (
        <g stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" fill="none">
          {/* ニッコリ笑い目 */}
          <path d="M38,63 Q44,55 50,63" />
          <path d="M70,63 Q76,55 82,63" />
          {/* 大笑い口 */}
          <path d="M47,77 Q60,93 73,77 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="2.2" />
        </g>
      ) : (
        <g>
          {/* 愛らしいタレ眉＆クリクリ目 */}
          <path d="M36,54 Q43,50 50,55" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M84,54 Q77,50 70,55" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="44" cy="63" r="4.2" fill="#1e293b" />
          <circle cx="76" cy="63" r="4.2" fill="#1e293b" />
          <circle cx="45.3" cy="61.5" r="1.5" fill="#ffffff" />
          <circle cx="77.3" cy="61.5" r="1.5" fill="#ffffff" />
          {/* ニッコリ口 */}
          <path d="M51,80 Q60,88 69,80" stroke="#1e293b" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* 愛嬌のある団子鼻＆ちょびヒゲ */}
      <ellipse cx="60" cy="69" rx="5" ry="3.5" fill="#fb923c" stroke="#7c2d12" strokeWidth="1.8" />
      <path d="M53,75 L67,75" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

// 全5章アイコンSVG（びんぼ～るの章タブ準拠）
export function ChapterIconSvg({ chapterId, size = 28 }) {
  if (chapterId === 1) {
    // 1.銭湯（ケロリン桶＆アヒル）
    return (
      <svg width={size} height={size} viewBox="0 0 36 36">
        <ellipse cx="18" cy="24" rx="14" ry="8" fill="#facc15" stroke="#854d0e" strokeWidth="2" />
        <ellipse cx="18" cy="22" rx="11" ry="5" fill="#fef9c3" />
        <circle cx="19" cy="14" r="6" fill="#fde047" stroke="#854d0e" strokeWidth="1.8" />
        <ellipse cx="25" cy="14" rx="3.5" ry="2" fill="#f97316" />
        <circle cx="20" cy="12.5" r="1.2" fill="#0f172a" />
      </svg>
    );
  }
  if (chapterId === 2) {
    // 2.満員電車
    return (
      <svg width={size} height={size} viewBox="0 0 36 36">
        <rect x="6" y="5" width="24" height="25" rx="5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
        <rect x="9" y="10" width="8" height="8" rx="1.5" fill="#e0f2fe" />
        <rect x="19" y="10" width="8" height="8" rx="1.5" fill="#e0f2fe" />
        <circle cx="11" cy="25" r="2" fill="#facc15" />
        <circle cx="25" cy="25" r="2" fill="#facc15" />
      </svg>
    );
  }
  if (chapterId === 3) {
    // 3.ブラック企業（ブリーフケース＆怒り）
    return (
      <svg width={size} height={size} viewBox="0 0 36 36">
        <rect x="5" y="11" width="26" height="19" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        <path d="M13,11 V7 H23 V11" fill="none" stroke="#451a03" strokeWidth="2.5" />
        <rect x="15" y="18" width="6" height="4" fill="#facc15" />
      </svg>
    );
  }
  if (chapterId === 4) {
    // 4.銀座クラブ（王冠＆シャンパン）
    return (
      <svg width={size} height={size} viewBox="0 0 36 36">
        <polygon points="5,27 8,11 14,19 18,8 22,19 28,11 31,27" fill="#facc15" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="18" cy="21" r="2.2" fill="#ef4444" />
      </svg>
    );
  }
  // 5.宇宙（UFO）
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <path d="M11,17 A7,7 0 0,1 25,17" fill="#67e8f9" stroke="#0e7490" strokeWidth="1.8" />
      <ellipse cx="18" cy="19" rx="14" ry="5.5" fill="#a855f7" stroke="#581c87" strokeWidth="2" />
      <circle cx="11" cy="19" r="1.5" fill="#facc15" />
      <circle cx="18" cy="20" r="1.5" fill="#facc15" />
      <circle cx="25" cy="19" r="1.5" fill="#facc15" />
    </svg>
  );
}

// タイトル画面プロローグ枠内のミニステージプレビューSVG
export function StagePreviewSvg({ chapterId }) {
  return (
    <svg width="160" height="82" viewBox="0 0 160 82" style={{ display: 'block', margin: '0 auto 6px' }}>
      {/* カーリングレーン枠（びんぼ～るの障子枠風） */}
      <rect x="8" y="6" width="144" height="70" rx="8" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
      <line x1="8" y1="29" x2="152" y2="29" stroke="#fed7aa" strokeWidth="1.5" />
      <line x1="8" y1="53" x2="152" y2="53" stroke="#fed7aa" strokeWidth="1.5" />
      <line x1="56" y1="6" x2="56" y2="76" stroke="#fed7aa" strokeWidth="1.5" />
      <line x1="104" y1="6" x2="104" y2="76" stroke="#fed7aa" strokeWidth="1.5" />

      {/* 右側の的（ハウス） */}
      <circle cx="128" cy="41" r="20" fill="#ef4444" />
      <circle cx="128" cy="41" r="13" fill="#ffffff" />
      <circle cx="128" cy="41" r="7" fill="#3b82f6" />
      <circle cx="128" cy="41" r="3" fill="#facc15" />

      {/* 中央の邪魔者 */}
      <g transform="translate(80, 41)">
        {chapterId === 1 && (
          <>
            <circle cx="0" cy="2" r="11" fill="#facc15" stroke="#854d0e" strokeWidth="1.8" />
            <ellipse cx="9" cy="1" rx="4" ry="2.2" fill="#f97316" />
          </>
        )}
        {chapterId === 2 && (
          <>
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#92400e" stroke="#451a03" strokeWidth="1.8" />
            <rect x="-3" y="-2" width="6" height="4" fill="#facc15" />
          </>
        )}
        {chapterId === 3 && (
          <>
            <circle cx="0" cy="0" r="11" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.8" />
            <path d="M-5,-3 L-1,0 M5,-3 L1,0" stroke="#0f172a" strokeWidth="1.8" />
          </>
        )}
        {chapterId === 4 && (
          <>
            <rect x="-11" y="-8" width="22" height="16" fill="#dcfce7" stroke="#15803d" strokeWidth="1.8" />
            <rect x="-3" y="-8" width="6" height="16" fill="#facc15" />
          </>
        )}
        {chapterId === 5 && (
          <>
            <ellipse cx="0" cy="2" rx="13" ry="6" fill="#a855f7" stroke="#581c87" strokeWidth="1.8" />
            <path d="M-6,0 A6,6 0 0,1 6,0" fill="#67e8f9" />
          </>
        )}
      </g>

      {/* 左側から突撃する愛らしいハゲオヤジ */}
      <g transform="translate(32, 41)">
        <path d="M-12,-4 L-18,-7 M-12,0 L-19,0 M-12,4 L-18,7" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="0" cy="0" r="13" fill="#fdba74" stroke="#7c2d12" strokeWidth="2" />
        <ellipse cx="-4" cy="-5" rx="4.5" ry="2.2" transform="rotate(-20 -4 -5)" fill="#ffffff" />
        <circle cx="3" cy="-2" r="1.8" fill="#1e293b" />
        <circle cx="8" cy="-2" r="1.8" fill="#1e293b" />
        <path d="M2,4 Q5.5,7 9,4" stroke="#1e293b" strokeWidth="1.6" fill="none" />
      </g>
    </svg>
  );
}

// ==========================================
// プレイ画面Canvas用：明るいポップ調ベクター描画
// ==========================================

export function drawStageBackground(ctx, chap, w, h, tick) {
  // 明るいクリーム〜パステル空色グラデーション背景
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, chap.outerBg);
  bgGrad.addColorStop(1, '#fffbeb');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // レーン床（明るいカード枠デザイン）
  ctx.save();
  ctx.fillStyle = chap.floor;
  ctx.beginPath();
  ctx.roundRect(14, 56, w - 28, h - 70, 16);
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = chap.border;
  ctx.stroke();
  ctx.clip();

  // 明るいタイル・模様
  ctx.strokeStyle = chap.gridColor;
  ctx.lineWidth = 1.5;
  const step = 40;
  for (let gx = 14; gx < w; gx += step) {
    ctx.beginPath();
    ctx.moveTo(gx, 56);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 56; gy < h; gy += step) {
    ctx.beginPath();
    ctx.moveTo(14, gy);
    ctx.lineTo(w - 14, gy);
    ctx.stroke();
  }

  // センターライン＆発射ライン
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(w / 2, 56);
  ctx.lineTo(w / 2, h - 14);
  ctx.moveTo(14, h - 115);
  ctx.lineTo(w - 14, h - 115);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

export function drawHouseTarget(ctx, house, tick) {
  const { x, y, r } = house;
  const pulse = Math.sin(tick * 0.08) * 2.2;
  const baseR = Math.max(12, r + pulse);

  ctx.save();
  const rings = [
    { rad: baseR, color: '#ef4444', stroke: '#991b1b' },
    { rad: baseR * 0.68, color: '#ffffff', stroke: '#cbd5e1' },
    { rad: baseR * 0.38, color: '#3b82f6', stroke: '#1d4ed8' },
    { rad: baseR * 0.16, color: '#facc15', stroke: '#b45309' },
  ];

  rings.forEach((rg) => {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(4, rg.rad), 0, Math.PI * 2);
    ctx.fillStyle = rg.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = rg.stroke;
    ctx.stroke();
  });

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 3.5;
  ctx.strokeText('GOAL!', x, y - baseR - 6);
  ctx.fillText('GOAL!', x, y - baseR - 6);
  ctx.restore();
}

export function drawObstacleVector(ctx, obs, tick) {
  const bob = obs.blasted ? 0 : Math.sin(tick * 0.09 + obs.phase) * 2.5;
  const scaleX = obs.blasted ? 1.16 : 1 + Math.sin(tick * 0.1 + obs.phase) * 0.04;
  const scaleY = obs.blasted ? 0.84 : 1 - Math.sin(tick * 0.1 + obs.phase) * 0.04;

  ctx.save();
  ctx.translate(obs.x, obs.y + bob);

  if (!obs.blasted) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, obs.r * 0.85, obs.r * 0.85, obs.r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.rotate(obs.rot);
  ctx.scale(scaleX, scaleY);

  switch (obs.kind) {
    case 'WIG_KING': {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(0, 2, 26, Math.PI, 0);
      ctx.lineTo(29, 13);
      ctx.quadraticCurveTo(0, 7, -29, 13);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-14, -18);
      ctx.lineTo(-18, -32);
      ctx.lineTo(-6, -24);
      ctx.lineTo(0, -36);
      ctx.lineTo(6, -24);
      ctx.lineTo(18, -32);
      ctx.lineTo(14, -18);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-8, 2, 4, 0, Math.PI * 2);
      ctx.arc(8, 2, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'DUCK': {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(-1, 5, 17, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#854d0e';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(6, -8, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(16, -7, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(9, -10, 2.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'BUCKET': {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(0, 2, 19, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#854d0e';
      ctx.stroke();

      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.ellipse(0, -2, 14, 9.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.font = '900 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ケロ', 0, 1);
      break;
    }
    case 'SOAP': {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.roundRect(-16, -9, 32, 19, 8);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#9d174d';
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-11, -11, 5, 0, Math.PI * 2);
      ctx.arc(-3, -13, 4, 0, Math.PI * 2);
      ctx.arc(12, 9, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      break;
    }
    case 'BAG': {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 23, 5);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#451a03';
      ctx.stroke();
      ctx.strokeRect(-7, -17, 14, 7);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, -1, 8, 6);
      break;
    }
    case 'STRAP': {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.lineTo(0, -9);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 4, 12, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 'SLEEPER': {
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#7c2d12';
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -4, 17, Math.PI, 0);
      ctx.fill();

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -3, 10, 6);
      ctx.strokeRect(2, -3, 10, 6);

      const bRad = 4.5 + Math.sin(tick * 0.16 + obs.phase) * 2.5;
      ctx.fillStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.beginPath();
      ctx.arc(6, 8, Math.max(2, bRad), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      break;
    }
    case 'BILL': {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14, -18, 28, 36);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.6;
      ctx.strokeRect(-14, -18, 28, 36);
      ctx.fillStyle = '#dc2626';
      ctx.font = '900 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('督促', 0, 2);
      ctx.fillRect(-9, 7, 18, 2.5);
      break;
    }
    case 'DOCS': {
      [-7, 0, 7].forEach((offset, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f1f5f9';
        ctx.fillRect(-16 + idx * 2, offset - 8, 30, 11);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(-16 + idx * 2, offset - 8, 30, 11);
      });
      break;
    }
    case 'BOSS_MAN': {
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(0, 2, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#991b1b';
      ctx.stroke();

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-9, -14);
      ctx.lineTo(9, -14);
      ctx.moveTo(-7, -11);
      ctx.lineTo(7, -11);
      ctx.moveTo(-11, -5);
      ctx.lineTo(-2, 0);
      ctx.moveTo(11, -5);
      ctx.lineTo(2, 0);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, 6, 16, 6);
      ctx.strokeRect(-8, 6, 16, 6);
      break;
    }
    case 'CHAMPAGNE': {
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.roundRect(-9, -4, 18, 23, 4);
      ctx.fill();
      ctx.fillRect(-4, -19, 8, 16);
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(-9, -4, 18, 23);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, -21, 8, 5);
      ctx.fillRect(-7, 3, 14, 8);
      break;
    }
    case 'MONEY': {
      ctx.fillStyle = '#dcfce7';
      ctx.fillRect(-18, -11, 36, 22);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(-18, -11, 36, 22);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, -11, 8, 22);
      ctx.fillStyle = '#14532d';
      ctx.font = '900 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('¥', 0, 4);
      break;
    }
    case 'HOST': {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#78350f';
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-14, -5, 12, 7);
      ctx.fillRect(2, -5, 12, 7);
      ctx.fillRect(-2, -3, 4, 2.5);
      break;
    }
    case 'METEOR': {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#451a03';
      ctx.stroke();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(-6, -5, 4.5, 0, Math.PI * 2);
      ctx.arc(7, 5, 5.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'SATELLITE': {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-24, -6, 15, 12);
      ctx.fillRect(9, -6, 15, 12);
      ctx.strokeStyle = '#0c4a6e';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-24, -6, 15, 12);
      ctx.strokeRect(9, -6, 15, 12);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'UFO':
    default: {
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.ellipse(0, 3, 22, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#581c87';
      ctx.stroke();
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(0, -2, 10.5, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      break;
    }
  }

  if (obs.blasted) {
    ctx.fillStyle = '#facc15';
    ctx.font = '900 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText('★ ★', 0, -20);
    ctx.fillText('★ ★', 0, -20);
  }

  ctx.restore();
}

export function drawHeroStone(ctx, stone, isPulling, pullDx, pullDy, isFever, tick) {
  stone.trail.forEach((tr) => {
    ctx.save();
    ctx.globalAlpha = tr.alpha * 0.45;
    ctx.fillStyle = isFever ? '#facc15' : '#fdba74';
    ctx.beginPath();
    ctx.arc(tr.x, tr.y, stone.r * 0.88, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.save();
  const drawX = isPulling ? stone.x - pullDx * 0.35 : stone.x;
  const drawY = isPulling ? stone.y - pullDy * 0.35 : stone.y;

  // 接地シャドウ
  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.beginPath();
  ctx.ellipse(drawX, drawY + stone.r * 0.85, stone.r * 0.9, stone.r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(drawX, drawY);
  ctx.rotate(stone.angle);

  // 黄金増毛フィーバーのスーパーオーラ＆逆立ち黄金髪
  if (isFever) {
    const auraR = stone.r + 12 + Math.sin(tick * 0.35) * 4;
    const auraGrad = ctx.createRadialGradient(0, 0, stone.r * 0.6, 0, 0, auraR);
    auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.85)');
    auraGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.8;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 6 - 4, -stone.r + 4);
      ctx.lineTo(i * 8, -stone.r - 14 - Math.sin(tick * 0.4 + i) * 3);
      ctx.lineTo(i * 6 + 4, -stone.r + 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  // 愛らしい耳
  ctx.fillStyle = '#fdba74';
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-stone.r + 1, 2, 5.5, 0, Math.PI * 2);
  ctx.arc(stone.r - 1, 2, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 側頭部のフワッと3本毛
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.2;
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(side * (stone.r - 2), -5);
    ctx.lineTo(side * (stone.r + 7), -8);
    ctx.moveTo(side * (stone.r - 1), 0);
    ctx.lineTo(side * (stone.r + 8), 0);
    ctx.moveTo(side * (stone.r - 2), 5);
    ctx.lineTo(side * (stone.r + 7), 8);
    ctx.stroke();
  });

  // 頭本体グラデーション
  const headGrad = ctx.createRadialGradient(-7, -9, 3, 0, 0, stone.r);
  headGrad.addColorStop(0, isFever ? '#fef9c3' : '#fff7ed');
  headGrad.addColorStop(0.55, isFever ? '#facc15' : '#fed7aa');
  headGrad.addColorStop(1, isFever ? '#ca8a04' : '#fb923c');

  ctx.beginPath();
  ctx.arc(0, 0, stone.r, 0, Math.PI * 2);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#7c2d12';
  ctx.stroke();

  // 天使の輪ハイライト
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.ellipse(-7, -9, 8, 4, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // ほっぺ赤み
  ctx.fillStyle = 'rgba(252, 165, 165, 0.75)';
  ctx.beginPath();
  ctx.ellipse(-11, 7, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(11, 7, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 愛らしいハゲオヤジ表情
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.2;
  if (isPulling) {
    // 踏ん張り＞＜目＋食いしばり口
    ctx.beginPath();
    ctx.moveTo(-11, -1);
    ctx.lineTo(-5, 3);
    ctx.lineTo(-11, 7);
    ctx.moveTo(11, -1);
    ctx.lineTo(5, 3);
    ctx.lineTo(11, 7);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, 10, 12, 4.5);
    ctx.strokeRect(-6, 10, 12, 4.5);
  } else {
    // タレ眉＋クリクリ目＋ちょびヒゲ＆笑顔
    ctx.beginPath();
    ctx.moveTo(-11, -3);
    ctx.lineTo(-4, -1);
    ctx.moveTo(11, -3);
    ctx.lineTo(4, -1);
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-6, 3, 2.6, 0, Math.PI * 2);
    ctx.arc(6, 3, 2.6, 0, Math.PI * 2);
    ctx.fill();

    // ちょびヒゲ＆笑顔
    ctx.fillStyle = '#334155';
    ctx.fillRect(-4, 7, 8, 2.2);
    ctx.beginPath();
    ctx.arc(0, 10, 4.5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawComicEffects(ctx, speedLinesTimer, comicEffects, w, h, tick) {
  if (speedLinesTimer > 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.lineWidth = 2.4;
    const cx = w / 2;
    const cy = h / 2;
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2 + tick * 0.12;
      const r1 = 115 + Math.random() * 45;
      const r2 = Math.max(w, h);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
      ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  comicEffects.forEach((ce) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ce.life);
    ctx.translate(ce.x, ce.y);
    ctx.scale(ce.scale, ce.scale);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    const spikes = 12;
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? 50 : 28;
      const a = (i / (spikes * 2)) * Math.PI * 2;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad * 0.62);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad * 0.62);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText(ce.text, 0, -2);
    ctx.fillStyle = ce.color;
    ctx.fillText(ce.text, 0, -2);

    ctx.font = 'bold 12px sans-serif';
    ctx.strokeText(ce.subText, 0, 15);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(ce.subText, 0, 15);
    ctx.restore();
  });
}
