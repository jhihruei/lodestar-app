import { CurrencyProps } from './program'
export type ReservationType = 'hour' | 'day' | null

export type AppointmentPlan = {
  id: string
  title: string
  description: string | null
  duration: number
  price: number
  phone: string | null
  supportLocales: string[] | null
  currency: CurrencyProps
  isPrivate?: boolean
  reservationAmount?: number
  reservationType?: ReservationType | null
}

export type AppointmentPeriod = {
  id: string
  startedAt: Date
  endedAt: Date
  booked: boolean
  available?: boolean
}

export type AppointmentEnrollment = {
  title: string
  startedAt: Date
  endedAt: Date
  canceledAt: Date | null
  creator: {
    avatarUrl: string | null
    name: string
  }
  member: {
    name: string
    email: string
    phone: string
  }
  appointmentUrl: string
  appointmentIssue: string | null
  orderProduct: {
    id: string
    options: any
  }
}
