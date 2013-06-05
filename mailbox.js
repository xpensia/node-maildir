
var EventEmitter = require('events').EventEmitter;
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');

var async = require('async');
var mkdirp = require('mkdirp');

function Mailbox(dir, create, cb, _exists) {
    EventEmitter.call(this);
    this.dir = dir;

    this.uid_list = null;
    this.uid_map = null;
    this.flags_map = null;

    this.uid_validity = 0;
    this.uid_next = 1;

    if(_exists) {
        return this;
    }
    if(typeof create == 'function') {
        cb = create;
        create = false;
    }
    if(create) {
        Mailbox.create(dir, this, cb);
        return this;
    }

    this.open(cb);
}
module.exports = Mailbox;
Mailbox.prototype = Object.create(EventEmitter.prototype);

Mailbox.create = function(dir, open, cb) {
    if(typeof open == 'function') {
        cb = open;
        open = false;
    }
    else {
        // ensure not null nor undefined
        open = open || false;
    }
    // cb is not mandatory when called from `new Maildir(dir, true)`
    if(typeof cb != 'function' && (!open.constructor || open.constructor != Mailbox)) {
        var e = new TypeError('A callback is required');
        Error.captureStackTrace(e, Mailbox.create);
        throw e;
    }

    function onError(err) {
        if(typeof cb == 'function') {
            cb(err);
        }
        else {
            open.emit('error', err);
        }
    }

    async.series({
        _dir: mkdirp.bind(null, dir),
        uid_list: fs.open.bind(fs, path.join(dir, 'uid-list'), 'w+'),
        uid_map: fs.open.bind(fs, path.join(dir, 'uid-map'), 'w+'),
        flags_map: fs.open.bind(fs, path.join(dir, 'flags-map'), 'w+')
    }, function(err, res) {
        if(err) {
            return onError(err);
        }
        var uid_validity = crypto.randomBytes(4).readInt32BE(0) & 0x7fffffff;
    });
};

Mailbox.prototype.open = function() {
    async.parallel({
        uid_list: fs.open.bind(fs, path.join(dir, 'uid-list'), 'r+'),
        uid_map: fs.open.bind(fs, path.join(dir, 'uid-map'), 'r+'),
        flags_map: fs.open.bind(fs, path.join(dir, 'flags-map'), 'r+')
    }, function(err, res) {
        //
    });
};
