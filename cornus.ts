//(c) 2023 j hudson

export namespace cornus {

interface OpaqueObject{};


//Class to handle details of rendering to SVG.
interface Renderer{
    makeVerticalLine( x: number, y1: number, y2: number): void;
    makeHorizontalLine( x1: number, x2: number, y: number): void;
    createElement(label: string|HTMLElement): [OpaqueObject,number,number];
    setPosition(element: OpaqueObject, x: number, y: number): void;
    setCSSClass(element: OpaqueObject, klass: string): void;
    setDimensions(width: number, height: number): void;
}

//Class to handle details of rendering to HTML.
class RendererHTML {

    holder: HTMLElement;

    constructor(container: HTMLElement){

        //we use absolute positioning to place the nodes.
        //Absolute positioning requires that we have a
        //node that is not statically positioned.
        //So we create an element
        //that has position:relative and left=0, top=0.
        //That's what holder is for.
        this.holder = document.createElement("div");
        this.holder.className = "cornus-content-holder";

        container.appendChild(this.holder);
    }

    makeVerticalLine( x: number, y1: number, y2: number){
        if( y1 > y2 ){
            let tmp = y1;
            y1=y2;
            y2=tmp;
        }

        let d = document.createElement("div");
        d.className = "cornus-vertical-edge";
        d.style.left = x+"px";
        d.style.top =  y1+"px";
        d.style.height = (y2-y1)+"px";
        this.holder.appendChild(d);
    }

    makeHorizontalLine( x1: number, x2: number, y: number){
        if( x1 > x2 ){
            let tmp = x1;
            x1=x2;
            x2=tmp;
        }

        let d = document.createElement("div");
        d.className = "cornus-horizontal-edge";
        d.style.left = x1+"px";
        d.style.top =  y+"px";
        d.style.width = (x2-x1)+"px";
        this.holder.appendChild(d);
    }

    //create the HTML element that represents the node onscreen
    createElement(label: string|HTMLElement): [OpaqueObject,number,number]{
        let element = document.createElement("div");
        element.className = "cornus-node cornus-layout";

        //Add content to label. We accept either a string
        //(which gets split on newline characters) or else
        //an HTML element (which is added as-is)
        if( typeof(label) == "string" ){
            let label_s = (label as string);
            let tmp = label_s.split("\n");
            for(let i=0;i<tmp.length;++i){
                let line = document.createElement("div");
                let klass = "cornus-node-label";
                if( i === 0 )
                    klass += " cornus-node-label-firstline";
                if( i === tmp.length-1 )
                    klass += " cornus-node-label-lastline";
                line.className = klass;
                line.appendChild(document.createTextNode(tmp[i]));
                element.appendChild(line);
            }
        } else {
            element.appendChild(label as HTMLElement);
        }

        //measure size of element
        //Note that container must be in the document
        //for this measurement to be performed
        this.holder.appendChild(element);
        let r = element.getBoundingClientRect();

        return [element,r.width,r.height];
    }

    setPosition(element: OpaqueObject, x: number, y: number){
        (element as HTMLElement).style.left = x+"px";
        (element as HTMLElement).style.top = y+"px";
    }

    setCSSClass(element: OpaqueObject, klass: string){
        (element as HTMLElement).className = klass;
    }

    setDimensions(width: number, height: number){
        this.holder.style.width = width+"px";
        this.holder.style.height = height+"px";
    }

}


//Class to handle details of rendering to SVG.
class RendererSVG  {
    constructor(){
        throw new Error("Not implemented");
    }

    makeVerticalLine( _x: number, _y1: number, _y2: number){
        throw new Error("Not implemented");
    }

    makeHorizontalLine( _x1: number, _x2: number, _y: number){
        throw new Error("Not implemented");
    }

    //create the HTML element that represents the node onscreen
    createElement(_label: string|HTMLElement): [OpaqueObject,number,number]{
        throw new Error("Not implemented");
    }

