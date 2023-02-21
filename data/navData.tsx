"use client"

/* eslint-disable prettier/prettier */
import {
  IconAdjustments,
  IconGauge,
  IconNotes,
  IconUser
} from '@tabler/icons-react'
import prisma from '@/lib/prisma';

import type { NavLinkType } from '@/types/component.types'

// const getBatchNav = async () => {
//   const batchArray = await prisma.student.findMany({
//     select: {
//       batch: true,
//     },
//   });

//   console.log(batchArray);
// }
// getBatchNav()

export const navData = (batchLinks: number[]): NavLinkType[] => [
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
  {
    label: 'Students',
    icon: IconNotes,
    initiallyOpened: true,
    links: batchLinks.map((batch) => ({ label: `Batch ${batch}`, link: `/students/${batch}` })),
    // links: [
    //   { label: 'Batch 1', link: '/students/1' },
    //   { label: 'Batch 2', link: '/students/2' },
    // ],
  },
  { label: 'Settings',
    icon: IconAdjustments,
    initiallyOpened: true,
    links: [
      { label: 'Add a Batch', link: '/add-batch' },
      { label: 'Add Students', link: '/add-student' },
      { label: 'File upload', link: '/file-upload' },
    ]
  },
]