/*!
 * Queensland Government Online Video Template
 * @version 0.8
 * @since 15/09/2011
 * @contact onlineservices@smartservice.qld.gov.au
 * 
 * @requires jQuery (tested with jQuery 1.4.2)
 * @requires jQuery UI (tested with jQuery UI 1.8.2)
 *             * jQuery UI core
 *             * jQuery UI widget
 *             * jQuery UI mouse
 *             * jQuery UI slider
 */
/*
 * References:
 *    * http://dev.aol.com/dhtml_style_guide#mediaplayer
 *    * http://www.longtailvideo.com/support/tutorials/Javascript-API-Examples
 *    * http://jqueryui.com/demos/slider/#slider-vertical
 *    * http://developer.longtailvideo.com/trac/wiki/FlashApi
 *    * http://developer.longtailvideo.com/trac/wiki/FlashEvents
 */
/*
	Can configure each template instance using the standard markup,
	or can override by initialising each player manually as per
	this example:
	
		$(document).ready(function(){
        
            $('#container-id.qg-ovt').qgOvt(options={
                playerswf      : 'cue/flash/player.swf'
                sourceflv    : '/qg/cue-video-template/template/media/video.flv', // optionally specify the sourcemp4 instead
                sourcemp4    : '',
				duration     : '0', // in total seconds
                ccfile       : '/qg/cue-video-template/template/media/video.xml',
                adfile       : '/qg/cue-video-template/template/media/video.mp3',
                poster       : '/qg/cue-video-template/template/media/video.jpg',
            });
        
        });
*/







/**
 * Check for existence of jQuery and initialise 'ovt' namespace
 */
