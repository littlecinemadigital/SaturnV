# C/C++ Styleguide.

Much of this is lifted from [Google's C/C++ styleguide](https://google.github.io/styleguide/cppguide.html). Thanks Google.
## Table of Contents

1. [Headers](#header)
1. [Scoping](#scoping)
  
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

      // good_user.cpp:
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
    
In `dir/foo.cpp` or `dir/foo_test.cpp`, whose main purpose is to implement or test the stuff in `dir2/foo2.h`, order your includes as follows:

1. `dir2/foo2.h`.
2. A blank line
3. C system files.
4. C++ system files.
5. A blank line
6. Other libraries' .h files.
7. Your project's .h files.
8. Note that any adjacent blank lines should be collapsed.

With the preferred ordering, if `dir2/foo2.h` omits any necessary includes, the build of `dir/foo.cpp` or `dir/foo_test.cpp` will break. Thus, this rule ensures that build breaks show up first for the people working on these files, not for innocent people in other packages.

`dir/foo.cpp` and `dir2/foo2.h` are usually in the same directory (e.g. base/basictypes_test.cc and base/basictypes.h), but may sometimes be in different directories too.

Note that the C compatibility headers such as stddef.h are essentially interchangeable with their C++ counterparts (cstddef) Either style is acceptable, but prefer consistency with existing code.

Within each section the includes should be ordered alphabetically. Note that older code might not conform to this rule and should be fixed when convenient.

You should include all the headers that define the symbols you rely upon, except in the unusual case of forward declaration. If you rely on symbols from bar.h, don't count on the fact that you included foo.h which (currently) includes bar.h: include bar.h yourself, unless foo.h explicitly demonstrates its intent to provide you the symbols of bar.h. However, any includes present in the related header do not need to be included again in the related cc (i.e., foo.cpp can rely on foo.h's includes).

For example, the includes in `project-dir/src/foo/internal/fooserver.cpp` might look like this:

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

## Scoping

### Namespaces
With few exceptions, place code in a namespace. Namespaces should have unique names based on the project name, and possibly its path. Do not use using-directives (e.g. using namespace foo). Do not use inline namespaces. For unnamed namespaces, see Unnamed Namespaces and Static Variables.

#### Pros:
Namespaces subdivide the global scope into distinct, named scopes, and so are useful for preventing name collisions in the global scope.

Namespaces provide a method for preventing name conflicts in large programs while allowing most code to use reasonably short names.

For example, if two different projects have a class Foo in the global scope, these symbols may collide at compile time or at runtime. If each project places their code in a namespace, project1::Foo and project2::Foo are now distinct symbols that do not collide, and code within each project's namespace can continue to refer to Foo without the prefix.

Inline namespaces automatically place their names in the enclosing scope. Consider the following snippet, for example:

    namespace outer {
    inline namespace inner {
      void foo();
    }  // namespace inner
    }  // namespace outer
    
The expressions `outer::inner::foo()` and `outer::foo()` are interchangeable. Inline namespaces are primarily intended for ABI compatibility across versions.

#### Cons:
Namespaces can be confusing, because they complicate the mechanics of figuring out what definition a name refers to.

Inline namespaces, in particular, can be confusing because names aren't actually restricted to the namespace where they are declared. They are only useful as part of some larger versioning policy.

In some contexts, it's necessary to repeatedly refer to symbols by their fully-qualified names. For deeply-nested namespaces, this can add a lot of clutter.

#### Decision:
Namespaces should be used as follows:

  * Follow the rules on Namespace Names.
  * Terminate namespaces with comments as shown in the given examples.
  * Namespaces wrap the entire source file after includes, gflags definitions/declarations and forward declarations of classes from other namespaces.

    // In the .h file
    namespace mynamespace {

    // All declarations are within the namespace scope.
    // Notice the lack of indentation.
    class MyClass {
    public:
      ...
      void Foo();
    };

    }  // namespace mynamespace
    // In the .cpp file
    namespace mynamespace {

    // Definition of functions is within scope of the namespace.
    void MyClass::Foo() {
      ...
    }

    }  // namespace mynamespace
    
More complex `.cpp` files might have additional details, like flags or using-declarations.

    #include "a.h"

    DEFINE_FLAG(bool, someflag, false, "dummy flag");

    namespace mynamespace {

    using ::foo::bar;

    ...code for mynamespace...    // Code goes against the left margin.

    }  // namespace mynamespace
    
To place generated protocol message code in a namespace, use the package specifier in the .proto file. See Protocol Buffer Packages for details.
Do not declare anything in namespace std, including forward declarations of standard library classes. Declaring entities in namespace std is undefined behavior, i.e., not portable. To declare entities from the standard library, include the appropriate header file.
You may not use a using-directive to make all names from a namespace available.

    // Forbidden -- This pollutes the namespace.
    using namespace foo;
    
Do not use Namespace aliases at namespace scope in header files except in explicitly marked internal-only namespaces, because anything imported into a namespace in a header file becomes part of the public API exported by that file.

    // Shorten access to some commonly used names in .cpp files.
    namespace baz = ::foo::bar::baz;
    // Shorten access to some commonly used names (in a .h file).
    namespace librarian {
    namespace impl {  // Internal, not part of the API.
    namespace sidetable = ::pipeline_diagnostics::sidetable;
    }  // namespace impl

    inline void my_inline_function() {
      // namespace alias local to a function (or method).
      namespace baz = ::foo::bar::baz;
      ...
    }
    }  // namespace librarian
    
Do not use inline namespaces.
