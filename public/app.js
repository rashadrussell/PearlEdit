YUI({
    //Last Gallery Build of this module
    gallery: 'gallery-2011.09.28-20-06'
}).use('node', 'view', 'event-mouseenter','dd-constrain', 'dd-proxy', 'dd-drop', 'uploader', 'gallery-colorpicker', 'color', function(Y) {

	var LayoutGenerator, GeneralSettings, DDDOM, GearEditButton, EditModal;

	// GeneralSettings View
	// Responsible for setting styles that will affect the entire HTML DOM such as background-color, font-color, font-size, etc.
	GeneralSettings = Y.GeneralSettings = Y.Base.create('generalSettings', Y.View, [], {

		template: Y.one('#general-settings').getHTML(),

		events: {
			'.layout-selector': {change: 'changeLayout'},
			'.font-size-selector': {change: 'changeFontSize'},
			'.font-family-selector': {change: 'changeFontFamily'},
			'.display-edit-buttons': {click: 'displayEditButtons'},
			'#bg-color-picker': {click: 'changeBgColor'},
			'#font-color-picker': {click: 'changeFontColor'},
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
					new TextEdit().render();
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

		changeBgColor: function(e) {
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body'),
				colorDiv   = Y.Node.create('<div id="bg-color-picker-container"></div>'),
				colorpicker,
				hex;

			Y.one('body').prepend(colorDiv);

			colorpicker = new Y.ColorPicker();

			colorpicker.render("#bg-color-picker-container");
			
			e.halt();

			hex = colorpicker.get('hex');
			
			colorDiv.on('mouseleave', function(e) {
				this.remove();
			});
			

			Y.one('#squareCanvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('backgroundColor', '#' + colorpicker.get('hex'));
					Y.one('#bg-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});
			
			Y.one('.yui3-colorpicker-hbar > canvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('backgroundColor', '#' + colorpicker.get('hex'));
					Y.one('#bg-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});
			
			Y.one('.yui3-colorpicker-sbar > canvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('backgroundColor', '#' + colorpicker.get('hex'));
					Y.one('#bg-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});

			
			Y.one('.yui3-colorpicker-lbar > canvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('backgroundColor', '#' + colorpicker.get('hex'));
					Y.one('#bg-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});

		},

		changeFontColor: function(e) {
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body'),
				colorDiv   = Y.Node.create('<div id="font-color-picker-container"></div>'),
				colorpicker,
				hex;

			Y.one('body').prepend(colorDiv);

			colorpicker = new Y.ColorPicker();

			colorpicker.render("#font-color-picker-container");
			
			e.halt();

			hex = colorpicker.get('hex');

			colorDiv.on('mouseleave', function(e) {
				this.remove();
			});

			Y.one('#squareCanvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('color', '#' + colorpicker.get('hex'));
					Y.one('#font-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});
			
			Y.one('.yui3-colorpicker-hbar > canvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('color', '#' + colorpicker.get('hex'));
					Y.one('#font-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});
			
			Y.one('.yui3-colorpicker-sbar > canvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('color', '#' + colorpicker.get('hex'));
					Y.one('#font-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});

			
			Y.one('.yui3-colorpicker-lbar > canvas').after('mousedown', function(e) {
				this.on('mousemove', function(e) {
					iframeBody.setStyle('color', '#' + colorpicker.get('hex'));
					Y.one('#font-color-picker').setStyle('backgroundColor', '#' + colorpicker.get('hex'));
				});
			});
			
		},

		removeColorPicker: function(e) {
			console.log('hi');
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
			var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body'),
				linkIndex,
				modalLink;

			iframeBody.all('*').each(function(n) {

				if(n.hasClass('pure-edit')) {

					n.get('children').each(function(child) {
						if(child.hasClass('gearButton')) {
							child.on('click', function(e) {
								linkIndex = e.target.get('className').indexOf('pure-gearButtonLink-'),
								modalLink = e.target.get('className').substr(linkIndex);
								new EditModal().render(e.target, modalLink);
							});
						}

					});

				}
			});
		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function() {			
			var container = this.get('container'),
				that = this,
				gearButtonLink = 1;

				var iframeBody = Y.one('#layout-iframe').get('contentWindow').get('document').get('body');
				//gearButton = Y.Node.create('<img class="gearButton" src="/img/gear.png" alt="edit" />');
				
				iframeBody.all('*').each(function(n) {

					if(n.hasClass('pure-edit')) {

						n.get('children').each(function(child) {
							
							var gearButton = Y.Node.create('<img class="gearButton ' + 'pure-gearButtonLink-' + gearButtonLink + '" src="/img/gear.png" alt="edit" />');
							
								gearButton.setStyles({
									'display': 'none',
									'width' : '20',
									'height': '20',
									'position': 'absolute',
									//'top': child.getY(),
									'left': child.getX(),
									'z-index': '1000'
								});
								child.insert(gearButton, 'before');
								child.addClass('pure-gearButtonLink-' + gearButtonLink);

								gearButtonLink++;

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



	
	// EditModalShell View
	// Responsible for displaying the edit modal when the GearEditButton is clicked
	EditModal = Y.EditModal = Y.Base.create('editModal', Y.View, [], {

		
		// ---- Event Handlers -------------------------------------------------------------------------------------

		removeModal: function() {
			this.remove();
		},

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function(parent, modalLink) {			
			var head 		= this.get('container').get('parentNode').one('head'),
				modal 		= Y.Node.create('<div class="edit-modal ' + modalLink + '" />'),
				modalStyle 	= Y.one('#modal-stylesheet').getHTML();

				modal.setStyles({
					'top': parent.getY(),
					'z-index': '1000'
				});

				modal.setHTML(Y.one('#edit-modal').getHTML());
				parent.insert(modal, 'before');

				head.append(modalStyle);


				


				
				// ---- Events -------------------------------------------------------------------------
				modal.on('mouseleave', this.removeModal);

			return this;
		},

	}, {
		ATTRS: {
			container: {
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}			
		}
	});

/*

	// EditModal View
	// Responsible for displaying the edit modal when the GearEditButton is clicked
	EditModal = Y.EditModal = Y.Base.create('editModal', Y.View, [], {

		containerTemplate: '<div class="edit-modal"/>',
		// ---- Event Handlers -------------------------------------------------------------------------------------
		events: {
			'.alignment > li': {click: 'hello'}
		},

		hello: function() {
			console.log('hello');
		},

		removeModal: function() {
			this.remove();
		},
		

		// ---- Render View to DOM ---------------------------------------------------------------------------------
		render: function(parent, modalLink) {

			var container = this.get('container'),
				that = this;

				console.log(container);
				/*
				container.all('*').each(function(n) {
					if(n.hasClass('edit-modal')) {
						console.log(n);
					}
				});
						
			


				//console.log(this.get('container'));

			return this;
		}

	}, {
		ATTRS: {
			
			container: { 
				valueFn: function() { return Y.one('#layout-iframe').get('contentWindow').get('document').get('body'); }
			}	
				
		}
	});
*/


	// UploadImg View
	// Responsible for replacing place-holder images with those that are uploaded 
	UploadImg = Y.UploadImg = Y.Base.create('uploadImg', Y.View, [], {

		
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
	ElementSelect = Y.ElementSelect = Y.Base.create('textEdit', Y.View, [], {

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
				valueFn: function() { return Y.Node.create('<div id="sidebar"><div id="element-select-sidebar"></div></div>'); }
			}			
		}
	});
	//new ElementSelect().render();
	


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
										//'outline': 'none',
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