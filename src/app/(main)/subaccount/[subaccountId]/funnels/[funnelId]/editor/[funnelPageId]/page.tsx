import FunnelEditorSidebar from "@/components/editor/editor-sidebar";
import FunnelEditor from "@/components/editor/funnel-editor";
import FunnelEditorNavigation from "@/components/editor/funnel-editor-navigation";
import { db } from "@/lib/db";
import EditorProvider from "@/providers/editor/editor-provider";
import { redirect } from "next/navigation";

interface Props {
    params: { subaccountId: string; funnelId: string; funnelPageId: string }
}

const FunnelIdPage = async ({ params }: Props) => {

  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
        id: params.funnelPageId
    }
  })

  if (!funnelPageDetails) {
    return redirect(`/subaccount/${params.subaccountId}/funnels/${params.funnelId}`)
  }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
            <EditorProvider subaccountId={params.subaccountId} funnelId={params.funnelId} pageDetails={funnelPageDetails}>
                {/* EDITOR NAVBAR */}
                <FunnelEditorNavigation funnelId={params.funnelId} funnelPageDetails={funnelPageDetails} subaccountId={params.subaccountId}/>
                {/* EDITOR */}
                <div className="h-full flex justify-center">
                <FunnelEditor funnelPageId={params.funnelPageId}/>
                </div>
                {/* EDITOR SIDEBAR */}
                <FunnelEditorSidebar subaccountId={params.subaccountId}/>
            </EditorProvider>
        </div>
    )
}

export default FunnelIdPage
