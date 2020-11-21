import { Divider, Modal } from 'antd'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AuthState } from '../../types/member'
import { BREAK_POINT } from '../common/Responsive'
import LoginSection from './LoginSection'
import RegisterSection from './RegisterSection'

const StyledContainer = styled.div`
  .ant-form-explain {
    font-size: 14px;
  }

  .ant-form-item {
    margin-bottom: 1.25rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 1rem;
  }
`
export const StyledTitle = styled.h1`
  margin-bottom: 1.5rem;
  color: #585858;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.2px;
`
export const StyledDivider = styled(Divider)`
  && {
    padding: 1rem;

    .ant-divider-inner-text {
      color: #9b9b9b;
      font-size: 12px;
    }
  }
`
export const StyledAction = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  text-align: center;
`

export const AuthModalContext = React.createContext<{
  visible: boolean
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>
}>({ visible: false })

type AuthModalProps = {
  defaultAuthState?: AuthState
  onAuthStateChange?: (authState: AuthState) => void
}
const AuthModal = ({ defaultAuthState, onAuthStateChange }: AuthModalProps) => {
  const { visible, setVisible } = useContext(AuthModalContext)
  const [authState, setAuthState] = useState(defaultAuthState || 'login')

  return (
    <Modal
      centered
      width={window.innerWidth > BREAK_POINT ? window.innerWidth / 3 : window.innerWidth}
      footer={null}
      onCancel={() => setVisible && setVisible(false)}
      visible={visible}
    >
      <StyledContainer>
        {authState === 'login' ? (
          <LoginSection onAuthStateChange={setAuthState} />
        ) : authState === 'register' ? (
          <RegisterSection onAuthStateChange={setAuthState} />
        ) : null}
      </StyledContainer>
    </Modal>
  )
}

export default AuthModal
