import React, {forwardRef} from 'react';

import {Handle, Remove} from '../Item';

import styles from './Container.module.css';
import {cn} from "@/lib/utils.ts";
import {statuses} from "@/components/task/data.tsx";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: Props,
    ref
  ) => {
    const Component = onClick ? 'button' : 'div';

    const status = statuses.find((s) => s.value == label)

    return (
      <Component
        {...props}
        ref={ref as React.Ref<HTMLDivElement & HTMLButtonElement>}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={cn(

          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow,
            "shadow-sm flex !ml-0 !mr-4 flex-col auto-rows-max overflow-hidden box-border appearance-none outline-none min-w-[350px] m-2 rounded min-h-[200px] transition-colors duration-[350ms] ease-in-out border border-solid text-base"
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
            <div className=" p-4 flex items-center justify-between text-center">
                <h2 className="font-semibold inline ">
                    {status?.icon &&
                        <status.icon className='inline mr-2 h-6 w-6'/>}
                    {status?.label}
                    {/*<span*/}
                    {/*    className='text-muted-foreground font-normal'> ({taskInfo.projectData?.data.project_task_count || 0})</span>*/}
                </h2>
                <div className={styles.Actions}>
                    {onRemove ? <Remove onClick={onRemove}/> : undefined}
                    <Handle {...handleProps} />
                </div>

            </div>

        ) : null}
          {placeholder ? children : <ul>{children}</ul>}
      </Component>
    );
  }
);
