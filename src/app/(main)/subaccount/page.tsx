import Unauthorized from "@/components/unauthorized";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";

interface Props {
  searchParams: { state: string; code: string  }
}

const SubaccountPage = async ({ searchParams }: Props) => {

  const agencyId = await verifyAndAcceptInvitation()

  if (!agencyId) {
    return <Unauthorized/>
  }

  const user = await getAuthUserDetails()
  if (!user) return

  const getFirstSubacoountWithAccess = user.Permissions.find((permission) => permission.access === true)

  if (searchParams.state) {
    const statePath = searchParams.state.split('___')[0]
    const stateSubaccountId = searchParams.state.split('___')[1]

    if (!stateSubaccountId) return <Unauthorized/>

    return redirect(`/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`)
  }

  if (getFirstSubacoountWithAccess) {
    return redirect(`/subaccount/${getFirstSubacoountWithAccess.subAccountId}`)
  }

  return <Unauthorized/>
}

export default SubaccountPage