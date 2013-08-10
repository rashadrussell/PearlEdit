YUI.add('gear-edit-button', function(Y) {

	var GearEditButton,
		EditModule = Y.Pearl.EditModule;

	// GearEditButton View
	// Responsible appending an edit button to pure-edit each DOM element in order to reveal EditModule
	GearEditButton = Y.Base.create('gearEditButton', Y.View, [], {

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
	
	Y.namespace('Pearl').GearEditButton = GearEditButton;

}, '@VERSION@', {

	requires: [
		'view',
		'node',
		'edit-module',
		'event-mouseenter'
	]

});