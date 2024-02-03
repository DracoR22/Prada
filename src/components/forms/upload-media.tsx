'use client'

import { z } from "zod"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import FileUpload from "../global/file-upload"
import { createMedia, saveActivityLogsNotification } from "@/lib/queries"

interface Props {
    subaccountId: string
}

const formSchema = z.object({
    link: z.string().min(1, { message: 'Media File is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
  })
  

const UploadMedia = ({ subaccountId }: Props) => {

   const { toast } = useToast()

   const router = useRouter()

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      link: '',
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
        const response = await createMedia(subaccountId, values)
        await saveActivityLogsNotification({agencyId: undefined, description: `Upload a media file | ${response.name}`, subaccountId})

        toast({ title: 'Success', description: 'Uploaded media' })
        router.refresh()
     } catch (error) {
        console.log(error)
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not uploaded media',
        })
     }
  }

    return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Media Information</CardTitle>
            <CardDescription>
                Please enter the details for your file
            </CardDescription>
          </CardHeader>
          <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint="subaccountLogo" value={field.value} onChange={field.onChange}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
        </Card>
    )
}

export default UploadMedia
