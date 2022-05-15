// cssfn:
import {
    // react:
    default as React,
    
    
    
    // types:
    FC,
    ReactElement,
    
    
    
    // hooks:
    useState,
    useLayoutEffect,
    useEffect,
    useReducer,
    useRef,
    
    
    
    // hocs:
    memo,
}                           from 'react'

// cssfn:
import type {
    StyleSheet,
}                           from '@cssfn/cssfn'
import {
    styleSheetRegistry,
}                           from '@cssfn/cssfn/dist/styleSheets.js'
import {
    render,
}                           from '@cssfn/cssfn/dist/renders.js'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// hooks:
const useIsomorphicLayoutEffect = isClientSide ? useLayoutEffect : useEffect;

const triggerRenderReducer = (indices: object, newIndices: void): object => {
    return {}; // update with a new object
};
export const useTriggerRender = () => {
    const [, setState] = useReducer(triggerRenderReducer, {});
    return setState;
};



// react components:
interface StyleContent {
    rendered : string|null
}
interface StyleProps {
    content : StyleContent
}
const Style : FC<StyleProps> = memo(({ content }: StyleProps) => {
    // because the `rendered` may a_huge_string, we need to *unreference* it:
    const rendered = content.rendered; // copy        the props' rendered
    content.rendered = null;           // unreference the props' rendered
    
    // jsx:
    return (
        <style>
            { rendered }
        </style>
    );
});

export const Styles : FC = () => {
    // states:
    const [pendingUpdates] = useState<Set<StyleSheet>>(() => new Set());
    const [styles        ] = useState<Map<StyleSheet, ReactElement<StyleProps, typeof Style>>>(() => new Map());
    const styleKeyCounter  = useRef(0);
    const triggerRender    = useTriggerRender();
    
    
    
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // handlers:
        const handleUpdate = (styleSheet: StyleSheet): void => {
            pendingUpdates.add(styleSheet);
            triggerRender();
        };
        
        
        
        // setups:
        const unsubscribe = styleSheetRegistry.subscribe(handleUpdate);
        
        
        
        // cleanups:
        return () => {
            unsubscribe?.unsubscribe();
        };
    }, []); // runs once on startup
    
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!pendingUpdates.size) return;
        
        
        
        // pop the queued:
        const styleSheets = Array.from(pendingUpdates.values());
        pendingUpdates.clear();
        
        
        
        // render all:
        const updates = styleSheets.map((styleSheet): readonly [StyleSheet, string|null] => [
            styleSheet,
            (styleSheet.enabled || null) && render(styleSheet)
        ]);
        
        
        
        // apply all:
        for (const [styleSheet, rendered] of updates) {
            if (!rendered) {
                // remove the <Style>:
                styles.delete(styleSheet);
            }
            else {
                // add/update the <Style>:
                const style = styles.get(styleSheet);
                styles.set(styleSheet,
                    /**
                     * <Style> is a pure component and will never re-render by itself.
                     * To update <Style>, we need to re-create <Style>.
                     */
                    <Style
                        content={
                            { rendered } as StyleContent
                        }
                        
                        key={
                            style?.key                  // re-use the existing key
                            ??
                            (++styleKeyCounter.current) // generate a new key
                        }
                    />
                );
            } // if
        } // for
        
        
        
        // trigger for re-render:
        triggerRender();
    }); // runs every render
    
    
    
    // jsx:
    return (
        <>
            { Array.from(styles.values()) }
        </>
    );
}
