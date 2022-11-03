import React from 'react';
import { CssKnownProps } from '@cssfn/css-types';
import {cssConfig} from '@cssfn/css-config'
import '@cssfn/cssfn-dom'



export const [basics, basicValues, cssBasicConfig] = cssConfig(() => {
    const transitionDuration = '300ms';
    
    return {
        // backgrounds:
        backg                : 'transparent'        as CssKnownProps['background'],
        backgGrad            : [
            ['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box'],
        ]                                           as CssKnownProps['backgroundImage'],
        
        
        
        // foregrounds:
        foreg                : 'currentColor'       as CssKnownProps['foreground'],
        
        
        
        // animations:
        transitionDuration   : transitionDuration   as CssKnownProps['transitionDuration'],
        transition           : [
            // appearances:
            ['opacity'      , transitionDuration, 'ease-out'],
            
            // sizes:
            ['inline-size'  , transitionDuration, 'ease-out'],
            ['block-size'   , transitionDuration, 'ease-out'],
            
            // backgrounds:
            ['background'   , transitionDuration, 'ease-out'],
            
            // foregrounds:
            ['color'        , transitionDuration, 'ease-out'],
            
            // borders:
            ['border'       , transitionDuration, 'ease-out'],
            ['border-radius', transitionDuration, 'ease-out'],
            
            // spacings:
         // ['padding'      , transitionDuration, 'ease-out'], // beautiful but uncomfortable
            
            // typos:
            ['font-size'    , transitionDuration, 'ease-out'],
        ]                                           as CssKnownProps['transition'],
    };
}, { prefix: 'test' });

Object.assign(globalThis, {
    basics, basicValues, cssBasicConfig
});



function App() {
    return (
        <div className="App">
            test
        </div>
    );
}

export default App;
