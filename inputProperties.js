define([], function() {
	
	var inputProps = {
		type: "items",
		show: function(d) {
			return d.inputfield.objecttype === 'input'	
		},
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
	
	return inputProps;
	
})