export { config as TC_Config } from "./tc-config";

export type Config = {
  number: Record<string, number>;
  unit: Record<string, number>;
  dot: string[];
};
