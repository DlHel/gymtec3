'use client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'
import { Location } from '@prisma/client'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface LocationSelectorProps {
  locations: Location[]
  selectedLocation: Location | undefined
  onSelect: (location: Location | undefined) => void
}

export function LocationSelector({
  locations,
  selectedLocation,
  onSelect,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {selectedLocation
            ? locations.find((location) => location.id === selectedLocation.id)
                ?.name
            : 'Seleccionar sede...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar sede..." />
          <CommandList>
            <CommandEmpty>No se encontraron sedes.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.id}
                  value={location.name}
                  onSelect={(currentValue) => {
                    const newSelectedLocation = locations.find(
                      (loc) => loc.name.toLowerCase() === currentValue
                    )
                    onSelect(newSelectedLocation)
                    setOpen(false)
                  }}
                >
                  {location.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 