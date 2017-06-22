---
layout: post
title:  "High Performance Computing with Python"
date:   2016-02-27 14:33:11 +0000
categories: code
---

Python is the programming language of choice for many scientists, but one of the criticisms you often hear levelled at it is 'it's so slow!'. Which is a fair point- pure python can be orders of magnitude slower than the equivalent C code. There are many modules and packages out there to address precisely this issue, though, and I recently attended a course describing some of the main ones: `numpy`, `numba`, `MPI4py`, `cython`, and `multiprocess`. I'll talk about the first three of those here and the last two plus an overall comparison in another post. The code from this post can be found [here][github_repo].



### numpy

`numpy` ([numpy.org][numpy]) is definitely the package I was most familiar with beforehand, but it was still interesting to see how much of an improvement it gives over the standard `math` libraries. For example, the following code:


{% highlight python %}
import math
def python_sine(array):
    results=[math.sin(value) for value in array]
    return results
{% endhighlight %}

takes 2.21 seconds to run on an array with 10 million elements on my laptop. The equivalent `numpy` code:

{% highlight python %}
import numpy as np
def numpy_sine(array):
    results=np.sin(array)
    return results
{% endhighlight %}

takes just 350 ms! 

Interestingly, I hadn't realised that applying `math.sin` to a single element is _much_ faster than `np.sin`. The speed up happens because we can apply np.sin to the whole array at once. I also hadn't realised that with just a few lines of code, we can do ~5-10 times better than numpy- but that's where `numba` and `cython` come in.

### numba

`numba` ([numba.pydata.org/][numba]) compiles your python functions to give performances similar to C or Fortran. It uses 'Just in Time' compilation, meaning a function is compiled into machine code the first time it's called, just before it's executed. Any further calls to this function now utilise the machine code, rather than interpreting the python syntax again. 

It's very easy to add `numba` to your existing code- just import `jit` and then add it as a decorator around a function. 

{% highlight python %}
import math
from numba import jit
@jit
def numba_sine(array):
    results=np.zeros_like(array)
    for i, value in enumerate(array):
        results[i]=math.sin(value)
    return results
{% endhighlight %}

This takes around the same time as the `numpy` code above, but we were also shown the example of finding the 'p-norm' of a vector where `numba` outperforms `np.linalg.norm` by a factor of ~10. 

You can also enforce the types of the function and its inputs, turn functions into 'universal functions' which act on arrays (like `numpy` does) and parallelise your code with the addition of a simple 'target="parallel"' to the arguments of the decorator. 

`numba` is still a pretty young package- it's only on version 0.33- but definitely one to watch.

### MPI4py

MPI (Message Passing Interface) is the standard for distributed, parallel computing. It allows different processes to execute the same program and communicate with each other, sharing data or results. It's best applied to problems which can be easily partitioned. `MPI4py` brings the MPI standards to python.

The key thing which took me a while to get my head around was that each script _runs the same program_. I was thinking that the master process would have to see different code to all the others, but that's not how it works. To perform our test of taking the sine of each element of a large array, we have to do a few things:

* Set up a communicator between different processes
* Make an array on the master process which we want to do something with
* Set up the points at which we want to split this array
* Make the split and send a chunk of the array to each node
* Do something to that chunk
* Gather each chunk back and reassemble the array again

A python script which does this can be found [here][github_repo] (which borrows a lot from [this][stack_overflow] stack overflow answer). As you can see, `MPI4py` is far more complicated than using `numpy` or `numba`! The code has to be rewritten rather than editing functions you already have, and should be called using `mpiexec -np $n_processes python script_name`, rather than just `python script_name`. But the possible gains are bigger, especially if you're running on a cluster, so it might be worth taking the time to use it. 

Next time- `cython`, `multiprocess` and a comparison of everything on a simple Monte Carlo problem. 





[numpy]: http://www.numpy.org/
[numba]: http://numba.pydata.org/
[stack_overflow]: https://stackoverflow.com/questions/36025188/along-what-axis-does-mpi4py-scatterv-function-split-a-numpy-array/36082684#36082684
[github_repo]: https://github.com/samvaughan/HPC_post1_June22