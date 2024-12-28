import {forwardRef} from 'react';

import {Action, ActionProps} from '../Action';

export const Handle = forwardRef<HTMLButtonElement, ActionProps>(
  (props, ref) => {
    return (
        <Action
            ref={ref}
            cursor="grab"
            data-cypress="draggable-handle"
            {...props}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="lucide lucide-grip-vertical h-6 w-6 text-gray-400">
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="9" cy="5" r="1"></circle>
                <circle cx="9" cy="19" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <circle cx="15" cy="19" r="1"></circle>
            </svg>
        </Action>
    );
  }
);
