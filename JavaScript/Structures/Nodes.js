import * as THREE from 'three';

/**
 * CKASS: BASICNODE
 * PURPOSE: Provides helper methods to the mesh class from three.js
 * Methods for moving the node around and get positions on the node
 * Also stores a value as a string for data keeping.
 */
export class BasicNode extends THREE.Mesh
{
    /**
     * FUNCTION: constructor
     * PURPOSE: Sets the initial values
     *  geometry - the geometry of the mesh
     *  material - the material of the mesh
     *  value - the value of the mesh usally a int
     */
    constructor (geometry , material , value)
    {
        super (geometry , material);
        this.value_ = value;

        this.boundbox = new THREE.Box3().setFromObject(this);


        // This is akward but Position dosent initialize til the end of the constructor
        // small work around
        this.size = this.boundbox.getCenter(new THREE.Vector3());
        this.size.x *= 2;
        this.size.y *= 2;
        this.size.z *= 2;

        this.center = new THREE.Vector3();

        this.top = new THREE.Vector3();
        this.left = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.bottom = new THREE.Vector3();
        
        this.center = this.boundbox.getCenter(new THREE.Vector3);

        this.top.set (this.center.x , this.position.y + this.size.y , this.center.z);
        this.left.set (this.position.x , this.center.y , this.center.z);
        this.right.set (this.position.x + this.size.x , this.center.y , this.center.z);
        this.bottom.set (this.center.x , this.position.y , this.center.z);
    }

    /**
     * FUNCTION: GetCenter
     * PURPOSE: returns the center position of the mesh
     */
    GetCenter ()
    {
        return this.center;
    }

    /**
     * FUNCTION: GetTop
     * PURPOSE: returns the top position of the mesh
     */
    GetTop ()
    {
        return this.top;
    }

    /**
     * FUNCTION: GetLeft
     * PURPOSE: returns the left position of the mesh
     */
    GetLeft ()
    {
        return this.left;
    }

    /**
     * FUNCTION: GetRight
     * PURPOSE: returns the right position of the mesh
     */
    GetRight ()
    {
        return this.right;
    }

    /**
     * FUNCTION: GetBottom
     * PURPOSE: returns the bottom position of the mesh
     */
    GetBottom ()
    {
        return this.bottom;
    }

    /**
     * FUNCTION: GetValue
     * PURPOSE: returns the value of the mesh as a string
     */
    GetValue ()
    {
        return this.value_;
    }

    /**
     * FUNCTION: Move
     * PURPOSE: Moves the mesh using the default position value (bottom left corner)
     */
    Move (x , y = this.position.y , z = this.position.z)
    {
        this.position.set( x , y , z);


        this.boundbox.setFromObject(this);
        this.boundbox.getCenter(this.center);

        // Update other positions
        this.top.set (this.center.x , this.position.y + this.size.y , this.center.z);
        this.left.set (this.position.x , this.center.y , this.center.z);
        this.right.set (this.position.x + this.size.x , this.center.y , this.center.z);
        this.bottom.set (this.center.x , this.position.y , this.center.z);
    }

    /**
     * Function: MovebyCenter
     * PURPOSE: Moves the node using the center position 
     */
    MovebyCenter (x , y = this.center.y , z = this.center.z)
    {
        this.center.set ( x , y , z);

        this.position.x = this.center.x - (this.size.x / 2);
        this.position.y = this.center.y - (this.size.y / 2);
        this.position.z = this.center.z - (this.size.z / 2);

        this.boundbox.setFromObject(this);

        // update other positions
        this.top.set (this.center.x , this.position.y + this.size.y , this.center.z);
        this.left.set (this.position.x , this.center.y , this.center.z);
        this.right.set (this.position.x + this.size.x , this.center.y , this.center.z);
        this.bottom.set (this.center.x , this.position.y , this.center.z);
    }

