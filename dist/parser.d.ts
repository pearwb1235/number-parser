import { Config } from "./config";
export declare class ParserConfig {
    private config;
    private allowChar;
    numberRegStr: Readonly<RegExp>;
    unitRegStr: Readonly<RegExp>;
    dotRegexp: Readonly<RegExp>;
    regexp: Readonly<RegExp>;
    negativeRegexp: Readonly<RegExp>;
    constructor(config: Config);
    loadConfig(config: Config): this;
    vaild(str: string): void;
    parseNumber(str: string): number;
    parseUnit(str: string): number;
}
export declare class Parser {
    private config;
    constructor(config: Config | ParserConfig);
    parse(str: string): number;
    parseNumber(str: string): number;
}
//# sourceMappingURL=parser.d.ts.map