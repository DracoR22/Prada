import FunnelEditor from "@/components/editor/funnel-editor"
import FunnelEditorNavigation from "@/components/editor/funnel-editor-navigation"
import { db } from "@/lib/db"
import { getDomainContent, getFunnelPageDetails } from "@/lib/queries"
import EditorProvider, { useEditor } from "@/providers/editor/editor-provider"
import { notFound } from "next/navigation"

const DomainPage = async ({ params }: { params: { domain: string }}) => {

   const domainData = await getDomainContent(params.domain.slice(0, -1))

   if (!domainData) return notFound()

   const pageData = domainData.FunnelPages.find((page) => !page.pathName)

   if (!pageData) return notFound()

   // UPDATE PAGE VISITS!
   await db.funnelPage.update({
    where: {
      id: pageData.id
    },
    data: {
      visits: {
        increment: 1
      }
    }
   })

  return (
    <EditorProvider subaccountId={domainData.subAccountId} pageDetails={pageData} funnelId={domainData.id}>
       <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  )
}

export default DomainPage