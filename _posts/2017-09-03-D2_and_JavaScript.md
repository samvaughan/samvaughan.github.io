---
layout: post
title:  "D3 and Javascript"
date:   2017-09-03 20:32:11 +0000
categories: code
---
I was inspired by some of the really impressive visualisations [here](https://bl.ocks.org/mbostock) to dive in and 
learn some javascript and D3! I found [this](http://chimera.labs.oreilly.com/books/1230000000345/ch01.html) excellent book by  
Scott Murray to be really informative and useful (although written for a previous version of D3- there's an updated edition of
 the book, but I don't think it's open access). 
 
Below is a simple graph with points that you can move and drag around. The code borrows very heavily from [this](https://stackoverflow.com/questions/42720488/d3-v4-drag-line-chart-with-x-and-y-axes)
stack overflow question/answer, and is also available on my github account [here](https://github.com/samvaughan/samvaughan.github.io/blob/master/_posts/JS/drag_points.js).


<div id="example"></div>


<script src="http://d3js.org/d3.v4.min.js"> 

</script>

<script src="https://rawgit.com/samvaughan/samvaughan.github.io/master/_posts/JS/drag_points.js">

</script>




Getting it embedded in the Jekyll markdown this site uses was also a bit challenging- but [this](https://stackoverflow.com/questions/22651346/how-to-embed-a-d3-js-example-to-the-jekyll-blog-post) 
stack overflow answer was very helpful. I went with the second method here- making a `<div>` tag and creating an
SVG element inside that. 

There's already lots of things I'd like to apply D3 to- so watch this space! 

