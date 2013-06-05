# Maildir++

A Maildir++ library for nodejs

## Installation

```sh
npm install --save maildir-plus
```

## Usage

```javascript

var Maildir = require('maildir-plus');

/* using events */
var maildir = new Maildir('/path/to/maildir');
maildir.on('error', function(err) {
    // do something about it...
});
maildir.on('ready', function() {
    // maildir ok
});

/* with a classic callback */
var maildir = new Maildir('/path/to/maildir', function(err) {
    // ...
});

```
