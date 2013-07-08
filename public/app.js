YUI().use('node', 'view', function(Y) {

	var LayoutGenerator, GeneralSettings;

	// GeneralSettings View
	// Responsible for settings that span the entire HTML DOM such as background-color, font-color, font-size, etc.
	GeneralSettings = Y.GeneralSettings = Y.Base.create('generalSettings', Y.View, [], {

		template: Y.one('#general-settings').getHTML(),

		events: {
			'.layout-selector': {change: 'changeLayout'},
			'.font-size-selector': {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'}
		},

		// ---- Event Handlers -------------------------------------------------------------------------------------
		changeLayout: function(e) {
			var layout = e.target.get('value'),
					path = '/layouts/' + layout,
					iframeDocument,
					iframeHeight;

				Y.one('.choose-layout-banner').setStyle('display', 'none');
				Y.one('#layout-iframe').setAttribute('src', path);


				Y.one('iframe').after('load', function() {
					iframeDocument = Y.one('#layout-iframe').get('contentWindow').get('document');
					iframeHeight = iframeDocument.get('height');
					Y.one('iframe').setStyles({'backgroundColor': '#fff','height': iframeHeight});
				});

		},

		changeFontSize: function(e) {
			var size = e.target.get('value') + 'px',
				iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');
				
				iframeBody.setStyle('fontSize', size);
		},

		changeFontFamily: function(e) {
			var fontFamily = e.target.get('value'),
				iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');
				
				iframeBody.setStyle('fontFamily', fontFamily);
		},

		render: function() {			
			var container = this.get('container');

				container.setHTML(this.template);
				Y.one('#header').append(container);

			return this;
		},

	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.Node.create('<div id="general-settings-bar"/>'); }
			}			
		}
	});
	new GeneralSettings().render();


});