    setPosition(_element: OpaqueObject, _x: number, _y: number){
        throw new Error("Not implemented");
    }

    setCSSClass(_element: OpaqueObject, _klass: string){
        throw new Error("Not implemented");
    }

    setDimensions(_width: number, _height: number){
        throw new Error("Not implemented");
    }

    getSVG(){
        throw new Error("Not implemented");
    }


}

export class TreeNode{
    children: TreeNode[];       //children of this node
    parent: TreeNode;           //parent of this node, or undefined if none
    width: number;              //width of this node
    height: number;             //height of this node
    label: string|HTMLElement;  //The node label
    depth: number;              //tree depth; root=0


    //these are set when laying out the tree
    x: number;                  //x location of top left corner of this node
    y: number;                  //y location of top left corner of this node
    leftNeighbor: TreeNode;      //node to the left of this one at the same level
                                //This is not necessarily a sibling: this.parent
                                //might not equal leftNeighbor.parent. If
                                //there is no left neighbor, this variable is undefined.
    rightNeighbor: TreeNode;     //node to the right of this one at the same level.
                                //As with leftNeighbor, this and rightNeighbor
                                //might not be siblings.
    rowHeight: number;          //height of tallest node in the same level as  this one
    element: OpaqueObject;      //element that holds content of this node


    constructor(label: string|HTMLElement, parent: TreeNode){
        this.children=[];
        this.parent=parent;
        this.x=0;
        this.y=0;
        this.label = label;
        if( parent )
            this.depth = parent.depth+1;
        else
            this.depth = 0;

        //these are defined when the tree is rendered
        this.width=undefined;
        this.height=undefined;
        this.element=undefined;
    }

    //prepare for rendering: Create HTML element and add to the document.
    //Measure width & height of element. We apply the layout css class
    //to ensure the node is not visible until we've positioned it
    //in its final location
    beginRender(renderer: Renderer){
        this.x=0;
        this.y=0;
        this.leftNeighbor=undefined;
        this.rightNeighbor=undefined;
        this.rowHeight=0;

        [this.element,this.width,this.height] = renderer.createElement(this.label);
        this.children.forEach( (c:TreeNode) => {
            c.beginRender(renderer);
        });
    }

    //property for left edge of this node
    get left(){
        return this.x;
    }

    //property for right edge of this node
    get right(){
        return this.x + this.width;
    }

    //property to get center x
    get centerX(){
        return this.x + this.width/2;
    }

    //set center of this node to x
    setCenterX(x:number){
        this.x = x-this.width/2;
    }

    //add a child to this node and return the child.
    //label: The label for the root node. May be a string or
    //  HTML element. If it is an image element, you should make sure
    //  it has been loaded or else the on-screen positioning may be
    //  incorrect.
    addChild( label: string|HTMLElement ){
        let n = new TreeNode(label, this);
        this.children.push(n);
        return n;
    }


    setRowHeight( h : number ){
        this.rowHeight = h;
    }

    //Finish render process: Position the element at its final
    //location, create edges between this node and its children,
    //and set CSS classes on the element.
    endRender(renderer: Renderer){

        renderer.setPosition(this.element,this.x,this.y);

        let klass = "cornus-node";
        if( this.children.length === 0 )
            klass += " cornus-node-leaf";
        if( this.parent === undefined )
            klass += " cornus-node-root";
        renderer.setCSSClass(this.element, klass);


        //create edges connecting this node to its children

        if( this.children.length === 0 ){
            //no edges
        } else if( this.children.length === 1 ){
            //straight line only
            let y1 = this.y + this.height;
            let y2 = this.children[0].y;
            renderer.makeVerticalLine( this.x+this.width/2, y1, y2 );
        } else {
            //Make horizontal line midway between node & children
            //and vertical line connecting parent to horizontal line
            //and vertical lines connecting children to horizontal line
            let y1 = this.y + this.height;  //bottom of parent
            let y2 = this.children[0].y;    //top of child
            let y3 = (this.y + this.rowHeight + y2 ) / 2; //y coordinate for horizontal line
            renderer.makeVerticalLine( this.x+this.width/2, y1,y3);
            this.children.forEach( (c: TreeNode) => {
                renderer.makeVerticalLine( c.x+c.width/2, y3, y2 );
            });
            let fc = this.children[0];  //first child
            let lc = this.children[this.children.length-1]; //last child
            renderer.makeHorizontalLine(
                fc.x+fc.width/2,
                lc.x+lc.width/2,
                y3
            );
        }

        this.children.forEach( (c: TreeNode) => {
            c.endRender(renderer);
        });

    }

