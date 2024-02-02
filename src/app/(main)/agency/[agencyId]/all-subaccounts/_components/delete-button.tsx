'use client'

import { deleteSubaccount, getSubaccountDetails, saveActivityLogsNotification } from "@/lib/queries"
import { useRouter } from "next/navigation"

interface Props {
    subaccountId: string
}

const DeleteButton = ({ subaccountId }: Props) => {

   const router = useRouter()

    return (
        <div onClick={async () => {
            const response = await getSubaccountDetails(subaccountId)
            await saveActivityLogsNotification({ agencyId: undefined, description: `Deleted a subaccount | ${response?.name}`, subaccountId})
            await deleteSubaccount(subaccountId)

            router.refresh()
        }}>
            Delete Sub Account
        </div>
    )
}

export default DeleteButton
