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
    links: batchLinks.sort().reverse().map((batch) => ({ label: `Batch ${batch}`, link: `/students/${batch}` })),
    // links: [
    //   { label: 'Batch 2020', link: '/students/2020' },
    //   { label: 'Batch 2021', link: '/students/2021' },
    //   { label: 'Batch 2022', link: '/students/2022' },
    //   { label: 'Batch 2023', link: '/students/2023' },
    // ].reverse()
  },
  { label: 'Settings',
    icon: IconAdjustments,
    initiallyOpened: true,
    links: [
      { label: 'Add a Batch', link: '/students/add-batch' },
      { label: 'Add Students', link: '/students/add' },
      { label: 'File upload', link: '/files' },
    ]
  },
]