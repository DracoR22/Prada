'use client'

import { DeviceTypes, useEditor } from "@/providers/editor/editor-provider"
import { FunnelPage } from "@prisma/client"
import { useRouter } from "next/navigation"
import { FocusEventHandler, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import clsx from "clsx"
import Link from "next/link"
import { ArrowLeftCircle, EyeIcon, LaptopIcon, Redo2, SmartphoneIcon, TabletIcon, Undo2 } from "lucide-react"
import { Input } from "../ui/input"
import { saveActivityLogsNotification, upsertFunnelPage } from "@/lib/queries"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"

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

    // PREVIEW
     const handlePreviewClick = () => {
        dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
        dispatch({ type: 'TOGGLE_LIVE_MODE' })
     }

     // UNDO
     const handleUndo = () => {
        dispatch({ type: 'UNDO' })
     }

     // REDO
     const handleRedo = () => {
        dispatch({ type: 'REDO' })
     }

     // SAVE PAGE
     const handleOnSave = async () => {
        const content = JSON.stringify(state.editor.elements)

        try {
            const response = await upsertFunnelPage(subaccountId, { ...funnelPageDetails, content }, funnelId)

            // create notification
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated a funnel page | ${response?.name}`,
                subaccountId: subaccountId,
              })

              toast.success('Success', {
                description: 'Saved',
              })
        } catch (error) {
            toast.error('Oppse!', {
                description: 'Could not save page',
              })
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
               {/* DEVICES VIEW */}
               <aside>
                 <Tabs defaultValue="Desktop" className="w-fit" value={state.editor.device}
                 onValueChange={(value) => {
                    dispatch({type: 'CHANGE_DEVICE', payload: { device: value as DeviceTypes}})
                 }}>
                    <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
                        {/* DESKTOP */}
                       <Tooltip>
                          <TooltipTrigger>
                            <TabsTrigger value="Desktop" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                               <LaptopIcon/>
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Desktop</p>
                          </TooltipContent>
                       </Tooltip>

                       {/* TABLET */}
                       <Tooltip>
                          <TooltipTrigger>
                            <TabsTrigger value="Tablet" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                               <TabletIcon/>
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tablet</p>
                          </TooltipContent>
                       </Tooltip>

                       {/* MOBILE */}
                       <Tooltip>
                          <TooltipTrigger>
                            <TabsTrigger value="Mobile" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                               <SmartphoneIcon/>
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mobile</p>
                          </TooltipContent>
                       </Tooltip>

                    </TabsList>
                 </Tabs>
               </aside>
               {/* OPTIONS */}
               <aside className="flex items-center gap-2">
                  {/* SET TO LIVE OR PREVIEW MODE */}
                    <Button variant={'ghost'} size={'icon'} className="hover:bg-slate-800" onClick={handlePreviewClick}>
                        <EyeIcon/>
                    </Button>

                    {/* UNDO */}
                    <Button disabled={!(state.history.currentIndex > 0)} onClick={handleUndo} variant={'ghost'} size={'icon'} className="hover:bg-slate-800">
                         <Undo2/> 
                    </Button>

                    {/* REDO */}
                    <Button disabled={!(state.history.currentIndex < state.history.history.length - 1)} onClick={handleRedo} variant={'ghost'} size={'icon'} className="hover:bg-slate-800 mr-4">
                         <Redo2/> 
                    </Button>

                    <div className="flex flex-col items-center mr-4">
                        {/* CHANGE TO DRAFT OR PUBLISHED */}
                       <div className="flex flex-row items-center gap-4">
                           Draft
                           <Switch disabled defaultChecked={true}/>
                           Publish
                       </div>
                       <span className="text-muted-foreground text-xs mt-1">
                          Last updated {funnelPageDetails.updatedAt.toLocaleDateString()}
                       </span>
                    </div>
                    <Button onClick={handleOnSave}>Save</Button>
               </aside>
            </nav>
        </TooltipProvider>
    )
}

export default FunnelEditorNavigation
