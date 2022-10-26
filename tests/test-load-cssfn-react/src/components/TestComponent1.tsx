import {
    styleSheet,
} from '@cssfn/cssfn'



console.log('created: SSTestComponent1');
styleSheet(function SSTestComponent1() {
    return ({
        display       : 'flex',
        flexDirection : 'row',
        flexWrap      : 'nowrap',
    });
}, { id: 'SS-TestComponent1'});