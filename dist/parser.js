"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = exports.ParserConfig = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _error = _interopRequireDefault(require("./error"));

var ParserConfig = /*#__PURE__*/function () {
  function ParserConfig(config) {
    (0, _classCallCheck2["default"])(this, ParserConfig);
    (0, _defineProperty2["default"])(this, "config", void 0);
    (0, _defineProperty2["default"])(this, "allowChar", void 0);
    (0, _defineProperty2["default"])(this, "numberRegStr", void 0);
    (0, _defineProperty2["default"])(this, "unitRegStr", void 0);
    (0, _defineProperty2["default"])(this, "dotRegexp", void 0);
    (0, _defineProperty2["default"])(this, "regexp", void 0);
    (0, _defineProperty2["default"])(this, "negativeRegexp", void 0);
    this.loadConfig(config);
  }

  (0, _createClass2["default"])(ParserConfig, [{
    key: "loadConfig",
    value: function loadConfig(config) {
      this.config = config;
      this.allowChar = [].concat(Object.keys(this.config.number)).concat(Object.keys(this.config.unit)).concat(this.config.dot);
      var numberRegStr = Object.keys(this.config.number).join("").replace(/(\.)/, "\\$1");
      var unitRegStr = Object.keys(this.config.unit).join("").replace(/(\.)/, "\\$1");
      var dotRegStr = this.config.dot.join("").replace(/(\.)/, "\\$1");
      this.numberRegStr = new RegExp("[".concat(numberRegStr, "]"));
      this.unitRegStr = new RegExp("[".concat(unitRegStr, "]"));
      this.dotRegexp = new RegExp("[".concat(dotRegStr, "]"));
      this.regexp = new RegExp("[".concat(numberRegStr + unitRegStr + dotRegStr, "]"));
      this.negativeRegexp = new RegExp("[^".concat(numberRegStr + unitRegStr + dotRegStr, "]"));
      return this;
    }
  }, {
    key: "vaild",
    value: function vaild(str) {
      var dotFlag = false;

      for (var i = 0; i < str.length; i++) {
        if (this.config.dot.includes(str[i])) {
          if (dotFlag) throw new _error["default"](2, "小數點出現兩個(含)以上");
          dotFlag = true;
        } else if (!this.allowChar.includes(str[i])) throw new _error["default"](1, "字串出現非允許字串: " + str[i] + "(index:" + i + ")");
      }
    }
  }, {
    key: "parseNumber",
    value: function parseNumber(str) {
      if (str in this.config.number) return this.config.number[str];
      throw new _error["default"](9, "無法轉換字元 " + str + " 為數字");
    }
  }, {
    key: "parseUnit",
    value: function parseUnit(str) {
      if (str in this.config.unit) return this.config.unit[str];
      throw new _error["default"](9, "無法轉換字元 " + str + " 為數字");
    }
  }]);
  return ParserConfig;
}();

exports.ParserConfig = ParserConfig;

var Parser = /*#__PURE__*/function () {
  function Parser(config) {
    (0, _classCallCheck2["default"])(this, Parser);
    (0, _defineProperty2["default"])(this, "config", void 0);
    this.config = config instanceof ParserConfig ? config : new ParserConfig(config);
  }

  (0, _createClass2["default"])(Parser, [{
    key: "parse",
    value: function parse(str) {
      this.config.vaild(str);
      var input = str;

      if (this.config.dotRegexp.test(input)) {
        if (this.config.unitRegStr.test(input.substr(-1))) {
          // 1.2萬
          var unit = this.config.parseUnit(input.substr(-1));

          if (unit % 1 === 0) {
            var match = /(0+)$/.exec(unit.toString());

            if (match) {
              var inputs = input.substr(0, input.length - 1).split(this.config.dotRegexp);
              input = inputs[0] + inputs[1].substr(0, match[1].length).padEnd(match[1].length, "0");
              if (match[1].length < inputs[1].length) input += "." + inputs[1].substr(match[2].length);
              return this.parseNumber(input.replace(/^0+/, "")) * (unit / Math.pow(10, match[1].length));
            }

            return this.parseNumber(input.substr(0, input.length - 1)) * unit;
          } else {
            return this.parseNumber(input.substr(0, input.length - 1)) * unit;
          }
        } else {
          // 1.2
          return this.parseNumber(input);
        }
      } else {
        if (this.config.unitRegStr.test(input.substr(0, 1)) && this.config.unitRegStr.test(input.substr(1, 1))) {
          // 十萬 => 10萬
          input = this.config.parseUnit(input.substr(0, 1)).toString() + input.substr(1);
        }

        if (this.config.unitRegStr.test(input.substr(-2, 1)) && this.config.numberRegStr.test(input.substr(-1))) {
          // 一【千二】
          var _unit = this.config.parseUnit(input.substr(-2, 1));

          return this.parseNumber(input.substr(0, input.length - 2)) * _unit + this.parseNumber(input.substr(-1)) * _unit / 10;
        } else {
          // 四千三百二十一
          return this.parseNumber(input);
        }
      }

      return 0;
    }
  }, {
    key: "parseNumber",
    value: function parseNumber(str) {
      var newStr = "";

      for (var i = 0; i < str.length; i++) {
        var s = str[i];

        if (this.config.dotRegexp.test(s)) {
          newStr += ".";
        } else if (this.config.unitRegStr.test(s)) {
          if (i + 1 >= str.length || this.config.unitRegStr.test(str[i + 1])) newStr += this.config.parseUnit(s).toString().substr(1);else if (this.config.parseNumber(str[i + 1]) === 0 && !["0", "０"].includes(str[i + 1])) {
            newStr += this.config.parseUnit(s).toString().substr(1);
            var sub = this.parseNumber(str.substr(i + 2)).toString();
            newStr = newStr.substr(0, newStr.length - sub.length) + sub;
            break;
          }
        } else {
          newStr += this.config.parseNumber(s).toString();
        }
      }

      if (this.config.dotRegexp.test(newStr)) {
        while (newStr.endsWith("0")) {
          newStr = newStr.substr(0, newStr.length - 1);
        }

        if (newStr.endsWith(".")) newStr = newStr.substr(0, newStr.length - 1);
      }

      var result = Number(newStr);
      if (result.toString() !== newStr) throw new _error["default"](999, "確認數字轉換結果失敗");
      return result;
    }
  }]);
  return Parser;
}();

exports.Parser = Parser;
//# sourceMappingURL=parser.js.map