<?php
/**
 * Admin screen for Open Source Emoji
 */

 
 
 
/**
 * Open admin page with header and message
 */
function os_emoji_admin_render_header( $subheader, $css = '' ){
    ?>
     <div class="wrap">
        <h2><?php echo esc_html__('Open Source Emoji')?></h2>
        <?php if( $subheader ):?> 
        <div class="<?php echo $css?>">
            <h3><?php echo esc_html($subheader)?></h3>
        </div>
        <?php endif?> 
    <?php
} 



/**
 * Close admin page
 */
function os_emoji_admin_render_footer(){
    ?>
    </div>
    <div class="wrap">
        &nbsp;
    </div>
    <div class="wrap">
        Built by <a href="https://twitter.com/timwhitlock">@timwhitlock</a>.
        Read the <a href="http://wordpress.org/extend/plugins/open-source-emoji/faq/">FAQs</a>
    </div>
    <?php
}



/**
 * Available themes
 */
function os_emoji_admin_themes(){
    static $themes = array (
        'android' => 'Android Emoji',
        'phantom' => 'Phantom Emoji',
    );
    return $themes;
}



/**
 * Render settings form
 */
function os_emoji_admin_render_form( array $conf ){
    extract( $conf );
    $themes = os_emoji_admin_themes();
    ?>
    <form action="<?php echo os_emoji_admin_base_uri()?>" method="post">
        <!-- themes as radio buttons -->
        <h3 class="title">
            <?php echo esc_html__('Change icon style')?>:
        </h3>
        <?php foreach( $themes as $name => $label ): $checked = $conf['theme'] === $name ? ' checked' : '' ?> 
        <p>
            <input type="radio" name="os_emoji[theme]" id="os-emoji-theme--<?php echo $name;?>" value="<?php echo $name;?>"<?php echo $checked;?> /> 
            <label for="os-emoji-theme--<?php echo $name;?>"><?php echo $label;?></label>
        </p>
        <?php endforeach?> 
        <!-- save emoji settings -->
        <p class="submit">
            <input type="submit" class="button-primary" value="<?php echo esc_html__('Save settings')?>" />
        </p>
    </form>
    <?php
}




/**
 * Render full admin page
 */ 
function os_emoji_admin_render_page(){
    if ( ! current_user_can('manage_options') ){
        os_emoji_admin_render_header( __("You don't have permission to manage these settings"), 'error');
        os_emoji_admin_render_footer();
        return;
    }
    try {
        $conf = _os_emoji_config();
        $themes = os_emoji_admin_themes();
        $message = sprintf( __('%s is enabled'), $themes[ $conf['theme'] ] );
        os_emoji_admin_render_header( "\xF0\x9F\x98\x81 ".$message, 'notice');
    }
    catch( Exception $Ex ){
        os_emoji_admin_render_header( $Ex->getMessage(), 'error' );
    }
    
    // end admin page with options form and close wrapper
    os_emoji_admin_render_form( $conf );
    os_emoji_admin_render_footer();
}




/**
 * Build clean base URL for admin settings page
 * @return string
 */
function os_emoji_admin_base_uri(){
    static $base_uri;
    if( ! isset($base_uri) ){
        $port = isset($_SERVER['HTTP_X_FORWARDED_PORT']) ? $_SERVER['HTTP_X_FORWARDED_PORT'] : $_SERVER['SERVER_PORT'];
        $prot = '443' === $port ? 'https:' : 'http:';
        $base_uri = $prot.'//'.$_SERVER['HTTP_HOST'].''.current( explode( '&', $_SERVER['REQUEST_URI'], 2 ) );
    }
    return $base_uri;
}



 


/**
 * admin_init action
 */
function os_emoji_admin_init (){
    // update applicaion settings if posted
    if( isset($_POST['os_emoji']) && is_array( $update = $_POST['os_emoji'] ) ){
        $conf = _os_emoji_config( $update );
        $redirect = os_emoji_admin_base_uri().'&updated='.$conf['theme'];
        return wp_redirect( $redirect );
    }
}
 


/**
 * Admin menu registration callback
 */
function os_emoji_admin_menu() {
    $hook = add_options_page( __('Open Source Emoji Settings'), __('OS Emoji'), 'manage_options', 'os-emoji-admin', 'os_emoji_admin_render_page');
    add_action('admin_print_scripts-'.$hook, 'os_emoji_enqueue_scripts' );
}



add_action('admin_init', 'os_emoji_admin_init');
add_action('admin_menu', 'os_emoji_admin_menu');

