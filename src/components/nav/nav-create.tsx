import {CircleCheck, CirclePlus, ClipboardList, Moon, Sun, Users} from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { useTheme } from "@/components/theme-provider.tsx"
import * as React from "react";
import {useDispatch} from "react-redux";
import {openCreateProjectPopup, openCreateTaskPopup, openCreateTeamPopup} from "@/store/slice/popupSlice.ts";

export function NavCreate() {
    const { setTheme } = useTheme()

    const dispatch = useDispatch()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <CirclePlus className='mr-2 h-4 w-4'/>{" "}Create
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
                <DropdownMenuItem onClick={() => dispatch(openCreateTaskPopup())}>
                    <CircleCheck className='mr-2 h-4 w-4'/>Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(openCreateProjectPopup())}>
                    <ClipboardList className='mr-2 h-4 w-4'/>Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dispatch(openCreateTeamPopup())}>
                    <Users className='mr-2 h-4 w-4' />Team
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
