YUI().use('node', function(Y) {

	Y.one('.info_link').on('click', function(e) {
		e.preventDefault();

		var transparency = Y.Node.create('<div></div>'),
			infoBox = Y.one('.infoBox');

		transparency.setAttribute('class', 'transparentScreen');
		transparency.setStyles({
			backgroundColor: '#000',
			position: 'fixed',
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			opacity: '0.5',
			zIndex: '10000'
		});

		infoBox.setStyles({
			marginLeft: (Y.DOM.docWidth() / 2) - 400 + 'px',
			marginTop: (Y.DOM.winHeight() / 2) - 200 + 'px',
			display: 'block'
		});

		Y.one('.infoBox .close').on('click', function() {
			transparency.remove();
			infoBox.setStyles({
				display: 'none',
				top: 0
			});
		});

		console.log(infoBox.getXY());	

		Y.one('.infoBox .close').setStyles({
			top: infoBox.getY() - 12 + 'px',
			left: infoBox.getX() + 805 + 'px',
			display: 'block'
		});

		transparency.on('click', function() {
			this.remove();
			infoBox.setStyle('display', 'none');
		});

		Y.one('body').prepend(transparency);
		//Y.one('body').prepend(infoBox);


	});

});