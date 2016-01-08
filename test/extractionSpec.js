describe('Composable', function () {

    beforeAll(function () {
        document.body.insertAdjacentHTML('afterbegin', window.__html__['fixture.html']);
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
            a: [
                'document',
                'querySelector:#test-span3',
                'innerText',
                'replace:/Test, Span\/ 3/g,Test Span 3'
            ]
        });
        expect(extractedData.a).toEqual('Test Span 3');
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
            a: [
                'window',
                'getProperties:testData.test1.1'
            ]
        });
        expect(extractedData.a).toEqual(2);
    });

    describe('map', function () {
        it('should work with sub commands which do and do not have arguments', function () {
            var extractedData = Composable({
                a: [
                    'document',
                    'querySelectorAll:.test-input-div',
                    'map:querySelector:input',
                    'map:value',
                    'map:toInt'
                ]
            });
            expect(extractedData.a).toEqual([1, 2, 3, 4]);
        });
    });

    describe('getTransformation', function () {
        it('should treat arguments of standard transformations, with the same name as a transformation, as arguments', function () {
            var extractedData = Composable({
                a: [
                    'document',
                    'querySelector:.test-match',
                    'innerText',
                    'match:match',
                    'getIndex:0'
                ]
            });
            expect(extractedData.a).toEqual('match');
        });

        it('should treat arguments of array transformations as transformations', function () {
            var extractedData = Composable({
                a: [
                    'document',
                    'querySelectorAll:.test-match',
                    'map:innerText',
                    'map:match:match',
                    'map:getIndex:0'
                ]
            });
            expect(extractedData.a).toEqual(['match', 'match']);
        });
    })


});
