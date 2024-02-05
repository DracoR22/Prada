import { Funnel, SubAccount } from '@prisma/client'
import { db } from '@/lib/db'
import { getConnectAccountProducts } from '@/lib/stripe/stripe-actions'
import FunnelForm from '@/components/forms/funnel-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FunnelProductsTable from './funnel-products-table'
import { Button } from '../ui/button'
import Link from 'next/link'

interface FunnelSettingsProps {
  subaccountId: string
  defaultData: Funnel
}

const FunnelSettings: React.FC<FunnelSettingsProps> = async ({ subaccountId, defaultData }) => {

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  })

  if (!subaccountDetails) return

  if (!subaccountDetails.connectAccountId) {
    return (
        <div className="flex justify-center">
            <div className='flex-col'>
              <h1 className='mt-2 '>
                 Connect your Stripe account first in order to edit your funnels
              </h1>
              <Button className='mt-4 w-full' asChild>
                <Link href={`/subaccount/${subaccountId}/launchpad`}>
                   Connect Stripe
                </Link>
              </Button>
            </div>
        </div>
    )
  }

  // GET SUBACCOUNT PRODUCTS FROM STRIPE
  const products = await getConnectAccountProducts(subaccountDetails.connectAccountId)

  return (
    <div className="flex gap-4 flex-col">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subaccountDetails.connectAccountId ? (
              <FunnelProductsTable
                defaultData={defaultData}
                products={products}
              />
            ) : (
              'Connect your stripe account to sell products.'
            )}
          </>
        </CardContent>
      </Card>

      <FunnelForm subAccountId={subaccountId} defaultData={defaultData}
      />
    </div>
  )
}

export default FunnelSettings