import {pathToRegexp} from "path-to-regexp";

// noinspection JSUnusedGlobalSymbols


/**
 * match path with pattern, and return params map.
 * @param {string} pathPattern pattern for your path.
 * @param {string} pathString your path to match the pattern
 * @param fieldsToConvertType Please specify fields that are needed to be converted to {number | boolean}. In {boolean} case,
 * 0 and 1 can also be converted to false and true.
 * return {<T>|undefined}
 */
export function pathToObject<T extends Record<string, string | boolean | number>>(pathPattern: string, pathString: string, fieldsToConvertType?: Record<string, 'boolean' | 'number'>): T {
  try {
    const result = pathToRegexp(pathPattern).exec(pathString);
    const keys = pathPattern
        .split('/')
        .filter(name => name.indexOf(':') === 0)
        .map(name => name.replace(':', ''));
    const params: Record<string, any> = {};
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= keys.length; i++) {
      if (result) {
        const value = result[i];
        const fieldName = keys[i - 1];
        if (fieldsToConvertType) {
          Object.keys(fieldsToConvertType).forEach((key) => {
            const type = fieldsToConvertType[key];
            switch (type) {
              case "boolean":
                switch (value.toLowerCase()) {
                  case "true":
                  case "1":
                    params[key] = true;
                    break;
                  case "false":
                  case "0":
                    params[key] = false;
                    break;
                  default:
                    break;
                }
                break;
              case "number":
                const n = parseInt(value, 10)
                params[key] = isNaN(n) ? 0 : n;
                break;
              default:
                break;
            }
          });
        } else {
          params[fieldName] = value;
        }
      }
    }
    return params as T;
  } catch (err) {
    // do nothing
  }
  return {} as T;
}
