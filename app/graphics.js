// app/graphics.js
// SUNミニゲームシリーズ第3弾『ハゲリング』高精細ベクターグラフィック＆アニメーション描画モジュール

export function drawStageBackground(ctx, chap, w, h, tick) {
  // ベース背景グラデーション
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, chap.bg);
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // レーン床（立体縁取り付き）
  ctx.save();
  ctx.fillStyle = chap.floor;
  ctx.beginPath();
  ctx.roundRect(14, 54, w - 28, h - 68, 14);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = chap.tile;
  ctx.stroke();
  ctx.clip();

  // 章ごとの背景ディテール演出
  if (chap.id === 1) {
    // 第1章：銭湯タイル＆湯気ゆらめき
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    for (let gx = 14; gx < w; gx += 36) {
      ctx.beginPath();
      ctx.moveTo(gx, 54);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }
    for (let gy = 54; gy < h; gy += 36) {
      ctx.beginPath();
      ctx.moveTo(14, gy);
      ctx.lineTo(w - 14, gy);
      ctx.stroke();
    }
    // 漂う湯気
    for (let i = 0; i < 4; i++) {
      const sx = 60 + i * 80 + Math.sin(tick * 0.02 + i) * 18;
      const sy = ((h - (tick * 0.6 + i * 150)) % (h - 60)) + 60;
      const steamGrad = ctx.createRadialGradient(sx, sy, 4, sx, sy, 42);
      steamGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      steamGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = steamGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, 42, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (chap.id === 2) {
    // 第2章：満員電車の床＆流れる窓外の光
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fillRect(14, 54, 28, h);
    ctx.fillRect(w - 42, 54, 28, h);
    const dashOffset = (tick * 6) % 90;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
    ctx.lineWidth = 4;
    ctx.setLineDash([35, 55]);
    ctx.lineDashOffset = -dashOffset;
    ctx.beginPath();
    ctx.moveTo(28, 54);
    ctx.lineTo(28, h);
    ctx.moveTo(w - 28, 54);
    ctx.lineTo(w - 28, h);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (chap.id === 3) {
    // 第3章：ブラック企業のPタイル＆警告ストライプ
    ctx.strokeStyle = 'rgba(232, 121, 249, 0.15)';
    ctx.lineWidth = 1.5;
    for (let gx = 14; gx < w; gx += 48) {
      ctx.beginPath();
      ctx.moveTo(gx, 54);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(220, 38, 38, 0.22)';
    ctx.fillRect(14, h - 125, w - 28, 8);
  } else if (chap.id === 4) {
    // 第4章：銀座高級クラブの絨毯＆スポットライト
    const spot1 = ctx.createRadialGradient(w * 0.3, 180, 10, w * 0.3, 180, 130);
    spot1.addColorStop(0, 'rgba(250, 204, 21, 0.18)');
    spot1.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = spot1;
    ctx.fillRect(14, 54, w - 28, h - 68);
  } else if (chap.id === 5) {
    // 第5章：宇宙ステーションの星空＆レーザーグリッド
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 28; i++) {
      const sx = ((i * 73) % (w - 40)) + 20;
      const sy = ((i * 137 + tick * 0.4) % (h - 90)) + 60;
      const alpha = 0.3 + Math.sin(tick * 0.08 + i) * 0.3;
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fillRect(sx, sy, 2.5, 2.5);
    }
    ctx.globalAlpha = 1.0;
  }

  // センターライン＆発射ホグライン
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2, 54);
  ctx.lineTo(w / 2, h - 14);
  ctx.moveTo(14, h - 110);
  ctx.lineTo(w - 14, h - 110);
  ctx.stroke();

  ctx.restore();
}

export function drawHouseTarget(ctx, house, tick) {
  const { x, y, r } = house;
  const pulse = Math.sin(tick * 0.08) * 2.5;
  const baseR = Math.max(10, r + pulse);

  ctx.save();
  // 外周発光リング
  const glow = ctx.createRadialGradient(x, y, baseR * 0.5, x, y, baseR + 12);
  glow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
  glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, baseR + 12, 0, Math.PI * 2);
  ctx.fill();

  const rings = [
    { rad: baseR, color: '#ef4444', stroke: '#991b1b' },
    { rad: baseR * 0.68, color: '#f8fafc', stroke: '#cbd5e1' },
    { rad: baseR * 0.38, color: '#2563eb', stroke: '#1e40af' },
    { rad: baseR * 0.16, color: '#facc15', stroke: '#ca8a04' },
  ];

  rings.forEach((rg) => {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(4, rg.rad), 0, Math.PI * 2);
    ctx.fillStyle = rg.color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = rg.stroke;
    ctx.stroke();
  });

  // GOALラベル
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.strokeText('GOAL', x, y - baseR - 5);
  ctx.fillText('GOAL', x, y - baseR - 5);
  ctx.restore();
}

