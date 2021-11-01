"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.dot_tc = exports.unit_tc = exports.number_tc = void 0;
var number_tc = {
  零: 0,
  〇: 0,
  "０": 0,
  "0": 0,
  一: 1,
  壹: 1,
  "１": 1,
  "1": 1,
  二: 2,
  貳: 2,
  兩: 2,
  "２": 2,
  "2": 2,
  三: 3,
  參: 3,
  "３": 3,
  "3": 3,
  四: 4,
  肆: 4,
  "４": 4,
  "4": 4,
  五: 5,
  伍: 5,
  "５": 5,
  "5": 5,
  六: 6,
  陸: 6,
  "６": 6,
  "6": 6,
  七: 7,
  柒: 7,
  "７": 7,
  "7": 7,
  八: 8,
  捌: 8,
  "８": 8,
  "8": 8,
  九: 9,
  玖: 9,
  "９": 9,
  "9": 9
};
exports.number_tc = number_tc;
var unit_tc = {
  十: 10,
  拾: 10,
  百: 100,
  佰: 100,
  千: 1000,
  仟: 1000,
  萬: 10000,
  億: 100000000
};
exports.unit_tc = unit_tc;
var dot_tc = [".", "•", "點"];
exports.dot_tc = dot_tc;
var config = {
  number: number_tc,
  unit: unit_tc,
  dot: dot_tc
};
exports.config = config;
//# sourceMappingURL=tc-config.js.map