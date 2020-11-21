import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mergeDeepLeft } from 'ramda'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import '../../styles.scss'
import defaultThemeVars from '../../theme.json'

const defaultChakraTheme = {
  components: {
    Button: {
      baseStyle: {
        fontWeight: '400',
        borderRadius: '2px',
        _focus: {
          boxShadow: '0',
        },
      },
    },
    CloseButton: {
      baseStyle: {
        _focus: {
          boxShadow: '0',
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: '2px',
        },
      },
    },
  },
  colors: {
    gray: {
      100: 'rgba(0, 0, 0, 0.1)',
      200: '#f7f8f8',
      300: '#ececec',
      400: '#cdcece',
      500: '#cdcdcd',
      600: '#9b9b9b',
      700: '#585858',
      800: '#4a4a4a',
      900: 'rgba(0, 0, 0, 0.45)',
    },
  },
}

export const AppThemeProvider: React.FC = ({ children }) => {
  const { settings } = useApp()

  const themeVars = Object.keys(settings)
    .filter(key => key.split('.')[0] === 'theme')
    .map(key => key.split('.')[1])
    .reduce((vars: { [key: string]: string }, themeKey: string) => {
      vars[themeKey] = settings[`theme.${themeKey}`]
      return vars
    }, defaultThemeVars)

  const customTheme = Object.keys(settings)
    .filter(key => key.split('.')[0] === 'chakraTheme')
    .map(key => key.split('.').slice(1).join('.'))
    .reduce((vars: any, themeKey: string) => {
      return mergeDeepLeft(
        vars,
        themeKey
          .split('.')
          .reverse()
          .reduce((acc: any, key) => {
            const obj = {} as any
            obj[key] = acc
            return obj
          }, settings[`chakraTheme.${themeKey}`]),
      )
    }, {})

  return (
    <ChakraProvider theme={extendTheme(mergeDeepLeft(customTheme, defaultChakraTheme))}>
      <ThemeProvider theme={themeVars}>{children}</ThemeProvider>
    </ChakraProvider>
  )
}
