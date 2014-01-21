YUI().use('node', function(Y) {

	Y.all('.pearl_modal_link').on('click', function(e) {
		e.stopPropagation();
		e.preventDefault();


		var transparency = Y.Node.create('<div></div>'),
			modalLink = e.currentTarget,
			modalLinkText = '.' + modalLink.get('innerText'),
			modal = Y.one(modalLinkText);

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

		modal.setStyles({
			marginLeft: (Y.DOM.docWidth() / 2) - 400 + 'px',
			marginTop: (Y.DOM.winHeight() / 2) - 200 + 'px',
			display: 'block'
		});

		modal.one('.close').setStyles({
			top: modal.getY() - 12 + 'px',
			left: modal.getX() + 805 + 'px',
			display: 'block'
		});

		modal.one('.close').on('click', function() {
			transparency.remove();
			modal.setStyles({
				display: 'none',
				top: 0
			});
		});

		transparency.on('click', function() {
			this.remove();
			modal.setStyle('display', 'none');
		});

		Y.one('body').prepend(transparency);

	});

});