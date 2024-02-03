import PipelineInfobar from "@/components/pipelines/pipeline-infobar";
import PipelineSettings from "@/components/pipelines/pipeline-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <div>
            {/* VIEW */}
             <TabsTrigger value="view" >
                PipeLine View
             </TabsTrigger>
             {/* SETTINGS */}
             <TabsTrigger value="settings">
                Settings
             </TabsTrigger>
          </div>
       </TabsList>

        {/* VIEW */}
       <TabsContent value="view">
          
       </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="settings">
          <PipelineSettings pipelineId={params.pipelineId} pipelines={pipelines} subaccountId={params.subaccountId}/>
       </TabsContent>
    </Tabs>
  )
}

export default PipelineIdPage