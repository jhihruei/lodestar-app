import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import PodcastProgramBlock from 'lodestar-app-element/src/components/blocks/PodcastProgramBlock'
import Layout from 'lodestar-app-element/src/components/Layout'
import React from 'react'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'

const PodcastProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  return (
    <BackgroundSection>
      <SectionTitle>{options?.title || '精選廣播'}</SectionTitle>

      <div className="container mb-5">
        <Layout
          customStyle={{
            type: 'grid',
            mobile: { columnAmount: 1, columnRatio: [12] },
            desktop: { columnAmount: 2, columnRatio: [6, 6] },
          }}
        >
          <PodcastProgramBlock displayAmount={3} />
        </Layout>
      </div>

      <div className="text-center">
        <StyledLink to="/podcasts">
          查看更多 <AngleRightIcon />
        </StyledLink>
      </div>
    </BackgroundSection>
  )
}

export default PodcastProgramSection
