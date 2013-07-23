YUI().use('node', 'view', 'event-mouseenter','dd-constrain', 'dd-proxy', 'dd-drop', 'uploader', function(Y) {

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
					//new UploadImg().render();
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

    		var drag = e.target;

    		drag.get('node').setStyle('opacity', '.25');
    		drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
    		drag.get('dragNode').setStyles({
        		opacity: '.5',
       			borderColor: drag.get('node').getStyle('borderColor'),
       		 	backgroundColor: drag.get('node').getStyle('backgroundColor')
    		});
		},

		resetProxy: function(e) {
			var drag = e.target;
    		// Reset styles
    		drag.get('node').setStyles({
       			visibility: '',
        		opacity: '1'
    		});
		},

		setShim: function(e) {
    		var drag = e.drag.get('node'),
        		drop = e.drop.get('node');
        		dragPureGroup = drag.ancestor('.pure-group'),
        		dropPureGroup = drop.ancestor('.pure-group');


        	if(!drop.hasClass('placeholder-image') && (dragPureGroup === dropPureGroup)) {

        		Y.DD.DDM.swapNode(drag, drop);

        	} else if(drag.ancestor('#sidebar') && (!drop.ancestor('#sidebar'))) {
        		console.log(drop.ancestor('#sidebar'));
        		drop.insert(drag, 'after');
        	}

        	e.drop.sizeShim();
    		
		},

		// ---- Event Handlers --- Drag & Drop Images ---------------------------------------------------
/*		dropImg: function(e) {
			var container = this.get('container');
			console.log('hi');
			var reader = new FileReader();

      		reader.onload = (function(theFile) {
      			console.log(DDDOM.imgUploader.get('fileList')[0].get('file'));
       			return function(e) {

       				//var span = document.createElement('span');
       				console.log(theFile);
       				//container.prepend('<img class="thumb" src="'+ e.target.result+ '" title="'+ escape(theFile.name)+ '" />');
       				//var repImg = container.one('.placeholder-Image');
       				//e.drop.get('node').replaceChild(span, repImg);
       			};

       		})(DDDOM.imgUploader.get('fileList')[0].get('file'));

       		reader.readAsDataURL(DDDOM.imgUploader.get('fileList')[0].get('file'));

		},

		setImgDropTarget: function(e) {

			console.log(e.drop);

		},
*/
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
			//			parentDrop = new Y.DD.Drop({ node: n.get('parentNode') });
						
			//			n.get('children').each(function(child) {
			//				if(child.hasClass('placeholder-image')) {
			//					tempImg = new Y.DD.Drop({ node: child });
			//				}
			//			});

					}

				});


				// Is HTML5 Drag & Drop available?
				// Setting up environment for dragging and dropping images into DOM
				

				// ---- Element Drag & Drop Events -------------------------------------------------------------------------
				Y.DD.DDM.on('drag:start', this.dragProxy);
				Y.DD.DDM.on('drop:over' , this.setShim);
				Y.DD.DDM.on('drag:end'  , this.resetProxy);

				// ---- Image Drag & Drop Events ---------------------------------------------------- 
				//Y.DD.DDM.on('drop:over', this.setImgDropTarget);
				//DDDOM.imgUploader.on('drop', this.dropImg);

			return this;
		},

	}, {

		imgUploader: new Y.Uploader(),

		uploadDone: false,
		
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
								'left': child.getX(),
								'z-index': '1000'
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



	// UploadImg View
	// Responsible for replacing place-holder images with those that are uploaded 
	UploadImg = Y.UploadImg = Y.Base.create('ddDOM', Y.View, [], {

		
		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			'.imgButton': {click: 'uploadImg'}
		},

		uploadImg: function(e) {
			console.log(this.n);
				
		},

		

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container'),
				that = this;

				Y.one(container).all('*').each(function(n) { 
					if(n.hasClass('drop-image')) {

						n.append('<input type="file" class="imgInput" accept="image/*" style="display:none">');
						n.append('<button class="imgButton">Upload Image</button>');
						
						n.get('children').each(function(child) {
							
							if(child.hasClass('imgButton')) {
								child.on('click', that.uploadImg.call(this, n));

							}

						});
					
					}
				});

				

				// ---- Element Drag & Drop Events -------------------------------------------------------------------------


				// ---- Image Drag & Drop Events ---------------------------------------------------- 


			return this;
		},

	}, {

		
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});

	


	// ElementSelect View
	// Responsible for selecting elements to be dragged and dropped into the DOM
	ElementSelect = Y.ElementSelect = Y.Base.create('ddDOM', Y.View, [], {

		template: Y.one('#elementSelect-module').getHTML(),
		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			
		},


		dragProxy: function(e) {

			var html = '<form class="pure-form"><fieldset class="pure-group"><input type="text" class="pure-input-1-2" placeholder="Username"><input type="text" class="pure-input-1-2" placeholder="Password"><input type="text" class="pure-input-1-2" placeholder="Email"><button type="submit" class="pure-button pure-input-1-2 pure-button-primary">Sign in</button></fieldset></form>';
    		var drag = e.target;

    		drag.get('node').setStyle('opacity', '.25');
    		drag.get('dragNode').set('innerHTML', html);
    		drag.get('dragNode').setStyles({
        		opacity: '.5',
       			borderColor: drag.get('node').getStyle('borderColor'),
       		 	backgroundColor: drag.get('node').getStyle('backgroundColor')
    		});
		},

		setProxy: function(e) {
			var drag = e.target;
    		// Reset the styles
    		drag.get('node').setStyles({
       			visibility: '',
        		opacity: '1'
    		});

		},

		resetShim: function(e) {
    		var drag = e.drag.get('node'),
        		drop = e.drop.get('node');

        	if(drag.ancestor('#sidebar')) {
        		console.log(drop.get('children'));
        	}

        	e.drop.sizeShim();

		},
		

		// ---- Render View to DOM --------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container');
				container.setHTML(this.template);

				Y.one('#sidebar').append(container);

			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); 
				

				Y.one(container).all('*').each(function(n) { 

					if(n.hasClass('selectImg')) {
						var drag, drop, tempImg;	

						drag = new Y.DD.Drag({
							node: n
						}).plug(Y.Plugin.DDProxy, {
							moveOnEnd: false
						});
						
					}

				});

		//		Y.DD.DDM.on('drag:start', this.dragProxy);
		//		Y.DD.DDM.on('drop:over' , this.resetShim);
		//		Y.DD.DDM.on('drag:end'  , this.setProxy);


			return this;
		},

	}, {

		
		ATTRS: {
			container: {
				valueFn: function() { return Y.Node.create('<div id="element-select-sidebar"/>'); }
			}			
		}
	});
	new ElementSelect().render();
	

});