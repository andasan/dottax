import { Footer, Paper, Text, UnstyledButton } from '@mantine/core'
import { IconBrandGithub } from '@tabler/icons-react'
import React from 'react'

import { COLORS } from '@/utils/constants'

const FooterBar = () => {
  return (
    <Footer height={60} p="md">
      <Paper>
        <Text variant="gradient" size={12} weight={600} gradient={{ from: COLORS.primary, to: COLORS.secondary }} style={{ lineHeight: '2.55'}}>
          Copyright &copy; 2023,{' '}
        <UnstyledButton>
          <Text
            variant="gradient"
            size={12}
            weight={600}
            component="a"
            target="_blank"
            href="#"
            gradient={{ from: COLORS.primary, to: COLORS.secondary }}
          >
            dottax
          </Text>
        </UnstyledButton>
        </Text>
      </Paper>
    </Footer>
  )
}

export default FooterBar
