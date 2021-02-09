export type CategoryProps = {
  id: string
  name: string
}

export type Module =
  | 'activity'
  | 'appointment'
  | 'approval'
  | 'blog'
  | 'coin'
  | 'contract'
  | 'coupon_scope'
  | 'currency'
  | 'customer_review'
  | 'creator_display'
  | 'invoice'
  | 'learning_statistics'
  | 'locale'
  | 'member_assignment'
  | 'member_card'
  | 'member_note'
  | 'member_property'
  | 'member_task'
  | 'merchandise'
  | 'merchandise_customization'
  | 'merchandise_virtualness'
  | 'order_contact'
  | 'permission'
  | 'podcast'
  | 'podcast_recording'
  | 'point'
  | 'practice'
  | 'program_package'
  | 'project'
  | 'qrcode'
  | 'search'
  | 'sharing_code'
  | 'social_connect'
  | 'tempo_delivery'
  | 'voucher'
  | 'creator_display'
  | 'referrer'

export type ProductRoleName = 'owner' | 'instructor' | 'assistant' | 'app-owner'
