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
