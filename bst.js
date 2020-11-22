 
 /** 

 * 	Modified from Robert Sedgewick's java class RedBlackTree
 *  For additional documentation, see
 *  <a href="https://algs4.cs.princeton.edu/33balanced">Section 3.3</a> of
 *  <i>Algorithms, 4th Edition</i> by Robert Sedgewick and Kevin Wayne.
 *  @author Jorge Jimenez
 *  @author Robert Sedgewick
 *  @author Kevin Wayne
 */

let RedBlackTree = (function() {

	// Is the node left or right.
	const Color = {
		RED: "red",
		BLACK: "black"
	}


	var Node = function(key, value, color, size) {
		this.left;
		this.right;

		this.key = key;
		this.value = value;
		this.color = color;
		this.size = size;
	}


	function RedBlackTree() {

	}

	/**
     * Inserts the specified key-value pair into the symbol table, overwriting the old 
     * value with the new value if the symbol table already contains the specified key.
     * Deletes the specified key (and its associated value) from this symbol table
     * if the specified value is {@code null}.
     *
     * @param key the key
     * @param val the value
	*/
    RedBlackTree.prototype.put = function(key, value) {
    	if (!key || (typeof key) != "string")  
    		throw "Key is not a string";

    	if (value === null || value == undefined) {
    		this.delete(key);
    	}

    	this.root = put(this.root, key, value);
    	this.root.color = Color.BLACK;

    }

    /**
     * Returns the number of key-value pairs in this symbol table.
     * @return the number of key-value pairs in this symbol table
     */
    RedBlackTree.prototype.size = function() {
    	return size(this.root);
    }

     /**
     * Is this symbol table empty?
     * @return {@code true} if this symbol table is empty and {@code false} otherwise
     */
    RedBlackTree.prototype.isEmpty = function() {
        return this.root === null || this.root == undefined;
    }

     /**
     * Returns the smallest key in the symbol table.
     * @return the smallest key in the symbol table
     * @throws NoSuchElementException if the symbol table is empty
     */
	RedBlackTree.prototype.min = function() {
        if (this.isEmpty()) throw "calls min() with empty symbol table";
        return min(this.root).key;
    } 


    /**
     * Returns the largest key in the symbol table.
     * @return the largest key in the symbol table
     * @throws NoSuchElementException if the symbol table is empty
     */
	RedBlackTree.prototype.max = function() {
        if (this.isEmpty()) throw "calls max() with empty symbol table";
        return max(root).key;
    } 

    /***************************************************************************
    *  Red-black tree deletion.
    ***************************************************************************/

    /**
     * Removes the smallest key and associated value from the symbol table.
     * @throws NoSuchElementException if the symbol table is empty
     */
    RedBlackTree.prototype.deleteMin = function() {
        if (this.isEmpty()) throw "BST underflow";

        // if both children of root are black, set root to red
        if (!isRed(this.root.left) && !isRed(this.root.right))
            this.root.color = Color.RED;

        this.root = deleteMin(this.root);
        if (!this.isEmpty()) this.root.color = Color.BLACK;
    }

    // delete the key-value pair with the minimum key rooted at h
    function deleteMin(h) { 
        if (h.left == null || h.left == undefined)
            return null;

        if (!isRed(h.left) && !isRed(h.left.left))
            h = moveRedLeft(h);

        h.left = deleteMin(h.left);
        return balance(h);
    }


    /**
     * Removes the largest key and associated value from the symbol table.
     * @throws NoSuchElementException if the symbol table is empty
     */
	RedBlackTree.prototype.deleteMax = function() {
        if (this.isEmpty()) throw "BST underflow";

        // if both children of root are black, set root to red
        if (!isRed(this.root.left) && !isRed(this.root.right))
            this.root.color = Color.RED;

        this.root = deleteMax(this.root);
        if (!this.isEmpty()) this.root.color = Color.BLACK;
    }

    // delete the key-value pair with the maximum key rooted at h
	function deleteMax(h) { 
        if (isRed(h.left))
            h = rotateRight(h);

        if (h.right == null || h.right == undefined)
            return null;

        if (!isRed(h.right) && !isRed(h.right.left))
            h = moveRedRight(h);

        h.right = deleteMax(h.right);

        return balance(h);
    }
    /***************************************************************************
    *  Standard BST search.
    ***************************************************************************/

    /**
     * Returns the value associated with the given key.
     * @param key the key
     * @return the value associated with the given key if the key is in the symbol table
     *     and {@code null} if the key is not in the symbol table
     * @throws IllegalArgumentException if {@code key} is {@code null}
     */
    RedBlackTree.prototype.get = function(key) {
        if (key == null || key == undefined) 
        	throw "argument to get() is null";

        return get(this.root, key);
    }

    // value associated with the given key in subtree rooted at x; null if no such key
	function get(x, key) {
        while (x != null && x != undefined) {
            var cmp = key.localeCompare(x.key);
            if      (cmp < 0) x = x.left;
            else if (cmp > 0) x = x.right;
            else              return x.value;
        }
        return null;
    }

	/**
	* Does this symbol table contain the given key?
	* @param key the key
	* @return {@code true} if this symbol table contains {@code key} and
	*     {@code false} otherwise
	* @throws IllegalArgumentException if {@code key} is {@code null}
	*/
    RedBlackTree.prototype.contains = function(key) {
    	var value = this.get(key);
        return value != null && value != undefined;
    }

    /**
     * Removes the specified key and its associated value from this symbol table     
     * (if the key is in this symbol table).    
     *
     * @param  key the key
     * @throws IllegalArgumentException if {@code key} is {@code null}
     */
	RedBlackTree.prototype.delete = function(key) { 
        if (key == null || key == undefined) throw "argument to delete() is null";
        if (!this.contains(key)) return;

        // if both children of root are black, set root to red
        if (!isRed(this.root.left) && !isRed(this.root.right))
            this.root.color = Color.RED;

        this.root = deleteN(this.root, key);
        if (!this.isEmpty()) this.root.color = Color.BLACK;
        // assert check();
    }

    // •–––––––––––––––––––––––––––––––––––––––•
    // | HELPERS - private
    // •–––––––––––––––––––––––––––––––––––––––•
    // delete the key-value pair with the given key rooted at h
    // private
    function deleteN(h, key) { 

        if (key.localeCompare(h.key) < 0)  {
            if (!isRed(h.left) && !isRed(h.left.left))
                h = moveRedLeft(h);
            h.left = deleteN(h.left, key);
        }
        else {
            if (isRed(h.left))
                h = rotateRight(h);
            if (key.localeCompare(h.key) == 0 && (h.right === null || h.right == undefined))
                return null;
            if (!isRed(h.right) && !isRed(h.right.left))
                h = moveRedRight(h);
            if (key.localeCompare(h.key) == 0) {
                var x = min(h.right);
                h.key = x.key;
                h.val = x.val;
                // h.val = get(h.right, min(h.right).key);
                // h.key = min(h.right).key;
                h.right = deleteMin(h.right);
            }
            else h.right = deleteN(h.right, key);
        }
        return balance(h);
    } 

        // the largest key in the subtree rooted at x; null if no such key
	function max(x) { 
        // assert x != null;
        if (x.right == null || x.right == undefined) 
        	return x; 
        else
        	return max(x.right); 
    } 


    // the smallest key in subtree rooted at x; null if no such key
    function min(x) {
    	if (x.left == null || x.left == undefined)
    		return x;
    	else 
    		return min(x.left);	
    }


    // number of node in subtree rooted at x; 0 if x is null
    function size(x) {
        if (x === null || x == undefined) return 0;
        return x.size;
    } 

    // private 
    function put(nodeH, key, value) {
    	if (key == undefined || !key || (typeof key) != "string")  
    		throw "Key is not a string";
    	if (nodeH === null || nodeH == undefined) 
    		return new Node(key, value, Color.RED, 1);

    	var cmp = key.localeCompare(nodeH.key);
    	
    	if (cmp < 0) 
    		nodeH.left = put(nodeH.left, key, value);
    	else if (cmp > 0)
    		nodeH.right = put(nodeH.right, key, value);
    	else
    		nodeH.value = value;

    	 // fix-up any right-leaning links
        if (isRed(nodeH.right) && !isRed(nodeH.left))      nodeH = rotateLeft(nodeH);
        if (isRed(nodeH.left)  &&  isRed(nodeH.left.left)) nodeH = rotateRight(nodeH);
        if (isRed(nodeH.left)  &&  isRed(nodeH.right))     flipColors(nodeH);

		nodeH.size = size(nodeH.left) + size(nodeH.right) + 1;

		return nodeH;

    }



    function isRed(node) {

    	if (node === null || node == undefined) 
    		return false;

    	return node.color == Color.RED;
    }

    // •–––––––––––––––––––––––––––––––––––––––––––•
    // | FIX UP RIGHT LEANING LINKS - HELPERS
    // •–––––––––––––––––––––––––––––––––––––––––––•
        // make a left-leaning link lean to the right
    function rotateRight(h) {
        var x = h.left; // Node
        h.left = x.right;
        x.right = h;
        x.color = x.right.color;
        x.right.color = Color.RED;
        x.size = h.size;
        h.size = size(h.left) + size(h.right) + 1;
        return x;
    }

    // make a right-leaning link lean to the left
    function rotateLeft(h) {
        var x = h.right;
        h.right = x.left;
        x.left = h;
        x.color = x.left.color;
        x.left.color = Color.RED;
        x.size = h.size;
        h.size = size(h.left) + size(h.right) + 1;
        return x;
    }

    // flip the colors of a node and its two children
    function flipColors(h) {
        // h must have opposite color of its two children
        // assert (h != null) && (h.left != null) && (h.right != null);
        // assert (!isRed(h) &&  isRed(h.left) &&  isRed(h.right))
        //    || (isRed(h)  && !isRed(h.left) && !isRed(h.right));
        h.color = (h.color == Color.RED) ? Color.BLACK : Color.RED;
        h.left.color = (h.left.color == Color.RED) ? Color.BLACK : Color.RED;
        h.right.color = (h.right.color == Color.RED) ? Color.BLACK : Color.RED;
    }

    // Assuming that h is red and both h.left and h.left.left
    // are black, make h.left or one of its children red.
   	function moveRedLeft(h) {
        // assert (h != null);
        // assert isRed(h) && !isRed(h.left) && !isRed(h.left.left);

        flipColors(h);
        if (isRed(h.right.left)) { 
            h.right = rotateRight(h.right);
            h = rotateLeft(h);
            flipColors(h);
        }
        return h;
    }

    // Assuming that h is red and both h.right and h.right.left
    // are black, make h.right or one of its children red.
    function moveRedRight(h) {
        // assert (h != null);
        // assert isRed(h) && !isRed(h.right) && !isRed(h.right.left);
        flipColors(h);
        if (isRed(h.left.left)) { 
            h = rotateRight(h);
            flipColors(h);
        }
        return h;
    }

    // restore red-black tree invariant
    function balance(h) {
        // assert (h != null);

        if (isRed(h.right))        
        	h = rotateLeft(h);
        if (isRed(h.left) && isRed(h.left.left))
        	h = rotateRight(h);
        if (isRed(h.left) && isRed(h.right))
            flipColors(h);

        h.size = size(h.left) + size(h.right) + 1;
        return h;
    }


    // •–––––––––––––––––––––––––––––––––––––––––––•
    // |	END - RedBlackTree
    // •–––––––––––––––––––––––––––––––––––––––––––•

	return RedBlackTree;
}(this));
