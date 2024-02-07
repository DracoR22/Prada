'use client'

import { EditorBtns } from "@/lib/constants"
import { EditorElement, useEditor } from "@/providers/editor/editor-provider"
import clsx from "clsx"
import { v4 } from "uuid"
import { defaultStyles } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import RecursiveComponent from "./recursive"
import { Trash } from "lucide-react"

interface Props {
    element: EditorElement
}

const Container = ({ element }: Props) => {

     const { content, id, name, styles, type } = element
     
     const { dispatch, state } = useEditor()

     // DRAG AND DROP FROM THE SIDEBAR OR FROM THE EDITOR
     const handleOnDrop = (e: React.DragEvent, type: string) => {
        e.stopPropagation()
        const componentType = e.dataTransfer.getData('componentType') as EditorBtns
        // HERE WE CHECK WHICH TYPE OF ELEMENT WE ARE DRAGGING AND ADD THE CORRESPONDING DISPATCH TO IT
        switch (componentType) {
          case 'text':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                  // @ts-ignore
                  content: { innerText: state.editor.selectedElement.content.innerText  ? state.editor.selectedElement.content.innerText : 'Text Element' },
                  id: v4(),
                  name: 'Text',
                  styles: state.editor.selectedElement.styles  ? state.editor.selectedElement.styles : {
                     color: 'black',
                    ...defaultStyles,
                  },
                  type: 'text',
                },
              },
            })
            break
          case 'link':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                  content: {
                    //@ts-ignore
                    innerText: state.editor.selectedElement.content.innerText  ? state.editor.selectedElement.content.innerText : 'Link element',
                    //@ts-ignore
                    href: state.editor.selectedElement.content.href  ? state.editor.selectedElement.content.href : '#'
                  },
                  id: v4(),
                  name: 'Link',
                  styles: state.editor.selectedElement.styles  ? state.editor.selectedElement.styles : {
                    color: 'black',
                   ...defaultStyles,
                 },
                  type: 'link',
                },
              },
            })
            break
          case 'video':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                  content: {
                    // @ts-ignore
                    src: state.editor.selectedElement.content.src  ? state.editor.selectedElement.content.src : 'https://www.youtube.com/embed/i9t8gdaBsTg?si=ZbDPkKtrZ-oWZa8O',
                  },
                  id: v4(),
                  name: 'Video',
                  styles: {},
                  type: 'video',
                },
              },
            })
            break
          case 'container':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                   // CLONED CONTENT CHILDREN DISABLED DUE TO A BUG
                  content:  [],  // state.editor.selectedElement.content && state.editor.selectedElement.type !== '__body'  ? state.editor.selectedElement.content :
                  id: v4(),
                  name: 'Container',
                  styles:  { ...defaultStyles },
                  type: 'container',
                },
              },
            })
            break
          case 'contactForm':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                  content: [],
                  id: v4(),
                  name: 'Contact Form',
                  styles: state.editor.selectedElement.styles  ? state.editor.selectedElement.styles : {},
                  type: 'contactForm',
                },
              },
            })
            break
          case 'paymentForm':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                  content: [],
                  id: v4(),
                  name: 'Payment Form',
                  styles: state.editor.selectedElement.styles ? state.editor.selectedElement.styles : {},
                  type: 'paymentForm',
                },
              },
            })
            break
          case '2Col':
            dispatch({
              type: 'ADD_ELEMENT',
              payload: {
                containerId: id,
                elementDetails: {
                   // CLONED CONTENT CHILDREN DISABLED DUE TO A BUG
                  content: [
                    {
                      content: [], //state.editor.selectedElement.content && state.editor.selectedElement.type !== '__body'  ? state.editor.selectedElement.content :
                      id: v4(),
                      name: 'Container',
                      styles: { ...defaultStyles, width: '100%' },
                      type: 'container',
                    },
                    {
                      content:  [], // state.editor.selectedElement.content && state.editor.selectedElement.type !== '__body'  ? state.editor.selectedElement.content : 
                      id: v4(),
                      name: 'Container',
                      styles: { ...defaultStyles, width: '100%' },
                      type: 'container',
                    },
                  ],
                  id: v4(),
                  name: 'Two Columns',
                  styles: { ...defaultStyles, display: 'flex' },
                  type: '2Col',
                },
              },
            })
            break
        }
  
      }
    
      const handleDragOver = (e: React.DragEvent) => {
        if (state.editor.liveMode === true) return
        e.preventDefault()
      }

      // DRAG AND DROP ELEMENT INSIDE EDITOR
      const handleDragStart = (e: React.DragEvent, type: string) => {
         if (type === '__body') return
          
         e.dataTransfer.setData('componentType', type)
      }

      // SELECT CLICKED ELEMENT
      const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        
        dispatch({ type: 'CHANGE_CLICKED_ELEMENT', payload: { elementDetails: element },
        })
      }

      // DELETE ELEMENT
      const handleDeleteElement = () => {
        dispatch({ type: 'DELETE_ELEMENT', payload: { elementDetails: element }})
      }
    
    return (
      <>
      {/* REMOVED DRAGGABLE AND ALL DRAG AND DROP ATTRIBUTES IF THE PAGE IS IN LIVE MODE */}
        {state.editor.liveMode ? (
            <div style={styles} className={clsx('relative p-4 transition-all group', {
              'max-w-full w-full': type === 'container' || type === '2Col',
              'h-fit': type === 'container',
              'h-full': type === '__body',
              'overflow-scroll': type === '__body',
              'pb-[250px]': type === '__body' && !state.editor.liveMode && !state.editor.previewMode,
              'flex flex-col md:!flex-row': type === '2Col',
              '!border-blue-500':
                state.editor.selectedElement.id === id &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== '__body',
              '!border-yellow-400 !border-4':
                state.editor.selectedElement.id === id &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type === '__body',
              '!border-solid': state.editor.selectedElement.id === id && !state.editor.liveMode,
              'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
            })} >
  
              {/* BADGE WITH THE NAME OF THE SELECTED ELEMENT */}
              <Badge className={clsx('absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden', {
                 block: state.editor.selectedElement.id === element.id && !state.editor.liveMode })}>
                  {element.name}
              </Badge>
  
             {/* CALL THE RECURSIVE COMPONENT IN CASE WE HAVE A NESTED CONTAINER */}
              {Array.isArray(content) && content.map((childElement) => (
                  <RecursiveComponent key={childElement.id} element={childElement}/>
              ))}
  
             {/* CLICK TO DELETE THE ELEMENT */}
             {state.editor.selectedElement.id === element.id && !state.editor.liveMode && state.editor.selectedElement.type !== '__body' && (
             <div className="text-white absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
                <Trash size={16} onClick={handleDeleteElement}/>
             </div>
          )}
  
          </div>
        ) : (
          <div style={styles} className={clsx('relative p-4 transition-all group', {
            'max-w-full w-full': type === 'container' || type === '2Col',
            'h-fit': type === 'container',
            'h-full': type === '__body',
            'overflow-scroll': type === '__body',
            'pb-[250px]': type === '__body' && !state.editor.liveMode && !state.editor.previewMode,
            'flex flex-col md:!flex-row': type === '2Col',
            '!border-blue-500':
              state.editor.selectedElement.id === id &&
              !state.editor.liveMode &&
              state.editor.selectedElement.type !== '__body',
            '!border-yellow-400 !border-4':
              state.editor.selectedElement.id === id &&
              !state.editor.liveMode &&
              state.editor.selectedElement.type === '__body',
            '!border-solid': state.editor.selectedElement.id === id && !state.editor.liveMode,
            'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
          })} onDrop={(e) => handleOnDrop(e, id)} onDragOver={handleDragOver} draggable={type !== '__body'}
          onDragStart={(e) => handleDragStart(e, state.editor.selectedElement.type ? state.editor.selectedElement.type : 'container')} onClick={handleOnClickBody}>

            {/* BADGE WITH THE NAME OF THE SELECTED ELEMENT */}
            <Badge className={clsx('absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden', {
               block: state.editor.selectedElement.id === element.id && !state.editor.liveMode })}>
                {element.name}
            </Badge>

           {/* CALL THE RECURSIVE COMPONENT IN CASE WE HAVE A NESTED CONTAINER */}
            {Array.isArray(content) && content.map((childElement) => (
                <RecursiveComponent key={childElement.id} element={childElement}/>
            ))}

           {/* CLICK TO DELETE THE ELEMENT */}
           {state.editor.selectedElement.id === element.id && !state.editor.liveMode && state.editor.selectedElement.type !== '__body' && (
           <div className="text-white absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
              <Trash size={16} onClick={handleDeleteElement}/>
           </div>
        )}

        </div>
        )}
      </>
    )
}

export default Container
