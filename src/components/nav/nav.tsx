"use client";

import {ChevronDown, ChevronRight, LucideIcon, Plus} from "lucide-react";

import { cn } from "@/lib/utils.ts";
import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {useNavigate} from "react-router-dom";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon?: LucideIcon;
    variant?: "default" | "ghost";
    path?: string;
    action?:(()=>void)|undefined
    isOpen?: boolean;
    setIsOpen?:(b:boolean)=>void
    children?:{
      title: string;
      path: string
      variant?: "default" | "ghost";
    }[]
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {

    const navigate = useNavigate();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? !link.children && (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  onClick={()=>{navigate(link.path||'')}}
                  className={cn("hover:cursor-pointer",
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-10 w-10",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  {link?.icon && <link.icon className="h-4 w-4" />}
                  <span className="sr-only">{link.title}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
              link.children ?
                  <div key={index}>
                    <Collapsible
                        open={link.isOpen}
                        onOpenChange={link.setIsOpen}
                        className="w-full "
                    >
                      <div className="flex items-center justify-between space-x-4 px-2">
                        <div className="flex items-center">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon">
                              {link.isOpen ? (
                                  <ChevronDown  />
                              ) : (
                                  <ChevronRight  />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                          <span className=" text-xs font-semibold">
                          {link.title}
                        </span>
                        </div>
                        <div>
                          {link.action && <Button variant="ghost" size="icon" onClick={link.action}>
                            <Plus className='size-2'/>
                          </Button>}
                        </div>

                      </div>
                      <CollapsibleContent className=" pl-10">
                        {link.children.map((ch,chIn)=>{

                          return(
                              <div
                                  key={chIn}
                                  onClick={()=>{navigate(ch.path||'')}}
                                  className={cn("hover:cursor-pointer w-full",
                                      buttonVariants({ variant: ch.variant, size: "sm" }),
                                      ch.variant === "default" &&
                                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                      "justify-start"
                                  )}
                              >
                                {ch.title}

                              </div>
                          )

                        })}

                      </CollapsibleContent>
                    </Collapsible>

                  </div>
                  :
            <div
              key={index}
              onClick={()=>{navigate(link.path||'')}}
              className={cn("hover:cursor-pointer",
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              {link.icon && <link.icon className="mr-2 h-4 w-4" />}
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </div>
          )
        )}
      </nav>
    </div>
  );
}
