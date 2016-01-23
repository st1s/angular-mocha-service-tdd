var expect = require("expect.js");
var Commission = require("./commission");

describe('Commission Lib', function () {
    var _rules = [{
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
    var _order = [{
        product: {
            price: 54.00
        },
        qty: 1
    }, {
            product: {
                price: 501.00
            },
            qty: 2
        }, {
            product: {
                price: 45.00
            },
            qty: 3
        }];
    var commission = new Commission({
        rules: _rules
    });

    it('Should have three rules composed with range, percent and fixed value', function () {
        expect(commission.rules).to.eql(_rules);
    });

    it('Should apply rule on specific value', function () {
        expect(commission.calc(60)).to.eql({
            fee: 6.00,
            liquid: 54.00
        });
    });

    it('Should apply rule on multiple plans', function () {
        expect(commission.calc(_order)).to.eql({
            fee: 120.56,
            liquid: 1070.44
        });
    });

    it('Should print specific information about calc', function () {
        expect(commission.calc(60)).to.eql({
            fee: 6.00,
            liquid: 54.00
        });
    });

});