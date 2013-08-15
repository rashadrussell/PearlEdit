YUI.add('dd-multi-container', function(Y) {

    var DDC = Y.Base.create('ddc', Y.Plugin.DDConstrained, [], {
        /**
         * Standardizes the 'constraint' attribute
         * @private
         * @method _getConstraint
         */
        _getConstraint: function () {
            var con = this.get('constrain'),
                ancestorSelector = this.get('constrain2ancestor'),
                ancestorNode = null,
                g = this.get('gutter'),
                region;

            if (con) {
                if (con instanceof Y.Node) {
                    if (!this._regionCache) {
                        this._eventHandles.push(Y.on('resize', Y.bind(this._cacheRegion, this), Y.config.win));
                        this._cacheRegion();
                    }
                    region = Y.clone(this._regionCache);
                    if (!this.get('cacheRegion')) {
                        this.resetCache();
                    }
                } else if (Y.Lang.isObject(con)) {
                    region = Y.clone(con);
                }
            }
            if (!con && ancestorSelector) {
                con = 'ancestor';
                ancestorNode = this.get('host').get('dragNode').ancestor(ancestorSelector);
                if (ancestorNode) {
                    region = ancestorNode.get('region');
                }
            }


            if (!con || !region) {
                con = 'view';
            }
            if (con === 'view') {
                region = this.get('host').get('dragNode').get('viewportRegion');
            }

            Y.Object.each(g, function (i, n) {
                if ((n === 'right') || (n === 'bottom')) {
                    region[n] -= i;
                } else {
                    region[n] += i;
                }
            });
            return region;
        }



    }, {
        NAME: 'ddc',
        NS: 'con',
        ATTRS: {
            constrain2ancestor: {
                value: null // any valid ancestor selector
            }
        }
    });

    Y.namespace('Plugin').DDConstrainedToAncestor = DDC;

}, '@VERSION@', {

    requires: [
        'base-build',
        'dd',
        'dd-delegate'
    ]

});