    /**
     * Function: MovebyLeft
     * PURPOSE: Moves the node using the left position 
     */
    MovebyLeft (x , y = this.left.y , z = this.left.z)
    {
        this.left.set (x , y , z);

        this.position.x = this.left.x;
        this.position.y = this.left.y - (this.size.y / 2);
        this.position.z = this.left.z - (this.size.z / 2);

        this.boundbox.setFromObject(this);
        this.boundbox.getCenter(this.center);

        // update the other positions
        this.top.set (this.center.x , this.position.y + this.size.y , this.center.z);
        this.right.set (this.position.x + this.size.x , this.center.y , this.center.z);
        this.bottom.set (this.center.x , this.position.y , this.center.z);
    }

    /**
     * Function: MovebyRight
     * PURPOSE: Moves the node using the right position 
     */
    MovebyRight (x , y = this.right.y , z = this.right.z)
    {
        this.right.set (x , y , z);

        this.position.x = this.right.x - this.size.x;
        this.position.y = this.right.y - (this.size.y / 2);
        this.position.z = this.right.z - (this.size.z / 2);

        this.boundbox.setFromObject(this);
        this.boundbox.getCenter(this.center);

        this.top.set (this.center.x , this.position.y + this.size.y , this.center.z);
        this.left.set (this.position.x , this.center.y , this.center.z);
        this.bottom.set (this.center.x , this.position.y , this.center.z);
    }

    /**
     * Function: MovebyTop
     * PURPOSE: Moves the node using the top position 
     */
    MovebyTop (x , y = this.top.y , z = this.top.z)
    {
        this.top.set (x , y , z);

        this.position.x = this.top.x - (this.size.x / 2);
        this.position.y = this.top.y - this.size.y;
        this.position.z = this.top.z - (this.size.z / 2);

        this.boundbox.setFromObject(this);
        this.boundbox.getCenter(this.center);

        // update the other positions
        this.left.set (this.position.x , this.center.y , this.center.z);
        this.right.set (this.position.x + this.size.x , this.center.y , this.center.z);
        this.bottom.set (this.center.x , this.position.y , this.center.z);
    }

    /**
     * Function: MovebyBottom
     * PURPOSE: Moves the node using the bottom position 
     */
    MovebyBottom (x , y = this.bottom.y , z = this.bottom.z)
    {
        this.bottom.set (x , y , z);

        this.position.x = this.bottom.x - (this.size.x / 2);
        this.position.y = this.bottom.y;
        this.position.z = this.bottom.z - (this.size.z / 2);

        this.boundbox.setFromObject(this);
        this.boundbox.getCenter(this.center);

        // update the other positions
        this.top.set (this.center.x , this.position.y + this.size.y , this.center.z);
        this.left.set (this.position.x , this.center.y , this.center.z);
        this.right.set (this.position.x + this.size.x , this.center.y , this.center.z);
    }
}

/**
 * An enum to keep track of a binarysearchtree node's relation to
 * it's parent
 */
export const ChildRelation = {
    None: 0, // Used If Node is Root
    Left: 1,
    Right: 2
}

/**
 * Class: TreeNode
 * A three.js implmentation of a tree node. Main purpose is to
 * keep track of children nodes and arrows.
 */
export class TreeNode extends BasicNode
{
    /**
     * FUNCTION: Constructor
     * PURPOSE: Sets default values for a binarytreeNode
     */
    constructor (geometry , material , value , l = null , r = null) 
    {
        super (geometry , material , value);
        this.leftNode_ = l;
        this.rightNode_ = r;

        this.rightArrow_ = null;
        this.leftArrow_ = null;

        this.parentNode_ = null;
    }

    /**
     * FUNCTION: SetLeftNode
     * PURPOSE: Sets the left child node of the current node.
     * Sets the node and changes the arrow property
     */
    SetLeftNode (ln)
    {
        this.leftNode_ = ln;

        if (ln == null)
        {
            // remove the relationship to the arrow
            this.leftArrow_ = null;
        }
        else if (this.leftArrow_ != null)
        {
            this.leftArrow_.SetSecondPosition (ln.top);
        }

        if (ln != null)
        {   
            ln.SetParent (this);
        }
    }

