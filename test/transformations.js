(function () {
	var domExtractor = typeof require == 'function' ? require('..') : window.domExtractor;

	QUnit.module('Transformations');

	test('toFloat', function () {
		equal(domExtractor.transformations.toFloat('12.34'), 12.34, 'parses strings into floats');
	});

	test('round', function () {
		equal(domExtractor.transformations.round(12.34), 12, 'rounds a number down');
		equal(domExtractor.transformations.round(12.54), 13, 'rounds a number up');
	});

	test('multiplyBy', function () {
		equal(domExtractor.transformations.multiplyBy(100)(12.34), 1234, 'multiplies by factor provided');
		equal(domExtractor.transformations.multiplyBy(20)('12.54'), false, 'returns false if value provided is not a number');
	});


}());
