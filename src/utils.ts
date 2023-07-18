import { css, CSSObject, SerializedStyles } from '@emotion/react'

export type StylesObject = Record<string, CSSObject>
export type SerialisedStylesObject = Record<string, SerializedStyles>

const cssProps = (styles: StylesObject): SerialisedStylesObject => {
  return Object.entries<CSSObject>(styles).reduce((acc, [selector, properties]) => {
    acc[selector] = css(properties)
    return acc
  }, {})
}

export const utils = {
  cssProps
}