    /**
     * FUNCTION: SetRightNode
     * PURPOSE: Sets the right child node of the current node.
     * Sets the node and changes the arrow property
     */
    SetRightNode (rn)
    {
        this.rightNode_ = rn;

        if (rn == null)
        {
            // remove the relationship to the arrow
            this.rightArrow_ = null;
        }
        else if (this.rightArrow_ != null)
        {
            this.rightArrow_.SetSecondPosition (rn.top);
        }

        if (rn != null)
        {
            rn.SetParent (this);
        }
    }

    /**
     * FUNCTION: SetLeftNodeWithArrow
     * PURPOSE: Sets the left node and sets the left arrow
     */
    SetLeftNodeWithArrow (ln , arrow)
    {
        this.leftNode_ = ln;
        this.leftArrow_ = arrow;
        this.leftArrow_.SetFirstPosition (this.bottom);
        this.leftArrow_.SetSecondPosition (ln.top);

        if (ln != null)
        {   
            ln.SetParent (this);
        }
    }

    /**
     * FUNCTION: SetRightNode
     * PURPOSE: Sets the right node and sets the right arrow
     */
    SetRightNodeWithArrow (rn , arrow)
    {
        this.rightNode_ = rn;
        this.rightArrow_ = arrow;
        this.rightArrow_.SetFirstPosition (this.bottom);
        this.rightArrow_.SetSecondPosition (rn.top);

        if (rn != null)
        {
            rn.SetParent (this);
        }
    }

    /**
     * FUNCTION: PopLeftArrow
     * PURPOSE: Removes the relationship to the left arrow
     */
    PopLeftArrow ()
    {
        var ln = this.leftArrow_;
        this.leftArrow_ = null;

        return ln;
    }

    /**
     * FUNCTION: PopRightArrow
     * PURPOSE: Removes the relationship to the right arrow
     */
    PopRightArrow ()
    {
        var rn = this.rightArrow_;
        this.rightArrow_ = null;

        return rn;
    }

    /**
     * FUNCTION: GetTotalChildren
     * PURPOSE: Gets the total number of children a node has as an int
     */
    GetTotalChildren ()
    {
        return this.GetLeftCount() + this.GetRightCount();
    }

    /**
     * FUNCTION: GetLeftCount
     * PURPOSE: Gets the total number of left children a node has
     */
    GetLeftCount ()
    {
        if (this.leftNode_)
        {
            return this.leftNode_.GetTotalChildren () + 1;
        }
        else
        {
            return 0;
        }
    }

    /**
     * FUNCTION: GetLeftCount
     * PURPOSE: Gets the total number of left children a node has
     */
    GetRightCount ()
    {
        if (this.rightNode_)
        {
            return this.rightNode_.GetTotalChildren () + 1;
        }
        else
        {
            return 0;
        }
    }

    /**
     * FUNCTION: UpdateLeftArrow
     * PURPOSE: Updates the position of a left arrow needed if left node is ever changed.
     */
    UpdateLeftArrow ()
    {
        if (this.leftArrow_)
        {
            if (this.leftNode_)
            {
                this.leftArrow_.SetSecondPosition (this.leftNode_);
            }
            else
            {
                return this.leftArrow_;
            }
        }
    }

    /**
     * FUNCTION: UpdateRightArrow
     * PURPOSE: Updates the position of a right arrow needed if right node is ever changed.
     */
    UpdateRightArrow ()
    {
        if (this.rightArrow_)
        {
            if (this.rightNode_)
            {
                this.rightArrow_.SetSecondPosition (this.rightNode_);
            }
            else
            {
                return this.rightArrow_;
            }
        }
    }

