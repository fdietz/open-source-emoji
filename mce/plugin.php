<?php
/**
 * Open Source Emoji TinyMCE plugin window
 */
?><!DOCTYPE html>
<html>
<head>
    <meta charset="utf8" />
    <title>Insert Emoji Shortcode</title>
    <link href="../pub/css/emoji-admin.css" rel="stylesheet" />
</head>
<body class="os-emoji-popup emoji-25">
    
    <div id="os-emoji-wrap" style="display:none;">
    <?php require '../lib/emoji-table.php';?> 
    </div>
    
    <script type="text/javascript" src="../../../../wp-includes/js/tinymce/tiny_mce_popup.js"></script>
    <script>
        // steal parent scripts
        var $       = parent.jQuery,
            tinyMCE = parent.tinyMCE,
            OSEmoji = parent.OSEmoji;
            
        // run Emoji convertion with current theme
        OSEmoji.run( window );            

        // wrapper may now be made visible
        var div = document.getElementById('os-emoji-wrap');
        div.style.display = 'block';
        
        // initialize tinyMCE callback to insert shortcode
        $(div).click( function(event){
            event.preventDefault();
            event.stopPropagation();
            var a = $(event.target).closest('a'),
                t = a.attr('title').replace(/_/g,' ').toLowerCase();
            insertShortcode(t);
            return false;
        } );
        
        // callback to TinyMCE with shortcode insertion        
        function insertShortcode( text ){
            if ( tinyMCE.isIE ) {
                tinyMCE.activeEditor.focus();
                tinyMCE.activeEditor.selection.moveToBookmark(tinyMCE.EditorManager.activeEditor.windowManager.bookmark);
            }
            text = ' [emoji '+text+'] ';
            tinyMCE.execInstanceCommand( 'content', 'mceInsertContent', false, text );
            tinyMCEPopup.editor.execCommand('mceRepaint');
            tinyMCEPopup.close();
        }
    </script>

</body>
</html>