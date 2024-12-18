import {useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import profileService from "@/services/ProfileService.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useTranslation} from "react-i18next";
import {cn} from "@/lib/utils.ts";


interface AddTeamMemberComboboxPropInterface {
    handleAddMember: (id: string) => void
    projectId: string
}

const AddProjectMemberCombobox: React.FC<AddTeamMemberComboboxPropInterface> = ({handleAddMember, projectId}) => {


    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const {t} = useTranslation()

    const usersList = profileService. usersListWhoDontBelongToTheProjectButBelongToTheTeam(projectId||'')

    const handleOnClick = async (id: string) => {
        if(!id) return
        await handleAddMember(id)
        setValue("")
    }

    return (
        <div className='flex gap-x-3'>

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between font-normal h-8"
                    size="sm"
                >
                    {value
                        ? usersList.userData?.data.find((framework) => framework.user_uuid === value)?.user_name
                        : t('selectUser')}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={t('searchUser')} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{t('noUserFound')}</CommandEmpty>
                        <CommandGroup>
                            {usersList.userData?.data.map((user) => (
                                <CommandItem
                                    key={user.user_uuid}
                                    value={user.user_uuid}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {user.user_name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === user.user_uuid ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

            <Button variant="outline" size="sm" className="h-8" onClick={()=>{handleOnClick(value)}}>
                {t('addMember')}
            </Button>
        </div>

    )
}

export default AddProjectMemberCombobox;
