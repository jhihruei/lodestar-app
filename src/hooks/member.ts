import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { uniq } from 'ramda'
import { useApp } from '../containers/common/AppContext'
import { notEmpty } from '../helpers'
import types from '../types'
import { MemberProps, MemberPublicProps, MemberSocialType, SocialCardProps, UserRole } from '../types/member'

export const useMember = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<types.GET_MEMBER, types.GET_MEMBERVariables>(
    gql`
      query GET_MEMBER($memberId: String!) {
        member_by_pk(id: $memberId) {
          id
          role
          username
          name
          email
          picture_url
          metadata
          description
          created_at
          logined_at
          facebook_user_id
          google_user_id
          youtube_channel_ids
        }
      }
    `,
    { variables: { memberId } },
  )

  const member: MemberProps | null =
    loading || error || !data || !data.member_by_pk
      ? null
      : {
          id: data.member_by_pk.id,
          role: data.member_by_pk.role as UserRole,
          username: data.member_by_pk.username,
          name: data.member_by_pk.name,
          email: data.member_by_pk.email,
          pictureUrl: data.member_by_pk.picture_url,
          metadata: data.member_by_pk.metadata,
          description: data.member_by_pk.description,
          createdAt: data.member_by_pk.created_at,
          loginedAt: data.member_by_pk.logined_at,
          facebookUserId: data.member_by_pk.facebook_user_id,
          googleUserId: data.member_by_pk.google_user_id,
          youtubeChannelIds: data.member_by_pk.youtube_channel_ids,
        }

  return {
    loadingMember: loading,
    errorMember: error,
    member,
    refetchMember: refetch,
  }
}

export const usePublicMember = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<types.GET_PUBLIC_MEMBER, types.GET_PUBLIC_MEMBERVariables>(
    gql`
      query GET_PUBLIC_MEMBER($memberId: String!) {
        member_public(where: { id: { _eq: $memberId } }) {
          id
          app_id
          picture_url
          name
          username
          tag_names
          abstract
          description
          role
          title
        }
      }
    `,
    { variables: { memberId } },
  )

  const member: MemberPublicProps | null =
    loading || error || !data || !data.member_public[0]
      ? null
      : {
          id: data.member_public[0].id || '',
          role: (data.member_public[0].role || 'anonymous') as UserRole,
          pictureUrl: data.member_public[0].picture_url,
          username: data.member_public[0].username || '',
          name: data.member_public[0].name,
          tags: (data.member_public[0].tag_names || []) as string[],
          abstract: data.member_public[0].abstract,
          description: data.member_public[0].description,
          title: data.member_public[0].title,
        }

  return {
    loadingMember: loading,
    errorMember: error,
    member,
    refetchMember: refetch,
  }
}

export const useUpdateMember = () => {
  const [updateMember] = useMutation<types.UPDATE_MEMBER, types.UPDATE_MEMBERVariables>(
    gql`
      mutation UPDATE_MEMBER(
        $memberId: String!
        $name: String
        $description: String
        $username: String
        $email: String
        $pictureUrl: String
      ) {
        update_member(
          where: { id: { _eq: $memberId } }
          _set: { name: $name, description: $description, username: $username, email: $email, picture_url: $pictureUrl }
        ) {
          affected_rows
        }
      }
    `,
  )

  return updateMember
}

export const useUpdateMemberMetadata = () => {
  const [updateMemberMetadata] = useMutation<types.UPDATE_MEMBER_METADATA, types.UPDATE_MEMBER_METADATAVariables>(gql`
    mutation UPDATE_MEMBER_METADATA($memberId: String!, $metadata: jsonb) {
      update_member(where: { id: { _eq: $memberId } }, _set: { metadata: $metadata }) {
        affected_rows
      }
    }
  `)

  return updateMemberMetadata
}

export const useCreatorCollection = () => {
  const { id: appId } = useApp()
  const { loading, error, data, refetch } = useQuery<
    types.GET_CREATOR_COLLECTION,
    types.GET_CREATOR_COLLECTIONVariables
  >(
    gql`
      query GET_CREATOR_COLLECTION($appId: String!) {
        member_public(where: { app_id: { _eq: $appId }, role: { _in: ["content-creator"] } }) {
          id
          picture_url
          name
          username
          abstract
          description
          role
          title
        }
      }
    `,
    {
      variables: {
        appId,
      },
    },
  )

  const creators: {
    id: string
    avatarUrl: string | null
    name: string
    abstract: string | null
    description: string | null
    title: string
  }[] =
    loading || !!error || !data
      ? []
      : data.member_public.map(member => ({
          id: member.id || '',
          avatarUrl: member.picture_url,
          name: member.name || member.username || '',
          abstract: member.abstract,
          description: member.description,
          title: member.title || '',
        }))

  return {
    loadingCreators: loading,
    errorCreators: error,
    creators: uniq(creators),
    refetchCreators: refetch,
  }
}

export const useUpdateMemberYouTubeChannelIds = () => {
  const [updateYoutubeChannelIds] = useMutation(gql`
    mutation UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION($memberId: String!, $data: jsonb) {
      update_member(where: { id: { _eq: $memberId } }, _set: { youtube_channel_ids: $data }) {
        affected_rows
      }
    }
  `)

  return updateYoutubeChannelIds
}

export const useSocialCardCollection = () => {
  const { loading, error, data, refetch } = useQuery<types.GET_SOCIAL_CARD_COLLECTION>(gql`
    query GET_SOCIAL_CARD_COLLECTION {
      social_card_enrollment {
        social_card {
          id
          name
          badge_url
          description
          member_social {
            id
            name
            profile_url
            channel_url
            type
          }
        }
      }
    }
  `)

  const socialCards: SocialCardProps[] =
    loading || error || !data
      ? []
      : data.social_card_enrollment
          .map(socialCardEnrollment =>
            socialCardEnrollment.social_card
              ? {
                  id: socialCardEnrollment.social_card.id,
                  channel: {
                    id: socialCardEnrollment.social_card.member_social.id,
                    name: socialCardEnrollment.social_card.member_social.name,
                    profileUrl: socialCardEnrollment.social_card.member_social.profile_url,
                    url: socialCardEnrollment.social_card.member_social.channel_url,
                    type: socialCardEnrollment.social_card.member_social.type as MemberSocialType,
                  },
                  plan: {
                    id: socialCardEnrollment.social_card.id,
                    name: socialCardEnrollment.social_card.name,
                    badgeUrl: socialCardEnrollment.social_card.badge_url,
                    description: socialCardEnrollment.social_card.description,
                  },
                }
              : null,
          )
          .filter(notEmpty)

  return {
    loadingSocialCards: loading,
    errorSocialCards: error,
    socialCards,
    refetchSocialCards: refetch,
  }
}