export function drawObstacleVector(ctx, obs, tick) {
  const bob = obs.blasted ? 0 : Math.sin(tick * 0.09 + obs.phase) * 2.8;
  const squashX = obs.blasted ? 1.18 : 1 + Math.sin(tick * 0.11 + obs.phase) * 0.05;
  const squashY = obs.blasted ? 0.82 : 1 - Math.sin(tick * 0.11 + obs.phase) * 0.05;

  ctx.save();
  ctx.translate(obs.x, obs.y + bob);

  // 接地ドロップシャドウ（未吹っ飛び時のみ）
  if (!obs.blasted) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, obs.r * 0.85, obs.r * 0.85, obs.r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.rotate(obs.rot);
  ctx.scale(squashX, squashY);

  switch (obs.kind) {
    case 'WIG_KING': {
      // ボス：巨大カツラ大王
      const hairGrad = ctx.createRadialGradient(-6, -8, 4, 0, 0, 28);
      hairGrad.addColorStop(0, '#4338ca');
      hairGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = hairGrad;
      ctx.beginPath();
      ctx.arc(0, 2, 27, Math.PI, 0);
      ctx.lineTo(30, 14);
      ctx.quadraticCurveTo(14, 7, 0, 14);
      ctx.quadraticCurveTo(-14, 7, -30, 14);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#1e1b4b';
      ctx.stroke();

      // 黄金王冠
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-15, -18);
      ctx.lineTo(-19, -34);
      ctx.lineTo(-7, -25);
      ctx.lineTo(0, -38);
      ctx.lineTo(7, -25);
      ctx.lineTo(19, -34);
      ctx.lineTo(15, -18);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 発光する赤目
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-9, 2, 4.5, 0, Math.PI * 2);
      ctx.arc(9, 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-9, 2, 1.8, 0, Math.PI * 2);
      ctx.arc(9, 2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'DUCK': {
      // 銭湯アヒル（立体グラデ＆クチバシ）
      const dGrad = ctx.createRadialGradient(-4, -4, 2, 0, 2, 20);
      dGrad.addColorStop(0, '#fef08a');
      dGrad.addColorStop(0.7, '#facc15');
      dGrad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.ellipse(-1, 5, 17, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#854d0e';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(6, -8, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 羽
      ctx.beginPath();
      ctx.ellipse(-3, 5, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.stroke();

      // クチバシ
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(17, -7, 6.5, 3.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 目
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(9, -10, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(9.8, -10.8, 0.9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'BUCKET': {
      // ケロリン桶
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(0, 2, 19, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#854d0e';
      ctx.stroke();

      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.ellipse(0, -2, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.font = '900 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ケロ', 0, 1);
      break;
    }
    case 'SOAP': {
      // 石鹸＋モコモコ泡アニメ
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.roundRect(-16, -9, 32, 19, 8);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#9d174d';
      ctx.stroke();

      const bubblePulse = Math.sin(tick * 0.2 + obs.phase) * 1.2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-11, -11, 5.5 + bubblePulse, 0, Math.PI * 2);
      ctx.arc(-3, -13, 4.5, 0, Math.PI * 2);
      ctx.arc(12, 9, 5 + bubblePulse, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'BAG': {
      // ビジネスカバン
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
      // 揺れるつり革
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.lineTo(0, -9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 4, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#475569';
      ctx.stroke();
      break;
    }
    case 'SLEEPER': {
      // 居眠りサラリーマン＋膨らむ鼻ちょうちん
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#7c2d12';
      ctx.stroke();

      // 七三髪
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -4, 17, Math.PI, 0);
      ctx.fill();

      // メガネ
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -3, 10, 6);
      ctx.strokeRect(2, -3, 10, 6);

      // 鼻ちょうちん
      const bRad = 4.5 + Math.sin(tick * 0.16 + obs.phase) * 3;
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.beginPath();
      ctx.arc(6, 8, Math.max(2, bRad), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      break;
    }
    case 'BILL': {
      // 赤い督促状
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(-14, -18, 28, 36);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.8;
      ctx.strokeRect(-14, -18, 28, 36);
      ctx.fillStyle = '#dc2626';
      ctx.font = '900 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('督促', 0, 2);
      ctx.fillRect(-9, 7, 18, 2.5);
      break;
    }
    case 'DOCS': {
      // 崩れそうな書類の山
      [-7, 0, 7].forEach((offset, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#e2e8f0';
        ctx.fillRect(-16 + idx * 2, offset - 8, 30, 11);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(-16 + idx * 2, offset - 8, 30, 11);
      });
      break;
    }
    case 'BOSS_MAN': {
      // 激怒上司（真っ赤顔＋バーコード髪＋噴き出す湯気）
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 2, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#7f1d1d';
      ctx.stroke();

      // バーコード髪
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-9, -14);
      ctx.lineTo(9, -14);
      ctx.moveTo(-7, -11);
      ctx.lineTo(7, -11);
      ctx.stroke();

      // 吊り上がり眉＆叫び口
      ctx.beginPath();
      ctx.moveTo(-11, -5);
      ctx.lineTo(-2, 0);
      ctx.moveTo(11, -5);
      ctx.lineTo(2, 0);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, 6, 16, 6);
      ctx.strokeRect(-8, 6, 16, 6);

      // 湯気アニメ
      const sy = -22 - ((tick % 24) * 0.5);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-9, sy, 3.8, 0, Math.PI * 2);
      ctx.arc(9, sy - 4, 3.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'CHAMPAGNE': {
      // 高級シャンパンボトル
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.roundRect(-9, -4, 18, 23, 4);
      ctx.fill();
      ctx.fillRect(-4, -19, 8, 16);
      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 2;
      ctx.strokeRect(-9, -4, 18, 23);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-4, -21, 8, 5);
      ctx.fillRect(-7, 3, 14, 8);
      break;
    }
    case 'MONEY': {
      // 一万円札束
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
      // グラサン黒服
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#78350f';
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-14, -5, 12, 7);
      ctx.fillRect(2, -5, 12, 7);
      ctx.fillRect(-2, -3, 4, 2.5);
      break;
    }
    case 'METEOR': {
      // 燃える隕石
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f97316';
      ctx.stroke();
      ctx.fillStyle = '#431407';
      ctx.beginPath();
      ctx.arc(-6, -5, 4.5, 0, Math.PI * 2);
      ctx.arc(7, 5, 5.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'SATELLITE': {
      // ソーラーパネル人工衛星
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-24, -6, 15, 12);
      ctx.fillRect(9, -6, 15, 12);
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-24, -6, 15, 12);
      ctx.strokeRect(9, -6, 15, 12);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'UFO':
    default: {
      // 発光円盤UFO
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.ellipse(0, 3, 22, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#e879f9';
      ctx.stroke();
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(0, -2, 10.5, Math.PI, 0);
      ctx.fill();
      break;
    }
  }

  // 吹っ飛び中の目回し星マーク
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
  // 滑走中の残像トレイル
  stone.trail.forEach((tr) => {
    ctx.save();
    ctx.globalAlpha = tr.alpha * 0.48;
    ctx.fillStyle = isFever ? '#facc15' : '#fdba74';
    ctx.beginPath();
    ctx.arc(tr.x, tr.y, stone.r * 0.88, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.save();
  const drawX = isPulling ? stone.x - pullDx * 0.35 : stone.x;
  const drawY = isPulling ? stone.y - pullDy * 0.35 : stone.y;

  // 接地ドロップシャドウ
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(drawX, drawY + stone.r * 0.85, stone.r * 0.9, stone.r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(drawX, drawY);
  ctx.rotate(stone.angle);

  // 黄金増毛フィーバーのスーパーオーラ＆逆立ち黄金髪
  if (isFever) {
    const auraR = stone.r + 12 + Math.sin(tick * 0.35) * 4;
    const auraGrad = ctx.createRadialGradient(0, 0, stone.r * 0.6, 0, 0, auraR);
    auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.8)');
    auraGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
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

  // 頭本体（立体ツヤツヤグラデーション）
  const headGrad = ctx.createRadialGradient(-7, -9, 3, 0, 0, stone.r);
  headGrad.addColorStop(0, isFever ? '#fef9c3' : '#ffedd5');
  headGrad.addColorStop(0.55, isFever ? '#facc15' : '#fdba74');
  headGrad.addColorStop(1, isFever ? '#ca8a04' : '#ea580c');

  ctx.beginPath();
  ctx.arc(0, 0, stone.r, 0, Math.PI * 2);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#7c2d12';
  ctx.stroke();

  // 側頭部のサザエさん風3本毛
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 2.4;
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(side * (stone.r - 2), -4);
    ctx.lineTo(side * (stone.r + 7), -7);
    ctx.moveTo(side * (stone.r - 1), 0);
    ctx.lineTo(side * (stone.r + 8), 0);
    ctx.moveTo(side * (stone.r - 2), 4);
    ctx.lineTo(side * (stone.r + 7), 7);
    ctx.stroke();
  });

  // 天使の輪ツヤハイライト
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.ellipse(-7, -9, 8, 4, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // 状態別の表情アニメーション
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 2.4;
  if (isPulling) {
    // 引っ張り中：＞＜ 顔＆歯食いしばり
    ctx.beginPath();
    ctx.moveTo(-10, 1);
    ctx.lineTo(-4, 5);
    ctx.lineTo(-10, 9);
    ctx.moveTo(10, 1);
    ctx.lineTo(4, 5);
    ctx.lineTo(10, 9);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, 11, 12, 4.5);
    ctx.strokeRect(-6, 11, 12, 4.5);
  } else if (stone.state === 'MOVING') {
    // 滑走中：カッと見開いた気合い顔
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(-3, 4);
    ctx.moveTo(11, 0);
    ctx.lineTo(3, 4);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-6, 7, 3.2, 0, Math.PI * 2);
    ctx.arc(6, 7, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-6, 7, 1.6, 0, Math.PI * 2);
    ctx.arc(6, 7, 1.6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 待機中：ニヤリ自信顔
    ctx.beginPath();
    ctx.moveTo(-10, 1);
    ctx.lineTo(-3, 4);
    ctx.moveTo(10, 1);
    ctx.lineTo(3, 4);
    ctx.stroke();
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(-6, 7, 2.3, 0, Math.PI * 2);
    ctx.arc(6, 7, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 10, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawComicEffects(ctx, speedLinesTimer, comicEffects, w, h, tick) {
  // マンガ風集中線（ヒット時）
  if (speedLinesTimer > 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = 2.2;
    const cx = w / 2;
    const cy = h / 2;
    for (let i = 0; i < 26; i++) {
      const ang = (i / 26) * Math.PI * 2 + tick * 0.12;
      const r1 = 115 + Math.random() * 45;
      const r2 = Math.max(w, h);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
      ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // アメコミ風ギザギザ擬音吹き出し
  comicEffects.forEach((ce) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ce.life);
    ctx.translate(ce.x, ce.y);
    ctx.scale(ce.scale, ce.scale);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    const spikes = 12;
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? 52 : 30;
      const a = (i / (spikes * 2)) * Math.PI * 2;
      if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad * 0.62);
      else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad * 0.62);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 18px sans-serif';
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
