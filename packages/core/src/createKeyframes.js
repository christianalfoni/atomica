import { createMemoMap } from './createMemoMap.js'

import { toCssRules } from './convert/toCssRules.js'
import { toHash } from './convert/toHash.js'
import { toTailDashed } from './convert/toTailDashed.js'

import { define } from './utility/define.js'

/** @typedef {import('.').Config} Config */
/** @typedef {import('.').Style} Style */
/** @typedef {import('.').GroupSheet} GroupSheet */

const createKeyframesFunctionMap = createMemoMap()

/** Returns a function that applies a keyframes rule. */
export const createKeyframesFunction = (/** @type {Config} */ config, /** @type {GroupSheet} */ sheet) => (
	createKeyframesFunctionMap(config, () => (style) => {
		/** @type {string} Keyframes Unique Identifier. @see `{CONFIG_PREFIX}-?k-{KEYFRAME_UUID}` */
		const name = `${toTailDashed(config.prefix)}k-${toHash(style)}`

		const render = () => {
			if (!sheet.rules.global.cache.has(name)) {
				sheet.rules.global.cache.add(name)

				let index = sheet.rules.global.group.cssRules.length

				const cssRules = []

				toCssRules(style, [], [], config, (cssText) => cssRules.push(cssText))

				const cssText = `@keyframes ${name}{${cssRules.join('')}}`

				sheet.rules.global.group.insertRule(cssText, index++)
			}

			return name
		}

		return define(render, {
			get name() {
				return render()
			},
			toString: render,
			[Symbol.toPrimitive]: render,
		})
	})
) // prettier-ignore
