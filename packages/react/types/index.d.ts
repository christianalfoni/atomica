import * as React from 'react'
import { InternalCSS, TConditions, TTheme, TStyledSheet, VariantsCall, IConfig, TThemeMap, CSSPropertiesToTokenScale, $variants, $conditions, StitchesExtractVariantsStyles, InferRestVariants } from '@stitches/core'

export type { StitchesVariants, StitchesCss, StitchesExtractVariantsStyles } from '@stitches/core'

export interface PolymorphicForwardRef<DefaultElement, Props> extends ForwardRefExoticBase<IntrinsicElementPolymorphicPropsWithAs<DefaultElement, Props>> {
	<JSXElm extends string>(props: IntrinsicElementPolymorphicPropsWithAs<JSXElm, Props>): JSX.Element
	<Component extends React.ComponentType>(props: ReactComponentPolymorphicPropsWithAs<Component, Props>): JSX.Element
	(props: IntrinsicElementPolymorphicPropsWithAs<DefaultElement, Props>): JSX.Element
}

type IntrinsicElementPolymorphicPropsWithAs<Elm, Props> = { as: Elm } & Omit<JSX.IntrinsicElements[Elm extends keyof JSX.IntrinsicElements ? Elm : never], keyof Props> & Props
type ReactComponentPolymorphicPropsWithAs<Elm, Props> = { as: Elm } & Omit<React.ComponentPropsWithRef<Elm extends React.ComponentType ? Elm : never>, keyof Props> & Props

/* Utils:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type IntrinsicElementsKeys = keyof JSX.IntrinsicElements
type ComponentInfer<T> = T extends IntrinsicElementsKeys | React.ComponentType<any> ? T : never

/* StitchesComponent:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type ForwardRefExoticBase<P> = Pick<React.ForwardRefExoticComponent<P>, keyof React.ForwardRefExoticComponent<any>>

export type IntrinsicElement<T extends React.ElementType, B = React.ElementRef<T>> = { [k in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[k] extends B ? k : never }[keyof HTMLElementTagNameMap]

export interface StitchesComponent<DefaultElement, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}>
	extends ForwardRefExoticBase<
		Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css' | 'as'> & {
			css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
		} & VariantsCall<Variants, Conditions>
	> {
	<M extends string>(props: NativeStitchesPropsWithAs<M, Variants, Conditions, Theme, Utils>): JSX.Element
	<As extends React.ComponentType>(props: StitchesPropsWithAs<As, Variants, Conditions, Theme, Utils>): JSX.Element
	(
		props: VariantsCall<Variants, Conditions> & { as?: DefaultElement } & Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element
	[$variants]: Variants
	[$conditions]: Conditions
}

type NativeStitchesPropsWithAs<Elm extends string, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}> = VariantsCall<Variants, Conditions> & { as: Elm } & Omit<
		JSX.IntrinsicElements[Elm extends IntrinsicElementsKeys ? Elm : never],
		keyof Variants | 'css' | 'as'
	> & {
		css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
	}
type StitchesPropsWithAs<Elm extends React.ElementType, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}> = VariantsCall<Variants, Conditions> & { as: Elm } & Omit<
		React.ComponentPropsWithRef<Elm>,
		keyof Variants | 'css' | 'as'
	> & {
		css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
	}

// export type NonIntrinsicElementProps<T extends React.ElementType> = IntrinsicElement<T> extends never ? React.ComponentProps<T> : Omit<React.ComponentProps<T>, keyof React.ComponentPropsWithoutRef<IntrinsicElement<T>>>

/* Styled instance:
 * -----------------------------------------------------------------------------------------------*/
export type StyledInstance<Conditions = {}, Theme extends TTheme = {}, Utils = {}, ThemeMap = {}> = {
	<E extends React.ElementType, Variants>(
		elm: ComponentInfer<E>,
		styles: InternalCSS<Conditions, Theme, Utils, ThemeMap> & {
			variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: InternalCSS<Conditions, Theme, Utils, ThemeMap> } }
		},
	): StitchesComponent<E, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils>
}

type ReactFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = '', ThemeMap extends TThemeMap = CSSPropertiesToTokenScale>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix, ThemeMap>,
) => TStyledSheet<Conditions, Theme, Utils> & { styled: StyledInstance<Conditions & { initial: '' }, Theme, Utils, ThemeMap> }

declare const styled: ReactFactory
export default styled
