// react:
import {
    // react:
    default as React,
    
    
    
    // types:
    FC,
    ReactElement,
    
    
    
    // hooks:
    useState,
    useEffect,
    useReducer,
    useRef,
    useMemo,
    
    
    
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



// hooks:
const triggerRenderReducer = (_currentGeneration: object, _newGeneration: void): object => {
    return {}; // update with a new object
};
const useTriggerRender = () => {
    const [generation, setState] = useReducer(triggerRenderReducer, {});
    return [setState, generation] as const;
};



// react components:
interface StyleContent {
    renderedCss : string|null
}
interface StyleProps {
    content : StyleContent
}
const Style : FC<StyleProps> = memo(({ content }: StyleProps) => {
    // because the `renderedCss` may be a_huge_string, we need to *unreference* it:
    const localRenderedCss = content.renderedCss; // copy         the `renderedCss` to local variable
    content.renderedCss    = null;                // de-reference the `renderedCss` from `props`
    
    // jsx:
    console.log(`<Style> render!`);
    return (
        <style>
            { localRenderedCss }
        </style>
    );
});

export const Styles : FC = () => {
    // states:
    const loaded                      = useRef(false);
    const [styles                   ] = useState<Map<StyleSheet, ReactElement<StyleProps, typeof Style>|null>>(() => new Map());
    const [triggerRender, generation] = useTriggerRender();
    
    
    
    // dom effects:
    const [unsubscribe] = useState(() => styleSheetRegistry.subscribe((styleSheet: StyleSheet): void => {
        const renderedCss = (styleSheet.enabled || null) && render(styleSheet);
        if (!renderedCss) {
            // remove the <Style>:
            console.log('');
            console.log(`<Style> removed!`);
            // styles.delete(styleSheet); // do not delete an item in collection
            styles.set(styleSheet, null); // instead assign to `null` to mark as deleted, so we can un-delete it later in the same prev order
        }
        else {
            // add/update the <Style>:
            console.log('');
            console.log(`<Style> mutated!`);
            const style = styles.get(styleSheet);
            styles.set(styleSheet,
                /**
                 * <Style> is a pure static component and will never re-render by itself.
                 * To update <Style>, we need to re-create a new <Style>.
                 */
                <Style
                    content={
                        { renderedCss } as StyleContent
                    }
                    
                    key={
                        style?.key  // re-use the existing key
                        ??
                        styles.size // generate a new key by looking `styles.size`, it always growing, never shrinking
                    }
                />
            );
        } // if
        
        
        
        if (loaded.current) triggerRender(); // re-render the <Styles>
    }));
    useEffect(() => {
        // setups:
        loaded.current = true; // mark <Styles> component as loaded
        
        
        
        // cleanups:
        return () => {
            unsubscribe?.unsubscribe();
        };
    }, []); // runs once on startup
    
    
    
    // jsx:
    return useMemo<JSX.Element>(() => {
        console.log('');
        console.log(`<Styles> render!`);
        return (
            <>
                { Array.from(styles.values()) }
            </>
        );
    }, [generation]); // re-create the `JSX.Element` if `generation` changed
}
