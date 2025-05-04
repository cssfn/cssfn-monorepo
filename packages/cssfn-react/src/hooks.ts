// React:
import {
    // Hooks:
    useReducer,
    useLayoutEffect,
    useEffect,
    useRef,
}                           from 'react'

// Utilities:
import {
    // Tests:
    isClientSide,
}                           from './utilities.js'



// Hooks:

/**
 * Reducer function used to trigger a forced re-render.
 * Always returns a **new unique value** to ensure React updates.
 * 
 * @returns {symbol} A unique identifier for state updates.
 */
const triggerRenderReducer = (_state: symbol, _action: void): symbol => {
    // Returning a symbol ensures a forced re-render:
    return Symbol();
};

/**
 * Custom React hook to manually trigger a component re-render.
 * Useful for cases where state updates aren't automatic.
 * 
 * @returns {[() => void, symbol]} A tuple containing the trigger function and the current state stamp.
 * 
 * @example
 * const [triggerRender, stateStamp] = useTriggerRender();
 * triggerRender(); // Forces a re-render
 */
export const useTriggerRender = () => {
    const [stateStamp, setState] = useReducer(triggerRenderReducer, Symbol());
    return [setState, stateStamp] satisfies readonly [() => void, symbol];
};

/**
 * A React hook that intelligently switches between `useLayoutEffect` and `useEffect`.
 * - Uses `useLayoutEffect` for synchronous updates **only in the browser** (client-side).
 * - Falls back to `useEffect` on the server to avoid unnecessary execution during SSR.
 * - Useful for effects that must run **before paint** in client-side rendering.
 * 
 * @example
 * useIsomorphicLayoutEffect(() => {
 *    console.log("Runs only when the component mounts!");
 * }, []);
 */
export const useIsomorphicLayoutEffect = isClientSide ? useLayoutEffect : useEffect;



/**
 * Tracks the mounted status of a React component.
 * 
 * - `undefined`: Component has never been mounted.
 * - `true`: Component is currently mounted.
 * - `false`: Component is unmounted.
 *
 * @returns {React.MutableRefObject<boolean | undefined>} A ref containing the mounted status.
 */
export const useMountedFlag = () => {
    // Tracking mount status:
    const isMounted = useRef<boolean | undefined>(undefined); // Initially uninitialized (never mounted).
    
    
    
    // Effect to update mount status:
    useIsomorphicLayoutEffect(() => {
        // Setups:
        isMounted.current = true; // Mark as mounted.
        
        
        
        // Cleanups:
        return () => {
            isMounted.current = false; // Mark as unmounted.
        };
    }, []);
    
    
    
    // Returns the reference of mounted status flag:
    return isMounted;
};
