'use client'

// React:
import {
    // Types:
    type JSX,
}                           from 'react'

// Cssfn:
import                           '@cssfn/cssfn-dom' // side effect



// React components:

/**
 * `HydrateStyles` Component
 *
 * ## Purpose:
 * - Ensures **hydration of static styles** produced by `<StaticStyles>` (server-side renderer).
 * - Works **better than `<Styles>` in React frameworks that support Server Components**, ensuring early style injection.
 * - Prevents late updates from `<Styles>` (which would normally delay styles until after `useLayoutEffect()`).
 *
 * ## Behavior:
 * - **Client-side only** (`"use client"` directive).
 * - **Does nothing on the server**—the import exists purely for side effects.
 * - **Hydrates styles before `useLayoutEffect()` runs** to support components requiring early DOM measurements.
 * - **Prevents duplicate `<style>` elements**:
 *   - If a `<style>` with `data-id="unique_id"` already exists, **initial rendering is skipped**.
 *   - This assumes the existing `<style>` already contains valid CSS from SSR.
 * - **Dynamically updates existing styles**:
 *   - On subsequent updates (same `data-id`), it **modifies the content** inside existing `<style>` tags.
 *   - If the rendered result is an empty string (`""`), the `<style>` is **removed** instead of being overwritten.
 * 
 * ## Relationship with `<Styles>` and `<StaticStyles>`:
 * - `<Styles>` is **the full version** (works interactively on client & server), but its updates **happen too late** in React frameworks.
 * - `<StaticStyles>` is a **pure server component** that **only outputs static HTML `<style>` tags** (no dynamic updates).
 * - **Together, `<StaticStyles>` and `<HydrateStyles>` replace `<Styles>` for better performance** in Server Component-based frameworks.
 *
 * @component
 * @returns {JSX.Element | null} Returns `null` since no JSX is directly rendered.
 */
const HydrateStyles = (): JSX.Element | null => {
    // Jsx:
    return null;
};

export {
    HydrateStyles,            // Named export for readability.
    HydrateStyles as default, // Default export to support React.lazy.
}
