import Sidebar from "@/components/sidebar"
import Unauthorized from "@/components/unauthorized"
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import React, { ReactNode } from "react"

interface Props {
    children : React.ReactNode
    params: { agencyId: string }
}

const AgencyIdLayout = async ({ children, params }: Props) => {

   const agencyId = await verifyAndAcceptInvitation()
   const user = await currentUser()

   if (!user) return redirect('/')

   if (!agencyId) return redirect('/agency')

   if (user.privateMetadata.role !== 'AGENCY_OWNER' && user.privateMetadata.role !== 'AGENCY_ADMIN') {
    return (
        <Unauthorized/>
     )
   } 

   let allNoti: any = []

   const notifications = await getNotificationAndUser(agencyId)

   if (notifications) {
     allNoti = notifications
   }

  return (
    <div className="h-screen overflow-hidden">
       <Sidebar id={params.agencyId} type="agency"/>
       <div className="md:pl-[300px]">
         {children}
       </div>
    </div>
  )
}

export default AgencyIdLayout