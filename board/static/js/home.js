$(function() {
  /* NOTE: hard-refresh the browser once you've updated this */
  $(".typed").typed({
    strings: [
    "stat Roberto Galdamez<br/>" +
    "><span class='caret'>$</span> status: Job seeker<br/> ^100" +
    "><span class='caret'>$</span> skills: coding ninja, problem solver<br/> ^100" +
    "><span class='caret'>$</span> hobbies: tech enthusiast, bookworm, coffee connoisseur, soccer<br/> ^300" +
    "><span class='caret'>$</span> alias: robdreamville<br/> ^300" +
    "><span class='caret'>$</span> universe: exploring the digital realms<br/> ^300"
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
