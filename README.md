# An experiment with React, Material UI, Emotion CSS & Stylelint

> Within React & Vite, can Emotion CSS be configured to work efficiently while also providing a maintainable development experience?

**Note:**
- As Material UI (MUI v.5) uses Emotion CSS under the hood it will be used as the themeing engine.

**Steps Followed**

1. Create a new Vite based React project
2. Add Stylelint to lint CSS styles
3. Add Emotion CSS, and enable the `css` prop
4. Migrate the default `App.css` to Emotion CSS
5. Evolve the Stylelint configuration to work with Emotion CSS
6. Extract Emotion styles out of the component closure
7. Integrate MUI theming into the Emotion styling
8. Create a utility to simplify style implementation

### 1. Create a new Vite based React project
Run this command, give the project a name, then select 'React' & 'Typescript'.
```
npm create vite@latest
```

### 2. Add Stylelint to lint CSS styles
Install these packages, then add the following script and configuration to integrate Stylelint into the development toolchain.
```
npm i -D stylelint stylelint-config-standard stylelint-order
```

`.stylelintrc.yml`
```
---
extends:
- stylelint-config-standard
plugins:
- stylelint-order
rules:
  declaration-property-value-no-unknown: true
  order/properties-alphabetical-order: true
```
This configuration adds several useful elements to the Stylelint setup. `stylelint-config-standard` is the best practice benchmark rule set offered by Stylelint. `declaration-property-value-no-unknown` is a new rule available with Stylelint v.15 which checks that each property value is valid. `order/properties-alphabetical-order` enables the automated ordering or properties into the most simple and inuitive sequence. Of course this can be greatly customised yet it represents a realistic starting point.

`package.json`
```
"lint:style": "stylelint '**/*.css' --fix",
```
Add this to the `scripts` section to enable style linting, and automated fixing where possible.

### 3. Add Emotion CSS, and enable the `css` prop
With the base application established and Stylelint integrate next up is the migration of the classic CSS styles to Emotion CSS.
```
npm i @emotion/react
```

