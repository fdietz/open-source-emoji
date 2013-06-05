/**
 * Open Source Emoji admin script     
 */
!function( window, $ ){

    $('#os-emoji-preview').click( function(event){
        event.preventDefault();
        event.stopPropagation();
        var a = $(event.target).closest('a'),
            t = a.attr('title').replace(/_/g,' ').toLowerCase(),
            s = '[emoji '+t+']';
        prompt( 'Shortcode:', s );
        return false;
    } );
    
}( window, window.jQuery );

