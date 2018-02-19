# SATURN-V
Code Styles, Operations, and Other Important Shit. This document contains everything you need to know about code styles, and methodology.

## Our Repos
* Be responsible, don't commit:
    * Credentials
    * Commented-out code
    * Compiled Files
    * Dependency code (react, three, etc)
        * Use npm or any other dependency management system.
* Keep line lenghts bellow 100 characets, keep the gif dif easy to read.

# Code Styles
* Use 2-space tabs. Don't start a fight about this.

## Table of Contents

  1. [Types](#types)
  
### Types
---------
  <a name="types--primitives"></a><a name="1.1"></a>
  - [1.1](#types--primitives) **Primitives**: When you access a primitive type you work directly on its value.

    - `string`
    - `number`
    - `boolean`
    - `null`
    - `undefined`
    - `symbol`

    ```javascript
    const foo = 1;
    let bar = foo;

    bar = 9;

    console.log(foo, bar); // => 1, 9
    ```

    - Symbols cannot be faithfully polyfilled, so they should not be used when targeting browsers/environments that don't support them natively.

  <a name="types--complex"></a><a name="1.2"></a>
  - [1.2](#types--complex)  **Complex**: When you access a complex type you work on a reference to its value.

    - `object`
    - `array`
    - `function`

    ```javascript
    const foo = [1, 2];
    const bar = foo;

    bar[0] = 9;

    console.log(foo[0], bar[0]); // => 9, 9
    ```

**[⬆ back to top](#table-of-contents)**
