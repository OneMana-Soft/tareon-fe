import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem, CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { appLangList } from "@/constants/dailog/const"
import { useTranslation } from "react-i18next"
import {useState} from "react";

interface AppLanguageComboboxProps {
    userLang?: string;
    onLangChange: (c: string) => void;
}

export function AppLanguageCombobox({ userLang, onLangChange }: AppLanguageComboboxProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>(userLang || 'en')

    const { t } = useTranslation()

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
                        {value && appLangList[value]
                            ? appLangList[value].name
                            : t('selectedLanguagePlaceholder')}
                        <ChevronsUpDown className="opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder={t('searchUser')} className="h-9"/>
                        <CommandList>
                            <CommandEmpty>{t('noUserFound')}</CommandEmpty>
                            <CommandGroup>
                                {Object.values(appLangList).map((e) => (<CommandItem
                                            key={e.code}
                                            onSelect={() => {
                                                setValue(e.code)
                                                setOpen(false)
                                                if (onLangChange) {
                                                    onLangChange(e.code)
                                                }
                                            }}
                                        >
                                        {e.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === e.code? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

        </div>

)
}

