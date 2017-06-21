---
layout: post
title:  "High Performance Computing with Python"
date:   2016-02-27 14:33:11 +0000
categories: code
---

Python is the programming language of choice for many scientists, but one of the criticisms you often hear is 'it's so slow!'. Which is a fair point- pure python can be orders of magnitude slower than the equivalent C code. There are many modules and packages out there to address precisely this issue, though, and I recently attended a course describing some of the main ones: `numpy`, `numba`, `cython`, `multiprocess` and `MPI4py`.



###numpy

`numpy` is definitely the package I was most familiar with beforehand, but it was interesting to see how much of an improvement it gives over the standard `math` libraries.




{% highlight python %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
