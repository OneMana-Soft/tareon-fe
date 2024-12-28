import React, {useEffect} from 'react';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

import {Handle, Remove} from './components';

import styles from './Item.module.css';
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {GitBranch, MessageSquare, Pencil} from "lucide-react";
import {isZeroEpoch, removeHtmlTags} from "@/utils/Helper.ts";
import {format} from "date-fns";
import {TaskInfoInterface} from "@/services/TaskService.ts";
import {priorities} from "@/components/task/data.tsx";
import {useDispatch} from "react-redux";
import {openSideBarTaskInfo} from "@/store/slice/popupSlice.ts";

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  task: TaskInfoInterface
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props['transform'];
    transition: Props['transition'];
    value: Props['value'];
  }): React.ReactElement;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
          task,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      const taskP = priorities.find(p => p.value == task.task_priority)
        const dispatch = useDispatch()

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
          <li
              className={cn(
                  styles.Wrapper,
                  fadeIn && styles.fadeIn,
                  sorting && styles.sorting,
                  dragOverlay && styles.dragOverlay,
              )}
              style={{
                  ...wrapperStyle,
                  transition: [transition, wrapperStyle?.transition]
                      .filter(Boolean)
                      .join(', '),
                  '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
                  '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
                  '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
                  '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
                  '--index': index,
                  '--color': color,
              } as React.CSSProperties}
              ref={ref}
          >
              <div
                  className={cn(
                      styles.Item,
                      dragging && styles.dragging,
                      handle && styles.withHandle,
                      dragOverlay && styles.dragOverlay,
                      disabled && styles.disabled,
                      color && styles.color,
                      "border rounded-lg bg-background w-full cursor-grab group"
                  )}
                  style={style}
                  data-cypress="draggable-item"
                  {...(!handle ? listeners : undefined)}
                  {...props}
                  tabIndex={!handle ? 0 : undefined}
              >
                  <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                          <span className="font-medium">{task.task_name}</span>
                          {taskP && (
                              <span className="text-muted-foreground">
                                <taskP.icon className="h-4 w-4"/>
                              </span>
                          )}
                      </div>
                      <Button
                          size='icon'
                          variant='outline'
                          className='invisible group-hover:visible'
                          onPointerDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                          }}
                          onClick={(e) => {
                              e.stopPropagation();
                              dispatch(openSideBarTaskInfo({taskId:task.task_uuid}));
                          }}
                      >
                          <Pencil size={4}/>
                      </Button>
                  </div>

                  {task.task_description && (
                      <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {removeHtmlTags(task.task_description)}
                      </div>
                  )}

                  <div className="flex items-center justify-between ">
                      <div>
                          {!isZeroEpoch(task.task_due_date) && (
                              <div
                                  className={cn(
                                      "text-xs",
                                      new Date(task.task_due_date) < new Date() && "text-destructive"
                                  )}
                              >
                                  {format(new Date(task.task_due_date), "dd MMM yyyy")}
                              </div>
                          )}
                      </div>

                      <div className="flex items-center gap-3">
                          {task.task_comment_count > 0 && (
                              <span className="text-muted-foreground text-sm flex items-center gap-1">
                                {task.task_comment_count}
                                                      <MessageSquare className="h-3 w-3"/>
                              </span>
                          )}
                          {task.task_sub_task_count > 0 && (
                              <span className="text-muted-foreground text-sm flex items-center gap-1">
                                {task.task_sub_task_count}
                                                      <GitBranch className="h-3 w-3"/>
                              </span>
                          )}
                      </div>
                  </div>

                  <span className={styles.Actions}>
      {onRemove && <Remove className={styles.Remove} onClick={onRemove}/>}
                      {handle && <Handle {...handleProps} {...listeners} />}
    </span>
              </div>
          </li>


      );
    }
  )
);
