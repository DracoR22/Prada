'use client'

import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from "@prisma/client"

interface Props {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: any
  user: any
  id: string
}

const MenuOptions = ({ defaultOpen, subAccounts, sidebarLogo, sidebarOpt, details, user, id }: Props) => {
    return (
        <div>
            
        </div>
    )
}

export default MenuOptions
