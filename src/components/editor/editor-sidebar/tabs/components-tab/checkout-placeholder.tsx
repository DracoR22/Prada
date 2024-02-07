import { EditorBtns } from '@/lib/constants'
import Image from 'next/image'
import React from 'react'

type Props = {}

const CheckoutPlaceholder = (props: Props) => {

  // WITH THIS WE CAN DRAG IT TO THE RECURSIVE COMPONENT
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }
  return (
    <div draggable onDragStart={(e) => handleDragStart(e, 'paymentForm')} className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab">
      <Image src="/stripelogo.png" height={40} width={40} alt="stripe logo" className="object-cover"/>
    </div>
  )
}

export default CheckoutPlaceholder