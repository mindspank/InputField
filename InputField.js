define([
	'jquery', 
	'qlik', 
	'text!./style.css', 
	'./debounce', 
	'./input', 
	'./properties'
], function ($, qlik, css, debounce, $input, properties) {
	'use strict';
	
	$("<style>").html(css).appendTo("head");

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
						objecttype: {
							ref: "inputfield.objecttype",
							label: "Type of input",
							component: "dropdown",
							options: [{
									value: "input",
									label: "Input"
								}, {
									value: "singleslider",
									label: "Single value slider"
								}, {
									value: "dualslider",
									label: "Dual value slider"
								}],
							type: "string",
							defaultValue: "input"
						},
						inputmode: properties.input
					}			
				}
			}		
		},
		paint: function ($element, layout) {
			$element.empty();

			var app = qlik.currApp(this);
			
			app.variable.getByName(layout.inputfield.variablename)
			.then(function(variable) {
				return variable.getLayout()
			})
			.then(function(model) {
				if (isNaN(model.qNum)) {
					return $element.html( "Variable does not contain a value" );
				}
				switch (layout.inputfield.objecttype) {
					case 'input':
						return $input($element, layout, app, model);
						break;
						
					case 'singleslider':
						return console.log('not implemented');
						break;
							
					case 'dualslider':
						return console.log('not implemented');
						break;												
				
					default:
						break;
				}
				
			})
	
		}
	};

} );