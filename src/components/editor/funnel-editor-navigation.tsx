'use client'

import { DeviceTypes, useEditor } from "@/providers/editor/editor-provider"
import { FunnelPage } from "@prisma/client"
import { useRouter } from "next/navigation"
import { FocusEventHandler, useEffect } from "react"
import { TooltipProvider } from "../ui/tooltip"
import clsx from "clsx"
import Link from "next/link"
import { ArrowLeftCircle } from "lucide-react"
import { Input } from "../ui/input"
import { upsertFunnelPage } from "@/lib/queries"
import { toast } from "sonner"
import { Tabs } from "../ui/tabs"

interface Props {
    funnelId: string
    funnelPageDetails: FunnelPage
    subaccountId: string
}

const FunnelEditorNavigation = ({ funnelId, funnelPageDetails, subaccountId }: Props) => {

    const router = useRouter()

    const { state, dispatch } = useEditor()

    useEffect(() => {
        dispatch({ type: 'SET_FUNNELPAGE_ID', payload: { funnelPageId: funnelPageDetails.id} })
    }, [funnelPageDetails])

    // CHANGE TITLE
    const handleBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (event) => {
        if (event.target.value === funnelPageDetails.name) return

        if (event.target.value) {
          await upsertFunnelPage(subaccountId, {
              id: funnelPageDetails.id,
              name: event.target.value,
              order: funnelPageDetails.order,
            },

            funnelId
          )
    
          toast.success('Success', {
            description: 'Saved Funnel Page title',

          })
          router.refresh()
        } else {
          toast.error('Oppse!', {
            description: 'You need to have a title!',
          })
          event.target.value = funnelPageDetails.name
        }
    }

    return (
        <TooltipProvider>
            <nav className={clsx('border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all', { '!h-0 !p-0 !overflow-hidden': state.editor.previewMode })}>
               <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
                {/* GO BACK TO PREVIOUS PAGE */}
                  <Link href={`/subaccountId/${subaccountId}/funnels/${funnelId}`}>
                      <ArrowLeftCircle/>
                  </Link>
                  <div className="flex flex-col w-full">
                    {/* PAGE NAME */}
                     <Input defaultValue={funnelPageDetails.name} className="border-none h-5 m-0 p-0 text-lg"
                     onBlur={handleBlurTitleChange}/>

                    <span className="text-sm text-muted-foreground">
                      Path: /{funnelPageDetails.pathName}
                    </span>
                  </div>
               </aside>
               <aside>
                {/* DEVICES */}
                 <Tabs defaultValue="Desktop" className="w-fit" value={state.editor.device}
                 onValueChange={(value) => {
                    dispatch({type: 'CHANGE_DEVICE', payload: { device: value as DeviceTypes}})
                 }}>
                    
                 </Tabs>
               </aside>
            </nav>
        </TooltipProvider>
    )
}

export default FunnelEditorNavigation
