import * as THREE from 'three';

import { Arrow } from './Arrow.js'
import { ChildRelation } from './Nodes.js';



// Check ARROW

/**
 * CLASS: BasicDS
 * PURPOSE: A class that provides helper methods for all data structures
 */
class BasicDS
{
    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        // A group of nodes to be placed in the scene
        this.inScene_ = new THREE.Group ();

        // A group of arrows between the nodes to be placed to scene
        this.arrows_ = new THREE.Group ();

        this.startingPosition_ = startingPosition;
        this.nodeDistance_ = nodeDistance;
        this.lineMaterial_ = lineMaterial;
    }

    /**
     * FUNCTION: AddToScene
     * PURPOSE: easily add the child groups to a scene
     */
    AddToScene (scene)
    {
        scene.add (this.inScene_);
        scene.add (this.arrows_);
    }

    /**
     * FUNCTION: GetLength
     * PURPOSE: Returns the number of children
     */
    GetLength ()
    {
        return this.inScene_.children.length;
    }

    /**
     * FUNCTION: Iterate
     * PURPOSE: Iterate through a data structure and return a string 
     */
    Iterate ()
    {
        var iterString = "[ ";

        for (var i = 0 ; i < this.GetLength() ; i++)
        {
            iterString += this.inScene_.children[i].GetValue() + " ";
        }

        iterString += "]";

        return iterString;
    }

    /**
     * FUNCTION: IsEmpty
     * PURPOSE: returns a boolean based on if the data structure has children
     */
    IsEmpty ()
    {
        if (this.inScene_.children.length == 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * FUNCTION: Rerender
     * PURPOSE: Redraw all nodes in the data structure
     */
    Rerender ()
    {
        // empty
    }
}

/**
 * CLASS: LinkedList
 * PURPOSE:  A three.js implementation of a linkedlist that controls inserted and deleting nodes.
 */
export class LinkedList extends BasicDS
{
    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        super (startingPosition , nodeDistance , lineMaterial);
    }

    /**
     * FUNCTION: Push
     * PURPOSE: Push a node to the end of the list
     */
    Push (insertedNode)
    {
        this.Insert (insertedNode , this.GetLength());
    }

    /**
     * FUNCTION: Pop
     * PURPOSE: Removes a node from the end of the list
     */
    Pop ()
    {
        return this.Delete (this.GetLength() - 1);
    }

    /**
     * FUNCTION: Insert
     * PURPOSE: A method to insert a node at a choosen. Will fail if index is greater than the length
     */
    Insert (insertedNode , index)
    {

        if (index < 0 || index > this.GetLength())
        {
            console.log ("Invalid Index");
            return;
        }

        if (this.GetLength() > 0)
        {
            this.inScene_.children.splice (index , 0 , insertedNode);
            this.arrows_.add (new Arrow (this.lineMaterial_ , 2));
        }
        else // this.children.length == 0
        {
            this.inScene_.add (insertedNode);
        }

        this.Rerender ();
    }

    /**
     * FUNCTION: Delete
     * PURPOSE: Removes a node from the linkedlist using an index
     */
    Delete (index)
    {
        if (index < 0 || index > this.GetLength())
        {
            console.log ("Invalid Index");
            return null;
        }

        if (this.GetLength() == 0)
        {
            console.log ("Cannot Delete");
            return null;
        }

        const value = this.inScene_.children[index].value_;

        this.inScene_.remove (this.inScene_.children[index]);

        if (this.arrows_.children.length > 0)
        {
            this.arrows_.children.pop ();
        }

        this.Rerender ();

        return value;
    }

    //override
    Rerender ()
    {
        if (this.GetLength() == 0)
        {
            return;
        }

        var x;
        var y;
        var z;

        this.inScene_.children[0].MovebyCenter (this.startingPosition_.x , this.startingPosition_.y , this.startingPosition_.z);

        for (var i = 1 ; i < this.GetLength() ; i++)
        {
            x = this.inScene_.children[i - 1].right.x + this.nodeDistance_.x;
            y = this.inScene_.children[i - 1].right.y + this.nodeDistance_.y;
            z = this.inScene_.children[i - 1].right.z + this.nodeDistance_.z;

            this.inScene_.children[i].MovebyLeft (x , y , z);
        }

        for (var j = 0 ; j < this.arrows_.children.length ; j++)
        {
            this.arrows_.children[j].SetFirstPosition (this.inScene_.children[j].right);
            this.arrows_.children[j].SetSecondPosition (this.inScene_.children[j + 1].left);
            this.arrows_.children[j].Update();
        }
    }
}

