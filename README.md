# domextractor
A JS library to select, transform and format data from the DOM, declaratively.

# Example
```html
<div id="qunit-fixture">
    <input type="text" name="a" value="1">

    <div class="test-div" id="test-div1">Test Div 1</div>
    <div class="test-div" id="test-div2">Test Div 2</div>
    <span class="test-span" id="test-span1">Test Span 1</span>
    <span class="test-span" id="test-span2">Test Span 2</span>
</div>
```

```js
var extractedData = window.domExtractor(window.document, {
    divNumber: {
        selector: '#qunit-fixture',
        transformations: [
            'querySelector:#test-div1',
            'innerText',
            'match:/\\d/',
            'getIndex:0',
            'toInt'
        ]
    }
});

extractedData.divNumber === 1; // true
```

# Testing
```bash
npm test
```
