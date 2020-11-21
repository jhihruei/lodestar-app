import { Carousel } from 'antd'
import React from 'react'
import styled from 'styled-components'
import Responsive, { BREAK_POINT } from '../common/Responsive'

type ProjectCardSectionProps = {
  items: {
    icon?: string
    title: string
    description: string
  }[]
  title: string
  subtitle: string
}

const StyledSection = styled.section`
  position: relative;

  > .container {
    position: relative;
    top: -80px;
    background-color: white;

    > .wrapper {
      padding: 80px 0 0 0;
    }
  }
`
const StyledHeader = styled.header`
  padding-bottom: 40px;

  h3 {
    width: 100%;
    max-width: 425px;
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
    text-align: center;
    margin: 0 auto;
    padding-bottom: 24px;

    span {
      display: inline-block;
    }
  }
  h4 {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.2px;
    text-align: center;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding-bottom: 60px;

    h3 {
      max-width: 615px;
      font-size: 40px;
      line-height: 1.4;
      letter-spacing: 1px;
    }
  }
`
const StyledCarousel = styled(Carousel)`
  && .slick-dots {
    li {
      margin-left: 16px;

      button {
        width: 12px;
        height: 12px;
        background: #cdcdcd;
        border-radius: 50%;
        transition: transform 0.2s ease-in-out;
      }
    }
    li:first-child {
      margin-left: 0;
    }
    li.slick-active {
      button {
        width: 12px;
        transform: scale(1.25, 1.25);
        background: #ff5760;
      }
    }
  }

  && .slick-track {
    display: flex;
  }
`
const StyledSlide = styled.div`
  max-width: 100vw;
  padding: 4px 16px 64px;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 570px;
  }
`
const StyleCard = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  height: 248px;
  width: 198px;

  h5 {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.8px;
    color: var(--gray-darker);
  }
  p {
    margin-bottom: 0px;
    height: 60px;
    line-height: 1.24;
    letter-spacing: 0.4px;
    color: #9b9b9b;
    font-size: 14px;
    font-weight: 500;
  }

  @media (min-width: ${BREAK_POINT}px) {
    width: 19%;
    margin-bottom: 20px;
  }
`
const StyledCardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  justify-content: space-between;
  padding: 24px;
  height: 100%;
`

const ProjectCardSection: React.FC<ProjectCardSectionProps> = ({ items, title, subtitle }) => {
  return (
    <StyledSection>
      <div className="container">
        <div className="wrapper">
          <StyledHeader>
            <h3>
              {title.split(';').map((text, idx) => (
                <span key={idx}>{text}</span>
              ))}
            </h3>
            <h4>{subtitle}</h4>
          </StyledHeader>
          <Responsive.Default>
            <StyledCarousel dots={true} draggable={true} slidesToShow={3} slidesToScroll={1} variableWidth={true}>
              {items.map(card => (
                <StyledSlide key={card.title}>
                  <StyleCard>
                    <StyledCardWrapper>
                      <img src={card.icon} alt="card icon" />
                      <div>
                        <h5>{card.title}</h5>
                        <p>{card.description}</p>
                      </div>
                    </StyledCardWrapper>
                  </StyleCard>
                </StyledSlide>
              ))}
            </StyledCarousel>
          </Responsive.Default>
          <Responsive.Desktop>
            <div className="container d-flex flex-row flex-wrap justify-content-between">
              {items.map(card => (
                <StyleCard key={card.title + card.description}>
                  <StyledCardWrapper>
                    <img src={card.icon} alt="card icon" />
                    <div>
                      <h5>{card.title}</h5>
                      <p>{card.description}</p>
                    </div>
                  </StyledCardWrapper>
                </StyleCard>
              ))}
            </div>
          </Responsive.Desktop>
        </div>
      </div>
    </StyledSection>
  )
}

export default ProjectCardSection
