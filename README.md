# Composable
A JS library to select, transform and format data, declaratively.

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
var data = window.Composable({
    divNumber: [
        'document',
        'querySelector:#qunit-fixture',
        'querySelector:#test-div1',
        'innerText',
        'match:/\\d/',
        'getIndex:0',
        'toInt'
    ]
});

data.divNumber === 1; // true
```

# Testing
```bash
npm test
```
