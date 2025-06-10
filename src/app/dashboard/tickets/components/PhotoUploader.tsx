'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// TODO: Implementar la carga de archivos al servicio de almacenamiento (ej. S3, Cloudinary)
// Esta es una server action simulada.
async function uploadPhotoAction(ticketId: string, formData: FormData) {
  console.log('Uploading photo for ticket:', ticketId)
  // Aquí iría la lógica para:
  // 1. Obtener una URL firmada de tu servicio de almacenamiento.
  // 2. Subir el archivo a esa URL.
  // 3. Guardar la URL y la descripción en la base de datos con prisma.photo.create().
  const file = formData.get('photo') as File
  const description = formData.get('description') as string
  
  if (!file) {
    return { error: 'No se ha seleccionado ningún archivo.' }
  }
  
  // Simulación de éxito
  console.log(`Simulated upload of ${file.name} with description: "${description}"`)
  return { success: true, url: URL.createObjectURL(file) }
}

const formSchema = z.object({
  photo: z.any().refine(file => file instanceof File, "Se requiere un archivo."),
  description: z.string().optional(),
})

interface PhotoUploaderProps {
  ticketId: string
}

export default function PhotoUploader({ ticketId }: PhotoUploaderProps) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue('photo', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append('photo', values.photo)
    formData.append('description', values.description || '')

    const result = await uploadPhotoAction(ticketId, formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Foto subida exitosamente (simulado).')
      form.reset()
      setPreview(null)
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar Foto</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Vista previa" className="max-w-xs rounded-md" />
          </div>
        )}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Añade una nota sobre la foto..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!preview}>Subir Foto</Button>
      </form>
    </Form>
  )
} 