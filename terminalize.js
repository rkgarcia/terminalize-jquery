(function($) {
    
    $.fn.xterm_effect = function( vel , callbackFunction ) {
        this.each(function() {
            var $ele = $(this), str = $ele.text(), progress = 0;
            str = ( str.length%2 == 0 ) ? str = str + " " : str ;
            $ele.text('');
            var timer = setInterval(function() {
                $ele.text(str.substring(0, progress++) + (progress & 1 ? '_' : ''));
                if (progress > str.length){
                    clearInterval(timer);
                    if( callbackFunction != undefined ){
                        callbackFunction.call(this);
                    }
                }
            }, vel );
        });
        return this;
    };
    /*
    $.fn.terminalize_init = function( options ){
        var defaults = {
            prompt:'terminal>', // Text for prompt if not defined
            };
        options = $.extend({}, defaults, options);
        var loc_selector = $(this).selector;
        var terminals = $( loc_selector );
        allCommands = $( loc_selector + " .cmd");
        allResponses = $( loc_selector + " .cmd-response");
        allCommands.css("visibility","hidden");
        allResponses.css({"visibility":"hidden","display":"block"});
    }*/
    
    $.fn.terminalize = function( options ) {
        var defaults = {
            velocity: 120,      // Velocity of effect between chars
            activated: true,    // Indicated if activate inmediatly the effect
            mode: 'single',     // You can use all for show the effect in all terminals at same time
            prompt:'terminal>', // Text for prompt if not defined
            };
        options = $.extend({}, defaults, options);
        options.prompt += " ";
        var loc_selector = $(this).selector;
        var terminals = $( loc_selector );
        allCommands = $( loc_selector + " .cmd");
        allResponses = $( loc_selector + " .cmd-response");
        allCommands.css("visibility","hidden");
        allResponses.css({"visibility":"hidden","display":"block"});
        $(loc_selector).children('.prompt').remove();
        $( loc_selector ).prepend('<a class="prompt">'+options.prompt+'</a>');
        if( options.activated ){
            if( terminals.length > 1 ){
                if( options.mode === "single"){
                    walkTerm( 0 , $(terminals) );
                }else if( options.mode === "all" ){
                    var ar = Array();
                    terminals.each(function(index){
                        ar[index] = new cmds( 0 , $(terminals[ index ]) );
                    });
                }
            }
        }
        
        function walkTerm( index , aTerms ){
            len = aTerms.length;
            if( index < len ){
                terminal = aTerms[index];
                cmds( 0 , $(terminal) , function(){
                    walkTerm( index + 1 , aTerms );
                });
            }
        }
        
        function cmds( index , container , callbackfunction ){
            commands = container.children(".cmd");
            responses = container.children(".cmd-response");
            len = commands.length;
            if( index < len ){
                if(index===0){
                    commandtmp = container.children(".prompt");
                    cmdprmpt = $(commandtmp[0]);
                    cmdprmpt.remove();
                }
                cmdAct = $(commands[index]);
                cmdAct.before('<a class="prompt">'+options.prompt+"</a>");
                cmdAct.css("visibility","visible");
                cmdAct.xterm_effect( options.velocity , function(){
                    $(responses[index]).css("visibility","visible");
                    cmds( index+1 , container , callbackfunction );
                });
            }else{
                if( callbackfunction != undefined ){
                    callbackfunction.call(this);
                }
            }
        }
    }
    
})(jQuery);