    /**
     * FUNCTION: SetParent
     * PURPOSE: Sets the parent of the current node used to simulate recursion
     */
    SetParent (parentnode)
    {
        this.parentNode_ = parentnode;
    }

    /**
     * FUNCTION: MOVETREENODE
     * PURPOSE: Recursavily moves nodes around using their relationship to the parent.
     * cr - The child relation to its parent used to determine how to set the x position
     * parentX - The X of the parent node 
     * parentY - The Y of the parent node
     * xDis - the default distance between the nodes along the x axis
     * yDis - the default distance between the nodes along the y axis
     */
    DrawTree (cr , parentPoint , nodeDistance)
    {
        // switch case to determine how to calculate the new positions
        switch (cr)
        {
            case ChildRelation.Left:

                // Node will be moved one layer down and to the left of the parent node
                var x = parentPoint.x - (this.GetRightCount() + 1 ) * nodeDistance.x;
                var y = parentPoint.y - nodeDistance.y;
                var z = parentPoint.z - (this.GetRightCount() + 1 ) * nodeDistance.z;

                this.MovebyCenter (x , y , z);
                break;

            case ChildRelation.Right:

                // Node will be moved one layer down and to the right of the parent node
                var x = parentPoint.x + (this.GetLeftCount() + 1) * nodeDistance.x;
                var y = parentPoint.y - nodeDistance.y;
                var z = parentPoint.z + (this.GetLeftCount() + 1) * nodeDistance.z;

                this.MovebyCenter (x , y , z);
                break;

            case ChildRelation.None:

                // This node is the root so parentX and parentY will be its position 
                this.MovebyCenter (parentPoint.x , parentPoint.y , parentPoint.z);
                break;
            default:
                console.log ("Something went wrong");
                break;
        }


        // Recursivaly call the MoveTreeNode function for the children if they are not null

        
        if (this.leftNode_) 
        {
            this.leftNode_.DrawTree (ChildRelation.Left , this.center , nodeDistance);
        }
        
        if (this.rightNode_)
        {
            this.rightNode_.DrawTree (ChildRelation.Right , this.center , nodeDistance);
        }
    }

    /**
     * FUNCTION: Inorder
     * PURPOSE: Used to recusivly print the values of a tree
     */
    Inorder (output)
    {
        if (this.leftNode_)
        {
            this.leftNode_.Inorder (output);
        }

        if (this.parentNode_)
        {
            console.log ("Value: " + this.value_ + "'s Parent is " + this.parentNode_.value_);
        }
        else
        {
            console.log("Value: " + this.value_ + " is Root");
        }
        

        if (this.rightNode_)
        {
            this.rightNode_.Inorder (output);
        }
    }
}


export class AVLTreeNode extends TreeNode
{
    constructor (geometry , material , value , parentnode = null , l = null , r = null)
    {
        super (geometry , material , value , l , r);
    } 

    /**
     * FUNCTION: CheckBalance
     * PURPOSE: Returns the balance factor of a node
     * 
     * if 0 then the node is balanced
     * if less than 0 the node is right heavy
     * if greater than 0 the node is left heavy
     */
    CheckBalance ()
    {
        var leftBalance = 0;
        var rightBalance = 0;

        if (this.leftNode_)
        {
            leftBalance = this.leftNode_.GetLevel() + 1;
        }
        
        if (this.rightNode_)
        {
            rightBalance = this.rightNode_.GetLevel() + 1;
        }

        return (leftBalance - rightBalance);
    }

    /**
     * FUNCTION: GetLevel
     * PURPOSE: Returns the level of the of the node
     */
    GetLevel ()
    {
        var llevel = 0;
        var rlevel = 0;

        if (this.leftNode_)
        {
            llevel = this.leftNode_.GetLevel () + 1;
        }

        if (this.rightNode_)
        {
            rlevel = this.rightNode_.GetLevel () + 1;
        }

        if (llevel > rlevel)
        {
            return llevel;
        }
        else
        {
            return rlevel;
        }
    }
}