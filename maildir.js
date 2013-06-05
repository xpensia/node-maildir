
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');

var async = require('async');
var mkdirp = require('mkdirp');

var Mailbox = require('./mailbox.js');

function Maildir(dir, create, cb, _exists) {
    EventEmitter.call(this);
    this.dir = dir;

    if(_exists) {
        return this;
    }
    if(typeof create == 'function') {
        cb = create;
        create = false;
    }
    if(create) {
        Maildir.create(dir, this, cb);
        return this;
    }


    var mdir = this;
    async.map([
        path.join(dir, 'new'),
        path.join(dir, 'cur'),
        path.join(dir, 'tmp')
    ], fs.stat, function(err) {
        if(typeof cb == 'function') {
            return cb(err, mdir);
        }
        if(err) {
            mdir.emit('error', err);
        }
        else {
            mdir.emit('ready', mdir);
        }
    });
}
Maildir.prototype = Object.create(EventEmitter);
module.exports = Maildir;
Maildir.Mailbox = Mailbox;

Maildir.create = function(dir, open, cb) {
    if(typeof open == 'function') {
        cb = open;
        open = false;
    }
    else {
        // ensure not null nor undefined
        open = open || false;
    }
    // cb is not mandatory when called from `new Maildir(dir, true)`
    if(typeof cb != 'function' && (!open.constructor || open.constructor != Maildir)) {
        var e = new TypeError('A callback is required');
        Error.captureStackTrace(e, Maildir.create);
        throw e;
    }
    var INBOX = path.join(dir, 'cur');
    async.map([
        path.join(dir, 'new'), // recents emails
        path.join(dir, 'tmp')
    ], mkdirp, function(err, res) {
        if(err) {
            return cb(err);
        }
        if(!open) {
            return Mailbox.create(mbox, cb);
        }
        Mailbox.create(INBOX, function(err) {
            var mDir = open.constructor && open.constructor === Maildir && open;
            if(typeof cb != 'function') {
                return err && open.emit('error', err) || open.emit('ready', open);
            }
            cb(err || null, !err && mDir || !err && new Maildir(dir, null, null, true));
        });
    });
};

Maildir.prototype.open = function(name, create, cb) {
    //
};

Maildir.prototype.create = function(name, open, cb) {
    //
};




