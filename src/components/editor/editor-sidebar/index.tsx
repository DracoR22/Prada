'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import TabList from './tabs'
import SettingsTab from './tabs/settings-tab'
import MediaBucketTab from './tabs/media-bucket-tab'

interface Props {
    subaccountId: string
}

const FunnelEditorSidebar = ({ subaccountId }: Props) => {

   const { state, dispatch } = useEditor()

    return (
        <Sheet open={true} modal={false}>
           <Tabs className='w-full' defaultValue='Settings'>
            {/* OPTIONS TO SELECT TAB */}
              <SheetContent showX={false} side='right' className={clsx('mt-[97px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden', { hidden: state.editor.previewMode })}>
                  <TabList/>
              </SheetContent>

              <SheetContent showX={false} side='right' className={clsx('mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden ', { hidden: state.editor.previewMode })}>
                  <div className='grid gap-4 h-full pb-36 overflow-scroll'>
                      {/* STYLING ELEMENTS */}
                      <TabsContent value='Settings'>
                            <SheetHeader className='text-left p-6'>
                                <SheetTitle>Styles</SheetTitle>
                                <SheetDescription>
                                    Show your creativity! You can customize every component as you like.
                                </SheetDescription>
                            </SheetHeader>
                            <SettingsTab/>
                      </TabsContent>

                      {/* MEDIA BUCKETS */}
                      <TabsContent value='Media'>
                         <MediaBucketTab subaccountId={subaccountId}/>
                      </TabsContent>
                  </div>
              </SheetContent>
           </Tabs>
        </Sheet>
    )
}

export default FunnelEditorSidebar
