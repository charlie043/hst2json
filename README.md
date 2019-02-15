# hst2json

convert MT4, MT5 time-series history file(`.hst`) to json.

## install

```
npm install --save hst2json
```

## Usage

```javascript
const fs = require('fs')
const hst2json = require('hst2json')

const buffer = fs.readFileSync('filename.hst')
const json = hst2json(buffer)
```
