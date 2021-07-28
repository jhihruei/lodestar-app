export type CategoryProps = {
  id: string
  name: string
}

export type Module =
  | 'activity'
  | 'activity_online'
  | 'appointment'
  | 'approval'
  | 'attend'
  | 'blog'
  | 'coin'
  | 'contract'
  | 'coupon_scope'
  | 'creator_display'
  | 'currency'
  | 'customer_review'
  | 'exercise'
  | 'group_buying'
  | 'invoice'
  | 'learning_statistics'
  | 'learning_statistics_advanced'
  | 'locale'
  | 'member_assignment'
  | 'member_card'
  | 'member_note'
  | 'member_note_demo'
  | 'member_property'
  | 'member_rejection'
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
  | 'private_appointment_plan'
  | 'program_content_material'
  | 'program_package'
  | 'project'
  | 'qrcode'
  | 'referrer'
  | 'search'
  | 'sharing_code'
  | 'sms_verification'
  | 'social_connect'
  | 'tempo_delivery'
  | 'voucher'
  | 'xuemi_pt'

export type ProductRoleName = 'owner' | 'instructor' | 'assistant' | 'app-owner'
