YUI.add('edit-module', function(Y) {

	var EditModule;

	// EditModuleShell View
	// Responsible for displaying the edit module when the GearEditButton is clicked
	EditModule = Y.Base.create('editModule', Y.View, [], {

		
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

	Y.namespace('Pearl').EditModule = EditModule;

}, '@VERSION@', {

	requires: [
		'view',
		'node',
		'event-mouseenter'
	]

});
