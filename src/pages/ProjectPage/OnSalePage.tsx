import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import OnSaleCallToActionSection from '../../components/project/OnSaleCallToActionSection'
import OnSaleCommentSection from '../../components/project/OnSaleCommentSection'
import OnSaleComparisonSection from '../../components/project/OnSaleComparisonSection'
import OnSaleCoverSection from '../../components/project/OnSaleCoverSection'
import OnSaleIntroductionSection from '../../components/project/OnSaleIntroductionSection'
import OnSaleProjectPlanSection from '../../components/project/OnSaleProjectPlanSection'
import OnSaleRoadmapSection from '../../components/project/OnSaleRoadmapSection'
import OnSaleSkillSection from '../../components/project/OnSaleSkillSection'
import OnSaleTrialSection from '../../components/project/OnSaleTrialSection'
import { ProjectProps } from '../../types/project'

const OnSalePage: React.VFC<ProjectProps> = ({
  id,
  expiredAt,
  coverType,
  coverUrl,
  title,
  abstract,
  description,
  introduction,
  introductionDesktop,
  contents,
  updates,
  comments,
  projectPlans,
}) => {
  const { settings } = useApp()
  const isDesktop = useMediaQuery({ minWidth: BREAK_POINT })
  let seoMeta: { title?: string; description?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ProjectPage[`${id}`]
  } catch (error) {}

  const siteTitle = seoMeta?.title || title
  const siteDescription = seoMeta?.description || description

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: coverUrl,
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
      <OnSaleCoverSection
        cover={{ title, abstract, description, url: coverUrl, type: coverType }}
        expiredAt={expiredAt}
        {...contents.slogan}
      />

      <OnSaleIntroductionSection
        introduction={(isDesktop && introductionDesktop ? introductionDesktop : introduction) || ''}
      />

      <OnSaleSkillSection {...contents.skill} />
      <OnSaleRoadmapSection roadmaps={contents.roadmaps} />
      <OnSaleTrialSection {...contents.trial} />
      <OnSaleComparisonSection comparisons={contents.comparisons} />

      <OnSaleProjectPlanSection projectPlans={projectPlans || []} />

      <OnSaleCommentSection comments={comments} />
      <OnSaleCallToActionSection updates={updates} expiredAt={expiredAt} projectId={id} />
    </DefaultLayout>
  )
}

export default OnSalePage
