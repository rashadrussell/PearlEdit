YUI().use('node', 'view', 'event-mouseenter','dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {

	var LayoutGenerator, GeneralSettings, DDDOM, GearEditButton, EditModal;

	// GeneralSettings View
	// Responsible for setting styles that will affect the entire HTML DOM such as background-color, font-color, font-size, etc.
	GeneralSettings = Y.GeneralSettings = Y.Base.create('generalSettings', Y.View, [], {

		template: Y.one('#general-settings').getHTML(),

		events: {
			'.layout-selector': {change: 'changeLayout'},
			'.font-size-selector': {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'},
			'.display-edit-buttons': {click: 'displayEditButtons'}
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
					new GearEditButton({exists: false, active: false}).render();
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

		displayEditButtons: function(e) {
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');

			iframeBody.all('*').each(function(n) {

				if(n.hasClass('pure-edit')) {

					n.get('children').each(function(child) {
						if(child.hasClass('gearButton')) {
							if(child.getStyle('display') === 'block') {
								child.setStyles({
									'display': 'none'
								});
							} else {
								child.setStyles({
									'display': 'block'
								});
							}
								
						}

					});

				}
			});
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
						
						/*
						n.on('mouseover', function(e) {
							e.target.setStyle('cursor', 'move');
						});
*/
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

	
	
	// GearEditButton View
	// Responsible appending an edit button to pure-edit each DOM element in order to reveal EditModule
	GearEditButton = Y.GearEditButton = Y.Base.create('gearEditButton', Y.View, [], {

		// ---- Event Handlers -------------------------------------------------------------------------------------
		renderModal: function() {
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');
			iframeBody.all('*').each(function(n) {

				if(n.hasClass('pure-edit')) {

					n.get('children').each(function(child) {
						if(child.hasClass('gearButton')) {
							child.on('click', function(e) {
								console.log(e.target.get('parentNode'));
								new EditModal().render(e.target);
							});
						}

					});

				}
			});
		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container'),
				that = this;
				

				var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');
				//gearButton = Y.Node.create('<img class="gearButton" src="/img/gear.png" alt="edit" />');

				iframeBody.all('*').each(function(n) {

					if(n.hasClass('pure-edit')) {

						n.get('children').each(function(child) {

							var gearButton = Y.Node.create('<img class="gearButton" src="/img/gear.png" alt="edit" />');
							
							child.insert(gearButton, 'before');
							gearButton.setStyles({
								'display': 'none',
								'width' : '20',
								'height': '20',
								'position': 'absolute',
								//'top': child.getY(),
								'left': child.getX()
							});

						});							

					}
				});
				this.renderModal();
				/*
				Y.one(container).all('*').each(function(n) { 
					if(n.hasClass('pure-edit')) {


						n.get('children').each(function(child) {

							child.on('mouseenter', function(e) {

								var gearButton = Y.Node.create('<img class="gearButton" src="/img/gear.png" alt="edit" />'),
									enterPosition = e.pageY,
									parent = e.currentTarget;
									
								gearButton.setStyles({
									'width' : '20',
									'height': '20',
									'position': 'absolute',
									'left': (e.currentTarget.getX())
								});

								if(!that.get('exists')) {
									parent.insert(gearButton, 'before');
									that.set('exists', true);
									console.log(that.get('exists'));
								}
								//e.currentTarget

								if(that.get('exists')) {
									console.log('hi');
									this.get('parentNode').one('.gearButton').on('mouseenter', function(e) {
										that.set('active', true);
										
									});
									
								//	if(!that.get('active')) {
										child.once('mouseleave', function(e) {
											this.get('parentNode').one('.gearButton').remove();
											that.set('exists', false);
											console.log(that.get('exists'));
										});
									//}
									
								}
								
								child.get('parentNode').one('.gearButton').on('click', function(e) {
									var modal = new EditModal();
									modal.render(parent);

									console.log(child)
									e.target.on('mouseleave', function(e) {
										console.log(this);
									});

									e.target.on('mouseleave', function(e) {
										e.target.remove();
									});
								});
								
								
								child.get('parentNode').one('.gearButton').on('click', function(e) {
									if(!child.get('parentNode').one('.edit-modal')) {
										var modal = new EditModal();
										modal.render(parent);
										child.detachAll(e);
									}
								});
							

							});
							
							this.on('mousemove', function(e) {
								if(e.pageY === this.get('y')) {

								}
								
								//this.get('parentNode').one('.gearButton').remove();
								
								//console.log(e.pageY);
								//console.log(this);
							});
							
							this.on('mouseleave', function(e) {
								
							});
							

						});

					}
				});
				*/
				// ---- Events -------------------------------------------------------------------------


			return this;
		},

	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});



	
	// EditModal View
	// Responsible for displaying the edit modal when the GearEditButton is clicked
	EditModal = Y.EditModal = Y.Base.create('editModal', Y.View, [], {

		
		// ---- Event Handlers -------------------------------------------------------------------------------------


		removeModal: function() {
			this.remove();
		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function(parent) {			
			var head = this.get('container').get('parentNode').one('head'),
				//modal      = this.get('container').one('.edit-modal'),
				modal = Y.Node.create('<div class="edit-modal" />'),
				modalStyle = Y.one('#modal-stylesheet').getHTML();

				modal.setStyles({
					'top': parent.getY(),
					'z-index': '1000'
				});

				modal.setHTML(Y.one('#edit-modal').getHTML());
				parent.insert(modal, 'before');

				head.append(modalStyle);
				

				// ---- Events -------------------------------------------------------------------------
				modal.on('mouseleave', this.removeModal);
				//this.renderModal();

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