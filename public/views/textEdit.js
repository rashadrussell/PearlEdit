YUI.add('text-edit', function(Y) {

	var TextEdit;

	// TextEdit View
	// Responsible Editing text in DOM upon double click
	TextEdit = Y.Base.create('textEdit', Y.View, [], {

		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			
		},
		

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container');

			container.all('.pearl-edit').each(function(n) { 

				n.on('dblclick', function(e) {

					if( isText(e.target.get('tagName')) ) {

						var target 		= e.target,
							parentNode 	= target.get('parentNode'),
							text 		= target.get('innerText'),
							className 	= target.get('className'),
							height 		= target.get('clientHeight'),
							width 		= target.get('clientWidth'),
							fontSize 	= target.getStyle('fontSize'),
							fontFamily 	= target.getStyle('fontFamily'),
							fontWeight 	= target.getStyle('fontWeight'),
							padding  	= target.getStyle('padding'),
							margin 		= target.getStyle('margin'),
							changedContent;

						content = '<textarea style="height:' + height + 'px; width:' + width + 'px;" class="' + className + ' pearl-current-edit">' + text + '</textarea>';

						target.get('parentNode').replaceChild(content, e.target);

						parentNode.one('.pearl-current-edit').setStyles({
							'backgroundColor': 'transparent',
							'border': 'none',
							'margin': margin,
							'padding': padding,
							'fontFamily': fontFamily,
							'fontSize': fontSize,
							'fontWeight': fontWeight
						});

						parentNode.one('.pearl-current-edit').on('mouseleave', function(e) {

							changedContent = Y.Escape.html( this.get('value') );
							target.set('innerHTML', changedContent);
							parentNode.replaceChild(target, this);

						});

					}

				});
					
			});
			
			// Check if element is some form of a text element
			function isText(ele) {
				ele = ele.toLowerCase();

				if(ele === "p" || ele === "a" || ele === "li" || ele === "h1" || ele === "h2" || ele === "h3" || ele === "h4" || ele === "h5" || ele === "h6") {
					return true;
				} else {
					return false;
				} 
			}

			return this;
		},

	}, {

		
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});

	Y.namespace('Pearl').TextEdit = TextEdit;

}, '@VERSION@', {

	requires: [
		'view',
		'node',
		'escape',
		'event-mouseenter'
	]

});