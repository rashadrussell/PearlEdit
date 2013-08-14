YUI.add('general-settings', function(Y) {

	var GeneralSettings,
		GearEditButton = Y.Pearl.GearEditButton,
		TextEdit = Y.Pearl.TextEdit,
		DDDOM = Y.Pearl.DDDOM;

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
			var layout = e.target.get('value'),
				path   = '/views/layouts/' + layout,
				iframeDocument,
				iframeHeight;

			Y.one('.choose-layout-banner').setStyle('display', 'none');
			Y.one('#layout-iframe').setAttribute('src', path);

			Y.one('iframe').after('load', function(e) {
				e.stopPropagation();

				iframeDocument = Y.one('#layout-iframe').get('contentWindow').get('document');
				iframeHeight   = iframeDocument.get('height');
				Y.one('iframe').setStyles({'backgroundColor': '#fff','height': iframeHeight});
				
				new GearEditButton({exists: false, active: false});
				new DDDOM();
				new TextEdit().render();
			});

		},

		changeFontSize: function(e) {
			var size       = e.target.get('value') + 'px',
				iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');
				
			iframeBody.setStyle('fontSize', size);
		},

		changeFontFamily: function(e) {
			var fontFamily = e.target.get('value'),
				iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');

				iframeBody.setStyle('fontFamily', fontFamily);
		},

		displayEditButtons: function(e) {
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');

			if( e.target.get('checked') ) {

				iframeBody.all('*').each(function(n) {

					if(n.hasClass('pearl-edit')) {

						n.get('children').each(function(child) {

							if(child.hasClass('gearButton')) {

									child.setStyles({
										'display': 'block'
									});

							}

						});

					}
				});

			}

			if( !e.target.get('checked') ) {

				iframeBody.all('*').each(function(n) {

					if(n.hasClass('pearl-edit')) {

						n.get('children').each(function(child) {

							if(child.hasClass('gearButton')) {

									child.setStyles({
										'display': 'none'
									});
									
							}

						});

					}
				});

			}
		}
		
	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.Node.create('<div id="general-settings-bar"/>'); }
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