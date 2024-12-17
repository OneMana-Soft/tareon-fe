import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import profileService from "@/services/ProfileService.ts";
import {useTranslation} from "react-i18next";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;

}

export function DataTableFacetedProjectFilter<TData, TValue>({
  column,
  title,

}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const selfUserProfile = profileService.getSelfUserProfile()
  const {t} = useTranslation()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} {t('selected          ')}
                  </Badge>
                ) : selfUserProfile.userData?.data.user_projects && (
                     selfUserProfile.userData?.data.user_projects
                    .filter((option) => selectedValues.has(option.uid))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.uid}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.project_name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('noResultFound')}</CommandEmpty>
            <CommandGroup>
              {selfUserProfile.userData?.data.user_projects && selfUserProfile.userData?.data.user_projects.map((option) => {
                const isSelected = selectedValues.has(option.uid);
                return (
                  <CommandItem
                    key={option.uid}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.uid);
                      } else {
                        selectedValues.add(option.uid);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
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
                    {/*{option.icon && (*/}
                    {/*  <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />*/}
                    {/*)}*/}
                    <span>{option.project_name}</span>
                    {/*{facets?.get(option.value) && (*/}
                    {/*  <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">*/}
                    {/*    {facets.get(option.value)}*/}
                    {/*  </span>*/}
                    {/*)}*/}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    {t('clearFilters')}
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
