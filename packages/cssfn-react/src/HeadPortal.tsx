'use client'

// React:
import {
    // Types:
    type JSX,
    type ReactNode,
}                           from 'react'
import {
    // Utilities:
    createPortal,
}                           from 'react-dom'



// React components:

/**
 * Props for the `HeadPortal` component.
 */
export interface HeadPortalProps {
    // Children:
    /**
     * Child elements to be rendered within the `<head>` tag.
     */
    children ?: ReactNode
}

/**
 * A React component that renders its children inside the `<head>` tag using React portals.
 * 
 * - Ensures rendering only occurs client-side.
 * - Returns `null` if `window` is undefined (e.g., during SSR).
 * 
 * @param {HeadPortalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered portal or `null` if unavailable.
 * 
 * @example
 * ```tsx
 * <HeadPortal>
 *   <title>My App</title>
 *   <meta name="description" content="An amazing React app" />
 * </HeadPortal>
 * ```
 */
const HeadPortal = (props: HeadPortalProps): JSX.Element | null => {
    // Props:
    const {
        // Children:
        children,
    } = props;
    
    
    
    // Get document.head safely, ensuring client-side execution:
    const headElm = (typeof window !== 'undefined') ? window?.document?.head : undefined;
    
    
    
    // Jsx:
    if (!headElm) return null;
    return createPortal(
        children,
        headElm
    );
};

export {
    HeadPortal,            // Named export for readability.
    HeadPortal as default, // Default export to support React.lazy.
}
