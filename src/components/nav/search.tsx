import { Input } from "@/components/ui/input.tsx"

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search... ⌘+k"
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}