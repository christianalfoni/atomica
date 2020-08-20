import { ICssPropToToken, IBreakpoints, ISheet, TUtility } from "./types";
import {
  background,
  animation,
  transition,
  font,
  boxShadow,
  margin,
  padding,
  border,
  borderBottom,
  borderColor,
  borderLeft,
  borderRadius,
  borderRight,
  borderStyle,
  borderTop,
  borderWidth,
} from "./shorthand-parser";

export const cssPropToToken: ICssPropToToken<any> = {
  border: ["", "borderStyles", "colors"],
  flexBasis: "space",
  color: "colors",
  backgroundColor: "colors",
  margin: "space",
  marginTop: "space",
  marginLeft: "space",
  marginRight: "space",
  marginBottom: "space",
  padding: "space",
  paddingTop: "space",
  paddingLeft: "space",
  paddingRight: "space",
  paddingBottom: "space",
  gridGap: "space",
  gridColumnGap: "space",
  gridRowGap: "space",
  fontSize: "fontSizes",
  borderColor: "colors",
  borderTopColor: "colors",
  borderLeftColor: "colors",
  borderRightColor: "colors",
  borderBottomColor: "colors",
  fontFamily: "fonts",
  fontWeight: "fontWeights",
  lineHeight: "lineHeights",
  letterSpacing: "letterSpacings",
  width: "sizes",
  height: "sizes",
  minWidth: "sizes",
  maxWidth: "sizes",
  minHeight: "sizes",
  maxHeight: "sizes",
  borderWidth: "borderWidths",
  borderTopWidth: "borderWidths",
  borderLeftWidth: "borderWidths",
  borderRightWidth: "borderWidths",
  borderBottomWidth: "borderWidths",
  borderStyle: "borderStyles",
  borderTopStyle: "borderStyles",
  borderLeftStyle: "borderStyles",
  borderRightStyle: "borderStyles",
  borderBottomStyle: "borderStyles",
  borderRadius: "radii",
  borderTopLeftRadius: "radii",
  borderTopRightRadius: "radii",
  borderBottomRightRadius: "radii",
  borderBottomLeftRadius: "radii",
  boxShadow: "shadows",
  textShadow: "shadows",
  zIndex: "zIndices",
  transition: "transitions",
};

export const tokenTypes = [
  "sizes",
  "colors",
  "space",
  "fontSize",
  "lineHeights",
  "fontWeights",
  "fonts",
  "borderWidths",
  "radii",
] as const;

export const createSheets = (env: any, screens: IBreakpoints = {}) => {
  const tags: HTMLStyleElement[] = [];
  if (env && env.document) {
    const head = env.document.querySelector("head");

    if (!head) {
      throw new Error("There is no HEAD element on this document");
    }

    const styles = Array.from<HTMLStyleElement>(head.querySelectorAll("style"));
    const existingStyles = styles.filter((style) =>
      Boolean(style.textContent && style.textContent.startsWith("/* STITCHES"))
    );

    return {
      tags,
      sheets: ["__variables__", ""]
        .concat(Object.keys(screens))
        .reduce<{ [key: string]: ISheet }>((aggr, key, index) => {
          let style = existingStyles[index];
          if (!style) {
            style = env.document.createElement("style");
            tags.push(style);
            head.appendChild(style);
          }

          for (let x = 0; x < document.styleSheets.length; x++) {
            if (document.styleSheets[x].ownerNode === style) {
              aggr[key] = document.styleSheets[x] as any;
              break;
            }
          }

          return aggr;
        }, {}),
    };
  }

  return {
    tags,
    sheets: ["__variables__", ""]
      .concat(Object.keys(screens))
      .reduce<{ [key: string]: ISheet }>((aggr, key) => {
        aggr[key] = {
          content: "",
          cssRules: [],
          insertRule(content) {
            aggr[key].content += `\n${content}`;
          },
        };

        return aggr;
      }, {}),
  };
};

export const specificityProps: {
  [key: string]: any;
} = {
  border,
  boxShadow,
  flex: (tokens, value) => {
    if (Array.isArray(value)) {
      if (value.length === 2) {
        return {
          flexGrow: value[0],
          ...(isNaN(value[1])
            ? { flexBasis: value[1] }
            : { flexShrink: value[1] }),
        };
      }
      if (value.length === 3) {
        return {
          flexGrow: value[0],
          flexShrink: value[1],
          flexBasis: value[2],
        };
      }
    }

    return isNaN(value)
      ? {
          flexBasis: value,
        }
      : {
          flexGrow: value,
        };
  },
  overflow: (tokens, value) => ({ overflowX: value, overflowY: value }),
  margin,
  padding,
  borderRadius,
  borderColor,
  borderStyle,
  borderWidth,
  background,
  animation,
  transition,
  font,
  borderBottom,
  borderLeft,
  borderTop,
  borderRight
};

export const getVendorPrefixAndProps = (env: any) => {
  const styles = env.getComputedStyle(env.document.documentElement);
  const vendorProps = Array.from(styles).filter(
    (prop) => (prop as string)[0] === "-"
  );
  // @ts-ignore
  const vendorPrefix = (vendorProps.join("").match(/-(moz|webkit|ms)-/) ||
    (styles.OLink === "" && ["", "o"]))[1];

  return { vendorPrefix: `-${vendorPrefix}-`, vendorProps };
};

export const hashString = (str: string) => {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return generateAlphabeticName(hash >>> 0);
};

/**
 * Converts a hash number to alphabetic representation:
 * Copied from:
 * https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/generateAlphabeticName.js
 */

const AD_REPLACER_R = /(a)(d)/gi;

/* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised
 * counterparts */
const charsLength = 52;

/* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */
const getAlphabeticChar = (code: number): string =>
  String.fromCharCode(code + (code > 25 ? 39 : 97));

/* input a number, usually a hash and convert it to base-52 */
function generateAlphabeticName(code: number): string {
  let name = "";
  let x;

  /* get a char and divide by alphabet-length */
  for (x = Math.abs(code); x > charsLength; x = (x / charsLength) | 0) {
    name = getAlphabeticChar(x % charsLength) + name;
  }

  return (getAlphabeticChar(x % charsLength) + name).replace(
    AD_REPLACER_R,
    "$1-$2"
  );
}