    //translate this node + its children by some delta x and delta y
    translate(dx: number, dy: number){
        this.x += dx;
        this.y += dy;
        this.children.forEach( (c: TreeNode) => {
            c.translate(dx,dy);
        });
    }

    //width of this node + its children
    totalWidth(){
        return this.totalRight() - this.totalLeft();
    }

    //leftmost edge of this node + its children
    totalLeft(){
        let left = Math.min( this.childrenLeft(), this.left );
        return left;
    }

    //rightmost edge of this node + its children
    totalRight(){
        let right = Math.max( this.childrenRight(), this.right );
        return right;
    }

    //lowermost extent of this node + its children
    totalBottom(){
        let bottom = this.y + this.height;
        this.children.forEach( (c: TreeNode) => {
            bottom = Math.max( bottom, c.totalBottom() );
        });
        return bottom;
    }

    //leftmost edge of this node's children; if there are no children,
    //returns leftmost edge of this node
    childrenLeft(){
        if( this.children.length === 0 )
            return this.left;
        let l = this.children[0].left;
        this.children.forEach( (c: TreeNode) => {
            l = Math.min(l,c.childrenLeft());
        });
        return l;
    }

    //rightmost edge of this node's children; if there are no children,
    //returns rightmost edge of this node
    childrenRight(){
        if( this.children.length === 0 )
            return this.right;
        let r = this.children[this.children.length-1].right;
        this.children.forEach( (c: TreeNode) => {
            r = Math.max(r,c.childrenRight());
        });
        return r;
    }

    leftmostByLevel(L: number[]){
        let v = this.left;
        if( L[this.depth] === undefined )
            L[this.depth] = v;
        else
            L[this.depth] = Math.min( v, L[this.depth] );
        this.children.forEach( (c: TreeNode) => {
            c.leftmostByLevel(L);
        });
    }

    rightmostByLevel(L: number[]){
        let v = this.right;
        if( L[this.depth] === undefined )
            L[this.depth] = v;
        else
            L[this.depth] = Math.max( v, L[this.depth] );
        this.children.forEach( (c: TreeNode) => {
            c.rightmostByLevel(L);
        });
    }

    spaceLeft() : number{
        //find the distance we could move this node
        //to the left without making it or any of its children
        //overlap any other node to the left.
        //Assumes leftNeighbor and rightNeighbor have been set

        //leftmost extent of this node or any child.
        //We can't just look at child 0 because
        //we could have a configuration like this:
        //            ┌─┐
        //            │A│
        //            └┬┘
        //       ┌───┬─┴──┬────┐
        //      ┌┴┐ ┌┴┐  ┌┴┐  ┌┴┐
        //      │B│ │C│  │D│  │E│
        //      └─┘ └┬┘  └─┘  └─┘
        //     ┌────┬┴───┬───┐
        //   ┌─┴─┐ ┌┴┐  ┌┴┐ ┌┴┐
        //   │ F │ │G│  │H│ │I│
        //   └───┘ └─┘  └─┘ └─┘
        //
        // Leftmost node is determined by the second child of A,
        // not the first child of A

        //no one to the left, so no child
        //can collide with anything to the left
        if( this.leftNeighbor === undefined )
            return Infinity;

        let L: number[] = [];
        this.leftmostByLevel(L);
        let R: number[] = [];
        let nn = this.leftNeighbor;
        while(nn){
            nn.rightmostByLevel(R);
            nn = nn.leftNeighbor;
        }

        let delta = Infinity;
        //if either L[i] is undefined or R[i] is undefined,
        //we can consider it to be infinity
        //so min() won't do anything.
        for(let i=0;i<L.length;++i){
            if( L[i] !== undefined && R[i] !== undefined ){
                delta = Math.min( L[i]-R[i], delta );
            }
        }
        return delta;
    }


