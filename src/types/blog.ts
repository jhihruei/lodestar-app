import { Category } from './general'
import { MerchandiseProps } from './merchandise'

export type PostLinkProps = {
  id: string
  codeName: string | null
  title: string
  coverUrl: string | null
  videoUrl: string | null
}

export type PostPreviewProps = PostLinkProps & {
  abstract: string | null
  authorId: string
  publishedAt: Date | null
  categories: Category[]
  tags: string[]
}

export type PostProps = Omit<PostPreviewProps, 'authorId'> & {
  author: {
    id: string
    name: string
    avatarUrl: string | null
    abstract: string | null
    withPodcast?: boolean
    withAppointment?: boolean
  }
  views: number
  merchandises: MerchandiseProps[]
  description: string | null
  prevPost: {
    id: string
    codeName: string | null
    title: string
  } | null
  nextPost: {
    id: string
    codeName: string | null
    title: string
  } | null
}

export type PostLatestProps = PostLinkProps & {
  abstract: string | null
  publishedAt: Date | null
  description: string | null
}
