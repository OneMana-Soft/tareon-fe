import React, {useEffect, useRef, useState} from "react"
import {Textarea} from "@/components/ui/textarea.tsx";
import {useThrottle} from "@/components/minimal-tiptap/hooks/use-throttle.ts";

interface ResizableTextInputProps {
    delay:number
    content: string
    className?: string
    placeholder?: string
    textUpdate: (content: string) => Promise<void> | void
    textUpdateOnEnter?: (content: string) => Promise<void> | void
}

export default function ResizeableTextInput({delay, content, textUpdate, className, placeholder, textUpdateOnEnter }: ResizableTextInputProps) {

    const throttledSetText = useThrottle((value:string) => updateText?.(value), delay)
    const [localText, setLocalText] = useState(content);
    const taskNameDivRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        setLocalText(content)
    }, [content]);
    const handleTaskNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocalText(e.target.value)
            throttledSetText(e.target.value)
        },
        [throttledSetText]
    )

    useEffect(() => {

        const textarea = taskNameDivRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

    }, [localText]);

    const updateText = async (e: string) => {
        const input = e.trim();

        textUpdate(input)
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && textUpdateOnEnter) {
            e.preventDefault()
            textUpdateOnEnter(localText.trim());
        }
    };

    return (
        <Textarea
            className={'border-0 !min-h-fit shadow-none overflow-hidden resize-none ' + className}
            value={localText}
            required={true}
            onChange={handleTaskNameChange}
            ref={taskNameDivRef}
            placeholder={placeholder}
            rows={1}
            onKeyDown={handleKeyPress}
        />
    )
}