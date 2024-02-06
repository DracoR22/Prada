'use editor'

import { Badge } from '@/components/ui/badge'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'

interface Props {
    element: EditorElement
}

const TextComponent = ({ element }: Props) => {

    const { dispatch, state } = useEditor()

    // DELETE TEXT
    const handleDeleteElement = () => {
        dispatch({ type: 'DELETE_ELEMENT', payload: { elementDetails: element } })
    }

    const styles = element.styles

    // CHANGE SELECTED ELEMENT
    const handleOnClickBody = (e: React.MouseEvent) => {
       e.stopPropagation()
       dispatch({ type: 'CHANGE_CLICKED_ELEMENT', payload: { elementDetails: element } })
    }

    return (
        <div style={styles} className={clsx('p-[2px] w-full m-[5px] relative text-[16px] transition-all', {
              '!border-blue-500': state.editor.selectedElement.id === element.id,
              '!border-solid': state.editor.selectedElement.id === element.id,
              'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
            }
          )} onClick={handleOnClickBody}>
            {/* BADGE WITH THE NAME OF THE SELECTED ELEMENT */}
            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                   {state.editor.selectedElement.name}
                </Badge>
            )}
            {/* CLICK ON THE SCREEN TO EDIT THE TEXT */}
            <span contentEditable={!state.editor.liveMode}
             onBlur={(e) => {
                const spanElement = e.target as HTMLSpanElement
                dispatch({ 
                    type: 'UPDATE_ELEMENT',
                    payload: { elementDetails: {
                         ...element, content: {
                            innerText: spanElement.innerText
                         }}}})
                      }}>
                   {!Array.isArray(element.content) && element.content.innerText}
            </span>
            {/* CLICK TO DELETE THE ELEMENT */}
            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none'>
                   <Trash className='cursor-pointer' size={16} onClick={handleDeleteElement}/>
                </div>
            )}
        </div>
    )
}

export default TextComponent
