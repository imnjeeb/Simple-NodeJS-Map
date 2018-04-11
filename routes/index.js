'use strict';

module.exports = function (app) {
  var express = require('express');
  var async = require("async");
  var request = require("request");
  var fs = require('fs');

  const ss_path = 'config/ss.json';
  var ssConfig = readJsonFileSync(ss_path);

  const style_path = 'config/styles.json';
  var stylesConfig = readJsonFileSync(style_path);


  app.get('/', callbackGetPage);


  function callbackGetPage(req,res) {

    res.render('index', {
      hostname: req.hostname,
      ss: ssConfig,
      styles: stylesConfig
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  // useful functions
  ////////////////////////////////////////////////////////////////////////////
  function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
      encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
  }

  function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  function spaceToUnderscore(str) {
    return str.split(' ').join('_');
  }

  function ArrObjNoDupe(a, id) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
      temp[a[i][id]] = a[i];
    var r = [];
    for (var k in temp)
      r.push(temp[k]);
    return r;
  }

  /* clone object, not return as address pointer */
  function clone(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle moment
    if (moment.isMoment(obj)) {
      copy = moment(obj);
      return copy;
    }
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (Array.isArray(obj)) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  String.prototype.replaceAll=function(search,replacement){
    var target=this;
    return target.split(search).join(replacement);
  }
};
