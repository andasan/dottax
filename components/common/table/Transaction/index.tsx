import { CopyButton, Flex, Table, Text, Tooltip } from '@mantine/core'
import { IconCurrencyRupee } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useQuery } from 'react-query'

import { getTransactionHistory } from '@/graphql/main'
import { server } from '@/utils/server'

type TransactionElementType = {
  name: string
  amount: number
  orderId: string
  date: string
}

const fetchTransactions = async () => {
  const res = await server.post('/graphql', {
    query: getTransactionHistory
  })
  const { docs } = res.data.data.Orders
  const rows = docs.map((item: any) => {
    const { firstName } = item.user
    const orderId = item.payment.orderCreationId
    const date = dayjs(item.createdAt).format('MMMM DD, YYYY')
    return {
      name: firstName,
      amount: item.orderAmount,
      orderId,
      status: item.orderStatus,
      date
    }
  })
  return rows
}

export default function TransactionHistory() {
  const { data, isLoading, error } = useQuery(
    'transaction-history',
    fetchTransactions,
    {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error instanceof Error) {
    return <div>{error!.message}</div>
  }
  const rows = data.map((element: TransactionElementType) => (
    <tr key={element.orderId}>
      <td>
        <Text weight={700} variant="gradient">
          {element.name}
        </Text>
      </td>
      <td>
        <CopyButton value={element.orderId}>
          {({ copied, copy }) => (
            <Tooltip
              color={copied ? 'teal' : 'blue'}
              label={`${copied ? 'Copied' : 'Copy'}: ${element.orderId}`}
            >
              <Text
                style={{ cursor: 'pointer' }}
                underline
                onClick={copy}
                color={copied ? 'teal' : 'blue'}
              >
                {`${element.orderId}`.slice(0, 10)}
              </Text>
            </Tooltip>
          )}
        </CopyButton>
      </td>
      <td>
        <Flex align="center">
          <IconCurrencyRupee size={16} />
          <Text mb={1}>{element.amount}</Text>
        </Flex>
      </td>

      <td>{element.date}</td>
    </tr>
  ))

  return (
    <Table verticalSpacing="md" striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Name</th>
          <th>Transaction Id</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      {rows && <tbody>{rows}</tbody>}
    </Table>
  )
}
