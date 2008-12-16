(function() {

	function append(level, msg){
		if (typeof log != 'undefined') {
			var fn = log[level]
			return fn.call(log, msg)
		}
	}

	function debug(msg) {
		append('debug', msg)
	}

	function info(msg) {
		append('info', msg)
	}

	function warn(msg) {
		append('warn', msg)
	}

	function SureGrow(element) {
		var textarea = jQuery(element).css({
			overflow: 'hidden'
		})
		var shadow = document.createElement('textarea')
		jQuery(shadow).css({
			position: 'absolute',
			top: "-200%",
			fontFamily: textarea.css('fontFamily'),
			fontSize: textarea.css('fontSize'),
			fontVariant: textarea.css('fontVariant'),
			fontWeight: textarea.css('fontWeight'),
			fontStyle: textarea.css('fontStyle'),
			height: "2px",
			width: textarea.innerWidth(),
			padding: 0,
			overflowY: 'scroll'
		}).prependTo(document.body)

		//for Windows based toolkits, adjust the width to account for encroaching scrollbars
		setTimeout(function() {
			jQuery(shadow).width(jQuery(shadow).innerWidth() * 2 - shadow.scrollWidth)
			debug('adjusted scrollWidth: ' + shadow.scrollWidth)
		})
		debug('lineHeight: ' + document.defaultView.getComputedStyle(element, '').lineHeight)


		var currentHeight = null;

		function sync(now) {
			shadow.value = textarea.val()
			var height = shadow.scrollHeight
			if (height != currentHeight) {
				var lineHeight = new Number(jQuery(shadow).css('lineHeight').slice(0,2))
				debug('height: ' + currentHeight + " -> " + height + ": " + height / lineHeight + " lines.")
				if (height != 0) {
					sizeTo(height, now)
				} else {
					sizeTo(15, now)
				}
			}
		}

		function sizeTo(height, now) {
			if (now) {
				textarea.height(height)
				textarea.focus()
				currentHeight = height
			} else {
				currentHeight = height
				textarea.stop(true).animate({height: height}, 300, 'easeOutBounce').queue(function() {
//					textarea.focus()
					$(this).dequeue()
					setTimeout(function() {
						textarea.get(0).focus()
					}, 100)
				})
			}
		}

		textarea.keyup(function() {
			sync(jQuery.browser.msie)
		})

		sync(true)
	}


	jQuery.fn.extend({
		suregrow: function() {
			log.info('suregrow 1.0 init. ENV ->' + jQuery.browser.version)
			return this.each(function() {
				if (this.tagName == 'TEXTAREA' || this.tagName == 'textarea') {
					SureGrow(this)
					info('added suregrow behavior to textarea[@id=' + this.id + ']')
				} else {
					warn('cannot suregrow element ' + this.tagName)
				}
			})
		}
	});
})();