function showMenu() {
    var sliderWrapper = document.getElementById("sliderWrapper");
    sliderWrapper.style.display = "block";
  }
  
  function hideMenu() {
    var sliderWrapper = document.getElementById("sliderWrapper");
    sliderWrapper.style.display = "none";
  }

jQuery(document).ready(function(){
    jQuery('#hideshow').on('click', function(event) {
        jQuery('#content').toggle('show');
        jQuery('#content8').toggle('show');

        jQuery('#totgif').toggle('show');

    });
});
jQuery(document).ready(function(){
        $('#one').fadeIn("fast");
        $('#two').fadeOut("fast");
        $('#three').fadeOut("fast");
        $('#four').fadeOut("fast");
        $('#five').fadeOut("fast");

});

jQuery(document).ready(function(){
    jQuery('#onebut').on('click', function(event) {
        $('#one').fadeIn("fast");
        $('#two').fadeOut("fast");
    });
});

jQuery(document).ready(function(){
    jQuery('#onebut').on('click', function(event) {
        $('#one').fadeIn("fast");
        $('#two').fadeOut("fast");
        $('#three').fadeOut("fast");
        $('#four').fadeOut("fast");
        $('#five').fadeOut("fast");

    });
});
jQuery(document).ready(function(){
    jQuery('#twobut').on('click', function(event) {
        $('#one').fadeOut("fast");
        $('#two').fadeIn("fast");
        $('#three').fadeOut("fast");
        $('#four').fadeOut("fast");
        $('#five').fadeOut("fast");

    });
});
jQuery(document).ready(function(){
    jQuery('#threebut').on('click', function(event) {
        $('#one').fadeOut("fast");
        $('#two').fadeOut("fast");
        $('#three').fadeIn("fast");
        $('#four').fadeOut("fast");
        $('#five').fadeOut("fast");
    });
});
jQuery(document).ready(function(){
    jQuery('#fourbut').on('click', function(event) {
        $('#one').fadeOut("fast");
        $('#two').fadeOut("fast");
        $('#three').fadeOut("fast");
        $('#four').fadeIn("fast");
        $('#five').fadeOut("fast");

    });
});
jQuery(document).ready(function(){
    jQuery('#fivebut').on('click', function(event) {
        $('#one').fadeOut("fast");
        $('#two').fadeOut("fast");
        $('#three').fadeOut("fast");
        $('#four').fadeOut("fast");
        $('#five').fadeIn("fast");
    });
});

jQuery(document).ready(function(){
    jQuery('#hideshow1').on('click', function(event) {
        jQuery('#content1').toggle('show');
    });
});

jQuery(document).ready(function(){
    jQuery('#hideright').on('click', function(event) {
        jQuery('#rightpref').toggle('show');
        jQuery('#otherright').toggle('show');

    });
});
jQuery(document).ready(function(){
    jQuery('#hidefav').on('click', function(event) {
        jQuery('#favinfo').toggle('show');
    });
});

jQuery(document).ready(function(){
    jQuery('#hideshow2').on('click', function(event) {
        jQuery('#content2').toggle('show');
    });
});

jQuery(document).ready(function(){
    jQuery('#hideshow3').on('click', function(event) {
        jQuery('#content3').toggle('show');
    });
});


jQuery(document).ready(function(){

        $('#totgif').fadeIn("fast");
        $('#sopgif').fadeOut("fast");
        $('#chigif').fadeOut("fast");
        $('#calgif').fadeOut("fast");
});

jQuery(document).ready(function(){
    jQuery('#tot').on('click', function(event) {
        $('#totgif').fadeIn("fast");
        $('#sopgif').fadeOut("fast");
        $('#chigif').fadeOut("fast");
        $('#calgif').fadeOut("fast");
    });
});
jQuery(document).ready(function(){
    jQuery('#sop').on('click', function(event) {
      $('#sopgif').fadeIn("fast");
        $('#totgif').fadeOut("fast");
        $('#chigif').fadeOut("fast");
        $('#calgif').fadeOut("fast");
    });
});
jQuery(document).ready(function(){
    jQuery('#chi').on('click', function(event) {
      $('#chigif').fadeIn("fast");
        $('#totgif').fadeOut("fast");
        $('#sopgif').fadeOut("fast");
        $('#calgif').fadeOut("fast");
    });
});
jQuery(document).ready(function(){
    jQuery('#cal').on('click', function(event) {
      $('#calgif').fadeIn("fast");
        $('#sopgif').fadeOut("fast");
        $('#chigif').fadeOut("fast");
        $('#totgif').fadeOut("fast");
    });
});