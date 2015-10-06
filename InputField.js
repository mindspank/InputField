define( ['jquery', 'js/qlik', 'text!./style.css'], function ($, qlik, css) {

	$("<style>").html(css).appendTo("head");

	function debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
			fn.apply(context, args);
			}, delay);
		};
	}

	return {
		initialProperties: {
            version: 1,
        },
		definition: {
			type: "items",
			component: "accordion",
			items: {
				settings: {
                    uses: "settings"
				},
				variablesettings: {
					grouped: true,
					type: "items",
					label: 'InputField Settings',
					items: {
						variable: {
							ref: "inputfield.variablename",
							label: "Variable name",
							type: "string"			
						},                  
						confirmModeGroup: {
							type: "items",
							items: {
								confirmMode: {
									label: "Input mode",
									ref: "inputfield.confirmMode",
									type: "boolean",
									component: "buttongroup",
									defaultValue: false,
									options: [{
										label: "Enter key",
										value: false,
										tooltip: "Enter key confirms selection"
									}, {
										label: "As you type",
										value: true,
										tooltip: "Will update as you type"
									}]

								},
								timeout: {
									label: 'Wait between keys (ms)',
									ref: "inputfield.debounce",
									type: "number",
									expression: "optional",
                                    defaultValue: 250,
                                    show: function (d) {
                                        return d.inputfield.confirmMode;
                                    }
								}
							}
						}
					}			
				}
			}		
		},
		paint: function ($element, layout) {
			$element.empty();
			var $this = this;
			var app = qlik.currApp(this);
			
			app.variable.getByName(layout.inputfield.variablename)
			.then(function(variable) {
				return variable.getLayout()
			})
			.then(function(varlayout) {
				if (isNaN(varlayout.qNum)) {
					return $element.html( "Variable does not contain a value" );
				}
				
				var $input = $('<input style="width: 100%;" class="qui-input" value="' + varlayout.qNum + '">');
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
				$element.append($input)
			})
	
		}
	};

} );