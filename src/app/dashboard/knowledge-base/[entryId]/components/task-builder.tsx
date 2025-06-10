'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checklist } from '@prisma/client'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { updateChecklistTasks } from './actions'

export interface Task {
  id: string
  text: string
}

interface TaskBuilderProps {
  checklist: Checklist
}

export function TaskBuilder({ checklist }: TaskBuilderProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isPending, startTransition] = useTransition()
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    try {
      const parsedTasks = JSON.parse(checklist.tasks)
      setTasks(Array.isArray(parsedTasks) ? parsedTasks : [])
    } catch {
      setTasks([])
    }
  }, [checklist.tasks])

  const handleAddTask = () => {
    setTasks([...tasks, { id: uuidv4(), text: '' }])
    setIsDirty(true)
  }

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    setIsDirty(true)
  }

  const handleTaskTextChange = (id: string, text: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text } : task))
    )
    setIsDirty(true)
  }

  const handleSaveChanges = () => {
    startTransition(async () => {
      try {
        await updateChecklistTasks({ checklistId: checklist.id, tasks })
        toast.success('Checklist guardado con éxito.')
        setIsDirty(false)
      } catch (error) {
        toast.error('No se pudo guardar el checklist.')
      }
    })
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-2">
            <span className="text-sm font-semibold">{index + 1}.</span>
            <Input
              value={task.text}
              onChange={(e) => handleTaskTextChange(task.id, e.target.value)}
              placeholder="Descripción de la tarea..."
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTask(task.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={handleAddTask}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Tarea
        </Button>
        {isDirty && (
          <Button size="sm" onClick={handleSaveChanges} disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        )}
      </div>
    </div>
  )
} 