import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import ModularBriefFooter from '../../components/common/Footer/ModularBriefFooter'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MessengerChat from '../../components/project/MessengerChat'
import ProjectBannerSection from '../../components/project/ProjectBannerSection'
import ProjectCalloutSection from '../../components/project/ProjectCalloutSection'
import ProjectCardSection from '../../components/project/ProjectCardSection'
import ProjectCommentSection from '../../components/project/ProjectCommentSection'
import ProjectComparisonSection from '../../components/project/ProjectComparisonSection'
import ProjectInstructorSection from '../../components/project/ProjectInstructorSection'
import ProjectProgramCollectionSection from '../../components/project/ProjectProgramCollectionSection'
import ProjectProgramSearchSection from '../../components/project/ProjectProgramSearchSection'
import ProjectPromotionSection from '../../components/project/ProjectPromotionSection'
import ProjectStaticSection from '../../components/project/ProjectStaticSection'
import ProjectStatisticsSection from '../../components/project/ProjectStatisticsSection'
import ProjectSwitchDisplaySection from '../../components/project/ProjectSwitchDisplaySection'
import ProjectTourSection from '../../components/project/ProjectTourSection'
import { useApp } from '../../containers/common/AppContext'
import { useProject } from '../../hooks/project'
import LoadingPage from '../LoadingPage'

const ModularPage: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { settings } = useApp()
  const { project } = useProject(projectId)
  const [displaySectionTypes, setDisplaySectionTypes] = useState<string[]>(
    project?.projectSections.map(projectSection => projectSection.type) || [],
  )

  useEffect(() => {
    return () => {
      const element = document.getElementById('fb-root')
      element && element.remove()
    }
  }, [])

  if (!project) {
    return <LoadingPage />
  }

  let seoMeta: { title?: string; description?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ProjectPage[`${projectId}`]
  } catch (error) {}

  const siteTitle = seoMeta?.title || project?.title
  const siteDescription = seoMeta?.description || project?.description
  const siteImage = project?.previewUrl || project?.coverUrl

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: siteImage,
    description: siteDescription,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: siteTitle,
      description: siteDescription,
    },
  })

  return (
    <DefaultLayout white noFooter>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:image:url" content={siteImage} />
        <meta property="og:image:secure_url" content={siteImage} />
        <meta property="og:description" content={siteDescription} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>
      {project.projectSections
        .filter(projectSection =>
          displaySectionTypes.find(displaySectionType => projectSection.type === displaySectionType),
        )
        .map(projectSection => {
          switch (projectSection.type) {
            case 'switchDisplay':
              return (
                <ProjectSwitchDisplaySection
                  key={projectSection.id}
                  projectId={project.id}
                  onDisplayProjectSectionTypesSet={setDisplaySectionTypes}
                />
              )
            case 'messenger':
              return (
                process.env.REACT_APP_FACEBOOK_APP_ID && (
                  <MessengerChat
                    key={projectSection.id}
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    {...projectSection.options}
                  />
                )
              )
            case 'banner':
              return (
                <ProjectBannerSection
                  key={projectSection.id}
                  title={project.title}
                  abstract={project.abstract}
                  description={project.description}
                  url={project.coverUrl}
                  type={project.coverType}
                  expiredAt={project.expiredAt}
                  callout={projectSection.options.callout}
                  backgroundImage={projectSection.options.backgroundImage}
                />
              )
            case 'statistics':
              return (
                <ProjectStatisticsSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  subtitle={projectSection.options.subtitle}
                  items={projectSection.options.items}
                />
              )
            case 'static':
              return <ProjectStaticSection key={projectSection.id} html={projectSection.options.html} />
            case 'card':
              return (
                <ProjectCardSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  subtitle={projectSection.options.subtitle}
                  items={projectSection.options.items}
                />
              )
            case 'tour':
              return <ProjectTourSection key={projectSection.id} trips={projectSection.options.trips} />
            case 'comparison':
              return <ProjectComparisonSection key={projectSection.id} items={projectSection.options.items} />
            case 'promotion':
              return (
                <ProjectPromotionSection
                  key={projectSection.id}
                  expiredAt={project.expiredAt}
                  promotions={projectSection.options.promotions}
                  button={projectSection.options.button}
                />
              )
            case 'comment':
              return (
                <ProjectCommentSection key={projectSection.id} items={projectSection.options.items}>
                  {projectSection.options.items.map((item: { type: string }, idx: number) => {
                    return <div key={idx}>{JSON.stringify(item)}</div>
                  })}
                </ProjectCommentSection>
              )
            case 'callout':
              return (
                <ProjectCalloutSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  callout={projectSection.options.callout}
                />
              )
            case 'instructor':
              return (
                <ProjectInstructorSection
                  key={projectSection.id}
                  title={projectSection.options.title}
                  items={projectSection.options.items}
                  callout={projectSection.options.callout}
                />
              )
            case 'programSearch':
              return (
                <ProjectProgramSearchSection
                  key={projectSection.id}
                  projectId={projectId}
                  coverUrl={projectSection.options.coverUrl}
                  category={projectSection.options.programCategory}
                />
              )
            case 'programCollection':
              return (
                <ProjectProgramCollectionSection
                  key={projectSection.id}
                  projectId={projectId}
                  programCategory={projectSection.options.programCategory}
                />
              )
            case 'modularBriefFooter':
              return <ModularBriefFooter key={projectSection.id} navs={projectSection.options.navs} />
            default:
              return <div key={projectSection.id}>{JSON.stringify(projectSection)}</div>
          }
        })}
    </DefaultLayout>
  )
}

export default ModularPage
