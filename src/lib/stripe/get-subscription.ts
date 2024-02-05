import { pricingCards } from "../constants"
import { db } from "../db"

export const getSubscription = async (agencyId: string) => {
    const agencySubscription = await db.agency.findUnique({
        where: {
          id: agencyId
        },
        select: {
          customerId: true,
          Subscription: true
        }
       })

       const currentPlanDetails = pricingCards.find((c) => c.priceId === agencySubscription?.Subscription?.priceId)

       return { agencySubscription, currentPlanDetails }
}