/**
 * CLASS: Stack
 * PURPOSE: A three.js implementation of a Stack that controls pushing and poping nodes.
 */
export class Stack extends BasicDS
{
    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        super (startingPosition , nodeDistance , lineMaterial);
    }

    /**
     * FUNCTION: Push
     * PURPOSE: Pushes a node to the start of a stack
     */
    Push (insertedNode)
    {
        this.inScene_.children.unshift (insertedNode);

        if (this.inScene_.children.length > 1)
        {
            this.arrows_.add (new Arrow (this.lineMaterial_ ,  2))
        }
        
        this.Rerender ();
    }

    /**
     * FUNCTION: Pop
     * PURPOSE: Popped a node from the start of a stack
     */
    Pop ()
    {

        if (this.GetLength() == 0)
        {
            console.log ("Cannot Pop");
            return null;
        }

        const value = this.inScene_.children[0].value_;

        this.inScene_.children.shift ();

        if (this.arrows_.children.length > 0)
        {
            this.arrows_.children.pop ();
        }

        this.Rerender ();

        return value;
    }

    Rerender ()
    {
        if (this.GetLength() == 0)
        {
            return;
        }

        this.inScene_.children[0].MovebyCenter (this.startingPosition_.x , this.startingPosition_.y , this.startingPosition_.z);

        var x;
        var y;
        var z;

        for (var i = 1 ; i < this.GetLength() ; i++)
        {
            x = this.inScene_.children[i - 1].center.x + this.nodeDistance_.x;
            y = this.inScene_.children[i - 1].center.y + this.nodeDistance_.y;
            z = this.inScene_.children[i - 1].center.z + this.nodeDistance_.z;
         
            this.inScene_.children[i].MovebyTop (x , y ,  z);
        }

        for (var j = 0 ; j < this.arrows_.children.length ; j++)
        {
            this.arrows_.children[j].SetFirstPosition (this.inScene_.children[j].bottom);
            this.arrows_.children[j].SetSecondPosition (this.inScene_.children[j + 1].top);
            this.arrows_.children[j].Update ();
        }
    }
}

/**
 * CLASS: Queue
 * PURPOSE: A three.js implementation of a Queue that controls enqueueing and dequeueing nodes.
 */
export class Queue extends BasicDS
{
    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        super (startingPosition , nodeDistance , lineMaterial);
    }

    /**
     * FUNCTION: Enqueue
     * PURPOSE: Enqueues a node inside the queue
     */
    Enqueue (insertedNode)
    {
        this.inScene_.children.push (insertedNode);

        if (this.inScene_.children.length > 1)
        {
            this.arrows_.add (new Arrow (this.lineMaterial_ , 2))
        }
        
        this.Rerender ();
    }

    /**
     * FUNCTION: Dequeue
     * PURPOSE: Dequeues a node from the queue
     */
    Dequeue ()
    {
        if (this.GetLength() == 0)
        {
            console.log ("Cannot Dequeue");
            return null;
        }

        const value = this.inScene_.children[0].value_;

        this.inScene_.children.shift ();

        if (this.arrows_.children.length > 0)
        {
            this.arrows_.children.pop ();
        }

        this.Rerender ();

        return value;
    }

    Rerender ()
    {
        if (this.GetLength() == 0)
        {
            return;
        }

        this.inScene_.children[0].MovebyCenter (this.startingPosition_.x , this.startingPosition_.y , this.startingPosition_.z);

        var x;
        var y;
        var z;

        for (var i = 1 ; i < this.GetLength() ; i++)
        {
            x = this.inScene_.children[i - 1].right.x + this.nodeDistance_.x;
            y = this.inScene_.children[i - 1].right.y + this.nodeDistance_.y;
            z = this.inScene_.children[i - 1].right.z + this.nodeDistance_.z;

            this.inScene_.children[i].MovebyLeft (x , y , z);
        }

        for (var j = 0 ; j < this.arrows_.children.length ; j++)
        {
            this.arrows_.children[j].SetFirstPosition (this.inScene_.children[j].right);
            this.arrows_.children[j].SetSecondPosition (this.inScene_.children[j + 1].left);
            this.arrows_.children[j].Update();
        }
    }
};


