import { Button, Icon } from '@chakra-ui/react'
import React, { memo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { ReactComponent as CheckCircleIcon } from '../../images/checked-circle.svg'
import { ReactComponent as ErrorCircleIcon } from '../../images/error-circle.svg'
import { ReactComponent as TickIcon } from '../../images/tick.svg'
import { CommonLargeTextMixin, CommonTextMixin } from '../common'

const messages = defineMessages({
  prevQuestion: { id: 'program.ui.prevQuestion', defaultMessage: '上一題' },
  nextQuestion: { id: 'program.ui.nextQuestion', defaultMessage: '下一題' },
  submit: { id: 'program.ui.submit', defaultMessage: '送出' },
  showResult: { id: 'program.ui.showResult', defaultMessage: '查看分數' },
  correctAnswer: { id: 'program.status.correctAnswer', defaultMessage: '答案正確' },
  errorAnswer: { id: 'program.status.errorAnswer', defaultMessage: '答案錯誤' },
  correct: { id: 'program.status.correct', defaultMessage: '正解' },
})

const StyledQuestionCount = styled.span`
  ${CommonTextMixin}
`
const StyledQuestion = styled.div`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledDetail = styled.div`
  padding: 24px;
  border-radius: 4px;
  background-color: var(--gray-lighter);
`
const StyledDetailTitle = styled.h4`
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`
const StyledDetailContent = styled.p`
  ${CommonLargeTextMixin}
`

const ExerciseQuestionBlock: React.FC<{
  showDetail: boolean
  exercises: {
    options: {
      answer: string
      isAnswer: boolean
      isSelected: boolean
    }[]
    isMultipleChoice: boolean
    question: string
    detail: string
    score: number
  }[]
  onSetStatusResult: () => void
  allowReAnswer?: boolean
  onSetAnswer?: React.Dispatch<
    React.SetStateAction<
      {
        isMultipleChoice: boolean
        question: string
        options: {
          answer: string
          isAnswer: boolean
          isSelected: boolean
        }[]
        detail: string
        score: number
      }[]
    >
  >
}> = ({ exercises, showDetail, allowReAnswer, onSetAnswer, onSetStatusResult }) => {
  const { formatMessage } = useIntl()
  const [questionNo, setQuestionNo] = useState(1)
  const exerciseIndex = questionNo - 1
  const activeExercise = exercises[exerciseIndex]

  return (
    <>
      <StyledQuestionCount>
        {questionNo}/{exercises.length}
      </StyledQuestionCount>

      <StyledQuestion className="mb-4">{activeExercise.question}</StyledQuestion>

      <div className="mb-4">
        {activeExercise.options.map((v, i, options) => (
          <ExerciseQuestionButton
            key={`${activeExercise.question}_${v.answer}`}
            showDetail={showDetail}
            selectedCount={options.filter(v => v.isSelected).length}
            isSelected={v.isSelected}
            isAnswer={v.isAnswer}
            onClick={() => {
              onSetAnswer?.(
                Object.assign([], exercises, {
                  [exerciseIndex]: {
                    ...activeExercise,
                    options: activeExercise.options.map((option, index) =>
                      index === i
                        ? {
                            ...option,
                            isSelected: !option.isSelected,
                          }
                        : {
                            ...option,
                            ...(!activeExercise.isMultipleChoice && { isSelected: false }),
                          },
                    ),
                  },
                }),
              )
            }}
          >
            {v.answer}
          </ExerciseQuestionButton>
        ))}
      </div>

      {showDetail && (
        <StyledDetail className="mb-4">
          {activeExercise.options.filter(v => v.isAnswer !== v.isSelected).length ? (
            <span>
              <Icon className="mr-2" as={ErrorCircleIcon} color="var(--error)" />
              <StyledDetailTitle>{formatMessage(messages.errorAnswer)}</StyledDetailTitle>
            </span>
          ) : (
            <span>
              <Icon className="mr-2" as={CheckCircleIcon} color="var(--success)" />
              <StyledDetailTitle>{formatMessage(messages.correctAnswer)}</StyledDetailTitle>
            </span>
          )}
          <StyledDetailContent className="ml-4">{activeExercise.detail}</StyledDetailContent>
        </StyledDetail>
      )}

      <div className="text-center">
        {allowReAnswer && 1 < questionNo && (
          <Button onClick={() => setQuestionNo(prev => prev - 1)} variant="outline" className="mr-2">
            {formatMessage(messages.prevQuestion)}
          </Button>
        )}

        {questionNo < exercises.length && (
          <Button
            onClick={() => setQuestionNo(prev => prev + 1)}
            disabled={!activeExercise.options.filter(v => v.isSelected).length}
            variant="primary"
          >
            {formatMessage(messages.nextQuestion)}
          </Button>
        )}

        {questionNo === exercises.length && (
          <Button
            onClick={() => onSetStatusResult()}
            variant="primary"
            disabled={!activeExercise.options.filter(v => v.isSelected).length}
          >
            {showDetail ? formatMessage(messages.showResult) : formatMessage(messages.submit)}
          </Button>
        )}
      </div>
    </>
  )
}

const StyledButton = styled(Button)<{ isActive: boolean; isCorrect: boolean; isError: boolean }>`
  &&& {
    width: 100%;
    background: white;
    border: ${props => props.isActive && `1px solid var(--gray-darker)`};

    ${props =>
      props.isCorrect &&
      css`
        border: 1px solid var(--success);
        .correct {
          color: var(--success);
        }
      `}

    ${props =>
      props.isError &&
      css`
        border: 1px solid var(--error);
        .correct {
          color: var(--error);
        }
      `}
  }
`

const ExerciseQuestionButton: React.FC<{
  showDetail: boolean
  isSelected: boolean
  isAnswer: boolean
  selectedCount: number
  onClick: () => void
}> = memo(
  ({ showDetail, isSelected, isAnswer, onClick, children }) => {
    const { formatMessage } = useIntl()

    if (showDetail) {
      return (
        <StyledButton
          isActive={isSelected}
          isCorrect={isAnswer && isAnswer === isSelected}
          isError={isAnswer && isAnswer !== isSelected}
          variant="outline"
          className="d-flex justify-content-between mb-3"
        >
          <span>{children}</span>
          <span className="correct">{isAnswer && formatMessage(messages.correct)}</span>
        </StyledButton>
      )
    }

    return (
      <StyledButton
        isActive={isSelected}
        rightIcon={isSelected && <Icon as={TickIcon} />}
        onClick={() => onClick()}
        variant="outline"
        className="d-flex justify-content-between mb-3"
      >
        {children}
      </StyledButton>
    )
  },
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected && prevProps.selectedCount === nextProps.selectedCount,
)
export default ExerciseQuestionBlock
