YUI({
    //Last Gallery Build of this module
    gallery: 'gallery-2011.09.28-20-06'
}).use('node', 'view', 'event-mouseenter','dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {

	var LayoutGenerator, 
		GeneralSettings, 
		DDDOM, 
		GearEditButton, 
		EditModule, 
		TextEdit;

	// GeneralSettings View
	// Responsible for setting styles that will affect the entire HTML DOM such as background-color, font-color, font-size, etc.
	GeneralSettings = Y.GeneralSettings = Y.Base.create('generalSettings', Y.View, [], {

		template: Y.one('#general-settings').getHTML(),

		events: {
			'.layout-selector': {change: 'changeLayout'},
			'.font-size-selector': {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'},
			'.display-edit-buttons': {click: 'displayEditButtons'},
		},

		// ---- Event Handlers -------------------------------------------------------------------------------------
		changeLayout: function(e) {
			var layout = e.target.get('value'),
				path   = '/layouts/' + layout,
				iframeDocument,
				iframeHeight;

			Y.one('.choose-layout-banner').setStyle('display', 'none');
			Y.one('#layout-iframe').setAttribute('src', path);

			Y.one('iframe').after('load', function(e) {
				e.stopPropagation();

				iframeDocument = Y.one('#layout-iframe').get('contentWindow').get('document');
				iframeHeight   = iframeDocument.get('height');
				Y.one('iframe').setStyles({'backgroundColor': '#fff','height': iframeHeight});
				
				new DDDOM().render();
				new GearEditButton({exists: false, active: false}).render();
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

			console.log(e.target.get('checked'));
			if( e.target.get('checked') ) {

				iframeBody.all('*').each(function(n) {

					if(n.hasClass('pure-edit')) {

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

					if(n.hasClass('pure-edit')) {

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
		// Lower opacity for dragged node and its proxy
		dragProxy: function(e) {
    		var drag = e.target;

    		drag.get('node').setStyle('opacity', '.25');
    		drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
    		drag.get('dragNode').setStyles({
        		opacity: '.5',
       			borderColor: drag.get('node').getStyle('borderColor'),
       		 	backgroundColor: drag.get('node').getStyle('backgroundColor')
    		});

		},

		// Bring dragged node back to full opacity
		resetProxy: function(e) {
			var drag = e.target;

    		drag.get('node').setStyles({
       			visibility: '',
        		opacity: '1'
    		});
		},

		// On drop event, complete node swap
		setShim: function(e) {
    		var drag = e.drag.get('node'),
        		drop = e.drop.get('node'),
        		dragPureGroup = drag.ancestor('.pure-group'),
        		dropPureGroup = drop.ancestor('.pure-group');


        	if(!drop.hasClass('placeholder-image') && (dragPureGroup === dropPureGroup)) {

        		Y.DD.DDM.swapNode(drag, drop);

        	} else if(drag.ancestor('#sidebar') && (!drop.ancestor('#sidebar'))) {

        		drop.insert(drag, 'after');

        	}

        	e.drop.sizeShim();
    		
		},

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container');

			Y.one(container).all('*').each(function(n) { 

				if(n.hasClass('pure-edit')) {

					var drag, drop, parentDrop, tempImg;	

					drag = new Y.DD.Drag({

						node: n

					}).plug(Y.Plugin.DDProxy, {

						moveOnEnd: false

					});

					drop = new Y.DD.Drop({ node: n });

				}

			});

			// ---- Element Drag & Drop Events -------------------------------------------------------------------------
			Y.DD.DDM.on('drag:start', this.dragProxy);
			Y.DD.DDM.on('drop:over' , this.setShim);
			Y.DD.DDM.on('drag:end'  , this.resetProxy);

			return this;
		},

	}, {

		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});

	
	
	// GearEditButton View
	// Responsible appending an edit button to pure-edit each DOM element in order to reveal EditModule
	GearEditButton = Y.GearEditButton = Y.Base.create('gearEditButton', Y.View, [], {

		// ---- Event Handlers -------------------------------------------------------------------------------------
		renderModule: function() {
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body'),
				linkIndex,
				moduleLink;

			iframeBody.all('*').each(function(n) {

				if(n.hasClass('pure-edit')) {

					n.get('children').each(function(child) {

						if(child.hasClass('gearButton')) {

							child.on('click', function(e) {

								linkIndex = e.target.get('className').indexOf('pure-gearButtonLink-'),
								moduleLink = e.target.get('className').substr(linkIndex);
								new EditModule().render(e.target, moduleLink);

							});
						}

					});

				}

			});
		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container'),
				iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body'),
				gearButtonLink = 1,
				that = this;
				
			iframeBody.all('*').each(function(n) {

				if(n.hasClass('pure-edit')) {

					n.get('children').each(function(child) {
							
						var gearButton = Y.Node.create('<img class="gearButton ' + 'pure-gearButtonLink-' + gearButtonLink + '" src="/img/gear.png" alt="edit" />');
							
							gearButton.setStyles({
								'display': 'none',
								'width' : '20',
								'height': '20',
								'position': 'absolute',
								'left': child.getX(),
								'z-index': '1000'
							});

							child.insert(gearButton, 'before');
							child.addClass('pure-gearButtonLink-' + gearButtonLink);

							gearButtonLink++;

					});							

				}
			});
			this.renderModule();

			return this;
		},

	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});



	
	// EditModuleShell View
	// Responsible for displaying the edit module when the GearEditButton is clicked
	EditModule = Y.EditModule = Y.Base.create('editModule', Y.View, [], {

		
		// ---- Event Handlers -------------------------------------------------------------------------------------

		removeModule: function() {
			this.remove();
		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function(parent, moduleLink) {			
			var head 		= this.get('container').get('parentNode').one('head'),
				module 		= Y.Node.create('<div class="edit-module ' + moduleLink + '" />'),
				moduleStyle = Y.one('#module-stylesheet').getHTML();

			module.setStyles({
				'top': parent.getY(),
				'z-index': '1000'
			});

			module.setHTML(Y.one('#edit-module').getHTML());
			parent.insert(module, 'before');

			head.append(moduleStyle);
				
			// ---- Events -------------------------------------------------------------------------
			module.on('mouseleave', this.removeModule);

			return this;
		},

	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});




	// TextEdit View
	// Responsible Editing text in DOM upon double click
	TextEdit = Y.TextEdit = Y.Base.create('textEdit', Y.View, [], {

		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			
		},
		

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container');

			Y.one(container).all('*').each(function(n) { 
				if(n.hasClass('pure-edit')) {

					n.on('dblclick', function(e) {

						if( isText(e.target.get('tagName')) ) {

							var target 		= e.target,
								parentNode 	= e.target.get('parentNode'),
								text 		= e.target.get('innerText'),
								className 	= e.target.get('className'),
								height 		= e.target.get('clientHeight'),
								width 		= e.target.get('clientWidth'),
								fontSize 	= e.target.getStyle('fontSize'),
								fontFamily 	= e.target.getStyle('fontFamily'),
								fontWeight 	= e.target.getStyle('fontWeight'),
								padding  	= e.target.getStyle('padding'),
								margin 		= e.target.getStyle('margin'),
								changedContent;

								content = '<textarea style="height:' + height + 'px; width:' + width + 'px;" class="' + className + ' current-edit">' + text + '</textarea>';

								e.target.get('parentNode').replaceChild(content, e.target);
								parentNode.one('.current-edit').setStyles({
									'backgroundColor': 'transparent',
									'border': 'none',
									'margin': margin,
									'padding': padding,
									'fontFamily': fontFamily,
									'fontSize': fontSize,
									'fontWeight': fontWeight
								});

								parentNode.one('.current-edit').on('mouseleave', function(e) {

									changedContent = this.get('value');
									target.set('innerHTML', changedContent);
									parentNode.replaceChild(target, this);

								});

							}

						});
					
					}
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
	

});