import React, { createContext, useContext } from 'react'
import { renderMemberAdminMenuProps } from '../components/common/AdminMenu'

export type CustomRendererProps = {
  renderCopyright?: (name?: string) => React.ReactNode
  renderRegisterTerm?: () => React.ReactNode
  renderMemberProfile?: (member: {
    id: string
    name: string | null
    email: string
    pictureUrl: string | null
  }) => React.ReactNode
  renderAuthButton?: (setAuthModalVisible?: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode
  renderMemberAdminMenu?: (props: renderMemberAdminMenuProps) => React.ReactElement
}

const CustomRendererContext = createContext<CustomRendererProps>({})

export const CustomRendererProvider: React.FC<{
  renderer?: CustomRendererProps
}> = ({ renderer = {}, children }) => {
  const { Provider } = CustomRendererContext

  return <Provider value={renderer}>{children}</Provider>
}

export const useCustomRenderer = () => useContext(CustomRendererContext)
