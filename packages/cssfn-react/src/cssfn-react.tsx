// cssfn:
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
import type {
    Subscription,
}                           from 'rxjs'



// hooks:
const triggerRenderReducer = (indices: object, newIndices: void): object => {
    return {}; // update with a new object
};
export const useTriggerRender = () => {
    const [, setState] = useReducer(triggerRenderReducer, {});
    return setState;
};



// react components:
interface StyleContent {
    renderedCss : string|null
}
interface StyleProps {
    content : StyleContent
}
const Style : FC<StyleProps> = memo(({ content }: StyleProps) => {
    // because the `renderedCss` may a_huge_string, we need to *unreference* it:
    const renderedCss = content.renderedCss; // copy        the props' `renderedCss`
    content.renderedCss = null;              // unreference the props' `renderedCss`
    
    // jsx:
    console.log(`<Style> render!`);
    return (
        <style>
            { renderedCss }
        </style>
    );
});

export const Styles : FC = () => {
    // states:
    const loaded           = useRef(false);
    const [styles        ] = useState<Map<StyleSheet, ReactElement<StyleProps, typeof Style>>>(() => new Map());
    const styleKeyCounter  = useRef(0);
    const triggerRender    = useTriggerRender();
    
    
    
    // dom effects:
    const [unsubscribe   ] = useState<Subscription|undefined>(() => styleSheetRegistry.subscribe((styleSheet: StyleSheet): void => {
        const renderedCss = (styleSheet.enabled || null) && render(styleSheet);
        if (!renderedCss) {
            // remove the <Style>:
            console.log(`<Style> removed!`);
            styles.delete(styleSheet);
        }
        else {
            // add/update the <Style>:
            console.log(`<Style> updated!`);
            const style = styles.get(styleSheet);
            styles.set(styleSheet,
                /**
                 * <Style> is a pure component and will never re-render by itself.
                 * To update <Style>, we need to re-create <Style>.
                 */
                <Style
                    content={
                        { renderedCss } as StyleContent
                    }
                    
                    key={
                        style?.key                  // re-use the existing key
                        ??
                        (++styleKeyCounter.current) // generate a new key
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
    console.log('');
    console.log(`<Styles> render!`);
    return (
        <>
            { Array.from(styles.values()) }
        </>
    );
}
