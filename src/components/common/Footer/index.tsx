import React, { useContext } from 'react'
import Icon from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../../containers/common/AppContext'
import LanguageContext from '../../../contexts/LanguageContext'
import FacebookIcon from '../../../images/facebook-icon.svg'
import GroupIcon from '../../../images/group-icon.svg'
import InstagramIcon from '../../../images/instagram-icon.svg'
import YoutubeIcon from '../../../images/youtube-icon.svg'
import { BREAK_POINT } from '../Responsive'
import DefaultFooter from './DefaultFooter'
import MultilineFooter from './MultilineFooter'

export const StyledFooter = styled.footer`
  background: white;
  border-top: 1px solid #ececec;
  color: #9b9b9b;

  a {
    margin-bottom: 1.25rem;
    line-height: 1;
  }

  .blank {
    width: 100%;
  }
  .divider {
    border-top: 1px solid #ececec;
  }

  @media (min-width: ${BREAK_POINT}px) {
    .blank {
      width: auto;
      flex-grow: 1;
    }
  }
`
export const StyledNavLink = styled(Link)`
  font-size: 14px;
  color: #9b9b9b;
  &:not(:first-child) {
    margin-left: 2rem;
  }
`
export const StyledNavAnchor = styled.a`
  font-size: 14px;
  color: #9b9b9b;
  &:not(:first-child) {
    margin-left: 2rem;
  }
`
const StyledSocialAnchor = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: solid 0.5px #ececec;
  border-radius: 50%;
  color: #585858;

  &:not(:first-child) {
    margin-left: 0.75rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    .blank + & {
      margin-left: 2rem;
    }
  }
`

export const NavLinks: React.FC = () => {
  const { navs } = useApp()
  const { currentLanguage } = useContext(LanguageContext)
  return (
    <>
      {navs
        .filter(nav => nav.block === 'footer' && nav.locale === currentLanguage)
        .map(nav =>
          nav.external ? (
            <StyledNavAnchor key={nav.label} href={nav.href} target="_blank" rel="noopener noreferrer">
              {nav.label}
            </StyledNavAnchor>
          ) : (
            <StyledNavLink key={nav.label} to={nav.href}>
              {nav.label}
            </StyledNavLink>
          ),
        )}
    </>
  )
}

export const SocialLinks: React.FC = () => {
  const { navs } = useApp()
  return (
    <>
      {navs
        .filter(nav => nav.block === 'social_media')
        .map(socialLink => (
          <StyledSocialAnchor key={socialLink.label} href={socialLink.href} target="_blank" rel="noopener noreferrer">
            {socialLink.label === 'facebook' && <Icon src={FacebookIcon} />}
            {socialLink.label === 'group' && <Icon src={GroupIcon} />}
            {socialLink.label === 'youtube' && <Icon src={YoutubeIcon} />}
            {socialLink.label === 'instagram' && <Icon src={InstagramIcon} />}
          </StyledSocialAnchor>
        ))}
    </>
  )
}

const Footer: React.FC = () => {
  const { settings } = useApp()
  if (settings['footer.type'] === 'multiline') {
    return <MultilineFooter />
  }

  return <DefaultFooter />
}

export default Footer
