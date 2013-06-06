/**
 * Open Source Emoji TinyMCE plugin script
 */
!function( window, tinymce, $ ){

    var pluginId   = 'os_emoji',
        pluginName = 'Open Source Emoji';

    tinymce.create( 'tinymce.plugins.'+pluginId, {
        
        init : function( ed, jsRoot ) {

            // Register command for: tinyMCE.activeEditor.execCommand('os_emoji');
            ed.addCommand( pluginId, function() {
                ed.windowManager.open({
                    file : jsRoot+'/plugin.php',
                    width : 800,
                    height : 500,
                    inline : 1
                }, {
                    plugin_url : jsRoot
                });
            }),

            // Register emoji button
            ed.addButton( pluginId, {
                title : pluginName,
                cmd : pluginId
            } );
        },
        getInfo : function() {
            return {
                longname  : pluginName,
                author    : 'Tim Whitlock',
                authorurl : 'http://timwhitlock.info'
            };
        }
    } );

    // Register emoji plugin
    tinymce.PluginManager.add( 'os_emoji', tinymce.plugins.os_emoji );    
    
    
}( window, window.tinymce, window.jQuery );

