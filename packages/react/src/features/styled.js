import React from 'react'

import { $$composers } from '../../../core/src/utility/composers.js'
import { createMemo } from '../../../core/src/utility/createMemo.js'
import { getComponentType } from '../utility/getComponentType.js'

import { createComponentFunction } from '../../../core/src/features/css.js'

/** @typedef {import('../../../core/src').Config} Config */
/** @typedef {import('../../../core/src').GroupSheet} GroupSheet */

const createComponentFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createStyledFunction = ({ /** @type {Config} */ config, /** @type {GroupSheet} */ sheet }) => (
	createComponentFunctionMap(config, () => {
		const css = createComponentFunction(config, sheet)

		const styled = (...args) => {
			const DefaultType = getComponentType(args[0])

			const cssComponent = css(...args)

			const styledComponent = React.forwardRef((props, ref) => {
				const Type = props && props.as || DefaultType

				const forwardProps = cssComponent(props).props

				delete forwardProps.as

				forwardProps.ref = ref

				return React.createElement(Type, forwardProps)
			}) // prettier-ignore

			const toString = () => cssComponent.selector

			styledComponent.className = cssComponent.className
			styledComponent.displayName = `Styled.${DefaultType.displayName || DefaultType.name || DefaultType}`
			styledComponent.selector = cssComponent.selector
			styledComponent.type = DefaultType
			styledComponent.toString = toString
			styledComponent[$$composers] = cssComponent[$$composers]

			return styledComponent
		}

		return styled
	})
) // prettier-ignore
