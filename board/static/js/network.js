/* Agent-network hero canvas: drifting nodes, linking lines, subtle cursor response.
   Represents multi-agent systems without saying a word. */
(function () {
  var canvas = document.getElementById('net');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var w = 0, h = 0, nodes = [], mouse = { x: -9999, y: -9999 };
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  function dark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
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
        hub: Math.random() < 0.12
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    var isDark = dark();
    var lineCol = isDark ? 'rgba(52, 211, 153, ' : 'rgba(5, 150, 105, ';
    var dotCol = isDark ? '52, 211, 153' : '5, 150, 105';
    var linkDist = 150;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      // gentle cursor push
      var dx = n.x - mouse.x, dy = n.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120 && d2 > 1) {
        var d = Math.sqrt(d2);
        n.vx += (dx / d) * 0.03;
        n.vy += (dy / d) * 0.03;
      }
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.985; n.vy *= 0.985;
      // keep a minimum drift
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
        if (dist < linkDist) {
          var alpha = (1 - dist / linkDist) * (na.hub || nb.hub ? 0.5 : 0.28);
          ctx.strokeStyle = lineCol + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (var k = 0; k < nodes.length; k++) {
      var p = nodes[k];
      var glow = p.hub ? 0.9 : 0.55;
      ctx.fillStyle = 'rgba(' + dotCol + ', ' + glow + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.hub ? p.r + 1.4 : p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.hub) {
        ctx.fillStyle = 'rgba(' + dotCol + ', 0.12)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 9, 0, Math.PI * 2);
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
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resize(); seed(); step();
  window.addEventListener('resize', function () { resize(); seed(); if (reduced) step(); });
})();
