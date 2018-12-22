# hst2json

convert MT4 `.hst` to json object.

* only support hst format version lower 401

## install
```
npm install hst2json
```

## Usage
```javascript
const fs = require('fs')
const hst2json = require('hst2json')

const buffer = fs.readFileSync('filename.hst')
const json = hst2json(buffer)
```
