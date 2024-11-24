import React, {useCallback} from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TaskInfoInterface } from "@/services/TaskService.ts";
import {isZeroEpoch, removeHtmlTags} from "@/utils/Helper.ts";
import {ListFilter, Pencil} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {useDispatch} from "react-redux";
import {openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {CheckIcon, PlusCircledIcon} from "@radix-ui/react-icons";
import {Separator} from "@/components/ui/separator.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command.tsx";
import {cn} from "@/lib/utils.ts";
import {priorities} from "@/components/task/data.tsx";

type TaskCardProps = {
    activeList: string[];
    updateList: (l: string[])=>void;
};

export function TaskKanbanColumnPriorityFilter({ activeList, updateList}: TaskCardProps) {



    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size='icon' variant={'ghost'}>
                    <ListFilter />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={'priorities'} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {priorities.map((option) => {
                                const isSelected = activeList.includes(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                updateList(activeList.filter((item) => item !== option.value))
                                            } else {
                                                updateList([...activeList, option.value])
                                            }

                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className={cn("h-4 w-4")} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span>{option.label}</span>
                                        {/*{facets?.get(option.value) && (*/}
                                        {/*  <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">*/}
                                        {/*    {facets.get(option.value)}*/}
                                        {/*  </span>*/}
                                        {/*)}*/}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {activeList.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => updateList([])}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}