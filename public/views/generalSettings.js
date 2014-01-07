YUI.add('general-settings', function(Y) {

	var GeneralSettings,
		GearEditButton = Y.Pearl.GearEditButton,
		TextEdit       = Y.Pearl.TextEdit,
		DDDOM          = Y.Pearl.DDDOM;

	// GeneralSettings View
	// Responsible for setting styles that will affect the entire HTML DOM such as background-color, font-color, font-size, etc.
	GeneralSettings = Y.Base.create('generalSettings', Y.View, [], {

		template: Y.one('#general-settings').getHTML(),

		events: {
			'.download'            : {click: 'downloadLayout'},
			'.layout-selector'     : {change: 'changeLayout'},
			'.font-size-selector'  : {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'},
			'.display-edit-buttons': {click : 'displayEditButtons'}
		},

		initializer: function() {
			var container = this.get('container');

			container.setHTML(this.template);
			Y.one('#header').append(container);
		},

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			

			return this;
		},

		// ---- Event Handlers -------------------------------------------------------------------------------------
		downloadLayout: function(e) {
			var htmlContent = Y.one('#layout-iframe').get('contentWindow').get('document').get('documentElement').get('outerHTML'),
			    layoutName  = Y.one('.layout-selector').get('value');
			
			Y.one('#HTMLContent').set('value', htmlContent);
			Y.one('#layoutName').set('value', layoutName);
			
		},

		changeLayout: function(e) {
			counter = 1;
			var banner = Y.one('.choose-layout-banner'),
				layout = e.target.get('value'),
				path   = './public/views/layouts/' + layout,
				that   = this,				
				iframeDocument,
				iframeHeight,
				layoutBody,
				textEdit,
				gearEdit,
				iframe,
				dddom;
				
			banner.setStyle('display', 'none');
			Y.one('#layout-iframe').setAttribute('src', path);

			iframe = Y.one('#layout-iframe');

			if(layout !== '') {

				iframe.setStyle('display', 'block');

				/*
				 * When I used the iframe.after('load'... method, for some reason the code 
				 * inside the function would incrementally loop. This would break the ability
				 * to drag & drop elements when switching layouts, and cause the page to 
				 * increasingly load slower. FIGURE OUT THE REASON WHY THIS HAPPEND.
				 */
				iframe.onceAfter('load', function(e) {
					e.stopPropagation();

					iframeDocument = iframe.get('contentWindow').get('document');
					iframeBody = iframeDocument.get('body');
					iframeHeight   = iframeBody.getStyle('height');
					iframe.setStyles({
						'backgroundColor': '#fff',
						'height': iframeHeight
					});

					that.set('layoutBody', iframeDocument.one('body'));
				
					dddom    = new DDDOM();
					textEdit = new TextEdit().render();
					gearEdit = new GearEditButton({exists: false, active: false});

				});

			} else {

				iframe.removeAttribute('src');
				
				iframe.setStyle('display', 'none');

				banner.setStyle('display', 'block');

			}

		},

		changeFontSize: function(e) {
			var size = e.target.get('value') + 'px';
				
			this.get('layoutBody').setStyle('fontSize', size);
		},

		changeFontFamily: function(e) {
			var fontFamily = e.target.get('value');

			this.get('layoutBody').setStyle('fontFamily', fontFamily);
		},

		displayEditButtons: function(e) {
			
			var layoutBody = this.get('layoutBody');

			if( e.target.get('checked') ) {

				layoutBody.all('.pearl-edit').each(function(n) {
					n.get('children').each(function(child) {

						if(child.hasClass('gearButton')) {

							child.setStyles({
								'display': 'block'
							});

						}

					});
				});

			}

			if( !e.target.get('checked') ) {

				layoutBody.all('.pearl-edit').each(function(n) {
					n.get('children').each(function(child) {

						if(child.hasClass('gearButton')) {

							child.setStyles({
								'display': 'none'
							});
									
						}

					});
				});

			}
			
		}
		
	}, {
		ATTRS: {

			container: {
				valueFn: function() { return Y.Node.create('<div id="general-settings-bar"/>'); }
			},

			layoutBody: {
				value: ''
			}

		}
	});

	Y.namespace('Pearl').GeneralSettings = GeneralSettings;

}, '@VERSION@', {

	requires: [
		'gear-edit-button',
		'dd-dom',
		'text-edit',
		'io-base'
	]

});