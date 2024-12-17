'use client'

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { EditorContent } from "@tiptap/react"
import { Content, Editor } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SectionOne } from "@/components/minimal-tiptap/components/section/one"
import { SectionTwo } from "@/components/minimal-tiptap/components/section/two"
import { SectionThree } from "@/components/minimal-tiptap/components/section/three"
import { SectionFour } from "@/components/minimal-tiptap/components/section/four"
import { SectionFive } from "@/components/minimal-tiptap/components/section/five"
import { LinkBubbleMenu } from "@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu"
import { ImageBubbleMenu } from "@/components/minimal-tiptap/components/bubble-menu/image-bubble-menu"
import {
  useMinimalTiptapEditor,
  UseMinimalTiptapEditorProps,
} from "@/components/minimal-tiptap/hooks/use-minimal-tiptap"

import "@/components/minimal-tiptap/styles/index.css"
import {openOtherUserProfilePopup} from "@/store/slice/popupSlice.ts";
import {useDispatch} from "react-redux";

export interface MinimalTiptapProps
    extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  buttonLabel?: string
  buttonOnclick?: () => (Promise<void> | void)
  secondaryButtonLabel?: string
  secondaryButtonOnclick?: () => (Promise<void> | void)
}

const Toolbar = ({ editor }: { editor: Editor }) => (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
      <div className="flex w-max items-center gap-px justify-between">
        <SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="outline" />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionTwo
            editor={editor}
            activeActions={["italic", "bold", "code", "strikethrough", "clearFormatting"]}
            mainActionCount={5}
            variant="outline"
        />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionThree editor={editor} variant="outline" />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionFour
            editor={editor}
            activeActions={["bulletList", "orderedList"]}
            mainActionCount={2}
            variant="outline"
        />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionFive
            editor={editor}
            activeActions={["blockquote", "codeBlock", "horizontalRule"]}
            mainActionCount={3}
            variant="outline"
        />
      </div>
    </div>
)

export const MinimalTiptapTask = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
    (
        { value, onChange, className, buttonLabel, buttonOnclick, secondaryButtonLabel, secondaryButtonOnclick, editable, editorContentClassName, content, ...props },
        ref
    ) => {
      const editor = useMinimalTiptapEditor({
        value,
        onUpdate: onChange,
        ...props,
      })

      // secondaryButtonLabel?: string
      // secondaryButtonOnclick?: () => Promise<void> | undefined



      const [isActive, setIsActive] = useState(false)
      const toolbarRef = useRef<HTMLDivElement>(null)
      const dispatch = useDispatch()
      const divRef = useRef<HTMLDivElement>(null);


      useEffect(() => {
        if (divRef.current) {
          divRef.current.addEventListener("click", handleMentionClick);
        }
        return () => {
          if (divRef.current) {
            divRef.current.removeEventListener("click", handleMentionClick);
          }
        };
      }, []);

      const handleMentionClick = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (target.classList.contains("mention")) {
          const userId = target.getAttribute("data-id")?.split("@")[0];
          if (userId) {
            dispatch(openOtherUserProfilePopup({userId: userId}));
          }
        }
      };

      useEffect(() => {
        if (editor) {
          const c  = content as string
          if(content !== undefined && editor.getHTML() !== c.trim()) {
            editor.commands.setContent(content || "")

          }

          editor.setEditable(editable||false)

          const handleFocus = () => setIsActive(true)
          const handleBlur = () => {
            if (toolbarRef.current ) {
              setIsActive(false)
            }
          }

          editor.on('focus', handleFocus)
          editor.on('blur', handleBlur)

          return () => {
            editor.off('focus', handleFocus)
            editor.off('blur', handleBlur)
          }

        }
      }, [editor, content, editable])

      const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
      }

      if (!editor) {
        return null
      }

      return (
          <div
              ref={ref}
              className={cn(
                  "flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
                  className
              )}
          >
            <EditorContent
                editor={editor}
                className={cn("minimal-tiptap-editor min-h-2 overflow-auto", editorContentClassName)}
                content={content as string}
                ref={divRef}
            />
            {isActive && editor.isEditable && (
                <div ref={toolbarRef} onMouseDown={handleMouseDown}>
                  <div className="flex justify-between mr-2">
                    <Toolbar editor={editor} />
                    <div className='flex gap-x-2'>
                      {secondaryButtonLabel && secondaryButtonOnclick && <Button onClick={secondaryButtonOnclick} variant='outline'>{secondaryButtonLabel}</Button>}
                      {buttonLabel && buttonOnclick && <Button onClick={buttonOnclick}>{buttonLabel}</Button>}

                    </div>

                  </div>
                  <LinkBubbleMenu editor={editor} />
                  <ImageBubbleMenu editor={editor} />
                </div>
            )}
          </div>
      )
    }
)

MinimalTiptapTask.displayName = "MinimalTiptapTask"

export default MinimalTiptapTask