    spaceRight() : number{
        //find the distance we could move this node
        //to the right without making it or any of its children
        //overlap any other node to the right.
        //Assumes leftNeighbor and rightNeighbor have been set
        //Logic is similar to spaceLeft; see comments there
        //for more explanations.
        if( this.rightNeighbor === undefined )
            return Infinity;

        let R: number[] = [];
        this.rightmostByLevel(R);
        let L: number[] = [];
        let nn = this.rightNeighbor;
        while(nn !== undefined ){
            nn.leftmostByLevel(L);
            nn = nn.rightNeighbor;
        }

        let delta = Infinity;
        for(let i=0;i<L.length;++i){
            if( L[i] !== undefined && R[i] !== undefined ){
                delta = Math.min( L[i]-R[i], delta );
            }
        }
        return delta;
    }

} //end TreeNode class


export class Tree{

    root: TreeNode;

    //rootLabel: The label for the root node. May be a string or
    //  HTML element. If it is an image element, you should make sure
    //  it has been loaded or else the on-screen positioning will be
    //  incorrect.
    constructor(rootLabel: string|HTMLElement){
        this.root = new TreeNode(rootLabel,undefined);
    }

    //create HTML elements for the tree and add to the document.
    //container: The container that will hold the tree. This is also used
    //  to measure the size of the nodes on-screen. The container must
    //  be part of the document or else the positioning may be
    //  incorrect.
    renderHTML(container: HTMLElement){

        //Container must be in DOM tree in order for dimension
        //measurement to work accurately.
        if( !container.isConnected ){
            throw new Error("Container must be part of document before calling render()");
        }

        let R = new RendererHTML(container);
        this.render(R);
    }

    //create SVG elements for the tree. Returns the SVG data.
    renderSVG(){
        let R = new RendererSVG();
        this.render(R);
        return R.getSVG();
    }

    render(R: Renderer){
        //Create the HTML elements and measure their sizes.
        //They will now be added to the DOM tree but their visibility
        //is set to invisible so they are not yet on the screen.
        this.root.beginRender(R);

        //compute the x and y positions of each tree node
        this.computeLayout();

        //set the dimensions of the holder div.
        let right = this.root.totalRight();
        let bottom = this.root.totalBottom();

        R.setDimensions(right,bottom);

        //make nodes visible and create edges connecting them
        this.root.endRender(R);
    }

