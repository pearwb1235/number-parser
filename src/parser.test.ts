import { describe, expect, it } from "@jest/globals";
import { TC_Config } from "./config";
import { Parser } from "./parser";

const TCNumberParser = new Parser(TC_Config);

describe("基本", () => {
  it("12345", () => {
    expect(TCNumberParser.parse("12345")).toEqual(12345);
  });
  it("01234", () => {
    expect(TCNumberParser.parse("01234")).toEqual(1234);
  });
  it("一萬", () => {
    expect(TCNumberParser.parse("一萬")).toEqual(10000);
  });
  it("一萬兩千", () => {
    expect(TCNumberParser.parse("一萬兩千")).toEqual(12000);
  });
  it("十萬", () => {
    expect(TCNumberParser.parse("十萬")).toEqual(100000);
  });
  it("1.20", () => {
    expect(TCNumberParser.parse("1.20")).toEqual(1.2);
  });
  it("12.0", () => {
    expect(TCNumberParser.parse("12.0")).toEqual(12);
  });
  it("0123", () => {
    expect(TCNumberParser.parse("0123")).toEqual(123);
  });
  it("0.12", () => {
    expect(TCNumberParser.parse("0.12")).toEqual(0.12);
  });
  it("1.2萬", () => {
    expect(TCNumberParser.parse("1.2萬")).toEqual(12000);
  });
  it("十點二", () => {
    expect(TCNumberParser.parse("十點二")).toEqual(10.2);
  });
  it("十二", () => {
    expect(TCNumberParser.parse("十二")).toEqual(12);
  });
  it("一萬二", () => {
    expect(TCNumberParser.parse("一萬二")).toEqual(12000);
  });
  it("一萬零二", () => {
    expect(TCNumberParser.parse("一萬零二")).toEqual(10002);
  });
});

describe("浮點數錯誤", () => {
  it("0.00013億", () => {
    expect(TCNumberParser.parse("0.00013億")).toEqual(13000);
  });
});
