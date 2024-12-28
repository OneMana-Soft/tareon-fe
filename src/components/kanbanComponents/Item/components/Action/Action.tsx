import React, {forwardRef, CSSProperties} from 'react';

import styles from './Action.module.css';
import {cn} from "@/lib/utils.ts";

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties['cursor'];
}

export const Action = forwardRef<HTMLButtonElement, Props>(
  ({active, className, cursor, style, ...props}, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(styles.Action, className)}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            '--fill': active?.fill,
            '--background': active?.background,
          } as CSSProperties
        }
      />
    );
  }
);
