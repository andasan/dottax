"use client"

/* eslint-disable prettier/prettier */
import {
  IconAdjustments,
  IconGauge,
  IconNotes,
} from '@tabler/icons-react'

import type { NavLinkType } from '@/types/component.types'

export const navData = (batchLinks: number[]): NavLinkType[] => [
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
  {
    label: 'Students',
    icon: IconNotes,
    initiallyOpened: false,
    links: batchLinks.map((batch) => ({ label: `Batch ${batch}`, link: `/students/${+batch}` })),
  },
  { label: 'Settings',
    icon: IconAdjustments,
    initiallyOpened: true,
    links: [
      { label: 'Email Template', link: '/email-template' },
      { label: 'File upload', link: '/file-upload' },
    ]
  },
]