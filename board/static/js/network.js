/* Agent-network hero canvas: drifting nodes, breathing glow, signal pulses.
   Represents multi-agent systems without saying a word. */
document.addEventListener('DOMContentLoaded', function () {
(function () {
  var canvas = document.getElementById('net');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var w = 0, h = 0, nodes = [], pulses = [], mouse = { x: -9999, y: -9999 };
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var startT = Date.now();
  var LINK = 150;

  function dark() {
    return document.body.classList.contains('dark-mode');
  }

  function resize() {
    var r = canvas.parentElement.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * DPR; canvas.height = h * DPR;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function seed() {
    var count = Math.min(90, Math.floor((w * h) / 16000));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.6 + Math.random() * 2.2,
        hub: Math.random() < 0.12,
        phase: Math.random() * Math.PI * 2,
        breathe: 0.6 + Math.random() * 1.4
      });
    }
    pulses = [];
  }

  function spawnPulse() {
    if (pulses.length >= 5) return;
    var a = nodes[Math.floor(Math.random() * nodes.length)];
    var near = [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] === a) continue;
      var dx = nodes[i].x - a.x, dy = nodes[i].y - a.y;
      if (dx * dx + dy * dy < LINK * LINK) near.push(nodes[i]);
    }
    if (!near.length) return;
    pulses.push({
      a: a,
      b: near[Math.floor(Math.random() * near.length)],
      t: 0,
      speed: 0.008 + Math.random() * 0.012
    });
  }

  function step() {
    var now = (Date.now() - startT) / 1000;
    ctx.clearRect(0, 0, w, h);
    var isDark = dark();
    var lineCol = isDark ? 'rgba(52, 211, 153, ' : 'rgba(5, 150, 105, ';
    var dotCol = isDark ? '52, 211, 153' : '5, 150, 105';

    // drift
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var dx = n.x - mouse.x, dy = n.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120 && d2 > 1) {
        var d = Math.sqrt(d2);
        n.vx += (dx / d) * 0.03;
        n.vy += (dy / d) * 0.03;
      }
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.985; n.vy *= 0.985;
      if (Math.abs(n.vx) < 0.08) n.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(n.vy) < 0.08) n.vy += (Math.random() - 0.5) * 0.02;
      if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
    }

    // links
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var na = nodes[a], nb = nodes[b];
        var ddx = na.x - nb.x, ddy = na.y - nb.y;
        var dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < LINK) {
          var alpha = (1 - dist / LINK) * (na.hub || nb.hub ? 0.5 : 0.28);
          ctx.strokeStyle = lineCol + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }
    }

    // signal pulses: bright dots travelling between nodes, like messages
    if (!reduced) {
      if (Math.random() < 0.04) spawnPulse();
      for (var p = pulses.length - 1; p >= 0; p--) {
        var pu = pulses[p];
        pu.t += pu.speed;
        if (pu.t >= 1) { pulses.splice(p, 1); continue; }
        var px = pu.a.x + (pu.b.x - pu.a.x) * pu.t;
        var py = pu.a.y + (pu.b.y - pu.a.y) * pu.t;
        var fade = Math.sin(pu.t * Math.PI);
        ctx.fillStyle = 'rgba(' + dotCol + ', ' + (0.1 + 0.9 * fade).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(px, py, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(' + dotCol + ', ' + (0.25 * fade).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
      }
    }

    // nodes with breathing glow
    for (var k = 0; k < nodes.length; k++) {
      var pt = nodes[k];
      var breath = reduced ? 0.7 : (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(now * pt.breathe + pt.phase)));
      var glow = (pt.hub ? 0.9 : 0.55) * breath;
      ctx.fillStyle = 'rgba(' + dotCol + ', ' + glow.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.hub ? pt.r + 1.4 : pt.r, 0, Math.PI * 2);
      ctx.fill();
      if (pt.hub) {
        ctx.fillStyle = 'rgba(' + dotCol + ', ' + (0.12 * breath).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r + 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!reduced) requestAnimationFrame(step);
  }

  canvas.parentElement.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', function () {
    mouse.x = -9999; mouse.y = -9999;
  });

  // re-tint when theme toggles
  new MutationObserver(function () { if (reduced) step(); })
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });

  resize(); seed(); step();
  window.addEventListener('resize', function () { resize(); seed(); if (reduced) step(); });
})();
});
