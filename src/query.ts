import qs from "qs";

// noinspection JSUnusedGlobalSymbols
/**
 * Map current queries to object with generics.
 *
 * Since all fields in query string are type of string,
 * here provides a key-value parameter to specify fields that are needed to be converted to {number | boolean}.
 *
 * @param fieldsToConvertType Please specify fields that are needed to be converted to {number | boolean}. In {boolean} case,
 * 0 and 1 can also be converted to false and true.
 */
export function getQueries<T extends Record<string, string | boolean | number>>(fieldsToConvertType?: Record<string, 'boolean' | 'number'>): T {
  try {
    const urlComponents = window.location.href.split('?');
    if (urlComponents.length > 1) {
      const queries = qs.parse(urlComponents[1]) as Record<string, any>
      if (fieldsToConvertType) {
        Object.keys(fieldsToConvertType).forEach((key) => {
          const type = fieldsToConvertType[key];
          const value = queries[key];
          switch (type) {
            case "boolean":
              switch (value.toLowerCase()) {
                case "true":
                case "1":
                  queries[key] = true;
                  break;
                case "false":
                case "0":
                  queries[key] = false;
                  break;
                default:
                  break;
              }
              break;
            case "number":
              if (typeof value === "string") {
                const n = parseInt(value, 10)
                queries[key] = isNaN(n) ? 0 : n;
              }
              break;
            default:
              break;
          }
        });
      }
      return queries as unknown as T;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
  return {} as T;
}
