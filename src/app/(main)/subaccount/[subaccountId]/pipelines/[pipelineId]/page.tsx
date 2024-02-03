import PipelineInfobar from "@/components/pipelines/pipeline-infobar";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketsAndTags, getPipelineDetails } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";

interface Props {
  params: { subaccountId: string; pipelineId: string }
}

const PipelineIdPage = async ({ params }: Props) => {

   const pipelineDetails = await getPipelineDetails(params.pipelineId)

   if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`)
   }

   const pipelines = await db.pipeline.findMany({
    where: {
        subAccountId: params.subaccountId
    }
   })

   const lanes = (await getLanesWithTicketsAndTags(params.pipelineId)) as LaneDetail[]

  return (
    <Tabs defaultValue="view" className="w-full">
       <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
          <PipelineInfobar pipelineId={params.pipelineId} subAccountId={params.subaccountId} pipelines={pipelines}/>
          <div></div>
       </TabsList>
    </Tabs>
  )
}

export default PipelineIdPage