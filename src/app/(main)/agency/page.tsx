import { getAuthUserDetails } from "@/lib/queries"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const AgencyPage = async () => {

  const authUser = await currentUser()
  if (!authUser) return redirect('/sign-in')

  const agencyId = await verifyAndAcceptInvitation()

  // Get users details
  const user = await getAuthUserDetails()

  return (
    <div>AgencyPage</div>
  )
}

export default AgencyPage