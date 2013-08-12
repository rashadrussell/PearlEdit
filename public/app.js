YUI.add('pearl-app', function(Y) {

	var PearlApp,
		GeneralSettings = Y.Pearl.GeneralSettings;

	PearlApp = Y.Base.create('pearlApp', Y.App, [], {

		events: {

		},

		initializer: function() {

			var generalSettings = new GeneralSettings();
			
		},

		render: function() {

		},

	});

	Y.namespace('Pearl').PearlApp = PearlApp;

}, '@VERSION@', {

	requires: [
		'app',
		'general-settings'
	]

});