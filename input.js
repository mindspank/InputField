define([
	'jquery'
], function($) {
	'use strict';
	
	function input($element, layout, app, model) {
		var $input = $('<input style="width: 100%;" class="qui-input" value="' + model.qNum + '">');
		$input.keypress(function(event) {
			if (event.keyCode == 13 && layout.inputfield.confirmMode === false) {
				app.variable.setNumValue(layout.inputfield.variablename, +event.target.value)
			}
		})
		.keyup(function(event) {
			if( /^\d*$/.test(event.target.value) ) {
				$(this).removeClass('invalid')
			} else {
				$(this).addClass('invalid')
			}
			if (layout.inputfield.confirmMode && !$(this).hasClass('invalid') ) {
				return debounce(function() {
					app.variable.setNumValue(layout.inputfield.variablename, +event.target.value)
				}, +layout.inputfield.debounce)()
			}
		})
		return $element.append($input)		
	}
	
	return input;

});