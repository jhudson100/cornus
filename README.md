# cornus
Typescript/Javascript library for creating trees using HTML+DOM for rendering

This program renders trees using DOM elements (rather than SVG or HTML canvas).


To build: Run "tsc" (the Typescript compiler). The tsconfig file
contains options that will govern the compile process.


For an example of usage, see test.html and test.ts. The result
is styled using CSS; there is an example css file in the repository.

Brief overview of usage:


    import {cornus} from "./cornus.js"

    //create a tree object. The parameter is the
    //label for the root
    let t = new cornus.Tree("Foo");

    //add children
    let a = t.root.addChild("A");
    let b = t.root.addChild("B");
    let c = t.root.addChild("C");

    //add children of the nodes just added
    a.addChild("D");

    //render the tree. div should be some element
    //that is part of the document; otherwise,
    //positioning may be incorrect.
    let div = document.getElementById("someDivID");
    t.renderHTML(div);

It is also possible to pass an HTMLElement (for example, an image) to
the Tree() constructor or to addChild(). Note that if the image
hasn't been loaded by the time renderHTML is called, the tree layout
will likely be incorrect.


![Example screenshot](screenshot.jpg "Screenshot")
