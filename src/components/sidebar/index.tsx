import { getAuthUserDetails } from "@/lib/queries"
import { SubAccount } from "@prisma/client"
import MenuOptions from "./menu-options"

interface Props {
    id: string
    type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {

   const user = await getAuthUserDetails()

   if (!user) return null

   if (!user.Agency) return

   const details = type === 'agency' ? user?.Agency : user?.Agency.SubAccount.find((subaccount: SubAccount) => subaccount.id === id)

   const isWhiteLabeledAgency = user.Agency.whitelabel

   if (!details) return

   let sideBarLogo = user.Agency.agencyLogo || '/assets/logo.svg'

    if (!isWhiteLabeledAgency) {
        if (type === 'subaccount') {
            sideBarLogo = user?.Agency.Subaccount.find((subaccount: SubAccount) => subaccount.id === id)?.subAccountLogo || user.Agency.agencyLogo
        }
    }

    const sidebarOptions = type === 'agency' ? user.Agency.SidebarOption || [] : user.Agency.Subaccount.find((subaccount: SubAccount) => subaccount.id === id)?.SidebarOption || []

    const subaccounts = user.Agency.SubAccount.filter((subaccount: SubAccount) => user.Permissions.find((permission: any) => permission.subAccountId === subaccount.id && permission.access))

    return (
        <>
          <MenuOptions defaultOpen={true} details={details} id={id} sidebarLogo={sideBarLogo} sidebarOpt={sidebarOptions} subAccounts={subaccounts} user={user}/>
          <MenuOptions details={details} id={id} sidebarLogo={sideBarLogo} sidebarOpt={sidebarOptions} subAccounts={subaccounts} user={user}/>
        </>
    )
}

export default Sidebar
