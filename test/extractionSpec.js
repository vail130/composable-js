describe('Composable', function () {

    beforeAll(function () {
        var fixture = '<div id="fixture">' +
            '<input type="text" name="a" value="1">' +
            '<div class="test-div" id="test-div1">Test Div 1</div>' +
            '<div class="test-div" id="test-div2">Test Div 2</div>' +
            '<span class="test-span" id="test-span1">Test Span 1</span>' +
            '<span class="test-span" id="test-span2">Test Span 2</span>' +
            '<span class="test-span" id="test-span3">Test, Span/ 3</span>' +
            '</div>';
        document.body.insertAdjacentHTML('afterbegin', fixture);
        window.testData = {test1: [1, 2, 3], test2: {a: 1,b: 2,c: 3}, test3: 11};
    });

    afterAll(function () {
        document.body.removeChild(document.getElementById('fixture'));
        delete window.testData;
    });

    it('should select child node and match part of inner text and parses as int', function () {
        var extractedData = Composable({
            a: [
                'document',
                'querySelector:#test-div1',
                'innerText',
                'match:/\\d/',
                'getIndex:0',
                'toInt'
            ]
        });
        expect(extractedData.a).toEqual(1);
    });

    it('should parse regular expressions with commas and slashes', function () {
        var extractedData = Composable({
            b: [
                'document',
                'querySelector:#test-span3',
                'innerText',
                'match:/Test, Span\/ 3/g',
                'getIndex:0'
            ]
        });
        expect(extractedData.b).toEqual('Test, Span/ 3');
    });

    it('should do regular expression replace with commas and slashes', function () {
        var extractedData = Composable({
            c: [
                'document',
                'querySelector:#test-span3',
                'innerText',
                'replace:/Test, Span\/ 3/g,Test Span 3'
            ]
        });
        expect(extractedData.c).toEqual('Test Span 3');
    });

    it('should support using callable transformations', function () {
        var extractedData = Composable({
            a: [
                Composable.T.document,
                Composable.T.querySelector('#test-div1'),
                Composable.T.innerText,
                Composable.T.match(/\d/),
                Composable.T.getIndex(0),
                Composable.T.toInt
            ]
        });
        expect(extractedData.a).toEqual(1);
    });

    it('should take input data and get properties and indices', function () {
        var extractedData = Composable({
            b: [
                'window',
                'getProperties:testData.test1.1'
            ]
        });
        expect(extractedData.b).toEqual(2);
    });

});