/**
 * CLASS: BasicDS
 * PURPOSE: Provides helper methods for its children to inherit
 */
class TreeDs extends BasicDS
{
    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        super (startingPosition , nodeDistance , lineMaterial);

        this.root_ = null;
        this.size_ = 0;
    }

    /**
     * FUNCTION: GetLength
     * PURPOSE: Returns the size of the tree
     */
    GetLength ()
    {
        return this.size_;
    }

    /**
     * FUNCTION: SetRoot
     * PURPOSE: An easy way to set the root of the Tree
     */
    SetRoot (node)
    {
        if (node != null)
        {
            node.parentNode_ = null;
            
        }

        this.root_ = node;
    }

    Insert (insertedNode)
    {
        // Empty
    }

    BaseInsert (insertedNode)
    {
        // null check
        if (this.root_ != null)
        {
            var value = parseFloat(insertedNode.value_);

            var currentNode = this.root_;

            // look for a position to place the node
            var keepGoing = true;
            while (keepGoing)
            {
                // I HATE TYPECASTING
                if (value > parseFloat(currentNode.GetValue())) // Go Right
                {
                    if (currentNode.rightNode_) // There is a node there
                    {
                        currentNode = currentNode.rightNode_;
                    }
                    else // There is no node there
                    {
                        var arrow = new Arrow (this.lineMaterial_ , 1.5);
                        arrow.SetFirstPosition (currentNode.bottom);
                        arrow.SetSecondPosition (insertedNode.top);
                        this.arrows_.add (arrow);

                        currentNode.SetRightNodeWithArrow (insertedNode , arrow);

                        keepGoing = false;
                    }
                }
                else // Go Left
                {
                    if (currentNode.leftNode_) // There is a node there
                    {
                        currentNode = currentNode.leftNode_;
                    }
                    else // There is no node there
                    {
                        var arrow = new Arrow (this.lineMaterial_ , 1.5);
                        arrow.SetFirstPosition (currentNode.bottom);
                        arrow.SetSecondPosition (insertedNode.top);
                        this.arrows_.add (arrow);

                        currentNode.SetLeftNodeWithArrow (insertedNode , arrow);


                        keepGoing = false;
                    }
                }
            }
        }
        else
        {
            this.SetRoot(insertedNode);
        }

        this.size_ += 1;
        this.inScene_.add (insertedNode);
    }

    Delete (value)
    {
        // Empty
    }

    BaseDelete (value)
    {
        value = parseFloat(value);

        var removedNode = this.root_;
        var parentNode;

        var isRoot = true;
        var isLeft; 

        // look for the value
        while (value != parseFloat(removedNode.value_))
        {
            isRoot = false;
            parentNode = removedNode;

            if (value > parseFloat(removedNode.value_)) // Go Right
            {
                removedNode = removedNode.rightNode_
                isLeft = false;
            }
            else // Go Left
            {
                removedNode = removedNode.leftNode_;
                isLeft = true;
            }

            if (!removedNode)
            {
                return null;
            }
        }

        var returnNode = null;
        this.inScene_.remove (removedNode);
        
        // Determine what to do to replace the node
        if (!removedNode.leftNode_ && !removedNode.rightNode_) // no children
        {
            if (!isRoot)
            {
                if (isLeft)
                {
                    this.arrows_.remove (parentNode.PopLeftArrow ());
                    parentNode.SetLeftNode (null);
                }
                else
                {
                    this.arrows_.remove (parentNode.PopRightArrow ());
                    parentNode.SetRightNode (null);
                }
                returnNode = parentNode;
            }
            else
            {
                this.SetRoot(null);
            }
        }
        else if (!removedNode.leftNode_) // only has a right child
        {
            if (!isRoot)
            {
                if (isLeft)
                {
                    this.arrows_.remove (removedNode.PopRightArrow ());
                    parentNode.SetLeftNode (removedNode.rightNode_);

                    returnNode = parentNode.leftNode_;
                }
                else
                {
                    this.arrows_.remove (removedNode.PopRightArrow ());
                    parentNode.SetRightNode (removedNode.rightNode_);

                    returnNode = parentNode.rightNode_;
                }
            }
            else
            {
                this.arrows_.remove (removedNode.PopRightArrow ());
                this.SetRoot(this.root_.rightNode_);

                returnNode = this.root_;
            }
        }   
        else if (!removedNode.rightNode_) // only has a left child
        {
            if (!isRoot)
            {
                if (isLeft)
                {
                    this.arrows_.remove (removedNode.PopLeftArrow ());
                    parentNode.SetLeftNode (removedNode.leftNode_);

                    returnNode = parentNode.leftNode_;
                }
                else
                {
                    this.arrows_.remove (removedNode.PopLeftArrow ());
                    parentNode.SetRightNode (removedNode.leftNode_);


                    returnNode = parentNode.rightNode_;
                }
            }
            else
            {
                this.arrows_.remove (removedNode.PopLeftArrow ());
                this.SetRoot(this.root_.leftNode_);
                

                returnNode = this.root_;
            }
        }
        else // both nodes are children
        {
            var rightmostParentNode;
            var righttmostNode = removedNode.leftNode_;

            while (righttmostNode.rightNode_)
            {
                rightmostParentNode = righttmostNode;
                righttmostNode = righttmostNode.rightNode_;
            }

            if (rightmostParentNode)
            {
                this.arrows_.remove (rightmostParentNode.PopRightArrow ());

                if (righttmostNode.leftNode_)
                {
                    rightmostParentNode.SetRightNodeWithArrow (righttmostNode.leftNode_ , removedNode.leftArrow_);            

                    righttmostNode.SetLeftNode (removedNode.leftNode_);
                    righttmostNode.SetRightNodeWithArrow (removedNode.rightNode_ , removedNode.rightArrow_);
                }
                else
                {
                    rightmostParentNode.SetRightNode (null);            

                    righttmostNode.SetLeftNodeWithArrow (removedNode.leftNode_ ,  removedNode.leftArrow_);
                    righttmostNode.SetRightNodeWithArrow (removedNode.rightNode_ , removedNode.rightArrow_);
                }

                returnNode = rightmostParentNode;
            }
            else
            {
                this.arrows_.remove (removedNode.PopLeftArrow ());
                righttmostNode.SetRightNodeWithArrow (removedNode.rightNode_ , removedNode.rightArrow_);

                returnNode = righttmostNode.rightNode_;
            }

            if (!isRoot)
            {
                if (isLeft)
                {
                    parentNode.SetLeftNode (righttmostNode);
                }
                else
                {
                    parentNode.SetRightNode (righttmostNode);
                }
            }
            else
            {
                this.SetRoot(righttmostNode);
            }
        }

        if (returnNode != null)
        {
            return returnNode;
        }
        else
        {
            return this.root_;
        }
    }

    

    PrintTree ()
    {
        console.log ("-----------------------------------------------");

        if (this.root_)
        {
           this.root_.Inorder ();    
        }

        console.log ("-----------------------------------------------");
    }

    Rerender ()
    {
        if (this.root_)
        {
            // Call the DrawTree method to move nodes into right positions recursively
            this.root_.DrawTree (ChildRelation.None , this.startingPosition_ , this.nodeDistance_);

            this.arrows_.children.forEach ( element => 
            {
                element.Update ();
            } );
        }
    }
}

