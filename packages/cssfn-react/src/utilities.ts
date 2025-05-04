// Other libs:
import {
    // Tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// Tests:
/**
 * Determines if code is running client-side.
 */
export const isClientSide : boolean = isBrowser || isJsDom;
