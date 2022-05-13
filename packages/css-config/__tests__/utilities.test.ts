import {
    cssConfig,
    usesPrefixedProps,
} from '../dist/css-config.js'



test(`test usesPrefixedProps()`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    });
    expect(
        usesPrefixedProps(cssProps, 'menu')
    )
    .toEqual({
        color       : `var(--menuColor)`,
        background  : `var(--menuBackground)`,
        opacity     : `var(--menuOpacity)`,
    });
});
test(`test usesPrefixedProps()`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    });
    expect(
        usesPrefixedProps(cssProps, 'menus')
    )
    .toEqual({
        padding    : `var(--menusPadding)`,
        cursor     : `var(--menusCursor)`,
        opacity    : `var(--menusOpacity)`,
    });
});
test(`test usesPrefixedProps()`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    });
    expect(
        usesPrefixedProps(cssProps, 'button')
    )
    .toEqual({
        boxShadow : `var(--buttonBoxShadow)`,
        filter    : `var(--buttonFilter)`,
        border    : `var(--buttonBorder)`,
    });
});

test(`test usesPrefixedProps(prefix: 'boo')`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesPrefixedProps(cssProps, 'menu')
    )
    .toEqual({
        color       : `var(--boo-menuColor)`,
        background  : `var(--boo-menuBackground)`,
        opacity     : `var(--boo-menuOpacity)`,
    });
});
test(`test usesPrefixedProps(prefix: 'boo')`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesPrefixedProps(cssProps, 'menus')
    )
    .toEqual({
        padding    : `var(--boo-menusPadding)`,
        cursor     : `var(--boo-menusCursor)`,
        opacity    : `var(--boo-menusOpacity)`,
    });
});
test(`test usesPrefixedProps(prefix: 'boo')`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesPrefixedProps(cssProps, 'button')
    )
    .toEqual({
        boxShadow : `var(--boo-buttonBoxShadow)`,
        filter    : `var(--boo-buttonFilter)`,
        border    : `var(--boo-buttonBorder)`,
    });
});

test(`test usesPrefixedProps(remove: false)`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    });
    expect(
        usesPrefixedProps(cssProps, 'menu', false)
    )
    .toEqual({
        menuColor       : `var(--menuColor)`,
        menuBackground  : `var(--menuBackground)`,
        menuOpacity     : `var(--menuOpacity)`,
    });
});
test(`test usesPrefixedProps(remove: false)`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    });
    expect(
        usesPrefixedProps(cssProps, 'menus', false)
    )
    .toEqual({
        menusPadding    : `var(--menusPadding)`,
        menusCursor     : `var(--menusCursor)`,
        menusOpacity    : `var(--menusOpacity)`,
    });
});
test(`test usesPrefixedProps(remove: false)`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    });
    expect(
        usesPrefixedProps(cssProps, 'button', false)
    )
    .toEqual({
        buttonBoxShadow : `var(--buttonBoxShadow)`,
        buttonFilter    : `var(--buttonFilter)`,
        buttonBorder    : `var(--buttonBorder)`,
    });
});

test(`test usesPrefixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesPrefixedProps(cssProps, 'menu', false)
    )
    .toEqual({
        menuColor       : `var(--boo-menuColor)`,
        menuBackground  : `var(--boo-menuBackground)`,
        menuOpacity     : `var(--boo-menuOpacity)`,
    });
});
test(`test usesPrefixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesPrefixedProps(cssProps, 'menus', false)
    )
    .toEqual({
        menusPadding    : `var(--boo-menusPadding)`,
        menusCursor     : `var(--boo-menusCursor)`,
        menusOpacity    : `var(--boo-menusOpacity)`,
    });
});
test(`test usesPrefixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        menuColor       : 'unset',
        menuBackground  : 'unset',
        menuOpacity     : 'unset',
        
        menusPadding    : 'unset',
        menusCursor     : 'unset',
        menusOpacity    : 'unset',
        
        buttonBoxShadow : 'unset',
        buttonFilter    : 'unset',
        buttonBorder    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesPrefixedProps(cssProps, 'button', false)
    )
    .toEqual({
        buttonBoxShadow : `var(--boo-buttonBoxShadow)`,
        buttonFilter    : `var(--boo-buttonFilter)`,
        buttonBorder    : `var(--boo-buttonBorder)`,
    });
});
