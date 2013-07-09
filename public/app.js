YUI().use('node', 'view', 'dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {

	var LayoutGenerator, GeneralSettings;

	// GeneralSettings View
	// Responsible for setting styles that will affect the entire HTML DOM such as background-color, font-color, font-size, etc.
	GeneralSettings = Y.GeneralSettings = Y.Base.create('generalSettings', Y.View, [], {

		template: Y.one('#general-settings').getHTML(),

		events: {
			'.layout-selector': {change: 'changeLayout'},
			'.font-size-selector': {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'},
		},

		// ---- Event Handlers -------------------------------------------------------------------------------------
		changeLayout: function(e) {
			var layout = e.target.get('value'),
					path = '/layouts/' + layout,
					iframeDocument,
					iframeHeight;

				Y.one('.choose-layout-banner').setStyle('display', 'none');
				Y.one('#layout-iframe').setAttribute('src', path);


				Y.one('iframe').after('load', function(e) {
					e.stopPropagation();
					iframeDocument = Y.one('#layout-iframe').get('contentWindow').get('document');
					iframeHeight = iframeDocument.get('height');
					Y.one('iframe').setStyles({'backgroundColor': '#fff','height': iframeHeight});
					new DDDOM().render();
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

		// ---- Render View to DOM --------------------------------------------------------------------------------
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


	// DDDOM View
	// Responsible for establishing a drag & drop environment for DOM elements in the layout
	DDDOM = Y.DDDOM = Y.Base.create('ddDOM', Y.View, [], {

		// ---- Event Handlers -------------------------------------------------------------------------------------
		dragProxy: function(e) {
			// Get our drag object
    		var drag = e.target;
    		// Set some styles here
    		drag.get('node').setStyle('opacity', '.25');
    		drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
    		drag.get('dragNode').setStyles({
        		opacity: '.5',
       			borderColor: drag.get('node').getStyle('borderColor'),
       		 	backgroundColor: drag.get('node').getStyle('backgroundColor')
    		});
		},

		postProxyStyle: function(e) {
			var drag = e.target;
    		// Put our styles back
    		drag.get('node').setStyles({
       			visibility: '',
        		opacity: '1'
    		});
		},

		adjustShim: function(e) {
			// Get a reference to our drag and drop nodes
    		var drag = e.drag.get('node'),
        	drop = e.drop.get('node');
    
        	// Add the node to this list
       	 	Y.DD.DDM.swapPosition(drag, drop);
        	// Resize this nodes shim, so we can drop on it later.
        	e.drop.sizeShim();
    		
		},

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container');

				Y.one(container).all('*').each(function(n) { 

					if(n.hasClass('pure-edit')) {
						var drag, drop;	

						drag = new Y.DD.Drag({
							node: n
						}).plug(Y.Plugin.DDProxy, {
							moveOnEnd: false
						});

						drop = new Y.DD.Drop({
							node: n.get('parentNode')
						});
						
						n.on('mouseover', function(e) {
							e.target.setStyle('cursor', 'move');
						});
					}

				});

				// ---- Events -------------------------------------------------------------------------
				Y.DD.DDM.on('drag:start', this.dragProxy);
				Y.DD.DDM.on('drag:end'  , this.postProxyStyle);
				Y.DD.DDM.on('drop:over' , this.adjustShim);

			return this;
		},

	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});
	

});