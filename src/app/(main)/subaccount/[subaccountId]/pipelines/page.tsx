import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface Props {
    params: { subaccountId: string }
}

const PipelinesPage = async ({ params }: Props) => {

  const pipelineExists = await db.pipeline.findFirst({
    where: {
        subAccountId: params.subaccountId
    }
  })

  if (pipelineExists) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`)
  }

  try {
    const response = await db.pipeline.create({
        data: {
            subAccountId: params.subaccountId,
            name: 'First Pipeline'
        }
    })

    return redirect(`/subaccount/${params.subaccountId}/pipelines/${response.id}`)
  } catch (error) {
    console.log(error)
  }
}

export default PipelinesPage