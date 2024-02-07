'use client'

import Loading from "@/components/global/loading"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { EditorBtns } from "@/lib/constants"
import { getFunnel, getSubaccountDetails } from "@/lib/queries"
import { getStripe } from "@/lib/stripe/stripe-client"
import { EditorElement, useEditor } from "@/providers/editor/editor-provider"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import clsx from "clsx"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

interface Props {
    element: EditorElement
}

const Checkout = ({ element }: Props) => {

    const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor()
    const router = useRouter()

    const [clientSecret, setClientSecret] = useState<string>('')
    const [livePrices, setLivePrices] = useState([])
    const [subAccountConnectAccId, setSubAccountConnectAccId] = useState<string>('')

    // OPTIONS FOR PAYMENT FORM
    const options = useMemo(() => ({ clientSecret }), [clientSecret])

    const styles = element.styles

    // GET SUBACCOUNT STRIPE ACCOUNT TO CONNECT
    useEffect(() => {
        if (!subaccountId) return
        const fetchData = async () => {
          const subaccountDetails = await getSubaccountDetails(subaccountId)
          if (subaccountDetails) {
            if (!subaccountDetails.connectAccountId) return
               setSubAccountConnectAccId(subaccountDetails.connectAccountId)
          }
        }
        fetchData()
      }, [subaccountId])
    
      // GET ALL SUBACCOUNT STRIPE PRICES
      useEffect(() => {
        if (funnelId) {
          const fetchData = async () => {
            const funnelData = await getFunnel(funnelId)
            setLivePrices(JSON.parse(funnelData?.liveProducts || '[]'))
          }
          fetchData()
        }
      }, [funnelId])


      // GET THE CLIENT SECRET
      useEffect(() => {
        if (livePrices.length && subaccountId && subAccountConnectAccId) {
          const getClientSercet = async () => {
            try {
              const body = JSON.stringify({
                subAccountConnectAccId,
                prices: livePrices,
                subaccountId,
              })

              const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body,
                }
              )

              const responseJson = await response.json()
              console.log(responseJson)

              if (!responseJson) throw new Error('somethign went wrong')
              if (responseJson.error) {
                throw new Error(responseJson.error)
              }

              if (responseJson.clientSecret) {
                setClientSecret(responseJson.clientSecret)
              }
            } catch (error) {
              toast({
                open: true,
                className: 'z-[100000]',
                variant: 'destructive',
                title: 'Oppse!',
                //@ts-ignore
                description: error.message,
              })
            }
          }
          getClientSercet()
        }
      }, [livePrices, subaccountId, subAccountConnectAccId])

      // DRAG AND DROP ELEMENT INSIDE EDITOR
      const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        e.dataTransfer.setData('componentType', type)
      }
    
       // SELECT CLICKED ELEMENT
      const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
          type: 'CHANGE_CLICKED_ELEMENT',
          payload: {
            elementDetails: element,
          },
        })
      }

      // NAVIGATE TO NEXTPAGE
      const goToNextPage = async () => {
        if (!state.editor.liveMode) return
        const funnelPages = await getFunnel(funnelId)
        if (!funnelPages || !pageDetails) return
        if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
          console.log(funnelPages.FunnelPages.length, pageDetails.order + 1)
          const nextPage = funnelPages.FunnelPages.find(
            (page) => page.order === pageDetails.order + 1
          )
          if (!nextPage) return
          router.replace(
            `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
          )
        }
      }
    
      // DELETE ELEMENT
      const handleDeleteElement = () => {
        dispatch({
          type: 'DELETE_ELEMENT',
          payload: { elementDetails: element },
        })
      }

    return (
        <div style={styles}
        draggable onDragStart={(e) => handleDragStart(e, 'paymentForm')} onClick={handleOnClickBody}
        className={clsx('p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center', {
            '!border-blue-500': state.editor.selectedElement.id === element.id,
            '!border-solid': state.editor.selectedElement.id === element.id,
            'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
          }
          )}>
            
        {/* BADGE WITH ELEMENT TYPE */}
         {state.editor.selectedElement.id === element.id &&  !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
         )}


        {/* STRIPE CHECKOUT FORM */}
        <div className="border-none transition-all w-full">
        <div className="flex flex-col gap-4 w-full">
          {options.clientSecret && subAccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider stripe={getStripe(subAccountConnectAccId)} options={options}>
                <EmbeddedCheckout/>
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {!options.clientSecret && (
            <div className="flex items-center justify-center w-full h-40">
              <Loading/>
            </div>
          )}
          </div>
       </div>


        {/* DELETE ELEMENT */}
          {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement}/>
          </div>
        )}
        </div>
    )
}

export default Checkout
