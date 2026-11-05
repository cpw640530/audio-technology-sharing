import generated from "./traditional.generated.json";

const dictionary: Record<string, string> = generated;
// shortcut: new phrases use character fallback until generate-traditional.cjs is rerun.
const convert = (value: string) => dictionary[value] ?? Array.from(value, char => dictionary[char] ?? char).join("");

// Convert localized values, never object keys, identifiers or DOM nodes.
export function traditional<T>(value: T): T {
  if (typeof value === "string") return convert(value) as T;
  if (Array.isArray(value)) return value.map(item => traditional(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, traditional(item)])) as T;
  }
  return value;
}
