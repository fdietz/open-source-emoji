=== Plugin Name ===
Contributors: timwhitlock
Donate link: http://timwhitlock.info/donate-to-a-project/
Tags: emoji, emoticons, icons, android, phantom, shortcode, unicode
Requires at least: 3.5.1
Tested up to: 3.5.1
Stable tag: 1.0.6
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Emoji support for your blog with no copyright problems.

== Description ==

This plugin uses open source Emoji sets, so it's legal to use without breaching copyright of Emoji artworks. 

Choose between the Android style and the full colour [Phantom](http://www.kickstarter.com/projects/374397522/phantom-open-emoji) set.

All Emoji in your pages are converted to visible icons, even on devices that don't support Emoji.

Add Emoji to your posts using shortcodes like `[emoji hamburger]`

Built by <a href="//twitter.com/timwhitlock">@timwhitlock</a> / <a rel="author" href="https://plus.google.com/106703751121449519322">Tim Whitlock</a>

== Installation ==

1. Unzip all files to the `/wp-content/plugins/` directory
2. Log into Wordpress admin and activate the 'Open Source Emoji' plugin through the 'Plugins' menu
3. Go to *Settings > OS Emoji* to change the icon style and see supported characters.

= Adding Emoji to your pages =

This plugin converts Emoji appearing anywhere on your pages, but Wordpress won't allow you to save Emoji characters in your posts.

To enter Emoji characters into your posts, use the [emoji ..] shortcode with the name of the Emoji following it. e.g. `[emoji cat face]`.

When editing a post you will see a pink smiling face icon in the first row of buttons in the text editor - click this to insert Emoji shortcodes.


== Frequently Asked Questions ==

= Are the Emoji icons copyright? =

No. This plugin uses only open source licensed artworks. See the Credits tab.

= Why are some icons missing? =

The Android Emoji set is [missing some characters](http://timwhitlock.info/blog/2013/04/androids-missing-emoji/) that you'll find on other systems, but it does follow the published Unicode standard.

The Phantom Emoji set is very new and the team are still adding new icons. Keep this plugin updated to get the new icons as they're created.

=  Why do the icons appear the wrong size compared to my text? =

The Android font will scale with your text, but the Phantom set uses fixed size images. I'm working on making them scalable.

The default size is 32px, but you can use 25px and 64px icons by adding the css class `emoji-64` or `emoji-25` on any HTML element in your theme.

= Will you support Apple style icons? =

No. They are copyright of Apple, so I can't distribute them

= What browsers does it support? =

Modern browsers that support `inline-block` and web fonts should work for the Android and Phantom themes. 

Internet Explorer 8 and below has some issues at the moment. I"m working on it.

= Are these FAQs complete? =

No. I'm working on them. Feel free to ask a question in the Support tab, or on [Twitter](https://twitter.com/timwhitlock)


== Screenshots ==

1. Post edit screen shows Emoji toolbar widget and shortcodes entered.
2. Rendered post with Phantom theme enabled.
3. Rendered post with Androind theme enabled.
4. Settings screen with theme options.


== Upgrade Notice ==

= 1.0.6 =
* Added latest Phantom emoji


== Changelog ==

= 1.0.6 =
* Added latest Phantom emoji

= 1.0.5 =
* fix for symlinks in resolving urls

= 1.0.4 =
* Added screenshots
* Added `H1` and `small` CSS contexts

= 1.0.3 =
* Added TinyMCE editor Emoji chooser
* Compressed JavaScript

= 1.0.2 =
* Added 32px and 64px phantom sets

= 1.0.1 =
* Added preview table

= 1.0.0 =
* First version released



== Credits ==

[Phantom Emoji](http://www.kickstarter.com/projects/374397522/phantom-open-emoji)
is an open source set of pictographs, [see license](https://github.com/Genshin/PhantomOpenEmoji/blob/master/LICENSE.md)
                    
Android Emoji font Copyright © 2008 The Android Open Source Project.
Licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0). 
See [notice](https://s3-eu-west-1.amazonaws.com/tw-font/android/NOTICE)