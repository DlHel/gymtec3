"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/app/dashboard/tickets/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  content: z.string().min(1, "El comentario no puede estar vacío."),
})

interface CommentFormProps {
  ticketId: string
}

export default function CommentForm({ ticketId }: CommentFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addComment(ticketId, values.content)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Comentario agregado exitosamente.")
      form.reset()
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Escribe un comentario..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Comentar</Button>
      </form>
    </Form>
  )
} 