import createCss from '../src/index'

describe('Configuration', () => {
	describe('Configuration', () => {
		test('Configuration can be passed into the `createCss` function', () => {
			const instance = createCss({
				prefix: '',
				theme: {
					colors: {
						brandRed: 'tomato',
					},
				},
				conditions: {
					sm: '@media (max-width: 639px)',
					md: '@media (min-width: 640px) and (max-width: 959px)',
					lg: '@media (min-width: 960px)',
				},
				properties: {
					marginX: (value: any) => ({
						marginLeft: value,
						marginRight: value,
					}),
				},
			})

			expect(instance.css).toBeInstanceOf(Function)
		})
	})

	/** @todo fix false positives - the prefix is not being applied. */
	describe('Prefix', () => {
		test('Configuration can be passed `prefix` which will prefix all component selectors', () => {
			const { css, toString } = createCss({ prefix: 'fusion' })
			const rule = css({ color: 'red' })
			expect(toString()).toBe('')

			const className = String(rule)
			expect(className).toBe('fusions-cysv1f')
			expect(toString()).toBe('.fusions-cysv1f{color:red;}')
		})
	})

	describe('Theme', () => {
		test('Users can define a theme when creating the CSS Instance', () => {
			const instance = createCss({
				theme: {
					colors: {
						brandRed: 'tomato',
					},
				},
			})
			const rule = instance.css({ color: '$red' })
			expect(instance.toString()).toBe(':root{--colors-brandRed:tomato;}')

			expect(String(rule)).toBe('s-jwwd7g')
			expect(instance.toString()).toBe(
				':root{--colors-brandRed:tomato;}.s-jwwd7g{color:var(--colors-red);}:root{--colors-brandRed:tomato;}',
			)
		})
	})

	/** @todo fix false positives — the conditions are not being applied. */
	describe('Conditions', () => {
		test('Users can define conditions when creating the CSS Instance', () => {
			const instance = createCss({
				conditions: {
					small: '@media (max-width: 768px)',
					mediumUp: '@media (min-width: 768px)',
					gridSupport: '@supports (display: grid)',
				},
			})
			const rule = instance.css({
				fontSize: '16px',
				when: {
					mediumUp: {
						fontSize: '24px',
					},
				},
			})
			expect(instance.toString()).toBe('')

			expect(String(rule)).toBe('s-5hh6q0')
			expect(instance.toString()).toBe('.s-5hh6q0{font-size:16px;}.s-5hh6q0 when mediumUp{font-size:24px;}')
		})
	})

	/** @todo fix false positives — the functional properties are not being applied. */
	describe('Properties', () => {
		test('Users can define functional properties when creating the CSS Instance', () => {
			const instance = createCss({
				properties: {
					// create `bg` property
					bg: (value: any) => ({ backgroundColor: value }),
				},
			})
			const rule = instance.css({
				bg: 'red',
			})
			expect(instance.toString()).toBe('')

			expect(String(rule)).toBe('s-ovku6v')
			expect(instance.toString()).toBe('.s-ovku6v{background-color:red;}')
		})
	})

	/** @todo fix missing parts — the lack of typing means there is not way to test typed functional properties. */
	/** @todo fix missing parts — the lack of typing means there is not way to test "third party" typed functional properties. */
})