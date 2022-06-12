import {
    cssConfig,
    usesPrefixedProps,
    usesSuffixedProps,
    overwriteProps,
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
        color           : `var(--menuColor)`,
        background      : `var(--menuBackground)`,
        opacity         : `var(--menuOpacity)`,
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
        padding         : `var(--menusPadding)`,
        cursor          : `var(--menusCursor)`,
        opacity         : `var(--menusOpacity)`,
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
        boxShadow       : `var(--buttonBoxShadow)`,
        filter          : `var(--buttonFilter)`,
        border          : `var(--buttonBorder)`,
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
        color           : `var(--boo-menuColor)`,
        background      : `var(--boo-menuBackground)`,
        opacity         : `var(--boo-menuOpacity)`,
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
        padding         : `var(--boo-menusPadding)`,
        cursor          : `var(--boo-menusCursor)`,
        opacity         : `var(--boo-menusOpacity)`,
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
        boxShadow       : `var(--boo-buttonBoxShadow)`,
        filter          : `var(--boo-buttonFilter)`,
        border          : `var(--boo-buttonBorder)`,
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



test(`test usesSuffixedProps()`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    });
    expect(
        usesSuffixedProps(cssProps, 'valid')
    )
    .toEqual({
        color           : `var(--colorValid)`,
        background      : `var(--backgroundValid)`,
        opacity         : `var(--opacityValid)`,
    });
});
test(`test usesSuffixedProps()`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    });
    expect(
        usesSuffixedProps(cssProps, 'invalid')
    )
    .toEqual({
        padding         : `var(--paddingInvalid)`,
        cursor          : `var(--cursorInvalid)`,
        opacity         : `var(--opacityInvalid)`,
    });
});
test(`test usesSuffixedProps()`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    });
    expect(
        usesSuffixedProps(cssProps, 'active')
    )
    .toEqual({
        boxShadow       : `var(--boxShadowActive)`,
        filter          : `var(--filterActive)`,
        border          : `var(--borderActive)`,
    });
});

test(`test usesSuffixedProps(prefix: 'boo')`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesSuffixedProps(cssProps, 'valid')
    )
    .toEqual({
        color           : `var(--boo-colorValid)`,
        background      : `var(--boo-backgroundValid)`,
        opacity         : `var(--boo-opacityValid)`,
    });
});
test(`test usesSuffixedProps(prefix: 'boo')`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesSuffixedProps(cssProps, 'invalid')
    )
    .toEqual({
        padding         : `var(--boo-paddingInvalid)`,
        cursor          : `var(--boo-cursorInvalid)`,
        opacity         : `var(--boo-opacityInvalid)`,
    });
});
test(`test usesSuffixedProps(prefix: 'boo')`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesSuffixedProps(cssProps, 'active')
    )
    .toEqual({
        boxShadow       : `var(--boo-boxShadowActive)`,
        filter          : `var(--boo-filterActive)`,
        border          : `var(--boo-borderActive)`,
    });
});

test(`test usesSuffixedProps(remove: false)`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    });
    expect(
        usesSuffixedProps(cssProps, 'valid', false)
    )
    .toEqual({
        colorValid      : `var(--colorValid)`,
        backgroundValid : `var(--backgroundValid)`,
        opacityValid    : `var(--opacityValid)`,
    });
});
test(`test usesSuffixedProps(remove: false)`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    });
    expect(
        usesSuffixedProps(cssProps, 'invalid', false)
    )
    .toEqual({
        paddingInvalid  : `var(--paddingInvalid)`,
        cursorInvalid   : `var(--cursorInvalid)`,
        opacityInvalid  : `var(--opacityInvalid)`,
    });
});
test(`test usesSuffixedProps(remove: false)`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    });
    expect(
        usesSuffixedProps(cssProps, 'active', false)
    )
    .toEqual({
        boxShadowActive : `var(--boxShadowActive)`,
        filterActive    : `var(--filterActive)`,
        borderActive    : `var(--borderActive)`,
    });
});