if (typeof jQuery == 'undefined') {
	consoleMessage('Video player warning: Initialisation failed. jQuery is not available', 'error');
} else { /* Start if jQuery exists */
if (typeof jQuery.qg == 'undefined') { jQuery.qg = {}; }
if (typeof jQuery.qg.ovt == 'undefined') { jQuery.qg.ovt = {}; }
if (typeof jQuery.qg.ovt.instances == 'undefined') { jQuery.qg.ovt.instances = []; }




/**
 * Default options, these can be overridden for each call to qgvideo
 */
jQuery.qg.ovt.defaultOptions = {
	sourceflv     : '',
	sourcemp4     : '',
	adfile        : '',
	ccfile        : '',
	poster        : '',
	videowidth    : '640',
	videoheight   : '360',
	playerswf     : 'cue/flash/player.swf',
	accessswf     : '', // by default will be located in the same directory as playerswf
	//sharesubject  : 'I just watched: {videotitle}',
	//sharemessage  : 'I just watched {videotitle} at {videourl}',
	videourl      : '' // optional, set automatically to current URL if not passed as an option
};




/**
 * Global configuration (these apply to every instance of the OVT, etc...)
 */
jQuery.qg.ovt.conf = {
	containerClass       : 'qg-ovt',
	activeClass          : 'qg-ovt-active',
	containerSelector    : '.qg-ovt-active',
	pressedClass         : 'pressed',
	altsClass            : 'qg-ovt-alternatives',
	optionsClass         : 'qg-ovt-options',
	transcriptClass      : 'qg-ovt-transcript',
	playerClass          : 'qg-ovt-player',
	controlsClass        : 'qg-ovt-controls',
	posterClass          : 'qg-ovt-poster',
	innerClass           : 'qg-ovt-inner',
	embeddedClass        : 'qg-ovt-embedded',
	embedIdSuffix        : '-embedded',
	playText             : '|&gt;',
	playTitle            : 'Play',
	pauseText            : '||',
	pauseTitle           : 'Pause',
	openCCText           : 'Captions',
	openCCTitle          : 'Open captions',
	closeCCText          : 'Captions',
	closeCCTitle         : 'Close captions',
	openADText           : 'Audio description',
	closeADText          : 'Audio description',
	openADTitle          : 'Play description',
	closeADTitle         : 'Mute description',
	openTranText         : 'Transcript',
	closeTranText        : 'Transcript',
	openTranTitle        : 'Show transcript',
	closeTranTitle       : 'Hide transcript',
	openFullscreenText   : 'FS',
	openFullscreenTitle  : 'Launch fullscreen',
	closeFullscreenText  : 'FS',
	closeFullscreenTitle : 'Close fullscreen',
	openFullscreenText   : 'FS',
	progressTitlePrefix  : 'Current position: ',
	durationTitlePrefix  : 'Video duration: ',
	volumeText           : 'Vol',
	volumeTitle          : 'Volume',
	unpressedVolumeTitle : 'Mute audio',
	pressedVolumeTitle   : 'Enable audio',
	//clearPixelImg        : '<img src="images/displacement.png" alt="" />',	
	//shareLink            : '<li class="share"><a href="mailto:?subject={subject}&body={message}">Share</a></li>',
	transcriptLink       : '<li class="transcript"><a href="#">Transcript</a></li>',
	flashEmbedTemplate   :
		  '<div class="qg-ovt-player-wrapper"><object data="{playerswf}" id="{videoid}" class="qg-ovt-embedded" type="application/x-shockwave-flash" width="640" height="360" tabindex="-1">'
		+ '<param name="movie" value="{playerswf}" />' // redundant param or IE 6, 7 and 8 will hang :(
		+ '<param value="true" name="allowfullscreen">'
		+ '<param value="always" name="allowscriptaccess">'
		+ '<param name="wmode" value="transparent">'
		+ '<param value="id={videoid}&amp;file={videofile}&amp;image={poster}&amp;captions={ccfile}&amp;audio={adfile}'
		+ '&amp;plugins={accessswf}&amp;accessibility.fontsize=16&amp;accessibility.volume=75&amp;accessibility.hide=true'
		+ '&amp;accessibility.mute=true&amp;mute=false&amp;volume=85" name="flashvars">'
		+ '</object></div>',
	controlsTemplate      :
		  '<div class="qg-ovt-controls"><ul>'
		+ '<li class="play"><a href="#" title="Play"><img src="cue/images/video/displacement.png" alt="" class="for-css-replacement" /><span>|></span></a></li>'
		+ '<li class="progress-bar"></li>'
		+ '<li class="progress" title="Current position"></li>'
		+ '<li class="duration" title="Video duration"></li>'
		+ '<li class="volume"><a href="#" title="Volume"><img src="cue/images/video/displacement.png" alt="" class="for-css-replacement" /><span>*)</span></a></li>'
		+ '<li class="captions"><a href="#" title="Captions"><img src="cue/images/video/displacement.png" alt="" class="for-css-replacement" /><span>CC</span></a></li>'
		+ '<li class="audio-description"><a href="#" title="Audio Description"><img src="cue/images/video/displacement.png" alt="" class="for-css-replacement" /><span>AD</span></a></li>'
		// + '<li class="fullscreen"><a href="#" title="Fullscreen"><img src="cue/images/video/displacement.png" alt="" class="for-css-replacement" /><span>FS</span></a></li>'
		+ '</ul></div>'
};





/**
 * Function defined as per JW Player API.
 * This function is called after a new JW Player instance is initialised.
 */
function playerReady(obj) {
	try {
		$('#'+obj['id']).activateQGVideo();
	} catch (e) {
		consoleMessage(e);
	}
};






(function($) { /* start closure */
	
	// Are we in IE6? Cache the result, we call this a few times :(
	$.browser.msie6 = $.browser.msie && $.browser.version < 7;
	
	
	/**
	 * The main jQuery plugin.
	 * 
	 * @this A node list of video template containers (.qg-ovt) that were passed to this plugin.
	 * @param options a JSON object of options
	 * @return true if all were instances were initialised successfully. false if there was an error.
	 *         Warnings are output to the JavaScript console on error.
	 */
	$.fn.qgOvt = function (options) {
		
		// Require Flash 9.0.115
		// @see http://www.longtailvideo.com/support/jw-player/jw-player-for-flash-v4/12203/supported-player-embed-methods
		if (!DetectFlashVer(9, 0, 115)) {
			consoleMessage('Online video template was not initialised. The template requires Flash 9.0.115 or later.','info');
			return;
		}
		
		// Merge runtime options with defaults
		// Note: The first argument sent to extend is an empty object to
		// prevent extend from overriding the default $.AKN.defaultOptions object.
			options = (typeof options == 'undefined')
				? $.qg.ovt.defaultOptions
				: $.extend({}, $.qg.ovt.defaultOptions, options)
			;
		// TODO ensure this user agent supports all required functionality to run the player (flash version etc), or throw notice and bail!
		
		success = true;
		$(this).each(function () {
			success = initQGVideoTemplate.apply(this, [options]) !== false ? success : false ;
		});
		
		return success;
	};
	
	
	
	/**
	 * Initialises a video template instance. Called by qgOvt for each video template container
	 * matched when calling the plugin.
	 * 
	 * @this A video template container (.qg-ovt)
	 * @param options a JSON object of options
	 * @return false on error. true on success.
	 */
	initQGVideoTemplate = function (options) {
		
		// if already initialised, return
			if ($(this).is('.qg-ovt-active')) {
				return;
			}
			
		// Enforce that each video has a unique id (or throw error)
			containerId = $(this).attr('id')+'';
			if (containerId == '' || $.inArray(containerId, $.qg.ovt.instances) !== -1) {
				consoleMessage('Video player warning: Initialisation failed. Each video template container must have a unique id', 'error');
				return false;
			}
			$.qg.ovt.instances[$.qg.ovt.instances.length] = containerId;
			
			
		// set embedded video id
			options.videoid = containerId+$.qg.ovt.conf.embedIdSuffix;
		
		// Get final options merged with information parsed from HTML
			if ((options = parseVideoHTML.apply(this, [options])) === false) {
				// The Video HTML does not meet expectations, return false.
				// Warnings will have been generated in the console.
				return false;
			}
		
		// Store options on video container
			$(this).data('options', options);
		
		// Decorate HTML with extra elements needed
			return decorateQGVideoTemplate.apply(this, [options]);
	};
	
	
	
	/**
	 * Supplements the options on calling the qgOvt plugin with information from the
	 * markup within the video template container (.qg-ovt).
	 * This way the plugin can take as much information as possible directly from the
	 * HTML, requiring limited options to be passed to the plugin on initialisation.
	 * This also allows a generic initialisation to be used for all videos, because the
	 * specific infomation for each video can be embedded in the HTML.
	 * For example (once document is ready): $('.qg-ovt').qgOvt();
	 * 
	 * @this A video template container (.qg-ovt)
	 * @param options a JSON object of options
	 * @return false on error. Array of final merged options.
	 */
	parseVideoHTML = function (options) {
		
		// Find video file. flv and mp4 only supported at this time
			options.duration = (typeof options.duration != 'undefined') ? options.sourceflv : '0' ; // in total seconds
			videofile = videoLink = '';
			
			if (typeof options.sourceflv != 'undefined' && options.sourceflv != '') {
				videofile = options.sourceflv;
			} else if (typeof options.sourcemp4 != 'undefined' && options.sourcemp4 != '') {
				videofile = options.sourcemp4;
			} else {
				// must rely on links
					flvLink = $(this).find('.'+$.qg.ovt.conf.optionsClass+' a[type*="video/flv"]');
					mp4Link = $(this).find('.'+$.qg.ovt.conf.optionsClass+' a[type*="video/mp4"]');
					if (flvLink.size() > 0) {
						videofile = (sourceflv = flvLink.get(0).href)+'' != 'undefined' ? sourceflv : '' ;
						videoLinkText = flvLink.text();
					} else if (mp4Link.size() > 0) {
						videofile = (sourcemp4 = mp4Link.get(0).href)+'' != 'undefined' ? sourcemp4 : '' ;
						videoLinkText = mp4Link.text();
					}
				// parse duration from link
					if (videoLinkText != '') {
						
						hours   = (hours   = videoLinkText.match(/(\d*) hours?/i))   ? parseInt(hours[1],   10) : 0 ;
						minutes = (minutes = videoLinkText.match(/(\d*) minutes?/i)) ? parseInt(minutes[1], 10) : 0 ;
						seconds = (seconds = videoLinkText.match(/(\d*) seconds?/i)) ? parseInt(seconds[1], 10) : 0 ;
						
						options.duration =  hours*60*60 + minutes*60 + seconds;
						
					}
			}
			options.videofile = videofile;
			
			if (videofile == '') {
				consoleMessage ('Video player warning: Initialisation failed. No acceptable video file could be found (flv, mp4)', 'warn');
				return false; // This is a show stopper, return false
			}
		
		
		// find CC files
			options.ccfile = (typeof options.ccfile != 'undefined' && options.ccfile != '') ? options.ccfile
	                       : (ccfile = $(this).find('.'+$.qg.ovt.conf.optionsClass+' .captions a').get(0).href)+'' != 'undefined' ? ccfile : '' ;
			if (options.ccfile == '') {
				consoleMessage ('Video player warning: No captions file could be found (timed text xml)', 'warn');
			}
		
		
		// find AD files
			options.adfile = (typeof options.adfile != 'undefined' && options.adfile != '') ? options.adfile
	                       : (adfile = $(this).find('.'+$.qg.ovt.conf.optionsClass+' .audio-description a').get(0).href)+'' != 'undefined' ? adfile : '' ;
			if (options.adfile == '') {
				consoleMessage ('Video player notice: No audio description file could be found (mp3)', 'notice');
			}
		
		// find poster image
			options.poster = (typeof options.poster != 'undefined' && options.poster != '') ? options.poster
	                       : (poster = $(this).find('.'+$.qg.ovt.conf.posterClass).get(0).src)+'' != 'undefined' ? poster+'' : '' ;
			if (options.poster == '') {
				consoleMessage ('Video player notice: No poster image could be found (jpg, png)', 'notice');
			}
			
		// Guess location of accessibility plugin
			options.accessswf = (options.accessswf != '') ? options.accessswf : options.playerswf.substr(0, options.playerswf.lastIndexOf('/'))+'/accessibility.swf';
		
		// Determine video title and URL
			options.videotitle = $(this).find(':header:first').text();
			options.videourl = (options.videourl != '') ? options.videourl : window.location+'' ;
		
		return options;
	};
	
	
	
	
	
	/**
	 * Converts/decorates the starting markup into markup needed to support the final video template
	 * 
	 * @this A video template container (.qg-ovt)
	 * @param options a JSON object of options
	 * @return false on error. true on success
	 */
	decorateQGVideoTemplate = function (options) {
		
		// Flash player only supported option at this time (HTML5 video can be worked in later for browsers that support it)
			embedCode = $.qg.ovt.conf.flashEmbedTemplate
				.replace(/{videoid}/g, options.videoid)
				.replace(/{playerswf}/g, options.playerswf)
				.replace(/{accessswf}/g, options.accessswf)
				.replace(/{videofile}/g, options.videofile)
				.replace(/{poster}/g, options.poster)
				.replace(/{ccfile}/g, options.ccfile)
				.replace(/{adfile}/g, options.adfile)
			;
			// consoleMessage( embedCode );
		
		/*
		// Define email subject and message for "Share" button/link
			subject = encodeURIComponent(options.sharesubject
				.replace(/{videotitle}/g, options.videotitle)
				.replace(/{videourl}/g, options.videourl)
			);
			message = encodeURIComponent(options.sharemessage
				.replace(/{videotitle}/g, options.videotitle)
				.replace(/{videourl}/g, options.videourl)
			);
			shareLink = $.qg.ovt.conf.shareLink
				.replace(/{subject}/g, subject)
				.replace(/{message}/g, message)
			;
		*/
		// embed element
			embedElement = $('<div class="'+$.qg.ovt.conf.playerClass+'"></div>').append(embedCode+$.qg.ovt.conf.controlsTemplate);
		
		
		// Resize to fit container
			//resizePlayerToFitContainer.apply(vidContainer);
			
		// Wrap transcript in extra div
			transcript = $('<div class="'+$.qg.ovt.conf.innerClass+'"></div>')
				.append($(this).find('.'+$.qg.ovt.conf.transcriptClass).contents());
		
		// Wrap download text in span (so layout CSS will work)
			downloadElement = $(this).find('.'+$.qg.ovt.conf.optionsClass+' .download');
			downloadList = downloadElement.find('ul');
			downloadElement.find('ul').remove();
			downloadLabel = downloadElement.text();
			downloadElement.empty().append('<span class="label">'+downloadLabel+'</span>').append(downloadList);
		
		// Wrap download option link text in spans so parts can be visually hidden
			$(this).find('.'+$.qg.ovt.conf.optionsClass+' .download a').each(function(){
				linkText = $(this).text();
				
				
				$(this)
					.attr('title', linkText)
					.empty().append(
						// Transform 'The video title (2 hours 3 minutes 10 seconds, FLV 3MB)' into '<span>The video title (2 hours 3 minutes 10 seconds, </span>FLV<span> 3MB)</span>'
							linkText.replace(/(.*\(.*, )([a-z0-9]*?)( .*\))/i, '<span>$1</span>$2<span>$3</span>')
					)
				
			});
			
		// Final decorations to the player
			$(this)
				.find('.'+$.qg.ovt.conf.posterClass).remove().end() // remove fallback poster image
				.find('.'+$.qg.ovt.conf.optionsClass+' .captions').remove().end() // remove captions link
				.find('.'+$.qg.ovt.conf.optionsClass+' .audio-description').remove().end() // remove audio description link
				.find('.'+$.qg.ovt.conf.altsClass).before(embedElement) // inject video code
					.find('ul.'+$.qg.ovt.conf.optionsClass).append(/*shareLink+*/$.qg.ovt.conf.transcriptLink).end().end() // add share and transcript to options
				.find('.'+$.qg.ovt.conf.optionsClass+' .download ul li:last').addClass('last-child').end() // add last-child class to last download li
				.find('.'+$.qg.ovt.conf.transcriptClass).empty().append(transcript).hide().end() // replace transcript with wrapped version
				.find('.'+$.qg.ovt.conf.optionsClass+' a, .'+$.qg.ovt.conf.controlsClass+' a').focusClass().end() // fix a:focus for IE by adding .focus class
				.find('.qg-ovt-overlay').css({'z-index':4}).end()
				.removeClass($.qg.ovt.conf.containerClass)
				.addClass($.qg.ovt.conf.activeClass)
			;
		
		
		
		// init duration display
			updateDuration(this, options.duration);
			updateProgress(this, 0, options.duration);
		
		// Set height now to avoid layout bugs as flash resizes
			resizePlayerToFitContainer.apply(this);
		
		
		// IE 6 & 7 won't auto-expand downloads list based on contents. Set fixed width here:
			if ($.browser.msie && parseInt($.browser.version) < 8) {
				totalWidth = 0;
				downloadElement.children().each(function(){
					totalWidth += parseInt($(this).outerWidth(true));
				});
				downloadElement.width(totalWidth+20); // 20 pixels is the error margin
			}
		
		
		// FIXME Return false if error ocurred.
		return true;
	};
	

	
	
	
	
	
		
	/**
	 * Called by JWPlayer when a video is ready. Initialises controls with functionality.
	 * 
	 * @this A video template container (.qg-ovt)
	 * @return 
	 */
	$.fn.activateQGVideo = function () {
		
		// store info on container
			vidContainer = getVidContainer(this);
			vidContainer.data('playerID', this.attr('id'));
			
		// init player
			$(this).addClass('cue-ovt-flash');
			var player = $(this).get(0);
		
		// add listeners
			player.addControllerListener("VOLUME", "volumeListener");
			player.addControllerListener("MUTE", "volumeListener");
			player.addModelListener("LOADED", "playPauseListener");
			player.addViewListener("PLAY", "playPauseListener");
			player.addModelListener("TIME", "progressListener");
		
		// init controls
			initVidControls(getVidControls(vidContainer));
	};
		
	
	
	
	
	
	/**
	 * Initialisation of UI states and assigning functionality
	 * 
	 * @param vidControls A jQuery node representing the list of control items.
	 * @return 
	 */
	initVidControls = function (vidControls) {
		
		var vidContainer = getVidContainer(vidControls);
		var playerID = vidContainer.data('playerID');
		var player = document.getElementById(playerID);
		options = vidContainer.data('options');
				
		// init play/pause button
			updatePlayButton(vidControls, false);
			vidControls.find('.play a').click( function(){
				
				vidContainer = getVidContainer(this);
				var playerID = vidContainer.data('playerID');
				var player = document.getElementById(playerID);
				
				if (vidContainer.data('state') != 'playing') {
					
					// JW API
						player.sendEvent("PLAY","true");
					
					// update text
						updatePlayButton(this, true);
						
						
					return false;
				} else {
					
					// JW API
						player.sendEvent("PLAY","false");
					
					// update text
						updatePlayButton(this, false);
						
					return false;
				}
			});
			
			
		
		// init captions button
			updateCCButton(vidControls, false);
			vidControls.find('.captions a').toggle(
				function(){
					var vidContainer = getVidContainer(this);
					var playerID = vidContainer.data('playerID');
					var player = document.getElementById(playerID);
					
					// JW API
						player.hideCaptions(false);
					
					// update text
						updateCCButton(vidContainer, true);
						
					return false;
				},
				function(){
					var vidContainer = getVidContainer(this);
					var playerID = vidContainer.data('playerID');
					var player = document.getElementById(playerID);
					
					// JW API
						player.hideCaptions(true);
					
					// update text
						updateCCButton(vidContainer, false);
						
					return false;
				}
			);
		
		// init audio description button
			updateADButton(vidControls, false);
			vidControls.find('.audio-description a').toggle(
				function(){
					var vidContainer = getVidContainer(this);
					var playerID = vidContainer.data('playerID');
					var player = document.getElementById(playerID);
					
					// JW API
						player.muteAudio(false);
					
					// update text
						updateADButton(vidContainer, isPressed=true);
						
					return false;
				},
				function(){
					var vidContainer = getVidContainer(this);
					var playerID = vidContainer.data('playerID');
					var player = document.getElementById(playerID);
					
					// JW API
						player.muteAudio(true);
					
					// update text
						updateADButton(vidContainer, isPressed=false);
						
					return false;
				}
			);
		
		// init transcript button
			updateTranscriptButton(vidControls, false);
			vidContainer.find('.transcript a').toggle(
				function(){
					var vidContainer = getVidContainer(this);
					var playerID = vidContainer.data('playerID');
					//var player = document.getElementById(playerID);
					
					// update text
						updateTranscriptButton(vidContainer, true);
								
					// Reveal transcript
						vidContainer.find('.qg-ovt-transcript').slideDown(function(){
							
							// Trigger layout recalc
								$(this).trigger('x-height-change');
						});
					
					
					return false;
				},
				function(){
					var vidContainer = getVidContainer(this);
					var playerID = vidContainer.data('playerID');
					//var player = document.getElementById(playerID);
					
					// Hide transcript
						vidContainer.find('.qg-ovt-transcript').slideUp(function(){
							// update text
								updateTranscriptButton(vidContainer, false);
							// Trigger layout recalc
								$(this).trigger('x-height-change');
						});
						
						
					return false;
				}
			);
			
		
		
		// insert volume slider code
			if ($.ui && typeof $.ui.slider != 'undefined') {
				vidControls.find('.volume')
					.append('<div class="volume-overlay"><div class="volume-slider"></div></div>')
					.find('.volume-overlay').hide()
					.find('.volume-slider').slider({
						range: 'min',
						orientation: "vertical",
						stop: function () {
							// when dragging stops, jump to position
								newPercent = $(this).slider('value');
								player.sendEvent("VOLUME", newPercent);	
						}
					})
				;
			} else {
				consoleMessage ('Video player warning: Volume slider could not be initialised. jQuery UI Slider was not found', 'warn');
			}
		// attach event handlers
			vidControls.find('.volume > a').click(function(){
				var vidContainer = getVidContainer(this);
				var playerID = vidContainer.data('playerID');
				var player = document.getElementById(playerID);
				volumeSlider = vidContainer.find('.volume-slider');
				
				// if currently muted
				if (player.getConfig().mute == true) {
					player.sendEvent("MUTE", false);
					volume = player.getConfig().volume;
				} else if (player.getConfig().volume == 0) {
					player.sendEvent("VOLUME", 100);
					volume = 100;
				} else {
					player.sendEvent("MUTE", true);
					volume = 0;
				}
				
				updateVolumeButton(vidContainer, volume);
				
				return false;
			})
			.parent()
				.bind('mouseover focusin', function(){
					var vidContainer = getVidContainer(this);
					vidContainer.find('.volume-overlay').show();
				})
				.bind('mouseout', function(){
					var vidContainer = getVidContainer(this);
					vidContainer.find('.volume-overlay').hide();
				})
				.find('.ui-slider-handle').bind('focusout', function() {
					var vidContainer = getVidContainer(this);
					vidContainer.find('.volume-overlay').hide();
				})
			;
		// init volume button
			updateVolumeButton(vidControls);
			
			
				
			
		// init progress bar
			//updateProgress(vidControls, 0);
			// Add progress bar. Toggle 'read' and 'write' mode.
			// 'write' mode is for user interactions, 'read' mode is for displaying user feedback).
				if ($.ui && typeof $.ui.slider != 'undefined') {
					vidControls.find('.progress-bar').data('uimode','read').slider({
						range: 'min',
						start: function () {
							// when dragging starts, progress updates should stop
								$(this).data('uimode','write');
								
						},
						stop: function () {
							// when dragging stops, jump to position
								newPercent = $(this).slider('value');
								// how many seconds?
									newValue = newPercent/100 * $(this).data('duration');
								container = getVidContainer(this);
								player = getVidPlayer(container);
								player.sendEvent("SEEK", newValue);
								
								if (container.data('state') != 'playing') {
									player.sendEvent("PLAY","false");
								}
								
							// then progress update should start again
								$(this).data('uimode','read');
								
						}
					}).slider('disable');
				} else {
					consoleMessage ('Video player warning: Progress bar could not be initialised. jQuery UI Slider was not found', 'warn');
				}
			vidControls.find('.progress-bar .ui-slider-range').after('<div class="load-progress"></div>');
		
		
	};
	
	
	
	
	
	
	
	
	
	
/**
 * Event listener functions to keep HTML UI up to date based on
 * video progress and state changes
 */
	progressListener = function (obj) {
		
		// init
			var vidControls = getVidControls($('#'+obj.id));
			var progressControl = vidControls.find('.progress-bar').eq(0);
		
		// When the progress reaches the end then jumps to begining, the video has ended.
		// Reset play button.
			if (progressControl.data('progress') == obj.duration && obj.position == 0) {
				// we just stopped!
				var vidContainer = getVidContainer(vidControls);
				var player = document.getElementById(obj.id);
				player.sendEvent("PLAY","false"); // just make sure it's stopped
				vidContainer.data('state','paused');
				vidContainer.removeClass('playing');
				updatePlayButton(vidContainer, false);
			}
		
		// update timers
			updateDuration (vidControls, Math.floor(obj.duration));
			updateProgress (vidControls, Math.floor(obj.position), Math.floor(obj.duration));
			progressControl.data('progress', obj.position);
		
		
		
		// test if progressbar should be updated now?
			if (progressControl.data('uimode') == 'write') {
				// progressbar is being interacted with, don't update
				return;
			}
		
		// ensure slider is enabled, and update duration value
			if ($.ui && typeof $.ui.slider != 'undefined') {
				progressControl.slider('enable');
				progressControl.data('duration', obj.duration);
				progressPercent = obj.position/obj.duration*100;
				progressControl.slider('value', progressPercent);
			}
	};
	
	
	
	playPauseListener = function (obj) {
		
		
		var container = getVidContainer($('#'+obj.id));
		
		// gets loading information too
		if (typeof obj.loaded != 'undefined') {
			loadedPercent = Math.floor(obj.loaded / obj.total * 100);
			container.find('.progress-bar .load-progress').width(loadedPercent+'%');
			$('#loaded span').text(loadedPercent);
			
			if (loadedPercent == 100) {
				container.addClass('loaded');
			}
			return;
		}
		
		
		// More complicated and unpredicatble behaviour from JW Player
		if (typeof obj.state == 'undefined' && typeof obj.loaded == 'undefined') {
			// We have an anonymous trigger, assume play/pause toggle from flash movie
			if (container.data('state') != 'playing') {
				obj.state = true;
			} else {
				obj.state = false;
			}
			
		}
		
		//if (typeof obj.state != 'undefined') {
			if (obj.state != false) {
				container.data('state','playing');
				container.addClass('playing');
			} else {
				container.data('state','paused');
				container.removeClass('playing');
			}
		//}
		
		updatePlayButton(container, obj.state);
	};
	
	
	
	volumeListener = function (obj) {
		
		var container = getVidContainer($('#'+obj.id));
		var playerID = container.data('playerID');
		var player = document.getElementById(playerID);
		
		volume = player.getConfig().mute ? 0 : player.getConfig().volume;
		
		updateVolumeButton(container, volume);
	};
	
	
	
	
	
	
	
	
	
	
	
	

/**
 * Update functions to keep button states in sync with Flash UI
 */
	updatePlayButton = function (element, isPressed) {
		isPressed = typeof isPressed != 'undefined' ? isPressed : false;
		container = getVidContainer(element);
		buttonEl = container.find('.play a');
		if (isPressed || container.data('state') == 'playing') {
			$(buttonEl)
				.attr('title',$.qg.ovt.conf.pauseTitle)
				.addClass('pressed')
				.find('.span').text($.qg.ovt.conf.pauseText)
			;
		} else {
			$(buttonEl)
				.attr('title',$.qg.ovt.conf.playTitle)
				.removeClass('pressed')
				.find('.span').text($.qg.ovt.conf.playText)
			;
		}
	};
	
	updateCCButton = function (element, isPressed) {
			isPressed = typeof isPressed != 'undefined' ? isPressed : false;
			
			container = getVidContainer(element);
			buttonEl = container.find('.captions a');
			
				if (isPressed){ //|| container.data('ccstate') == 'playing') {
					$(buttonEl)
						.find('.span').text($.qg.ovt.conf.closeCCText).end()
						.attr('title', $.qg.ovt.conf.closeCCTitle)
						.addClass('pressed')
					;
				} else {
					$(buttonEl)
						.find('.span').text($.qg.ovt.conf.openCCText).end()
						.attr('title', $.qg.ovt.conf.openCCTitle)
						.removeClass('pressed')
					;
				}
	};
	
	updateADButton = function (element, isPressed) {
			isPressed = typeof isPressed != 'undefined' ? isPressed : false;
			
			container = getVidContainer(element);
			buttonEl = container.find('.audio-description a');
			
				if (isPressed){ //|| container.data('adstate') == 'playing') {
					$(buttonEl)
						.find('.span').text($.qg.ovt.conf.closeADText).end()
						.attr('title', $.qg.ovt.conf.closeADTitle)
						.addClass('pressed')
					;
				} else {
					$(buttonEl)
						.find('.span').text($.qg.ovt.conf.openADText).end()
						.attr('title', $.qg.ovt.conf.openADTitle)
						.removeClass('pressed')
					;
				}
	};
	
	updateTranscriptButton = function (element, isPressed) {
			isPressed = typeof isPressed != 'undefined' ? isPressed : false;
			
			container = getVidContainer(element);
			buttonEl = container.find('.transcript a');
			
			
				if (isPressed){
					$(buttonEl)
						.text($.qg.ovt.conf.closeTranText)
						.attr('title', $.qg.ovt.conf.closeTranTitle)
						.addClass('pressed')
					;
				} else {
					$(buttonEl)
						.text($.qg.ovt.conf.openTranText)
						.attr('title', $.qg.ovt.conf.openTranTitle)
						.removeClass('pressed')
					;
				}
	};
	
	updateFSButton = function (element, isFullscreen) {
		// FIXME: init only ATM (fullscreen not implemented)
			container = getVidContainer(element);
			buttonEl = container.find('.fullscreen a');
			$(buttonEl).find('.span').text($.qg.ovt.conf.openFullscreenText);
	};
	
	updateVolumeButton = function (element, volume) {
		
			container = getVidContainer(element);
			vidControls = getVidControls(container);
				
			var playerID = container.data('playerID');
			var player = document.getElementById(playerID);
			
			
			if (typeof volume == 'undefined') {
				volume = player.getConfig().volume;
			}
			
			buttonEl = container.find('.volume a');
			$(buttonEl)
				.attr('title',$.qg.ovt.conf.unpressedVolumeTitle)
				.find('.span').text($.qg.ovt.conf.volumeText)
				.data('volume', volume);
			;
			
			buttonEl.removeClass('pressed vol-muted vol-low vol-medium vol-high');
			
			if (volume == 0) {
				// muted
				buttonEl
					.addClass('pressed')
					.addClass('vol-muted')
					.attr('title', $.qg.ovt.conf.pressedVolumeTitle)
				;
			} else if (volume < 40) {
				// low
				buttonEl.addClass('vol-low');
			} else if (volume < 75) {
				// med
				buttonEl.addClass('vol-medium');
			} else {
				// high
				buttonEl.addClass('vol-high');
			}
			
			// update slider also
				vidControls.find('.volume-slider').slider('value',volume);
			
	};
	updateProgress = function (element, progress, duration) {
			
			formatted = secondsFormatted(progress, duration);
			
			container = getVidContainer(element);
			uiEl = container.find('.progress');
			if (typeof duration != 'undefined' && $(uiEl).text() != formatted[0] + ' /') {
				$(uiEl).text(formatted[0] + ' /');
				$(uiEl).attr('title', $.qg.ovt.conf.progressTitlePrefix+formatted[1]);
			}
	};
	updateDuration = function (element, duration) {
			
			formatted = secondsFormatted(duration, duration);
			
			container = getVidContainer(element);
			
			uiEl = container.find('.duration');
			if ($(uiEl).text() != formatted[0]) {
				$(uiEl).text(formatted[0]);
				$(uiEl).attr('title', $.qg.ovt.conf.durationTitlePrefix+formatted[1]);
			}
	};
	
	
	
/*     RESIZING     */
	
	/**
	 * Update the dimensions of the video container, player wrapper, 
	 * embedded player flash object and fallback poster img within.
	 */
	updateDimensions = function(container, availableDimensions) {
		$(container).css({
				'width': availableDimensions.width
			})
			.find('.qg-ovt-player-wrapper')
				.css({
					'width': availableDimensions.width,
					'height': availableDimensions.height
				})
			.find('object')
				.attr('width', availableDimensions.width)
				.attr('height', availableDimensions.height)
		;
		
		// Progressbar takes up whatever space is left
			progressBar = $(container).find('.progress-bar');
			parentWidth = progressBar.parent().width();
			siblingsWidth = 0;
			progressBar.siblings().each(function(){
				siblingsWidth += $(this).outerWidth(true);
			});
			
			// 5px error margin for the sake of Firefox 3.6.6 and 18 for IE 6 & 7
				errorMargin = $.browser.msie && $.browser.version < 8 ? 18 : 5 ;
			
			// Calculate available width for the progressbar
			availWidth = parentWidth - siblingsWidth - errorMargin;
			
			// if progress bar would be too small, calc new width based on play button only
				if (availWidth < 110) {
					availWidth = parentWidth - progressBar.prev().outerWidth(true) - 10;
					//progressBar.next().css('clear','left');
				}// else {
				//	progressBar.next().css('clear','none');	
				//}
			
			progressBar.css('width', availWidth);
			
	};
	
	
	resizeThrottleTimeoutID = null;
	//currentWindowWidth = $(window).width();
	
	/**
	 * When window resizes, wait to see if user is finished resizing,
	 * then trigger resize handler. Throttling the number of resize
	 * events in this way will improve performance.
	 */
	$(window).resize(function(){
		
		if ($.browser.msie6) {
			return; // IE6 has major issues with window resize that I just can't resolve
		}
		
		
		if (resizeThrottleTimeoutID != null) {
			window.clearTimeout(resizeThrottleTimeoutID);
			resizeThrottleTimeoutID = null;
		}
		
		//if (currentWindowWidth != $(window).width()) {
			
			resizeThrottleTimeoutID = window.setTimeout(function(){
				$('.qg-ovt-active').each(resizePlayerToFitContainer);
				//currentWindowWidth = $(window).width();
			}, 200);
		//}
	});
	
	resizePlayerToFitContainer = function(){
		
		options = $(this).data('options');
			
			// Work out how wide the video can be.
			// If IE6, pull video player out of flow before calculating how wide the parent container is.
			// Otherwise IE6 incorrectly stretches parent container to fit video.
				if ($.browser.msie6) { $(this).css('position','absolute'); }
					parentContainer = $(this).parent();
					availableDimensions = calculateDimensions(options.videowidth, options.videoheight, parentContainer.width());
				if ($.browser.msie6) { $(this).css('position','static'); }
				
				updateDimensions(this, availableDimensions);
	};
	
	/**
	 * Calculates the largest possible dimension for the video and keeps the two dimensoins in propotion.
	 * @param 
	 */
	calculateDimensions = function(defaultWidth, defaultHeight, availableWidth, availableHeight, expandPastDefaults) {
		
		defaultWidth = parseInt(defaultWidth,10);
		defaultHeight = parseInt(defaultHeight,10);
		availableWidth = parseInt(availableWidth,10);
		availableHeight = typeof availableHeight != 'undefined' ? parseInt(availableHeight,10) : null ;
		expandPastDefaults = expandPastDefaults || false;
		
		// calc width
			if (availableWidth > defaultWidth) {
				if (expandPastDefaults) {
					width = availableWidth;
				} else {
					width = defaultWidth;
				}
			} else {
				width = availableWidth;
			}
		
		// Adjust height proprtionally
			scaleFactor = defaultWidth/width;
			height = defaultHeight/scaleFactor;
		
		// should we check against height also?
			if (availableHeight != null) {
				
				// calc height
					if (availableHeight < height) {
						// Adjust height proprtionally
						scaleFactor = availableHeight/height;
						height = availableHeight;
						width = width/scaleFactor;
					}
			}
		
		width = parseInt(width,10);
		height = parseInt(height,10);
		
		/*
		consoleMessage('defaultWidth: '+defaultWidth);
		consoleMessage('defaultHeight: '+defaultHeight);
		consoleMessage('availableWidth: '+availableWidth);
		consoleMessage('availableHeight: '+availableHeight);
		consoleMessage('expandPastDefaults: '+expandPastDefaults);
		consoleMessage('width: '+width);
		consoleMessage('height: '+height);
		*/
		
		return {
			'width': width,
			'height': height
		};
	};

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
	/**
	 * Functions to find various elements related to the current
	 * video template instance
	 */
	 	/**
		 * Get vid container, then find player within
		 */
		getVidPlayer = function (element) {
			if (!$(element).is($.qg.ovt.conf.containerSelector)) {
				element = getVidContainer(element);
			}
			return findVidPlayer(element);
		};
		/**
		 * Find Player within DOMNode
		 */
		findVidPlayer = function (element) {
			return $(element).find('.'+$.qg.ovt.conf.embeddedClass).get(0);
		};
		
		getVidControls = function (element) {
			if (!$(element).is($.qg.ovt.conf.containerSelector)) {
				element = getVidContainer(element);
			}
			return $(element).find('.'+$.qg.ovt.conf.controlsClass);
		};
		
		/**
		 * Look up the DOM tree for Container
		 */
		getVidContainer = function (element) {
			if ($(element).is($.qg.ovt.conf.containerSelector)) {
				return $(element);
			}
			return $(element).parents($.qg.ovt.conf.containerSelector);
		};
		
		/**
		 * Find Container within DOMNode
		 */
		findVidContainer = function (element) {
			if ($(element).is($.qg.ovt.conf.containerSelector)) {
				return $(element);
			}
			return $(element).find($.qg.ovt.conf.containerSelector);
		};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Utility functions
	 */
		padString = function (input, paddedLength, padStr) {
			while ((input+'').length < paddedLength) {
				input = padStr+input;
			}
			return input;
		};
		
		secondsFormatted = function (rawSeconds, maxSeconds) {
			
			if (parseInt(maxSeconds,10) == 0) {
				return ['',''];
			}
			
			totalSeconds = parseInt(rawSeconds,10);
			seconds = Math.floor(rawSeconds % 60);
			secondsPadded = padString(seconds, 2, '0'); // always pad seconds
			rawMinutes = Math.floor(rawSeconds / 60);
			minutes = Math.floor(rawMinutes % 60);
			//minutesPadded = $.qg.ovt.conf.zeroPadTimes ? padString(minutes, 2, '0') : minutes;
			hours = Math.floor(rawMinutes / 60);
			//hoursPadded = $.qg.ovt.conf.zeroPadTimes ? padString(hours, 2, '0') : hours;
			
			if (maxSeconds >= 3600) {
				formattedShort =  hours + ':' + padString(minutes, 2, '0') + ':' + secondsPadded;
			}
		 // always pad up to 0 minutes
			/*else if (maxSeconds >= 60) {
				formattedShort =  minutesPadded + ':' + secondsPadded;
			} */ 
			else {
				formattedShort =  minutes + ':' + secondsPadded;
				//formattedShort =  secondsPadded;
			}
			
			formattedLong = '';
			if (hours > 0) {
				formattedLong += hours + ' hour'+(hours != 1 ? 's' : '')+', ';
			}
			if (hours > 0 || minutes > 0) {
				formattedLong += minutes + ' minute'+(minutes != 1 ? 's' : '')+' and ';
			}
			formattedLong += seconds + ' second'+(seconds != 1 ? 's' : '');
			
			return [formattedShort, formattedLong];
		}
		
		
		/**
		 * Adds event listeners to add a focus class on focus and remove it on blur.
		 * 
		 * @this The element to add event listeners to
		 * @return The this element is returned to facilitate jQuery chaining
		 */
		$.fn.focusClass = function() {
			$(this)
				.focus(function() {		
					$(this).addClass("focus")
				})
				.blur(function(){
					$(this).removeClass("focus");
				})
			;
			return this; // facilitate jQuery chaining
		}
		


	/**
	 * When document is ready, prep and auto initialise video players
	 * if they are not already initialised.
	 */
	$(document).ready(function(){
		
		/* Ensure IE6 caches background images (avoid flicker) */
		if ($.browser.msie6) {
			document.execCommand("BackgroundImageCache",false,true);
		}
		
		// Auto-initialise videos based on markup.
		// If OVT has already been initialised the plugin will just exit quietly.
			if (typeof PATH_TO_OVT_PLAYER != 'undefined') {
				$('.qg-ovt').qgOvt(options={
					playerswf : PATH_TO_OVT_PLAYER
				});
			} else {
				$('.qg-ovt').qgOvt();
			}
	});
	
	
	
})(jQuery); /* end closure */
} /* end if jQuery exists */




/**
 * Sends messages to the JavaScript console if it exists
 * 
 * @param message The console message to display
 * @param type The type/level of message (error, warning, notice, log, debug)
 * @return void
 * @see http://davidwalsh.name/firebug-console-log
 */
consoleMessage = function (message, type) {
	// TODO fix logging to avoid JS 'undefined' errors
	if (typeof console != 'undefined') {
		switch (type) {
			case 'error': case 'exception':
				console.error(message);
			break;
			case 'warn': case 'warning':
				console.warn(message);
			break;
			case 'notice': case 'log':
				console.log(message);
			break;
			default: case 'debug':
				if (console.debug) {
					console.debug(message);
				} else {
					console.log(message);
				}
			break;
		}
	}
};