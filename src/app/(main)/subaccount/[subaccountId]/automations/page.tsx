import BlurPage from '@/components/global/blur-page'
import React from 'react'

interface Props {
    
}

const Page = (props: Props) => {
    return (
        <BlurPage>
        <div className='flex justify-center items-center h-full'>
            <h1 className='flex justify-center items-center text-4xl text-muted-foreground'>
                This page will be available soon!
            </h1>
        </div>
        </BlurPage>
    )
}

export default Page
