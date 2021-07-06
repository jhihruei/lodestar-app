import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import '../../styles.scss'
import defaultThemeVars from '../../theme.json'
const paletteGenerator = require('@bobthered/tailwindcss-palette-generator')

export const AppThemeProvider: React.FC = ({ children }) => {
  const { settings } = useApp()

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
        variants: {
          primary: {
            background: 'primary.500',
            color: '#ffffff',
            _hover: {
              background: 'primary.300',
            },
          },
          outline: {
            border: 'solid 1px',
            borderColor: 'var(--gray)',
            color: '#585858',
            _hover: {
              background: 'transparent',
              borderColor: settings['theme.@primary-color'] || '#000000',
              color: settings['theme.@primary-color'] || '#000000',
            },
          },
          ghost: {
            _hover: {
              background: 'transparent',
            },
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
      Divider: {
        baseStyle: {
          borderColor: '#e8e8e8',
        },
      },
      IconButton: {
        download: {
          background: 'transparent',
        },
      },
      Input: {
        variants: {
          outline: () => ({
            field: {
              borderColor: 'var(--gray)',
              _focus: {
                borderColor: settings['theme.@primary-color'],
              },
            },
          }),
        },
      },
      FormError: {
        baseStyle: {
          text: {
            color: 'danger.500',
          },
        },
      },
      Menu: {
        baseStyle: {
          item: {
            _active: {
              bg: `${settings['theme.@primary-color']}1a`,
            },
            _focus: {
              bg: `${settings['theme.@primary-color']}1a`,
            },
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
      Tooltip: {
        baseStyle: {
          bg: '#4a4a4a',
          borderRadius: '4px',
          fontWeight: '500',
          fontSize: '12px',
        },
      },
      Tabs: {
        baseStyle: {
          tab: {
            _focus: {
              boxShadow: 0,
            },
          },
        },
      },
    },
    colors: {
      ...paletteGenerator(settings['theme.@primary-color'] || '#000000'),
      danger: {
        ...paletteGenerator('#ff7d62').primary,
      },
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

  const themeVars = Object.keys(settings)
    .filter(key => key.split('.')[0] === 'theme')
    .map(key => key.split('.')[1])
    .reduce((vars: { [key: string]: string }, themeKey: string) => {
      vars[themeKey] = settings[`theme.${themeKey}`]
      return vars
    }, defaultThemeVars)

  return (
    <ChakraProvider theme={extendTheme(defaultChakraTheme)}>
      <ThemeProvider theme={themeVars}>{children}</ThemeProvider>
    </ChakraProvider>
  )
}
