YUI.add('pearl-app', function(Y) {

	var PearlApp,
		GeneralSettings = Y.Pearl.GeneralSettings;

	PearlApp = Y.Base.create('pearApp', Y.App, [], {

		events: {

		},

		initializer: function() {

			var generalSettings = new GeneralSettings();
			generalSettings.render();

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