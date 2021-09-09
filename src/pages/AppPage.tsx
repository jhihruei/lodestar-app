import { Editor, Frame } from '@craftjs/core'
import CraftActivity from 'lodestar-app-element/src/components/craft/CraftActivity'
import CraftBackground from 'lodestar-app-element/src/components/craft/CraftBackground'
import CraftButton from 'lodestar-app-element/src/components/craft/CraftButton'
import CraftCard from 'lodestar-app-element/src/components/craft/CraftCard'
import CraftCarousel from 'lodestar-app-element/src/components/craft/CraftCarousel'
import CraftCarouselContainer from 'lodestar-app-element/src/components/craft/CraftCarouselContainer'
import CraftCollapse from 'lodestar-app-element/src/components/craft/CraftCollapse'
import CraftContainer from 'lodestar-app-element/src/components/craft/CraftContainer'
import CraftImage from 'lodestar-app-element/src/components/craft/CraftImage'
import CraftInstructor from 'lodestar-app-element/src/components/craft/CraftInstructor'
import CraftLayout from 'lodestar-app-element/src/components/craft/CraftLayout'
import CraftParagraph from 'lodestar-app-element/src/components/craft/CraftParagraph'
import CraftPodcastProgram from 'lodestar-app-element/src/components/craft/CraftPodcastProgram'
import CraftProgram from 'lodestar-app-element/src/components/craft/CraftProgram'
import CraftProject from 'lodestar-app-element/src/components/craft/CraftProject'
import CraftStatistics from 'lodestar-app-element/src/components/craft/CraftStatistics'
import CraftTitle from 'lodestar-app-element/src/components/craft/CraftTitle'
import CraftTitleAndParagraph from 'lodestar-app-element/src/components/craft/CraftTitleAndParagraph'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import MessengerChat from '../components/common/MessengerChat'
import DefaultLayout from '../components/layout/DefaultLayout'
import ActivityIntroSection from '../components/page/ActivityIntroSection'
import ActivitySection from '../components/page/ActivitySection'
import BlndPostSection from '../components/page/BlndPostSection'
import CoverSection from '../components/page/CoverSection'
import CreatorSection from '../components/page/CreatorSection'
import CustomCoverSection from '../components/page/CustomCoverSection'
import LittlestarFeaturedPodcastSection from '../components/page/LittlestarFeaturedPodcastSection'
import LittlestarLastTimePodcastSection from '../components/page/LittlestarLastTimePodcastSection'
import MisaFeatureSection from '../components/page/MisaFeatureSection'
import MisaNavigationBar from '../components/page/MisaNavigationBar'
import PodcastCollectionSection from '../components/page/PodcastCollectionSection'
import PostSection from '../components/page/PostSection'
import ProgramIntroSection from '../components/page/ProgramIntroSection'
import ProgramSection from '../components/page/ProgramSection'
import ReferrerSection from '../components/page/ReferrerSection'
import StaticBlock from '../components/page/StaticBlock'
import TeacherSection from '../components/page/TeacherSection'
import { AppPageProps } from '../hooks/page'
import { ReactComponent as AngleRightIcon } from '../images/angle-right.svg'

export const SectionTitle = styled.div<{ white?: boolean }>`
  margin: 0 auto;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 28px;
  letter-spacing: 0.23px;
  text-align: center;
  color: var(--gray-color);
`
export const StyledLink = styled(Link)<{ $backgroundActive?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  & .ant-btn-primary:active {
    background: ${props =>
      props.$backgroundActive ? props.$backgroundActive : props.theme['@primary-color']} !important;
  }
  margin-top: 56px;
`
export const StyledAngleRightIcon = styled(AngleRightIcon)`
  transform: translateY(-0.5px);
`

export const StyledSection = styled.section`
  padding: 64px 0;
  background: white;
`

const AppPage: React.VFC<{ page: AppPageProps }> = ({ page }) => {
  const sectionConverter = {
    // general
    homeActivity: ActivitySection,
    homeActivityIntro: ActivityIntroSection,
    homeCreator: CreatorSection,
    homeCover: CoverSection,
    homeCustomCover: CustomCoverSection,
    homePost: PostSection,
    homeProgram: ProgramSection,
    homeProgramCategory: ProgramSection,
    homeProgramIntro: ProgramIntroSection,
    homePodcastCollection: PodcastCollectionSection,
    homeReferrer: ReferrerSection,
    homeStatic: StaticBlock,
    homeTeacher: TeacherSection,
    messenger: MessengerChat,
    // custom
    homeBlndPost: BlndPostSection,
    homeMisaFeature: MisaFeatureSection,
    homeMisaNav: MisaNavigationBar,
    homeLittlestarLastTimePodcast: LittlestarLastTimePodcastSection,
    homeLittlestarFeaturedPodcast: LittlestarFeaturedPodcastSection,
  }

  return (
    <DefaultLayout {...page.options}>
      {page.craftData ? (
        <Editor
          enabled={false}
          resolver={{
            CraftContainer,
            CraftLayout,
            CraftTitle,
            CraftParagraph,
            CraftTitleAndParagraph,
            CraftButton,
            CraftCarousel,
            CraftCarouselContainer,
            CraftStatistics,
            CraftImage,
            CraftCard,
            CraftCollapse,
            CraftBackground,
            CraftProgram,
            CraftProject,
            CraftActivity,
            CraftPodcastProgram,
            CraftInstructor,
          }}
        >
          <Frame data={JSON.stringify(page.craftData)} />
        </Editor>
      ) : (
        page.appPageSections.map(section => {
          const Section = sectionConverter[section.type]
          if (!sectionConverter[section.type]) {
            return <></>
          }
          return <Section key={section.id} options={section.options} />
        })
      )}
    </DefaultLayout>
  )
}

export default AppPage
