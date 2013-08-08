YUI({
    //Last Gallery Build of this module
    gallery: 'gallery-2011.09.28-20-06'
}).use('node', 'view', 'event-mouseenter','dd-constrain', 'dd-proxy', 'dd-drop', 'dd-scroll', 'node-scroll-info', 'escape', function(Y) {

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

        	if(!drag.ancestor('.displayContainer')) {

        		if(!drop.hasClass('placeholder-image') && (dragPureGroup === dropPureGroup)) {

        			Y.DD.DDM.swapNode(drag, drop);

        		} else if(drag.ancestor('#sidebar') && (!drop.ancestor('#sidebar'))) {

        			drop.insert(drag, 'after');

        		}

        		e.drop.sizeShim();

        	}
    		
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
			Y.DD.DDM.on('drag:start', this.dragProxy, this.get('container'));
			Y.DD.DDM.on('drop:over' , this.setShim,  this.get('container'));
			Y.DD.DDM.on('drag:end'  , this.resetProxy,  this.get('container'));

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

									changedContent = Y.Escape.html( this.get('value') );
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
	



	// Element Module View
	// Responsible dragging and dropping UI elements in the DOM
	ElementModule = Y.ElementModule = Y.Base.create('elementModule', Y.View, [], {

		template: Y.one('#element-module-template').getHTML(),

		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			'.element-list > li': {click: 'displayElements'}
		},

		initializer: function() {

		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function() {			
			
			var container = this.get('container');

			container.setHTML(this.template);
			
			return this;
		},

		displayElements: function(e) {
			var target = e.target;
//				formImages = Y.one('#form-images').getHTML(),
//				displayContainer = Y.Node.create('<div class="displayContainer" />');
			
//			displayContainer.setHTML(formImages);

//			displayContainer.setStyles({
//				top: target.getY() - 5,
//				left: target.get('parentNode').getX() - 210
//			});
			
//			Y.one('body').append(displayContainer);

			new ElementDisplay({target: target}).render();

		}



	}, {

		
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#element-module'); }
			}			
		}
	});
	new ElementModule().render();




	// Element Display View
	// Responsible dragging and dropping UI elements in the DOM
	ElementDisplay = Y.ElementDisplay = Y.Base.create('elementDisplay', Y.View, [], {

		containerTemplate: '<div class="displayContainer" />',

		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			'.elementImg': {click: 'logIt'},
			'.delete': {click: 'deleteContainer'}
		},

		deleteContainer: function(e) {
			this.remove();
		},

		// ---- Event Handlers -------------------------------------------------------------------------------------
		// Lower opacity for dragged node and its proxy
		dragProxy: function(e) {
    		var drag       = e.target,
    			classIndex = drag.get('node').get('className').indexOf('form'),
				formClass  = drag.get('node').get('className').substring(classIndex),
				endIndex   = formClass.indexOf(' '),
				formClass  = formClass.substring(0, endIndex),
				form       = Y.one('#' + formClass);

			this.set('proxyHTML', form.getHTML());

			if(drag.get('dragNode').ancestor('.displayContainer')) {
				drag.get('dragNode').set('innerHTML', form.getHTML());

    			drag.get('dragNode').setStyles({
        			width: '300px',
        			height: '200px',
       				borderColor: drag.get('node').getStyle('borderColor')
    			});

    		}

		},

		// On drop event, complete node swap
		appendElement: function(e) {
    		var classIndex,
    			targetClass,
    			endIndex,
    			denominator,
    			that = this,
    			drag = e.drag.get('node'),
        		drop = e.drop.get('node'),
        		dropArea = drop.ancestor('.pure-g-r');
        		
        	if(drag.ancestor('.displayContainer')) {

        		if(!drop.hasClass('placeholder-image') && drop.ancestor('.pure-group')) {

        			dropArea.append(this.get('proxyHTML'));
        			dropAreaSize = dropArea.get('children').size();

        			dropArea.get('children').each(function(child) {

        				targetClass  = child.get('className');

        				//console.log(classIndex);
        				//targetClass = child.substring(classIndex);
        				console.log(dropArea);
        				endIndex    = targetClass.indexOf(' ');
        				targetClass = targetClass.substring(0, endIndex);

        				denominator = targetClass.substring(targetClass.length-1);

        				child.removeClass(targetClass);

        				if(denominator) {
        					child.addClass('pure-u-1-' + ++denominator);
        					that.set('denominator', denominator);
        					//console.log(this.get('denominator'));
        				} else {
        					child.addClass('pure-u-1-' + that.get('denominator'));
        				}
        				
        				//console.log(dropArea);

        			});


        		}

        		e.drop.sizeShim();

        	}



        	
    		
		},

		initializer: function() {
			var formImages = Y.one('#form-images').getHTML(),
				container  = this.get('container'),
				target     = this.get('target'),
				body       = Y.one('body');

			container.setHTML(formImages);
			
			Y.one('body').append(container);

			container.setStyles({
				top:  target.getY() - 5,
				left: target.get('parentNode').getX() - 230
			});

			body.plug(Y.Plugin.ScrollInfo, {
				scrollDelay: 1
			});

			body.scrollInfo.on('scroll', function (e) {
    			container.setStyles({
    				top: target.getY() - 5,
    			});
			});

			container.all('img').each(function(n) {

				new Y.DD.Drag({

					node: n

				}).plug(Y.Plugin.DDProxy, {

					moveOnEnd: false

				});//.plug(Y.Plugin.DDWinScroll);

			});

			container.append('<img src="./img/delete.png" class="delete" />');

			// ---- Element Drag & Drop Events -------------------------------------------------------------------------
			Y.DD.DDM.on('drag:start', this.dragProxy);
			Y.DD.DDM.on('drop:hit', this.appendElement);

		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function() {			
			
			
			
			return this;
		},


	}, {
		
		ATTRS: {
			
			proxyHTML: {
				value: ''
			},

			denominator: {
				value: ''
			}

		}

	});


});