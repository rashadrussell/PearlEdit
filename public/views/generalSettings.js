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
			'.layout-selector'     : {change: 'changeLayout'},
			'.font-size-selector'  : {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'},
			'.display-edit-buttons': {click : 'displayEditButtons'},
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
		changeLayout: function(e) {

			var banner = Y.one('.choose-layout-banner'),
				layout = e.target.get('value'),
				path   = '/views/layouts/' + layout,
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

				iframe.after('load', function(e) {
					e.stopPropagation();

					iframeDocument = iframe.get('contentWindow').get('document');
					iframeHeight   = iframeDocument.get('height');
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
		'text-edit'
	]

});