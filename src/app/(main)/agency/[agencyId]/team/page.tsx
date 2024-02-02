import SendInvitation from "@/components/forms/send-invitation"
import { columns } from "@/components/team-data-table/columns"
import DataTable from "@/components/team-data-table/data-table"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import { Plus } from "lucide-react"

interface Props {
  params: { agencyId: string }
}

const TeamPage = async ({ params }: Props) => {

  const authUser = await currentUser()

   const teamMembers = await db.user.findMany({
     where: {
       agencyId: params.agencyId
     },
     include: {
      Agency: {
        include: {
          SubAccount: true
        }
      },
      Permissions: {
        include: {
          SubAccount: true
        }
      }
     }
   })

   if (!authUser) return null

   const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId
     },
     include: {
      SubAccount: true
     }
   })

   if (!agencyDetails) return

  return (
    <DataTable actionButtonText={<><Plus size={15}/> Add</>} modalChildren={<SendInvitation agencyId={agencyDetails.id}/>} filterValue="name" columns={columns} data={teamMembers}/>
  )
}

export default TeamPage