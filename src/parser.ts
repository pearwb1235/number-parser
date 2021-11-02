import { Config } from "./config";
import NumberParserError from "./error";

export class ParserConfig {
  private config: Config;
  private allowChar: string[];
  numberRegStr: Readonly<RegExp>;
  unitRegStr: Readonly<RegExp>;
  dotRegexp: Readonly<RegExp>;
  regexp: Readonly<RegExp>;
  negativeRegexp: Readonly<RegExp>;
  constructor(config: Config) {
    this.loadConfig(config);
  }
  loadConfig(config: Config): this {
    this.config = config;
    this.allowChar = []
      .concat(Object.keys(this.config.number))
      .concat(Object.keys(this.config.unit))
      .concat(this.config.dot);
    const numberRegStr = Object.keys(this.config.number)
      .join("")
      .replace(/(\.)/, "\\$1");
    const unitRegStr = Object.keys(this.config.unit)
      .join("")
      .replace(/(\.)/, "\\$1");
    const dotRegStr = this.config.dot.join("").replace(/(\.)/, "\\$1");
    this.numberRegStr = new RegExp(`[${numberRegStr}]`);
    this.unitRegStr = new RegExp(`[${unitRegStr}]`);
    this.dotRegexp = new RegExp(`[${dotRegStr}]`);
    this.regexp = new RegExp(`[${numberRegStr + unitRegStr + dotRegStr}]`);
    this.negativeRegexp = new RegExp(
      `[^${numberRegStr + unitRegStr + dotRegStr}]`
    );
    return this;
  }
  vaild(str: string): void {
    let dotFlag = false;
    for (let i = 0; i < str.length; i++) {
      if (this.config.dot.includes(str[i])) {
        if (dotFlag) throw new NumberParserError(2, "小數點出現兩個(含)以上");
        dotFlag = true;
      } else if (!this.allowChar.includes(str[i]))
        throw new NumberParserError(
          1,
          "字串出現非允許字串: " + str[i] + "(index:" + i + ")"
        );
    }
  }
  parseNumber(str: string): number {
    if (str in this.config.number) return this.config.number[str];
    throw new NumberParserError(9, "無法轉換字元 " + str + " 為數字");
  }
  parseUnit(str: string): number {
    if (str in this.config.unit) return this.config.unit[str];
    throw new NumberParserError(9, "無法轉換字元 " + str + " 為數字");
  }
}

export class Parser {
  private config: ParserConfig;
  constructor(config: Config | ParserConfig) {
    this.config =
      config instanceof ParserConfig ? config : new ParserConfig(config);
  }
  parse(str: string): number {
    this.config.vaild(str);
    let input = str;
    if (this.config.dotRegexp.test(input)) {
      if (this.config.unitRegStr.test(input.substr(-1))) {
        // 1.2萬
        return (
          this.parseNumber(input.substr(0, input.length - 1)) *
          this.config.parseUnit(input.substr(-1))
        );
      } else {
        // 1.2
        return this.parseNumber(input);
      }
    } else {
      if (
        this.config.unitRegStr.test(input.substr(0, 1)) &&
        this.config.unitRegStr.test(input.substr(1, 1))
      ) {
        // 十萬 => 10萬
        input =
          this.config.parseUnit(input.substr(0, 1)).toString() +
          input.substr(1);
      }
      if (
        this.config.unitRegStr.test(input.substr(-2, 1)) &&
        this.config.numberRegStr.test(input.substr(-1))
      ) {
        // 一【千二】
        const unit = this.config.parseUnit(input.substr(-2, 1));
        return (
          this.parseNumber(input.substr(0, input.length - 2)) * unit +
          (this.parseNumber(input.substr(-1)) * unit) / 10
        );
      } else {
        // 四千三百二十一
        return this.parseNumber(input);
      }
    }
    return 0;
  }
  parseNumber(str: string): number {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
      const s = str[i];
      if (this.config.dotRegexp.test(s)) {
        newStr += ".";
      } else if (this.config.unitRegStr.test(s)) {
        if (i + 1 >= str.length || this.config.unitRegStr.test(str[i + 1]))
          newStr += this.config.parseUnit(s).toString().substr(1);
        else if (
          this.config.parseNumber(str[i + 1]) === 0 &&
          !["0", "０"].includes(str[i + 1])
        ) {
          newStr += this.config.parseUnit(s).toString().substr(1);
          const sub = this.parseNumber(str.substr(i + 2)).toString();
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
    }
    const result = Number(newStr);
    if (result.toString() !== newStr)
      throw new NumberParserError(999, "確認數字轉換結果失敗");
    return result;
  }
}
