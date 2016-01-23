(function () {
    'use strict';
    var window = window && window.length ? window : {};
        
    //
    // @usage
    // var commission = new Commission(options);
    //
    var Commission = function (options) {
        var _ = window.lodash ? window.lodash : require('lodash');
        //
        // Default rules
        //
        this.rules = [{
            range: {
                min: 0,
                max: 50
            },
            percent: 0,
            value: 5
        }, {
                range: {
                    min: 51,
                    max: 500
                },
                percent: 10,
                value: 0
            }, {
                range: {
                    min: 501,
                    max: 99999
                },
                percent: 8,
                value: 10
            }];
        //
        // Extend by options
        //
        _.merge(this, options);
    };

    function calc(arg) {
        var _ = window.lodash ? window.lodash : require('lodash');
        if (_.isArray(arg)) {
            var fee = 0,
                total = 0;
            _.each(arg, function (row) {
                var sub = this.sub(row.product.price);
                fee += sub.fee * row.qty;
                total += row.product.price * row.qty;
            }.bind(this));
            total -= fee;
            return {
                fee: fee.toFixed(2),
                liquid: total.toFixed(2)
            }
        } else if (_.isNumber(arg)) {
            var sub = this.sub(arg);
            return {
                fee: sub.fee,
                liquid: sub.liquid
            }
        }
    }

    function sub(value) {
        var _ = window.lodash ? window.lodash : require('lodash');
        var fee = 0,
            liquid = value;
        _.each(this.rules, function (plan) {
            if (value >= plan.range.min && value <= plan.range.max) {
                if (plan.percent) fee += (value * plan.percent) / 100;
                if (plan.value) fee += plan.value;
            }
        });
        liquid -= fee;
        return {
            fee: fee.toFixed(2),
            liquid: liquid.toFixed(2)
        }
    }
    
    //
    // API
    //
    Commission.prototype.calc = calc;
    Commission.prototype.sub = sub;
    
    //
    // Node
    //    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Commission;
    }
    //
    // Browser
    //
    else {
        angular.module('services').service('Commission', function event(lodash) {
            window.lodash = lodash;
            return Commission;
        });
    }
})();