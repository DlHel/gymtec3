"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ServiceLevelAgreement as SLA } from "@prisma/client"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/handle-error"
import { SubmitButton } from "@/components/ui/submit-button"
import { createSla, deleteSla, updateSla } from "../actions"
import { Trash } from "lucide-react"
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const slaFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().optional(),
  responseTimeHours: z.coerce.number().min(1, {
    message: "El tiempo de respuesta debe ser de al menos 1 hora.",
  }),
  resolutionTimeHours: z.coerce.number().min(1, {
    message: "El tiempo de resolución debe ser de al menos 1 hora.",
  }),
})

type SlaFormValues = z.infer<typeof slaFormSchema>

interface SlaFormProps {
  sla?: SLA | null
}

export function SlaForm({ sla }: SlaFormProps) {
  const router = useRouter()
  const form = useForm<SlaFormValues>({
    resolver: zodResolver(slaFormSchema),
    defaultValues: {
      name: sla?.name || "",
      description: sla?.description || "",
      responseTimeHours: sla?.responseTimeHours || 8, // Default a 8 horas
      resolutionTimeHours: sla?.resolutionTimeHours || 24, // Default a 24 horas
    },
  })
    
  const { formState: { isSubmitting } } = form

  async function onSubmit(data: SlaFormValues) {
    try {
        if (sla) {
            await updateSla(sla.id, data)
            toast.success("SLA actualizado correctamente.")
        } else {
            await createSla(data)
            toast.success("SLA creado correctamente.")
        }
    } catch (error) {
        toast.error(getErrorMessage(error))
    }
  }

  async function handleDelete() {
    if (!sla) return
    try {
      await deleteSla(sla.id)
      toast.success("SLA eliminado.")
      router.push("/dashboard/settings/sla")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={sla ? "Editar SLA" : "Crear SLA"}
          description={sla ? "Modifica una plantilla existente." : "Crea una nueva plantilla de SLA."}
        />
        {sla && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará el SLA permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ... form fields are the same ... */}
        </form>
      </Form>
    </>
  )
}