    //compute x and y coordinates of each tree node
    computeLayout(){
        //perform level order traversal of tree
        //to get list of elements by level

        //queue for level order traversal
        let Q: TreeNode[] = [this.root];    //nodes on current level
        let Qn: TreeNode[] = [];            //nodes on next level down
        let levels: TreeNode[][] = [ [] ];  //list of nodes by level
        let prev: TreeNode = undefined;     //previous node on this level

        while(Q.length > 0 || Qn.length > 0){

            //if we've exhausted the current level, move
            //down to the next level
            if( Q.length === 0 ){
                Q = Qn;
                Qn = [];
                levels.push([]);
                prev = undefined;
            }

            let n = Q.shift();
            n.leftNeighbor = prev;
            if(prev)
                prev.rightNeighbor = n;
            prev = n;
            levels[levels.length-1].push(n);        //In future, use levels.at()
            n.children.forEach( (c: TreeNode) => {
                Qn.push(c);
            });
        }

        //FIXME: Make these CSS stylable?
        let marginX = 10;
        let marginY = 40;

        //start at lowest level and work up toward root
        //All nodes start with x=0 initially
        for(let i=levels.length-1;i>=0;i--){

            let nodes = levels[i];      //list of nodes at this level
            let maxH=0;                 //max height of any node on this level

            //look at each node on this level and position it
            for(let j=0;j<nodes.length;++j){
                let n = nodes[j];       //makes notation shorter

                //update max height if this node is taller than
                //any we've seen so far on this level
                maxH = Math.max( maxH, n.height );

                if( n.children.length == 0 ){
                    //if this is a leaf node,
                    //position it so it is far enough to the right
                    //that its left edge does not overlap the node
                    //to its left. This isn't necessarily
                    //the final position of the node; it might get
                    //moved to the right later on.
                    //Example: We work from the bottom of the tree
                    //toward the top. Suppose we've positioned
                    //nodes A and B. We come to node C which is a leaf.
                    //C gets positioned just to the right of B
                    //
                    //               ┆         ┆
                    //           ┌───┴──┐   ┌──┼──┐
                    //          ┌┴┐    ┌┴┐ ┌┴┐ ┆  ┆
                    //          │A│    │B│ │C│
                    //          └┬┘    └┬┘ └─┘
                    //           ┆      ┆
                    //
                    //Note that the parent of B and the parent of C
                    //might or might not be siblings. Considering the
                    //next level up in the tree:
                    //
                    //                      ┆
                    //               ┌──────┼───────┐
                    //              ┌┴┐    ┌┴┐     ┌┴┐
                    //              │D│    │E│     │F│
                    //              └┬┘    └─┘     └┬┘
                    //           ┌───┴──┐        ┌──┼──┐
                    //          ┌┴┐    ┌┴┐      ┌┴┐ ┆  ┆
                    //          │A│    │B│      │C│
                    //          └┬┘    └┬┘      └─┘
                    //           ┆      ┆
                    //
                    //When we lay out the row D-E-F, we will push
                    //F to the right to make room for E. This will
                    //result in C also getting moved to the right.

                    //If there is no left neighbor, we can leave
                    //the node at zero. When we lay out the parent
                    //of this node, we might have to pull the parent over
                    //to the right, which will result in this node
                    //also getting moved to the right,
                    //but that will be accounted for later on.
                    if( n.leftNeighbor ){
                        n.x = n.leftNeighbor.right + marginX;
                    }
                } else {

                    //We first figure out the ideal location
                    //for node n; then we adjust to ensure no overlaps.

                    //center n over its children
                    let x1 = n.children[0].centerX;
                    let x2 = n.children[n.children.length-1].centerX;
                    let mid = (x1+x2)/2;
                    n.setCenterX(mid);

                    //see if n is overlapping its left neighbor
                    //or if any of the leftmost children of n are
                    //overlapping any left neighbors. If so,
                    //slide them to the right so there's no more overlap
                    let maxDelta = 0;
                    let nn = n;
                    while(nn){
                        let delta = 0;
                        if( nn.leftNeighbor != undefined )
                            delta = nn.leftNeighbor.right + marginX - nn.left;
                        maxDelta = Math.max(maxDelta,delta);
                        nn = nn.children[0];
                    }

                    n.translate( maxDelta, 0 );
                }
            }

            //potentially reposition nodes to
            //balance out use of free space. Suppose we had this tree.
            //The previous code has positioned each node as far to
            //the left as possible without any overlaps; each node
            //is centered over its children
            //
            //               ┌─┐
            //               │A│
            //               └┬┘
            //       ┌───┬────┴─────┬──┐
            //      ┌┴┐ ┌┴┐        ┌┴┐┌┴┐
            //      │B│ │C│        │D││E│
            //      └┬┘ └─┘        └┬┘└─┘
            //   ┌───┼───┐    ┌────┬┴───┬───┐
            //  ┌┴┐ ┌┴┐ ┌┴┐ ┌─┴─┐ ┌┴┐  ┌┴┐ ┌┴┐
            //  │F│ │G│ │H│ │ I │ │J│  │K│ │L│
            //  └─┘ └─┘ └─┘ └───┘ └─┘  └─┘ └─┘
            //
            //We'd like to reposition C so it is centered in the
            //space that's available to it. We could have had
            //several children in that space, like so:
            //                 ┌─┐
            //                 │A│
            //                 └┬┘
            //       ┌───┬───┬──┴─────┐
            //      ┌┴┐ ┌┴┐ ┌┴┐      ┌┴┐
            //      │B│ │C│ │D│      │E│
            //      └┬┘ └┬┘ └┬┘      └┬┘
            //       ┆   ┆   ┆        ┆
            //
            //In this case, we'd like to reposition C and D
            //to evenly fill the space between B and E. C and D
            //might be leaf nodes or they might have
            //children.
            //Iterate several times to spread out
            //free space more evenly. Stop when
            //we either reach predefined maximum iterations or else
            //we aren't moving the nodes much.

            let maxMovement = Infinity;
            for(let repeat=0;repeat<25 && maxMovement > 5 ;++repeat){
                maxMovement=0;
                for(let j=0;j<nodes.length;++j){
                    let n = nodes[j];

                    //don't reposition root
                    if( !n.parent )
                        continue;

                    //don't adjust first or last child
                    if( n === n.parent.children[0] )
                        continue;
                    if( n === n.parent.children[n.parent.children.length-1] )
                        continue;

                    //see how far we could move left or right
                    //without getting a collision between this node
                    //or any of its children.
                    let space1 = n.spaceLeft();
                    let space2 = n.spaceRight();
                    //if space1 is smaller, want to move left, so delta is negative
                    //if space1 is larger, want to move right, so delta is positive
                    let delta  = (space2-space1)/2;
                    n.translate(delta,0);
                    maxMovement = Math.max(maxMovement,delta);
                }
            }

            //adjust for height: Move children down
            //so no vertical overlap between level i and level i+1.
            //Note that all nodes of level i always have the same
            //top y coordinate; only their bottom y coordinates differ
            for(let j=0;j<nodes.length;++j){
                let n = nodes[j];
                n.setRowHeight(maxH);
                for(let k=0;k<n.children.length;++k){
                    n.children[k].translate(0,maxH+marginY);
                }
            }
        } //end for each level


        //when we readjusted the nodes to balance out the free space,
        //it's possible we might have some nodes extending left of 0.
        //Suppose this is what we had before we balanced out the
        //free space. No node can extend left of 0, but
        //B and F ended up with x=0. That means C is off-center.
        //              ┌─┐
        //              │A│
        //              └┬┘
        //       ┌──────┬┴──┬──┐
        //      ┌┴┐    ┌┴┐ ┌┴┐┌┴┐
        //      │B│    │C│ │D││E│
        //      └─┘    └┬┘ └─┘└─┘
        //        ┌────┬┴───┬───┐
        //      ┌─┴─┐ ┌┴┐  ┌┴┐ ┌┴┐
        //      │ F │ │G│  │H│ │I│
        //      └───┘ └─┘  └─┘ └─┘
        //
        //After balancing, C gets moved over to better use the
        //space available for the middle children of A:
        //            ┌─┐
        //            │A│
        //            └┬┘
        //       ┌───┬─┴──┬────┐
        //      ┌┴┐ ┌┴┐  ┌┴┐  ┌┴┐
        //      │B│ │C│  │D│  │E│
        //      └─┘ └┬┘  └─┘  └─┘
        //     ┌────┬┴───┬───┐
        //   ┌─┴─┐ ┌┴┐  ┌┴┐ ┌┴┐
        //   │ F │ │G│  │H│ │I│
        //   └───┘ └─┘  └─┘ └─┘
        //
        //But now F has x<0. We need to translate the entire tree
        //over so F.x is zero.

        let left = this.root.totalLeft();
        if( left < 0 ){
            this.root.translate(-left,0);
        }
    }
}


} //end namespace
