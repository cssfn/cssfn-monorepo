import {
    // style sheets:
    styleSheet,
    
    
    
    // scopes:
    scopeOf,
    mainScope,
    globalScope,
} from '../src/cssfn'



const sheet = styleSheet(() => [
    mainScope(
    ),
    scopeOf('menuBar',
    ),
    globalScope(
    ),
]);

const mainClass = sheet.classes.main;
const menuBarClass = sheet.classes.menuBar;
