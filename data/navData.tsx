/* eslint-disable prettier/prettier */
import {
  IconAdjustments,
  IconGauge,
  IconNotes,
  IconUser
} from '@tabler/icons-react'

import type { NavLinkType } from '@/types/component.types'

export const navData: NavLinkType[] = [
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
  { label: 'Users', icon: IconUser, link: '/users' },
  {
    label: 'Students',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Batch 2020', link: '/students/2020' },
      { label: 'Batch 2021', link: '/students/2021' },
      { label: 'Batch 2022', link: '/students/2022' },
      { label: 'Batch 2023', link: '/students/2023' },
    ].reverse()
  },
  { label: 'Settings', icon: IconAdjustments, link: '/settings' },
]