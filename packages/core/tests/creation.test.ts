import createCss from '../src/index'

describe('Creation', () => {
	describe('Creates a CSS Instance via `createCSS`', () => {
		test('`createCSS` function is exported', async () => {
			const { default: defaultImport } = await import('../src/index')

			expect(defaultImport).toBeInstanceOf(Function)
		})

		test('`createCss` function can be called empty', () => {
			expect(() => createCss()).not.toThrow
		})

		test('`createCss` function can be called with a config', () => {
			expect(() => createCss({})).not.toThrow
		})

		test('`createCss` function returns a `css` function', () => {
			const { css } = createCss()
			expect(css).toBeInstanceOf(Function)
		})
	})

	describe('Create a CSS Component', () => {
		const sheet = createCss({
			theme: {
				color: {
					lite: 'gainsboro',
				},
				radii: {
					full: '9999px',
				},
				space: {
					full: '1em',
					tenSixteenth: 'calc(10em / 16)',
				},
			},
		})
		const { css } = sheet

		test('`css` function can create a CSS Component', () => {
			const buttonClass = css({
				backgroundColor: '$lite',
				borderRadius: '$full',
				fontWeight: 500,
				padding: '$tenSixteenth $full',
				border: 0,
				transition: 'all 200ms ease',

				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: '0 10px 25px rgba(0, 0, 0, .3)',
				},
			})

			expect(String(buttonClass)).toBe('s-2j80d3')

			expect(sheet.toString()).toBe(
				':root{--color-lite:gainsboro;--radii-full:9999px;--space-full:1em;--space-tenSixteenth:calc(10em / 16);}.s-2j80d3{background-color:var(--colors-lite);border-radius:var(--radii-full);font-weight:500;padding:var(--space-tenSixteenth) var(--space-full);border:0;transition:all 200ms ease;}.s-2j80d3:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(0, 0, 0, .3);}',
			)
		})

		// test('`css` function can create a CSS Component with multiple arguments', () => {
		// 	expect(true).toBe(true)
		// })

		// test('`css` function can create a CSS Component from another component', () => {
		// 	expect(true).toBe(true)
		// })
	})
})