test(`test usesSuffixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesSuffixedProps(cssProps, 'valid', false)
    )
    .toEqual({
        colorValid      : `var(--boo-colorValid)`,
        backgroundValid : `var(--boo-backgroundValid)`,
        opacityValid    : `var(--boo-opacityValid)`,
    });
});
test(`test usesSuffixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesSuffixedProps(cssProps, 'invalid', false)
    )
    .toEqual({
        paddingInvalid  : `var(--boo-paddingInvalid)`,
        cursorInvalid   : `var(--boo-cursorInvalid)`,
        opacityInvalid  : `var(--boo-opacityInvalid)`,
    });
});
test(`test usesSuffixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        colorValid      : 'unset',
        backgroundValid : 'unset',
        opacityValid    : 'unset',
        
        paddingInvalid  : 'unset',
        cursorInvalid   : 'unset',
        opacityInvalid  : 'unset',
        
        boxShadowActive : 'unset',
        filterActive    : 'unset',
        borderActive    : 'unset',
    }, { prefix: 'boo' });
    expect(
        usesSuffixedProps(cssProps, 'active', false)
    )
    .toEqual({
        boxShadowActive : `var(--boo-boxShadowActive)`,
        filterActive    : `var(--boo-filterActive)`,
        borderActive    : `var(--boo-borderActive)`,
    });
});



test(`test overwriteProps(usesSuffixedProps())`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'sm'))
    )
    .toEqual({
        'var(--borderRadius)'    : `var(--borderRadiusSm)`,
        'var(--fontSize)'        : `var(--fontSizeSm)`,
    });
});
test(`test overwriteProps(usesSuffixedProps())`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'lg'))
    )
    .toEqual({
        'var(--borderRadius)'    : `var(--borderRadiusLg)`,
        'var(--fontSize)'        : `var(--fontSizeLg)`,
    });
});
test(`test overwriteProps(usesSuffixedProps())`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'blah'))
    )
    .toEqual({
        /* empty */
    });
});

test(`test overwriteProps(usesSuffixedProps(prefix: 'boo'))`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    }, { prefix: 'boo' });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'sm'))
    )
    .toEqual({
        'var(--boo-borderRadius)'    : `var(--boo-borderRadiusSm)`,
        'var(--boo-fontSize)'        : `var(--boo-fontSizeSm)`,
    });
});
test(`test overwriteProps(usesSuffixedProps(prefix: 'boo'))`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    }, { prefix: 'boo' });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'lg'))
    )
    .toEqual({
        'var(--boo-borderRadius)'    : `var(--boo-borderRadiusLg)`,
        'var(--boo-fontSize)'        : `var(--boo-fontSizeLg)`,
    });
});
test(`test overwriteProps(usesSuffixedProps(prefix: 'boo'))`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    }, { prefix: 'boo' });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'blah'))
    )
    .toEqual({
        /* empty */
    });
});

test(`test overwriteProps(usesSuffixedProps(remove: false))`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'sm', false))
    )
    .toEqual({
        'var(--borderRadiusSm)'  : `var(--borderRadiusSm)`,
        'var(--fontSizeSm)'      : `var(--fontSizeSm)`,
    });
});
test(`test overwriteProps(usesSuffixedProps(remove: false))`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'lg', false))
    )
    .toEqual({
        'var(--borderRadiusLg)'  : `var(--borderRadiusLg)`,
        'var(--fontSizeLg)'      : `var(--fontSizeLg)`,
        'var(--boxShadowLg)'     : `var(--boxShadowLg)`,
    });
});
test(`test overwriteProps(usesSuffixedProps(remove: false))`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'blah', false))
    )
    .toEqual({
        /* empty */
    });
});

test(`test usesSuffixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    }, { prefix: 'boo' });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'sm', false))
    )
    .toEqual({
        'var(--boo-borderRadiusSm)'  : `var(--boo-borderRadiusSm)`,
        'var(--boo-fontSizeSm)'      : `var(--boo-fontSizeSm)`,
    });
});
test(`test usesSuffixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    }, { prefix: 'boo' });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'lg', false))
    )
    .toEqual({
        'var(--boo-borderRadiusLg)'  : `var(--boo-borderRadiusLg)`,
        'var(--boo-fontSizeLg)'      : `var(--boo-fontSizeLg)`,
        'var(--boo-boxShadowLg)'     : `var(--boo-boxShadowLg)`,
    });
});
test(`test usesSuffixedProps(prefix: 'boo', remove: false)`, () => {
    const [cssProps] = cssConfig({
        borderRadius    : 'unset',
        borderRadiusSm  : 'unset',
        borderRadiusLg  : 'unset',
        
        fontSize        : 'unset',
        fontSizeSm      : 'unset',
        fontSizeLg      : 'unset',
        
        boxShadowLg     : 'unset',
    }, { prefix: 'boo' });
    expect(
        overwriteProps(cssProps, usesSuffixedProps(cssProps, 'blah', false))
    )
    .toEqual({
        /* empty */
    });
});
