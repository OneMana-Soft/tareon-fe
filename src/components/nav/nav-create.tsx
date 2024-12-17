import {CircleCheck, CirclePlus, ClipboardList, Users} from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {useDispatch} from "react-redux";
import {openCreateProjectPopup, openCreateTaskPopup, openCreateTeamPopup} from "@/store/slice/popupSlice.ts";
import {useTranslation} from "react-i18next";


interface NavCreateProp {
    isAdmin: boolean
}

export function NavCreate({isAdmin}: NavCreateProp) {

    const dispatch = useDispatch()
    const {t} = useTranslation()


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <CirclePlus className='mr-2 h-4 w-4'/>{" "}{t('create')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
                <DropdownMenuItem onClick={() => dispatch(openCreateTaskPopup())}>
                    <CircleCheck className='mr-2 h-4 w-4'/>{t('task')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(openCreateProjectPopup())}>
                    <ClipboardList className='mr-2 h-4 w-4'/>{t('project')}
                </DropdownMenuItem>
                {isAdmin &&
                <DropdownMenuItem onClick={() => dispatch(openCreateTeamPopup())}>
                    <Users className='mr-2 h-4 w-4' />{t('team')}
                </DropdownMenuItem>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