In order to play nice with the Typescript compiler this must be added to 'tsconfig.ts', as well as being added to the 'vite.config.ts' React plugin config: `"jsxImportSource": "@emotion/react"`. The next step is to choose between the [JSX Pgrama](https://emotion.sh/docs/css-prop#jsx-pragma) integration or the Babel plugin enabled [css prop](https://emotion.sh/docs/css-prop). After looking into these options I opted for the `css prop` option as I found the need to add the below code at the top of every component undesirable.
```
/** @jsx jsx */
import { jsx } from '@emotion/react'
```

Enabling the 'css prop' first requires these packages be added to the project: `@emotion/babel-plugin @emotion/babel-preset-css-prop`. Then add this additional configuration to the `vite.config.ts` React plugin config.
```
babel: {
  plugins: ["@emotion/babel-plugin"],
},
```

### 4. Migrate the default `App.css` to Emotion CSS
With these in place Emotion `css` can now be integrated into the JSX either inline or as a serialised styles object. The serialised styles object option requires the `css` function to convert object notation to the data structure compatible with the JSX css prop.
```
import { css } from '@emotion/react'

// serialised styles object
const readTheDocs = css`
  color: 'readTheDocs.invalid';
  font-weight: ${theme.typography.fontWeightBold};
`

<h2>Individual Styles</h2>
<div css={{ padding: '2em' }}>
  ...
</div>
<p css={readTheDocs}>
  Click on the Vite and React logos to learn more
</p>
```

### 5. Evolve the Stylelint configuration to work with Emotion CSS
The Stylelint configuration needs to be expanded to include cover for the CSS-in-JS implementation introduced by Emotion. The first step is to update the `lint:style` script within the package.json to include the components: `lint:style": "stylelint '**/*.{css,tsx}' --fix`. Next the stylelint configuration also needs to be updated.

`.stylelintrc.yml`
```
- customSyntax: "postcss-styled-syntax"
  files:
  - "**/*.tsx"
```
This establishes an override for the Typescript component implementations, catered for by the `postcss-styled-syntax` custom syntax. Running the linting now surfaces any issues within our Emotion CSS.

### 6. Extract Emotion styles out of the component closure
While functional there are a few issues with this first approach. For starters, I am not a fan of inline styles. They both clutter up the JSX markup and add potentially prodlematic specificity to the styling. Beyond this there is [a more pronounced issue, performance](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b). Having the styles declared inside the component scope results in them being recreated on every rerender.

All of these concerns can be mitigated by extracting the styles outside the component as shown below. This tidies up the JSX without impacting any of the styling functionality. It removes the performance impact incurred by the styles being reproduced on each render cycle. And it is still covered by stylelint.
```
const templateLiteralStyles = {
  card: css`
    padding: 2em;
  `,
  readTheDocs: css`
    color: 'templateStyles.invalid';
    font-weight: 700;
  `,
}

export function App() {
  const styles = templateLiteralStyles;
  ...
  <h2>Utils.cssProps Styles</h2>
  <div css={styles.card}>
    ...
  </div>
  <p css={styles.readTheDocs}>
    Click on the Vite and React logos to learn more
  </p>
```

### 7. Integrate MUI theming into the Emotion styling
Establishing, and consistently using, a centralised theme is a core element of building high quality UI. So enabling this with Emotion is a essential requirement. Thankfully adjusting the extracted styles just a little makes integrating with a Material UI defined theme easy. This approach is also very easily adapted to any other theme implementation.

```
const makeTemplateLiteralStyles = (theme: Theme) => {
  return {
    card: css`
      padding: 2em;
    `,
    readTheDocs: css`
      color: 'templateStyles.invalid';
      font-weight: ${theme.typography.fontWeightBold};
    `,
  }
}

export function App() {
  const theme = useTheme()
  const styles = makeTemplateLiteralStyles(theme)
```

This change also enables any dynamic value to be used as a factor in the styles creation. For example:
```
const makeTemplateLiteralStyles = (theme: Theme) => {
  const cardLayoutSetting =
    theme.cardLayoutDirection === 'row' ? 'center' : 'flex-start'

  return {
    card: css`
      display: flex;
      flex-flow: ${theme.cardLayoutStyle};
      justify-content: ${cardLayoutSetting};
      padding: 2em;
    `,
    ...
  }
}

export function App() {
  const theme = useTheme()
  const styles = makeTemplateLiteralStyles(  {
    ...theme,
    cardLayoutDirection: 'row',
  })
```

While this functions exactly as intended, this is where Stylelint started to present challenges. The super useful `declaration-property-value-no-unknown` rule does not verify dynamically assigned property values. Or at least I was not yet able to find a configuration that enables this, which is a little disappointing. Emotion Css does have its own [theming capability](https://emotion.sh/docs/theming), despite having experiemented with this in isolation and as a pass through of the Material UI theme any approach I took still failed to register in the linting report yet.

### 8. Create a utility to simplify style implementation
Undettered I pressed on with a further evolution of the extracted styles. As well as using literal templates, Emotion CSS enables the declaration of styles camelCase object notation. My previous experience with JSS drew me towards this option. While exploring this it occurred to me to try creating a small utility function to simplify the creation of styles another step. This function automatically completes the Emotion `css` serialisation, removing the need to enclose each style object individually.

`utils.ts`
```
import { css, CSSObject, SerializedStyles } from '@emotion/react'

export type StylesObject = Record<string, CSSObject>
export type SerialisedStylesObject = Record<string, SerializedStyles>

const cssProps = (styles: StylesObject): SerialisedStylesObject => {
  return Object.entries<CSSObject>(styles).reduce((acc, [selector, properties]) => {
    acc[selector] = css(properties)
    return acc
  }, {})
}
```

This function is then used to automatically complete the Emotion `css` serialisation. However, while this functions as intended I have not yet found a working Stylelint configuration that covers this implementation... :-(
```
const makeObjectStyles = (theme: Theme): SerialisedStylesObject => {
  return cssProps({
    card: {
      padding: 'styles.invalid', // '2em',
    },
    readTheDocs: {
      fontWeight: theme.typography.fontWeightBold,
      color: '#888',
    },
  })
}
```
