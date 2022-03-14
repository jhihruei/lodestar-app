import { useQuery } from '@apollo/react-hooks'
import {
  Button,
  Checkbox,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  SkeletonText,
} from '@chakra-ui/react'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { complement, equals, flatten, groupBy, includes, isEmpty, map, pluck, toPairs } from 'ramda'
import React, { useState } from 'react'
import { defineMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../../helpers/translation'
import { ReactComponent as SearchIcon } from '../../../images/search.svg'

const StyledModalBody = styled(ModalBody)`
  && {
    padding: 0 2rem;
  }
`

const StyledCheckbox = styled(Checkbox)`
  && {
    [data-checked] {
      background: ${props => props.theme['@primary-color']};
      border-color: ${props => props.theme['@primary-color']};
    }
  }
`

const StyledContent = styled(ModalContent)`
  && {
    max-width: 600px;
    width: 100%;
  }
`

const StyleSearchIcon = styled.div`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
`

const StyledClearButton = styled.span`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: ${props => props.theme['@primary-color']};
  cursor: pointer;

  &:hover: {
    color: ${props => props.theme['@primary-color']}33;
  }
`

export type FilterType = {
  categoryIdSList: string[][]
  tagNameSList: string[][]
  durationRange: [number, number] | null
  score: number | null
}

const GlobalSearchModal: React.VFC = () => {
  const history = useHistory()
  const { enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const [isOpen, setIsModalOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<FilterType>({
    categoryIdSList: [],
    tagNameSList: [],
    durationRange: null,
    score: null,
  })

  return (
    <>
      <StyleSearchIcon onClick={() => setIsModalOpen(true)}>
        <Icon as={SearchIcon} />
      </StyleSearchIcon>
      <Modal isOpen={isOpen} onClose={() => setIsModalOpen(false)}>
        <StyledContent>
          <ModalCloseButton />
          <StyledModalBody className="my-4">
            {enabledModules.search && (
              <div className="d-flex my-3">
                <InputGroup>
                  <Input
                    className="flex-grow-1 mr-2"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder={formatMessage(
                      defineMessage({ id: 'common.ui.enterKeyword', defaultMessage: '輸入關鍵字' }),
                    )}
                  />
                  <InputRightElement
                    className="mr-3"
                    children={
                      <StyledClearButton
                        onClick={() => {
                          setKeyword('')
                          setFilter({
                            categoryIdSList: [],
                            tagNameSList: [],
                            durationRange: null,
                            score: null,
                          })
                        }}
                      >
                        {formatMessage(defineMessage({ id: 'common.ui.clear', defaultMessage: '清除' }))}
                      </StyledClearButton>
                    }
                  />
                </InputGroup>

                <Button
                  className="flex-shrink-0"
                  colorScheme="primary"
                  leftIcon={<Icon as={SearchIcon} />}
                  onClick={() => {
                    if (enabledModules.search_advanced) {
                      history.push('/search/advanced', {
                        title: keyword,
                        ...filter,
                      })
                      return
                    }
                    history.push(`/search?q=${keyword}`)
                  }}
                >
                  {formatMessage(commonMessages.ui.search)}
                </Button>
              </div>
            )}

            {enabledModules.search_advanced && <GlobalSearchFilter filter={filter} onFilterSet={setFilter} />}
          </StyledModalBody>
        </StyledContent>
      </Modal>
    </>
  )
}

const StyledFilterTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
  margin: 32px 0 12px 0;
`

const StyledFilterSubTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  text-align: justify;
  color: var(--gray-dark);
`

const StyledGroup = styled.div<{ active: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  border: solid 1px ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray)')};

  &:hover {
    border: solid 1px #002e6d;
  }
`

const StyledRoundedButton = styled(Button)<{ active: boolean }>`
  && {
    height: 36px;
    padding: 6px 20px;
    border-radius: 30px;

    color: ${props => props.active && props.theme['@primary-color']};
    border: solid 1px ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray)')};
    background-color: ${props => (props.active ? props.theme['@primary-color'] : 'fff')}22;
    &:hover {
      background: initial;
    }
  }
`

const GlobalSearchFilter: React.VFC<{
  filter: FilterType
  onFilterSet: React.Dispatch<React.SetStateAction<FilterType>>
  type?: 'program' | 'activity' | 'member' | 'merchandise' | 'podcastProgram' | 'post'
}> = ({ filter, type = 'program', onFilterSet }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const {
    isLoading,
    filterOptionGroup: { categories, tags },
  } = useFilterOptions(type)

  if (isLoading === true) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  return (
    <div>
      <div>
        <StyledFilterTitle>
          {formatMessage(defineMessage({ id: 'common.ui.filterCategory', defaultMessage: '篩選分類' }))}
        </StyledFilterTitle>
        {categories.map(category => {
          const isCategoryActive = includes(
            category.id ? [category.id] : pluck('id', category.subCategories),
            filter.categoryIdSList,
          )
          return (
            <StyledGroup active={isCategoryActive} key={category.id} className="mb-2">
              <div className="d-flex align-items-center">
                <StyledCheckbox
                  isChecked={isCategoryActive}
                  onChange={() => {
                    onFilterSet(prevFilter => ({
                      ...prevFilter,
                      categoryIdSList: isCategoryActive
                        ? [
                            ...prevFilter.categoryIdSList.filter(
                              categoryIdS =>
                                !equals(categoryIdS, category.id ? [category.id] : pluck('id', category.subCategories)),
                            ),
                          ]
                        : [
                            ...prevFilter.categoryIdSList,
                            category.id ? [category.id] : pluck('id', category.subCategories),
                          ],
                    }))
                  }}
                />
                <span className="ml-2">{category.name}</span>
              </div>
              {category.subCategories.length > 0 && (
                <div className="mt-3 ml-4">
                  {category.subCategories.map(subCategory => {
                    const isSubCategoryActive = flatten(filter.categoryIdSList).includes(subCategory.id)
                    return (
                      <StyledRoundedButton
                        active={isSubCategoryActive}
                        onClick={() =>
                          onFilterSet(prevFilter => {
                            return {
                              ...prevFilter,
                              categoryIdSList: isSubCategoryActive
                                ? [
                                    ...prevFilter.categoryIdSList.filter(
                                      categoryIdS => !categoryIdS.includes(subCategory.id),
                                    ),
                                    [
                                      ...(prevFilter.categoryIdSList
                                        .find(categoryIdS => categoryIdS.includes(subCategory.id))
                                        ?.filter(categoryIdS => !categoryIdS.includes(subCategory.id)) || []),
                                    ],
                                  ].filter(complement(isEmpty))
                                : [
                                    ...prevFilter.categoryIdSList.filter(categoryIdS =>
                                      categoryIdS.every(categoryId =>
                                        pluck('id', category.subCategories).includes(categoryId),
                                      ),
                                    ),
                                    [
                                      ...(!!prevFilter.categoryIdSList.find(categoryIdS =>
                                        categoryIdS.every(categoryId =>
                                          pluck('id', category.subCategories).includes(categoryId),
                                        ),
                                      )
                                        ? [
                                            ...(prevFilter.categoryIdSList.find(categoryIdS =>
                                              categoryIdS.every(categoryId =>
                                                pluck('id', category.subCategories).includes(categoryId),
                                              ),
                                            ) || []),
                                            subCategory.id,
                                          ]
                                        : [subCategory.id]),
                                    ].sort(),
                                  ],
                            }
                          })
                        }
                        key={`${category.id}_${subCategory.id}`}
                        colorScheme="primary"
                        variant="outline"
                        className="mr-2"
                      >
                        {subCategory.name}
                      </StyledRoundedButton>
                    )
                  })}
                </div>
              )}
            </StyledGroup>
          )
        })}
      </div>
      <div>
        <StyledFilterTitle>
          {formatMessage(defineMessage({ id: 'common.ui.filterCategory', defaultMessage: '篩選條件' }))}
        </StyledFilterTitle>
        {tags.map(tag => {
          const isTagActive = includes(tag.id ? [tag.name] : pluck('name', tag.subTags), filter.tagNameSList)

          return (
            <StyledGroup active={isTagActive} key={tag.id} className="mb-2">
              <div className="d-flex align-items-center">
                <StyledCheckbox
                  isChecked={isTagActive}
                  onChange={() =>
                    onFilterSet(prevFilter => ({
                      ...prevFilter,
                      tagNameSList: isTagActive
                        ? [
                            ...prevFilter.tagNameSList.filter(
                              tagNameS => !equals(tagNameS, tag.id ? [tag.name] : pluck('name', tag.subTags)),
                            ),
                          ]
                        : [...prevFilter.tagNameSList, tag.id ? [tag.name] : pluck('name', tag.subTags)],
                    }))
                  }
                />
                <span className="ml-2">{tag.name}</span>
              </div>
              {tag.subTags.length > 0 && (
                <div className="mt-3 ml-4">
                  {tag.subTags.map(subTag => {
                    const isSubTagActive = flatten(filter.tagNameSList).includes(subTag.name)
                    return (
                      <StyledRoundedButton
                        active={isSubTagActive}
                        onClick={() => {
                          onFilterSet(prevFilter => ({
                            ...prevFilter,
                            tagNameSList: isSubTagActive
                              ? [
                                  ...prevFilter.tagNameSList.filter(tagNameS => !tagNameS.includes(subTag.name)),
                                  [
                                    ...(prevFilter.tagNameSList
                                      .find(tagNameS => tagNameS.includes(subTag.name))
                                      ?.filter(tagNameS => !tagNameS.includes(subTag.name)) || []),
                                  ],
                                ].filter(complement(isEmpty))
                              : [
                                  ...prevFilter.tagNameSList.filter(
                                    tagNameS =>
                                      !tagNameS.every(tagName => pluck('name', tag.subTags).includes(tagName)),
                                  ),
                                  [
                                    ...(!!prevFilter.tagNameSList.find(tagNameS =>
                                      tagNameS.every(tagName => pluck('name', tag.subTags).includes(tagName)),
                                    )
                                      ? [
                                          ...(prevFilter.tagNameSList.find(tagNameS =>
                                            tagNameS.every(tagName => pluck('name', tag.subTags).includes(tagName)),
                                          ) || []),
                                          subTag.name,
                                        ].sort()
                                      : [subTag.name]),
                                  ],
                                ],
                          }))
                        }}
                        key={subTag.id}
                        colorScheme="primary"
                        variant="outline"
                        className="mr-2"
                      >
                        {subTag.name}
                      </StyledRoundedButton>
                    )
                  })}
                </div>
              )}
            </StyledGroup>
          )
        })}
      </div>
      <div className="mt-4">
        <StyledFilterTitle>
          {formatMessage(defineMessage({ id: 'common.ui.advancedCondition', defaultMessage: '進階條件' }))}
        </StyledFilterTitle>

        <div className="mb-2">
          <StyledFilterSubTitle className="mb-2">
            {formatMessage(defineMessage({ id: 'common.ui.duration', defaultMessage: '時長' }))}
          </StyledFilterSubTitle>
          {[0, ...settings['global_search.minute_interval'].split(',').map(Number)].map((minute, i, minutes) => (
            <StyledRoundedButton
              onClick={() => {
                onFilterSet(prevFilter => ({
                  ...prevFilter,
                  durationRange: equals(prevFilter.durationRange, [minute, minutes[i + 1]])
                    ? null
                    : [minute, minutes[i + 1]],
                }))
              }}
              active={equals(filter.durationRange, [minute, minutes[i + 1]])}
              className="mr-2"
              colorScheme="primary"
              variant="outline"
            >
              {i === 0 ? (
                <span>&lt; {minutes[i + 1]}</span>
              ) : i === minutes.length - 1 ? (
                <span>{minute} &gt;</span>
              ) : (
                <span>
                  {minute} ~ {minutes[i + 1]}
                </span>
              )}
            </StyledRoundedButton>
          ))}
        </div>
        <div className="mb-2">
          <StyledFilterSubTitle className="mb-2">
            {formatMessage(defineMessage({ id: 'common.ui.score', defaultMessage: '評分' }))}
          </StyledFilterSubTitle>
          <div>
            {[4.8, 4.5, 4.0].map(score => (
              <StyledRoundedButton
                onClick={() =>
                  onFilterSet(prevFilter => ({
                    ...prevFilter,
                    score: prevFilter.score === score ? null : score,
                  }))
                }
                active={filter.score === score}
                className="mr-2"
                colorScheme="primary"
                variant="outline"
              >
                <span>&gt; {score}</span>
              </StyledRoundedButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type Category = {
  id: string
  name: string
}

type Tag = {
  id: string
  name: string
}

const useFilterOptions: (type?: 'program' | 'activity' | 'member' | 'merchandise' | 'podcastProgram' | 'post') => {
  isLoading: boolean
  filterOptionGroup: {
    categories: (Category & { subCategories: Category[] })[]
    tags: (Tag & { subTags: Tag[] })[]
  }
} = type => {
  const { loading, data } = useQuery(
    gql`
      query GET_PRODUCT_FILTER_OPTIONS($class: String) {
        category(where: { class: { _eq: $class }, program_categories: { program_id: { _is_null: false } } }) {
          id
          name
        }
        app_tag(where: { tag: { program_tags: { program_id: { _is_null: false } } } }) {
          name: tag_name
        }
      }
    `,
    {
      variables: {
        class: type,
      },
    },
  )
  const categories = map(([categoryName, subCategories]) => {
    if (subCategories.length === 1) {
      return {
        ...subCategories[0],
        subCategories: [],
      }
    }

    return {
      id: subCategories.filter(cat => cat.name === categoryName)[0]?.id,
      name: categoryName,
      subCategories: subCategories
        .filter(cat => cat.name !== categoryName)
        .map(cat => ({ id: cat.id, name: cat.name.split('/')[1] })),
    }
  }, toPairs(groupBy<{ id: string; name: string }>(category => category.name.split('/')[0], data?.category || [])))

  const tags = map(([tagName, subTags]) => {
    if (subTags.length === 1) {
      const [{ name }] = subTags
      return {
        id: name,
        name: name,
        subTags: [],
      }
    }

    return {
      id: subTags.filter(tag => tag.name === tagName)[0]?.name,
      name: tagName,
      subTags: subTags
        .filter(tag => tag.name !== tagName)
        .map(tag => ({
          id: tag.name,
          name: tag.name,
        })),
    }
  }, toPairs(groupBy<{ id: string; name: string }>(tag => tag.name.split('/')[0], data?.app_tag || [])))

  return {
    isLoading: loading,
    filterOptionGroup: {
      categories,
      tags,
    },
  }
}

export default GlobalSearchModal
