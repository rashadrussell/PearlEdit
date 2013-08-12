YUI.add('dd-dom', function(Y) {

	var DDDOM;

	// DDDOM View
	// Responsible for establishing a drag & drop environment for DOM elements in the layout
	DDDOM = Y.Base.create('ddDOM', Y.View, [], {

		
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

	Y.namespace('Pearl').DDDOM = DDDOM;

}, '@VERSION@', {

	requires: [
		'view',
		'node',
		'dd-drop',
		'dd-proxy',
		'dd-constrain'
	]

});
