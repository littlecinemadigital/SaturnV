# C/C++ Styleguide.

Much of this is lifted from [Google's C/C++ styleguide](https://google.github.io/styleguide/cppguide.html). Thanks Google.
## Table of Contents

  1. [Headers](#header)
  
  ## Headers

 Generally speaking, all `.c` and `.cpp` files should be accompanied by a `.h` or `.hpp` file. 
 
 ### Self Contained Headers
 
 Header files should be self contained and suffixed in `.h` if they're C and `.hpp` if they're C++.

### #define Guard

Header files should utilize a `#define` guard in order to to prevent multi inclusion. The format of the symbol name should be `<PROJECT>_<PATH>_<FILE>_H_`.

### Forward Declarations

Avoid using forward declarations where possible. Just #include the headers you need.

#### Definition

A "forward declaration" is a declaration of a class, function, or template without an associated definition.

#### Pros:

* Forward declarations can save compile time, as #includes force the compiler to open more files and process more input.

* Forward declarations can save on unnecessary recompilation. #includes can force your code to be recompiled more often, due to unrelated changes in the header.

#### Cons:
Forward declarations can hide a dependency, allowing user code to skip necessary recompilation when headers change.
A forward declaration may be broken by subsequent changes to the library. Forward declarations of functions and templates can prevent the header owners from making otherwise-compatible changes to their APIs, such as widening a parameter type, adding a template parameter with a default value, or migrating to a new namespace.
Forward declaring symbols from namespace std:: yields undefined behavior.
It can be difficult to determine whether a forward declaration or a full #include is needed. Replacing an #include with a forward declaration can silently change the meaning of code:
      
  
      // b.h:
      struct B {};
      struct D : B {};

      // good_user.cc:
      #include "b.h"
      void f(B*);
      void f(void*);
      void test(D* x) { f(x); }  // calls f(B*)
      

If the #include was replaced with forward decls for B and D, test() would call f(void*).
Forward declaring multiple symbols from a header can be more verbose than simply #includeing the header.
Structuring code to enable forward declarations (e.g. using pointer members instead of object members) can make the code slower and more complex.

#### Decision
* Try to avoid forward declarations of entities defined in another project.
* When using a function declared in a header file, always #include that header.
* When using a class template, prefer to #include its header file.
* Please see Names and Order of Includes for rules about when to #include a header.

### Inline Functions
Define functions inline only when they are small, say, 10 lines or fewer.

#### Definition:
You can declare functions in a way that allows the compiler to expand them inline rather than calling them through the usual function call mechanism.

#### Pros:
Inlining a function can generate more efficient object code, as long as the inlined function is small. Feel free to inline accessors and mutators, and other short, performance-critical functions.

#### Cons:
Overuse of inlining can actually make programs slower. Depending on a function's size, inlining it can cause the code size to increase or decrease. Inlining a very small accessor function will usually decrease code size while inlining a very large function can dramatically increase code size. On modern processors smaller code usually runs faster due to better use of the instruction cache.

#### Decision:
A decent rule of thumb is to not inline a function if it is more than 10 lines long. Beware of destructors, which are often longer than they appear because of implicit member- and base-destructor calls!


Another useful rule of thumb: it's typically not cost effective to inline functions with loops or switch statements (unless, in the common case, the loop or switch statement is never executed).


It is important to know that functions are not always inlined even if they are declared as such; for example, virtual and recursive functions are not normally inlined. Usually recursive functions should not be inline. The main reason for making a virtual function inline is to place its definition in the class, either for convenience or to document its behavior, e.g., for accessors and mutators.

### Names and Order of Includes
Use standard order for readability and to avoid hidden dependencies: Related header, C library, C++ library, other libraries' .h, your project's .h.

All of a project's header files should be listed as descendants of the project's source directory without use of UNIX directory shortcuts . (the current directory) or .. (the parent directory). For example, `project-dir/src/base/logging.h` should be included as:

    #include "base/logging.h"
    
In `dir/foo.cc` or `dir/foo_test.cc`, whose main purpose is to implement or test the stuff in `dir2/foo2.h`, order your includes as follows:

1. `dir2/foo2.h`.
2. A blank line
3. C system files.
4. C++ system files.
5. A blank line
6. Other libraries' .h files.
7. Your project's .h files.
8. Note that any adjacent blank lines should be collapsed.

With the preferred ordering, if `dir2/foo2.h` omits any necessary includes, the build of `dir/foo.cc` or `dir/foo_test.cc` will break. Thus, this rule ensures that build breaks show up first for the people working on these files, not for innocent people in other packages.

`dir/foo.cc` and `dir2/foo2.h` are usually in the same directory (e.g. base/basictypes_test.cc and base/basictypes.h), but may sometimes be in different directories too.

Note that the C compatibility headers such as stddef.h are essentially interchangeable with their C++ counterparts (cstddef) Either style is acceptable, but prefer consistency with existing code.

Within each section the includes should be ordered alphabetically. Note that older code might not conform to this rule and should be fixed when convenient.

You should include all the headers that define the symbols you rely upon, except in the unusual case of forward declaration. If you rely on symbols from bar.h, don't count on the fact that you included foo.h which (currently) includes bar.h: include bar.h yourself, unless foo.h explicitly demonstrates its intent to provide you the symbols of bar.h. However, any includes present in the related header do not need to be included again in the related cc (i.e., foo.cc can rely on foo.h's includes).

For example, the includes in `project-dir/src/foo/internal/fooserver.cc` might look like this:

    #include "foo/server/fooserver.h"

    #include <sys/types.h>
    #include <unistd.h>
    #include <vector>

    #include "base/basictypes.h"
    #include "base/commandlineflags.h"
    #include "foo/server/bar.h"
    
#### Exception:
Sometimes, system-specific code needs conditional includes. Such code can put conditional includes after other includes. Of course, keep your system-specific code small and localized. Example:

    #include "foo/public/fooserver.h"

    #include "base/port.h"  // For LANG_CXX11.

    #ifdef LANG_CXX11
    #include <initializer_list>
    #endif  // LANG_CXX11
