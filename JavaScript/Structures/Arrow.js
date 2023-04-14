import * as THREE from 'three';

/**
 * CLASS: Arrow
 * PURPOSE: Used to show relations between nodes in
 * a scene.
 */
export class Arrow extends THREE.Line
{
    /**
     * CONSTRUCTOR
     * 
     * material - the material the object uses
     * firstposition - the first position of the arrow. the non pointed one. Takes a Vector3
     * secondPositon - the second position of the arrow. 
     * arrowSize - controls how big the arrow head is
     */
    constructor (material , arrowSize = 1.5 ,  firstPosition = null , secondPosition = null)
    {
        super ();

        this.material = material;
        
        this.points = [];
        this.arrowSize_ = arrowSize;

        this.marker = new THREE.Vector3 ();
        
        // null check
        if (firstPosition && secondPosition)
        {
            this.points.push (firstPosition);
            this.points.push (secondPosition);
            this.points.push (new THREE.Vector3(this.points[1].x - this.difference , this.points[1].y + this.difference , this.points[1].z));
            this.points.push (secondPosition);
            this.points.push (new THREE.Vector3(this.points[1].x - this.difference , this.points[1].y - this.difference , this.points[1].z));
        }
        else
        {
            this.points.push (new THREE.Vector3());
            this.points.push (new THREE.Vector3());
            this.points.push (new THREE.Vector3());
            this.points.push (new THREE.Vector3());
            this.points.push (new THREE.Vector3());
        }
    }

    /**
     * FUNCTION: Update
     * PURPOSE: Should be called everytime the positions move. This allows the tracking
     * effects.
     */
    Update ()
    {

        var angleRadians = Math.atan2 (this.points[1].y - this.points[0].y , this.points[1].x - this.points[0].x);

        this.marker.x = this.points[1].x - (this.arrowSize_ * (.5 * Math.cos(angleRadians)));
        this.marker.y = this.points[1].y - (this.arrowSize_ * (.5 * Math.sin(angleRadians)));
        this.marker.z = this.points[1].z;

        this.points[2].x = this.marker.x - (this.arrowSize_ * (.5 * Math.sin(angleRadians)));
        this.points[2].y = this.marker.y + (this.arrowSize_ * (.5 * Math.cos(angleRadians)));
        this.points[2].z = this.marker.z;

        this.points[4].x = this.marker.x + (this.arrowSize_ * (.5 * Math.sin(angleRadians)));
        this.points[4].y = this.marker.y - (this.arrowSize_ * (.5 * Math.cos(angleRadians)));
        this.points[4].z = this.marker.z;

        this.geometry.setFromPoints (this.points);
    }

    /**
     * FUNCTION: Check
     * PURPOSE: Checks both positions to see if either are null.
     * RETURNS:
     *  true - If both are not null
     *  false - if one or both is null
     * 
     */
    Check ()
    {
        if (this.firstMesh && this.pointerMesh)
        {
            return true;
        }
        else // either was null
        {
            return false;
        }
    }

    /**
     * FUNCTION: SetFirstPosition
     * PURPOSE: Sets the firstposition variable to a new position
     */
    SetFirstPosition (firstPosition)
    {
        this.firstPosition = firstPosition;
        this.points[0] = this.firstPosition;
    }

    /**
     * FUNCITON: SetSecondPosition
     * PURPOSE: Sets the secondposition variable to a new position 
     */
    SetSecondPosition (secondPosition)
    {
        this.secondPosition = secondPosition;
        this.points[1] = this.secondPosition;
        this.points[3] = this.secondPosition;
    }


    /**
     * FUNCTION: GetFirstPosition
     * PURPOSE: Returns the firstposition variable
     */
    GetFirstPosition ()
    {
        return this.firstPosition;
    }

    /**
     * FUNCTION: GetSecondPosition
     * PURPOSE: Returns the secondposition variable
     */
    GetSecondPosition ()
    {
        return this.secondPosition;
    }
}