//function to enable long clicks in floorplan
//credit to @tknp for the code enclosed

( function( $) {

    // -- variables --
    var  defaults = {
      NS: 'jquery.longclick-',
      delay: 400
    };
  
  
    // -- function --
    $.fn.mayTriggerLongClicks = function( options) {
      // alter settings according to options
      var settings = $.extend( defaults, options);
      // define long click based on mousedown and mouseup
      var timer;
      var haveLongClick;
      return $( this).on( 'mousedown tapstart touchstart', function() {
        haveLongClick = false;
        timer = setTimeout( function( elm) {
      haveLongClick = true;
      $( elm).trigger( 'longClick');
        }, settings.delay, this);
      } ).on( 'mouseup tapend touchend', function() {
        clearTimeout( timer);
      } ).on( 'click tap touch', function( evt) {
        if( haveLongClick)
      evt.stopImmediatePropagation();
      } );
    }  // $.fn.mayTriggerLongClicks
    
  } )( jQuery);
