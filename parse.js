"use strict";

/************************ sample data ************************/
var json_in = '{"Name":"Bart Simpson","Company":"Google","Title":"Engineer","Team":[{"Name":"Bob Jones","Project":"Maps"},{"Name":"Alisha Roth","Project":"Gmail"}]}',

/************************ JSONx.parse implementation ************************/
JSONx = {
  _str: function(str) {
    var word = "";

    for (var index = 1; index < str.length; index++) {
      var curr = str.charAt(index);
      if (curr == "\""){
        return { data: word, leftover: str.substring(index + 1) };
      }
      word += curr;
    }
  },
  _arr: function(str) {
    str = str.substring(1);
    var array = [], object;
    while (true) {
      var curr = str.charAt(0);
      if (curr == "]"){
        return { data: array, leftover: str.substring(1) };
      }

      object = this._parse(str);
      str = object.leftover;

      if (str.charAt(0) == ","){
        str = str.substring(1);
      }

      array.push(object.data);
    }
  },
  _obj: function(str) {
    str = str.substring(1);
    var object = {}, key, val;

    while (true) {
      if ( str.length === 1 && str.charAt(0) == "}"){
        return object;
      } else if (str.charAt(0) == "}"){
        return { data: object, leftover: str.substring(1) };
      }

      key = this._parse(str);
      str = key.leftover.substring(1);

      val = this._parse(str);
      str = val.leftover;

      if (str.charAt(0) == ","){
        str = str.substring(1);
      }

      object[key.data] = val.data;
    }
  },
  _parse: function(str) {
    var curr = str.charAt(0);

    if (curr == "\""){
      return this._str(str);
    }
    if (curr == "{"){
      return this._obj(str);
    }
    if (curr == "["){
      return this._arr(str);
    }
  },
  parse: function(str) {
    return this._parse(str);
  }
};

/************************ MyJson class ************************/
function MyJson(str_json) {
  this.data = JSONx.parse(str_json);
}

MyJson.prototype.get_value = function(key) {
  return this.data[key];
};

MyJson.prototype.get_array = function(key) {
  return this.get_value(key);
};

/************************ CREATE UNIT TEST ************************/
function unit_test(){
  var my_json = new MyJson(json_in);

  if (my_json.get_value("Name") !== "Bart Simpson" ||
    my_json.get_value("Company") !== "Google" ||
    my_json.get_value("Title") !== "Engineer"){
    return false;
  }

  var teammates = [ { Name: "Bob Jones", Project: "Maps" }, { Name: "Alisha Roth", Project:"Gmail" } ];
  if (JSON.stringify(my_json.get_array("Team"))
      !==
      JSON.stringify(teammates)){
    return false;
  }

  return true;
}
/************************ RUN TEST ************************/
console.log(unit_test());
