$(function() {
  /* Terminal removed Oct 2026 — skip typed init when the element is gone */
  if (!$(".typed").length) return;
  /* NOTE: hard-refresh the browser once you've updated this */
  $(".typed").typed({
    strings: [
    "whoami<br/>" +
    "><span class='caret'>$</span> roberto galdamez — ai systems builder<br/> ^100" +
    "><span class='caret'>$</span> focus: agents, evals, pipelines that ship<br/> ^100" +
    "><span class='caret'>$</span> stack: python, langgraph, gemini, fastapi<br/> ^100" +
    "><span class='caret'>$</span> now: building neurastream<br/> ^300" +
    "><span class='caret'>$</span> open to: ai ops, implementation, support roles<br/> ^300"
],
    showCursor: true,
    cursorChar: '_',
    autoInsertCss: true,
    typeSpeed: 0.001,
    startDelay: 50,
    loop: false,
    showCursor: false,
    onStart: $('.message form').hide(),
    onStop: $('.message form').show(),
    onTypingResumed: $('.message form').hide(),
    onTypingPaused: $('.message form').show(),
    onComplete: $('.message form').show(),
    onStringTyped: function(pos, self) {$('.message form').show();},
  });
  $('.message form').hide()
});
