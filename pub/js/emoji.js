/**
 * Emojify all text nodes in a document
 * @author Tim Whitlock
 * @license MIT
 */
( function( window, document, emoji ){
    
    // count how many emoji we find each time this is run.
    //
    window.emojifyCount = 0;
    

    // ignore non-html pages
    //
    var body = document.body,
        head = document.head || document.getElementsByTagName('head')[0];
    if( ! body || ! head ){
        return;
    }
    
    // find our own url amongst script sources
    //
    function myUrl(){
        var i = -1, src,
            baseurl = '/emoji.js',
            scripts = document.documentElement.getElementsByTagName('script');
        while( ++i < scripts.length ){
            src = scripts[i].getAttribute('src');
            if( src && src.indexOf(baseurl) !== -1 ){
                return src;
            }
        }
        return baseurl;
    }

    
    
    // Configure:
    var confClass  = 'emojified',
        confTheme  = 'android',
        confScript = myUrl(),
        confQuery  = confScript.split('?')[1];
                
    // establish emoji theme and add to wrapper class
    if( /theme=(\w+)/.exec(confQuery) ){
        confTheme = RegExp.$1;
    }
    
    
    // No point loading Android theme if user is on Android
    if( 'android' === confTheme && -1 !== navigator.userAgent.indexOf('; Android') ){
        return;
    }
    
     
    
    // logging only when console is available.
    //
    function log( text ){
        window.console && console.log && console.log(text);
    }
    
    
    
    // simple span element creator
    //
    function createElement( className, innerText, tagName  ){
        var span = document.createElement( tagName||'span' );
        span.className = className || '';
        innerText && span.appendChild( createText(innerText) );
        return span;
    }

    
    
    // simple text node creator
    //
    function createText( innerText ){
        return document.createTextNode( innerText );
    }
    
    
    
    // convert surrogate pair to single integer
    //
    function compileSurrogate( hi, lo ){
        return ( (hi - 0xD800) * 0x400 ) + (lo - 0xDC00) + 0x10000;
    }
    
    

    // convert emoji in a text node
    //
    function findEmoji( text ){
        if( ! text ){
            return [];
        }
        // single emoji range:   [\u203C-\uFFFF]
        // surrogate pair range: [\uD800-\uDBFF][\uDC00-\uDFFF]
        var found = [],
            reg = /[\u203C-\uFFFF][\uDC00-\uDFFF]?/g,
            matches, match, lo, hi, index;

        while( matches = reg.exec(text) ) {
            match = matches[0];
            index = reg.lastIndex;
            hi = match.charCodeAt(0);
            lo = match.charCodeAt(1);
            // single emoji if no low sibling
            if( isNaN(lo) ){
                found.push( [ --index, 1, hi, match ] );
                //log('single at '+index+' '+hi.toString(16) );
            }
            // else two single emojis if sibling is not in surrogate range
            else if( hi < 0xD800 || hi > 0xDBFF ){
                found.push( [ --index, 1, lo, match ] );
                found.push( [ --index, 1, hi, match ] );
                //log('two at '+index+' '+hi.toString(16)+' '+lo.toString(16) );
            }
            // else bingo - a surrogate pair we have
            else {
                found.push( [ index-=2, 2, compileSurrogate(hi,lo), match ] );
                //log( 'surrogate at '+index+' '+compileSurrogate(hi,lo).toString(16) );
            }
        }
        return found;
    }
    
    
    // convert emoji in a text node
    //
    function emojifyTextNode( textNode ){

        var text = textNode.nodeValue,
            found = findEmoji( text );
        if( ! found.length ){
            return;
        }

        // build new element stucture inside single span to keep child node count the same
        var wrapNode = createElement(confClass), 
            i = -1, next = 0, index, code, length, name;

        while( ++i < found.length ){
            match = found[i][3];
            name  = emoji[match];
            if( ! name ){
                continue;
            }
            log( name );
            index  = found[i][0];
            length = found[i][1];
            code   = found[i][2];
            // content before emoji element if we've skipped some text
            if( index > next ){
                wrapNode.appendChild( createText( text.substring( next, index ) ) );
            }
            // splice in emoji element
            wrapNode.appendChild( createElement( 
                'emoji emoji-'+code.toString(16)+' emoji-'+name, match
            ) );
            // ready for next
            emojifyCount++;
            next = index + length;
        }
        // pick up any remaining text
        if( text.length > next ){
            wrapNode.appendChild( createText( text.substr(next) ) );
        }
        textNode.parentNode.replaceChild( wrapNode, textNode );
    }

    
    
    // convert emoji in an element attribute
    //
    function emojifyAttribute( element, attr, text ){
        text = text || element.getAttribute(attr);
        var found = findEmoji( text );
        if( ! found.length ){
            return;
        }          
        // can't do replacement in element attribute, can only set classname and add to count
        var classes = element.className ? element.className.split(/\s+/) : [];
        classes.push(confClass);
        element.className = classes.join(' ');
        emojifyCount += found.length;
    }
    
    
    
    // Recursively find every text node and its parent element
    //
    function descend( parent ){
        // skip node if it's already converted in a previous run
        if( -1 !== parent.className.indexOf(confClass) ){
            return;
        }
        // skip node if it has no children
        var length = parent.childNodes.length;
        if( ! length ){
            // support field input values
            parent.hasAttribute('value') && emojifyAttribute( parent, 'value', parent.value );
            return;
        }
        // skip tags we know will never contain emoji
        switch( parent.tagName ){
        case 'STYLE':
        case 'SCRIPT':
            return;
        }
        // ok to descend into this element
        var i = -1, child;
        while( ++i < length ){
            child = parent.childNodes[i];
            switch( child.nodeType ){
            case 1:
                descend( child );
                break;
            case 3:
                emojifyTextNode( child );
                break;
            }
        }
    }
    
    
    // convert all text nodes
    descend( body );
    
    //log('Emojified: '+emojifyCount);
    
    // load CSS and Emoji fonts if needed and not already loaded
    if( emojifyCount && ! window.emojiLoaded ){
        var link = createElement('','','link');
        link.setAttribute('href', confScript.replace('/js/emoji.js','/css/emoji-'+confTheme+'.css') );
        link.setAttribute('rel','stylesheet');
        head.appendChild( link );
        //
        emojifyLoaded = true;
    }

    // expose function to global scope
    window.OSEmoji = {
        convert: descend
    };
    
} )( 
    window, document, 
    // Map of Pahntom Emoji name mappings indexed by single character
    {"\ud83d\ude01":"grin","\ud83d\ude02":"face_with_tear_of_joy","\ud83d\ude03":"smiley","\ud83d\ude04":"smile","\ud83d\ude05":"sweat_smile","\ud83d\ude06":"laughing","\ud83d\ude09":"wink","\ud83d\ude0a":"blush","\ud83d\ude0b":"face_savouring_delicious_food","\ud83d\ude0c":"relieved","\ud83d\ude0d":"heart_eyes","\ud83d\ude0f":"smirk","\ud83d\ude12":"unamused","\ud83d\ude13":"sweat","\ud83d\ude14":"pensive_face","\ud83d\udd67":"","\ud83d\ude18":"kissing_heart","\ud83d\ude1a":"kissing_closed_eyes","\ud83d\ude1c":"stuck_out_tongue_winking_eye","\ud83d\ude1d":"stuck_out_tongue_closed_eyes","\ud83d\ude1e":"disappointed_face","\ud83d\ude20":"angry_face","\ud83d\ude21":"pouting_face","\ud83d\ude22":"crying_face","\ud83d\ude23":"persevering_face","\ud83d\ude24":"face_with_look_of_triumph","\ud83d\ude25":"disappointed_but_relieved_face","\ud83d\ude28":"fearful_face","\ud83d\ude29":"weary_face","\ud83d\ude2d":"loudly_crying_face","\ud83d\ude30":"face_with_open_mouth_and_cold_sweat","\ud83d\ude32":"astonished_face","\ud83d\ude33":"flushed","\ud83d\ude35":"dizzy_face","\ud83d\ude37":"face_with_medical_mask","\ud83d\ude38":"grinning_cat_face_with_smiling_eyes","\ud83d\ude39":"cat_face_with_tears_of_joy","\ud83d\ude3a":"smiling_cat_face_with_open_mouth","\ud83d\ude3b":"smiling_cat_face_with_heart_shaped_eyes","\ud83d\ude3c":"cat_face_with_wry_smile","\ud83d\ude3d":"kissing_cat_face_with_closed_eyes","\ud83d\ude3e":"pouting_cat_face","\ud83d\ude3f":"crying_cat_face","\ud83d\ude40":"weary_cat_face","\ud83d\ude45":"face_with_no_good_gesture","\ud83d\ude46":"face_with_ok_gesture","\ud83d\ude47":"person_bowing_deeply","\ud83d\ude48":"see_no_evil_monkey","\ud83d\ude49":"hear_no_evil_monkey","\ud83d\ude4a":"speak_no_evil_monkey","\ud83d\ude4b":"happy_person_raising_one_hand","\ud83d\ude4c":"person_raising_both_hands_in_celebration","\ud83d\ude4d":"person_frowning","\ud83d\ude4e":"person_with_pouting_face","\ud83d\ude4f":"person_with_folded_hands","\u270c":"victory_hand","\u2764":"heart","\ud83d\ude8f":"bus_stop","\ud83d\ude97":"car","\ud83d\ude99":"RV","\ud83d\udea2":"ship","\ud83d\udeb9":"mens_symbol","\u2600":"sun","\u2601":"cloud","\u2615":"hot_beverage","\u263a":"smiling_face","\u264b":"cancer","\u2693":"anchor","\u26a1":"high_voltage_sign","\u3299":"circled_ideograph_secret","\ud83c\udf00":"cyclone","\ud83c\udf08":"rainbow","\ud83c\udf0c":"milky_way","\ud83c\udf11":"new_moon","\ud83c\udf13":"first_quarter_moon","\ud83c\udf14":"waxing_gibbous_moon","\ud83c\udf15":"full_moon","\ud83c\udf19":"crescent_moon","\ud83c\udf1b":"moon_with_face","\ud83c\udf1f":"glowing_star","\ud83c\udf20":"shooting_star","\ud83c\udf35":"cactus","\ud83c\udf4a":"tangerine","\ud83c\udf54":"hamburger","\ud83c\udf55":"pizza","\ud83c\udf59":"rice_ball","\ud83c\udf65":"fish_cake_with_swirl_design","\ud83c\udf70":"cake","\ud83c\udf71":"bento_box","\ud83c\udf79":"tropical_drink","\ud83c\udf7a":"beer_mug","\ud83c\udf83":"jack_o_lantern","\ud83c\udfa4":"microphone","\ud83c\udfae":"video_game","\ud83c\udfb8":"guitar","\ud83c\udfbe":"tennis_racquet_and_ball","\ud83c\udfc2":"snowboarder","\ud83c\udfe9":"love_hotel","\ud83d\udc0c":"snail","\ud83d\udc0d":"snake","\ud83d\udc14":"chicken","\ud83d\udc17":"boar","\ud83d\udc18":"elephant","\ud83d\udc19":"octopus","\ud83d\udc21":"blowfish","\ud83d\udc23":"hatching_chick","\ud83d\udc27":"penguin","\ud83d\udc28":"koala","\ud83d\udc2b":"bactrian_camel","\ud83d\udc31":"cat_face","\ud83d\udc33":"spouting_whale","\ud83d\udc34":"horse","\ud83d\udc36":"dog_face","\ud83d\udc38":"frog_face","\ud83d\udc3a":"wolf_face","\ud83d\udc3e":"paw_prints","\ud83d\udc4d":"thumbs_up_sign","\ud83d\udc6a":"family","\ud83d\udc6b":"couple_holding_hands","\ud83d\udc7b":"ghost","\ud83d\udc7d":"extraterrestrial_alien","\ud83d\udc80":"skull","\ud83d\udc8a":"pill","\ud83d\udc91":"couple_with_heart","\ud83d\udca9":"poop","\ud83d\udcac":"speech_balloon","\ud83d\udd1e":"no_one_under_eighteen_symbol","\ud83d\udd2b":"pistol","\ud83d\uddfb":"mount_fuji","\ud83d\ude00":"grinning","\ud83d\ude11":"expressionless","\ud83d\ude15":"confused","\ud83d\ude17":"kissing","\ud83d\ude19":"kissing_smiling_eyes","\ud83d\ude1b":"stuck_out_tongue","\ud83d\ude1f":"worried","\ud83d\ude26":"frowning","\ud83d\ude27":"anguished","\ud83d\ude2c":"grimacing","\ud83d\ude2e":"open_mouth","\ud83d\ude2f":"hushed","\ud83d\ude34":"sleeping","\ud83c\udf17":"last_quarter_moon","\ud83d\udc6c":"two_men_holding_hands","\ud83d\udc6d":"two_women_holding_hands"}
);