/**
 * CLASS: BinarySearchTree
 * PURPOSE: A three.js implementation of a BinarySearchTree that controls inserting and deleting nodes.
 */
export class BinarySearchTree extends TreeDs
{

    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        super (startingPosition , nodeDistance , lineMaterial);
    }

    /**
     * FUNCTION: Insert
     * PURPOSE: Inserts a node into the binary search tree. Calls BaseInsert and Rerender
     */
    Insert (insertedNode)
    {
        this.BaseInsert (insertedNode);
        this.Rerender ();
    }

    /**
     * FUNCTION: Delete
     * PURPOSE: Deletes a node from the tree. Calls BaseDelete and Rerender
     * Returns if the value was found and deleted
     */
    Delete (value)
    {
        if (this.length == 0)
        {
            return false;
        }

        const result = this.BaseDelete (value);

        this.Rerender ();

        if (result || this.root_ == null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

/**
 * CLASS: AVL
 * PURPOSE: A implementation of an AVL Tree in Three.js. Controls deleting and inserting Nodes
 */
export class AVL extends TreeDs
{
    constructor (startingPosition , nodeDistance , lineMaterial)
    {
        super (startingPosition , nodeDistance , lineMaterial);
    }

    /**
     * FUNCTION: Insert
     * PURPOSE: Inserts a node into the tree then checks for a reblance. Also calls Rerender
     */
    Insert (insertedNode)
    {
        this.BaseInsert (insertedNode);

        this.ReBalance (insertedNode);

        this.PrintTree ();

        this.Rerender ();
    }

    /**
     * FUNCTION: Delete
     * PURPOSE: Deletes a node from the tree and then checks for a reblance. Also calls Rerender
     */
    Delete (value)
    {
        if (this.length == 0)
        {
            return false;
        }

        var node = this.BaseDelete (value);

        this.ReBalance (node);

        this.PrintTree ()

        this.Rerender ();

        if (node || this.root_ == null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * FUNCTION: Rebalance
     * PURPOSE: Checks for possible inbalances in the tree after an insert of delete.
     * Starts at node and keeps lokking until it checks the root
     */
    ReBalance (node)
    {
        if (node == null) // Safty check to prevent crashes
        {
            if (this.root_ == null)
            {
                return;
            }
            else
            {
                node = this.root_;
            }
        }

        var currentNode = node;
        var balance;

        var tempParentPTR;
        var needsChecked;
        var isLeft;

        // loops throught all nodes until all imbalances are fixed then exits
        while (currentNode)
        {
            balance = currentNode.CheckBalance ();

            // There is an imbalance
            if (Math.abs (balance) > 1)
            {
                needsChecked = true;

                tempParentPTR = currentNode.parentNode_;

                if (tempParentPTR != null)
                {
                    if (tempParentPTR.leftNode_)
                    {
                        if (tempParentPTR.leftNode_.value_ == currentNode.value_)
                        {
                            isLeft = true;
                        }
                        else
                        {
                            isLeft = false;
                        }
                    }
                    else
                    {
                        isLeft = false;
                    }
                }
            }

            if (balance > 1) // heavy left
            {
                if (currentNode.leftNode_.leftNode_)
                {
                    currentNode = this.RightRotation (currentNode);
                }
                else
                {
                    currentNode = this.LeftRightRotation (currentNode);
                }
            }

            if (balance < -1) // heavy right
            {
                if (currentNode.rightNode_.rightNode_)
                {
                    currentNode = this.LeftRotation (currentNode);
                }
                else
                {
                    currentNode = this.RightLeftRotation (currentNode);
                }
            }

            if (needsChecked)
            {
                needsChecked = false;

                // A check to make sure the tree is reordered properly
                if (tempParentPTR)
                {
                    if (isLeft)
                    {
                        tempParentPTR.SetLeftNode (currentNode);
                    }
                    else
                    {
                        tempParentPTR.SetRightNode (currentNode);
                    }
                }
                else
                {
                    if (currentNode)
                    {
                        this.SetRoot (currentNode);
                    }
                }
                
                tempParentPTR = null;
            }

            // Get next node
            currentNode = currentNode.parentNode_;
        }

    }

    /**
     * FUNCTION: RightRotation
     * PURPOSE: Performs a right rotation on a node. Has a lot of special cases.
     */
    RightRotation (node)
    {
        var t = node.leftNode_;

        // if true the tree flip is a little more complicated than normal
        if (node.rightNode_)
        {
            var count = t.GetLeftCount() - t.GetRightCount();
            if (count > 0) // Left
            {
                var t2 = t.rightNode_;
                
                t.parentNode_ = node.parentNode_;

                t.SetRightNode (node);
                node.SetLeftNode (t2);

                return t;
            }
            else // Right
            {
                var n = t.rightNode_;
                var n2;

                if (n.leftNode_)
                {
                    n2 = n.leftNode_;

                    var arrowholder = node.PopLeftArrow ();
                    node.SetLeftNode (null);

                    n.parentNode_ = node.parentNode_;
                    n.SetLeftNode(t);

                    n.SetRightNodeWithArrow (node , arrowholder);

                    t.SetRightNode(n2);

                    return n;

                }
                else
                {
                    n2 = n.rightNode_;

                    n.parentNode_ = node.parentNode_;
                    node.SetLeftNode(n2);

                    var arrowholder = t.PopRightArrow ();
                    t.SetRightNode (null);

                    n.SetLeftNodeWithArrow (t, arrowholder);

                    n.SetRightNode (node);

                    node.SetLeftNode (n2);

                    return n;
                }
            }
        }
        else // easyflip
        {
            t.parentNode_ = node.parentNode_;

            var arrowholder = node.PopLeftArrow ();
            node.SetLeftNode (null);

            t.SetRightNodeWithArrow (node , arrowholder);

            return t;
        }
    }

    /**
     * FUNCTION: LeftRotation
     * PURPOSE: Performs a left rotation on a node. Has a lot of special cases.
     */
    LeftRotation (node)
    {
        var t = node.rightNode_;

        // This special case is need since the tree favors moving nodes from the left
        if (node.leftNode_ == null && node.GetRightCount() == 3)
        {
            var n = t.leftNode_;

            var arrowholder = node.PopRightArrow ();
            var arrowholder1 = t.PopLeftArrow ();

            node.SetRightNode(null);
            t.SetLeftNode(null);

            n.parentNode_ = node.parentNode_;

            n.SetLeftNodeWithArrow (node , arrowholder);
            n.SetRightNodeWithArrow (t , arrowholder1);


            return n;
        }

        // Check if true then it is more complicated
        if (node.leftNode_)
        {
            var count = t.GetRightCount() - t.GetLeftCount();

            if (count > 0) // Right
            {
                var t2 = t.leftNode_;

                t.parentNode_ = node.parentNode_;

                t.SetLeftNode (node);
                node.SetRightNode (t2);

                return t;
            }
            else // Left
            {
                var n = t.leftNode_
                var n2;

                if (n.rightNode_)
                {
                    n2 = n.rightNode_;

                    var arrowholder = node.PopRightArrow ();
                    node.SetRightNode (null);

                    n.parentNode_ = node.parentNode_;
                    n.SetRightNode(t);

                    n.SetLeftNodeWithArrow (node , arrowholder);

                    t.SetLeftNode (n2);

                    return n;
                }
                else
                {
                    n2 = n.leftNode_;

                    n.parentNode_ = node.parentNode_;

                    var arrowholder = t.PopLeftArrow ();
                    t.SetLeftNode (null);

                    n.SetRightNodeWithArrow (t , arrowholder);

                    n.SetLeftNode (node);

                    node.SetRightNode (n2);

                    return n;
                }
            }
            
        }
        else // easyflip
        {
            t.parentNode_ = node.parentNode_;
        
            var arrowholder = node.PopRightArrow ();
            node.SetRightNode (null);

            t.SetLeftNodeWithArrow (node , arrowholder);

            return t;
        }
    }

    /**
     * FUNCTION: RightLeftRotation
     * PURPOSE: Used for a unigue Rotation
     * 
     *     node
     *         \
     *          t
     *         /
     *       t2
     */
    RightLeftRotation (node)
    {
        var t = node.rightNode_;
        var t2 = t.leftNode_;

        var arrowholder = t.PopLeftArrow ();

        t.SetLeftNode (null);
        
        node.SetRightNode (t2);
        t2.SetRightNodeWithArrow (t , arrowholder);

        var top = this.LeftRotation (node);

        return top;
    }

    /**
     * FUNCTION: RightLeftRotation
     * PURPOSE: Used for a unigue Rotation
     * 
     *     node
     *    /     
     *   t      
     *    \     
     *     t2
     */
    LeftRightRotation (node)
    {
        var t = node.leftNode_;
        var t2 = t.rightNode_;

        var arrowholder = t.PopRightArrow ();

        t.SetRightNode (null);
        
        node.SetLeftNode (t2);
        t2.SetLeftNodeWithArrow (t , arrowholder);

        var top = this.RightRotation (node);

        return top;
    }
}