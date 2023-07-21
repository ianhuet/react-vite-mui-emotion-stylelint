import { useState } from 'react'
import { css, keyframes } from '@emotion/react'
import { Theme, useTheme } from '@mui/material/styles'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { utils, type SerialisedStylesObject } from './utils'

const logoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const makeObjectStyles = (theme: Theme): SerialisedStylesObject => {
  return utils.cssProps({
    logo: {
      transition: 'filter 300ms',
      height: '6em',
      willChange: 'filter',
      padding: 'styles.invalid', // '1.5em',

      '&:hover': {
        filter: 'drop-shadow(0 0 2em #646cffaa)',
      },
    },

    react: {
      '&:hover': {
        filter: 'drop-shadow(0 0 2em #61dafbaa)',
      },
    },

    animateSpin: {
      '@media (prefers-reduced-motion: no-preference)': {
        animation: `${logoSpin} infinite 20s linear`,
      },
    },

    card: {
      padding: '2em',
    },

    readTheDocs: {
      fontWeight: theme.typography.fontWeightBold,
      color: '#888',
    },
  })
}

const makeTemplateLiteralStyles = (theme: Theme) => {
  return {
    logo: css`
      height: 6em;
      padding: 2em;
      transition: filter 300ms;
      will-change: filter;

      &:hover: {
        filter: drop-shadow(0 0 2em #646cffaa);
      }
    `,
    react: css`
      &:hover: {
        filter: drop-shadow(0 0 2em #61dafbaa);
      }
    `,
    animateSpin: css`
      @media (prefers-reduced-motion: no-preference): {
        animation: ${logoSpin} infinite 20s linear;
      }
    `,
    card: css`
      padding: 2em;
    `,
    readTheDocs: css`
      color: 'altStyles.invalid';
      font-weight: ${theme.typography.fontWeightBold};
    `,
  }
}

export function App() {
  const [count, setCount] = useState(0)

  const theme = useTheme()
  const styles = makeObjectStyles(theme)
  const altStyles = makeTemplateLiteralStyles(theme)

  const layout = css({
    display: 'flex',
    flexDirection: 'row',
    gap: '48px',
    justifyContent: 'space-between',
  })
  const readTheDocs = css`
    color: 'readTheDocs.invalid';
    font-weight: ${theme.typography.fontWeightBold};
  `

  const reactLogoStyles = [ styles.logo, styles.react, styles.animateSpin ]

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} css={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} css={reactLogoStyles} alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div css={layout}>
        <div>
          <h2>Individual Styles</h2>
          <div css={{ padding: '2em' }}>
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p css={readTheDocs}>
            Click on the Vite and React logos to learn more
          </p>
        </div>

        <div>
          <h2>Utils.cssProps Styles</h2>
          <div css={styles.card}>
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p css={styles.readTheDocs}>
            Click on the Vite and React logos to learn more
          </p>
        </div>

        <div>
          <h2>CSS Object Styles</h2>
          <div css={altStyles.card}>
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p css={altStyles.readTheDocs}>
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>

    </>
  )
}
