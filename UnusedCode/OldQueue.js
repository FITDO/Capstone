import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// A list of constants of that our Queue uses

// Max outputs for the output area
const MAXOUTPUTS = 5;

// The text path where our font is stored
const TEXTFONTPATH = '../three.js/examples/fonts/helvetiker_regular.typeface.json';

// The starting point of the Queue
const STARTINGPOINT = -65;

// How far must nodes be apart
const MINNODEDISTANCE_X = 4;

// Scene dimensions
const SCENEHEIGHT = 725;
const SCENEWIDTH = 1535;

/**
 * CLASS: MeshWithValue
 * PURPOSE: A mesh with a value solves the issue of not being
 * able to retrieve the value of a node.
 */
class MeshWithValue extends THREE.Mesh
{
    constructor(geometry , material , val) {
        super (geometry , material);
        this.value = val;
    }
}

// Main sets everything up
function main ()
{
    
    // Declare basic variables that are used to set up the scene

    const scene = new THREE.Scene();
    scene.background = new THREE.Color (0xb6b6b6);
    const camera = new THREE.PerspectiveCamera 
    (
        45 ,
        SCENEWIDTH / SCENEHEIGHT , 
        1 ,
        1000
    );
    camera.position.set( 0 , 0 , 100 );

    // Set the renderer up and attach it to the sceneContanier on the html page
    const renderer = new THREE.WebGLRenderer ();
    renderer.setSize (SCENEWIDTH , SCENEHEIGHT);
    const sceneContanier = document.getElementById ("sceneContanier");
    sceneContanier.appendChild (renderer.domElement);
    
    // the orbital controls and font loader to gener the meshes and drag the scene
    const controls = new OrbitControls( camera, renderer.domElement );
    const fontLoader = new FontLoader();

    // A few materials for the nodes
    const defaultNodeColorMaterial = new THREE.MeshBasicMaterial ( {color: 0x0000ff} ); // blue
    const defaultLineColorMaterial = new THREE.MeshBasicMaterial ( {color: 0xff0000} ); // red

    // A set of groups to control the meshes in the scenes
    const QueueNodes = new THREE.Group (); // For Nodes
    const QueueArrows = new THREE.Group (); // For Arrows
    const QueueLabels = new THREE.Group (); // For Top, Arrow, and Null

    scene.add (QueueNodes);
    scene.add (QueueArrows);
    scene.add (QueueLabels);

    const enqueueValue = document.getElementById ("enqueueValue");  
    const enqueueButton = document.getElementById ("enqueueButton");
    const dequeueButton = document.getElementById ("dequeueButton");

    const defNodeColorPicker = document.getElementById ("defaultNodeColorPicker");
    const defLineColorPicker = document.getElementById ("defaultLineColorPicker");
    
    // Get the output
    const elOutput = document.getElementById ("output");

    // A list of outputs that is used by the output area
    var outputs = [];

    enqueueButton.addEventListener ('click' , EnqueueFunction);
    dequeueButton.addEventListener ('click' , DequeueFunction);


    defNodeColorPicker.addEventListener ('input' , NodeColorChange);
    defLineColorPicker.addEventListener ('input' , LineColorChange);

    GenerateStartingNodes ();

    // end of main call animate ()
    animate();

    /**
     * FUNCTION: animate
     * PURPOSE: Renders the scene every frame
     */
    function animate () 
    {
        requestAnimationFrame( animate );

        controls.update ();

        renderer.render( scene, camera );
    } // end of animate ()

    /**
     * FUNCTION: NodeColorChange
     * PURPOSE: Called everytime the Node color picker is changed
     */
    function NodeColorChange ()
    {
        // Set the material's hex to a new hext using the GetColor Function
        defaultNodeColorMaterial.color.setHex (GetColor(defNodeColorPicker.value));
    } // end of NodeColorChange ()

    /**
     * FUNCTION: LineColorChange
     * PURPOSE: Called everytime the Line color picker is changed
     */
    function LineColorChange ()
    {
        // Set the material's hex to a new hext using the GetColor Function
        defaultLineColorMaterial.color.setHex (GetColor(defLineColorPicker.value));
    } // end of LineColorChange ()

    /**
     * FUNCTION: GetColor
     * PARAMETERS: hexColor -> recieved as the incorrect format
     * RETURNS: string -> a hex value in the correct formate
     * PURPOSE: Changes the format recived from the color picker and changes it to the
     * correct format three.js uses
     */
    function GetColor (hexvalue)
    {
        return '0x' + hexvalue.slice (1);
    } // end of GetColor (hexvalue)

    /**
     * FUNCTION: GenerateStartingNodes
     * PURPOSE: A method to set up the starting nodes in the scene.
     * Generates the Front mesh, 2 arrows, and Back mesh
     */
    function GenerateStartingNodes ()
    {
        // Use the fontloader load function and our text path to load
        // the meshes
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // Generates all the Geometries

            const frontPtrGeo = new TextGeometry( "Front" , {
                font: font,
                size: 3,
                height: .5
            } );

            const nullPtrGeo = new TextGeometry ( "Null" , {
                font: font,
                size: 3,
                height: .5
            } );

            const backPtrGeo = new TextGeometry ("Back" , {
                font: font,
                size: 3,
                height: .5
            })

            // Constructs the meshes

            const frontPtrNode = new THREE.Mesh (frontPtrGeo , defaultNodeColorMaterial);
            const nullPtrNode = new THREE.Mesh (nullPtrGeo , defaultNodeColorMaterial);
            const backPtrNode = new THREE.Mesh (backPtrGeo , defaultNodeColorMaterial);

            // Used to make the geometry for the down arrow
            var downpoints = [];
            var midArrow = new THREE.Vector3 (0 , 0 , 0);
            downpoints.push (new THREE.Vector3 (0 , 3.5 , 0));
            downpoints.push (midArrow);
            downpoints.push (new THREE.Vector3 (1 , 1.5 , 0));
            downpoints.push (midArrow);
            downpoints.push (new THREE.Vector3 (-1 , 1.5 , 0));

            const downarrowGeo = new THREE.BufferGeometry().setFromPoints (downpoints);
            const downarrow = new THREE.Line (downarrowGeo , defaultLineColorMaterial);

            // Used to make the arrow for the up arrow
            var Uppoints = [];
            Uppoints.push (new THREE.Vector3 (0 , -3.5 , 0));
            Uppoints.push (midArrow);
            Uppoints.push (new THREE.Vector3 (1 , -1.5 , 0));
            Uppoints.push (midArrow);
            Uppoints.push (new THREE.Vector3 (-1 , -1.5 , 0));

            const uparrowGeo = new THREE.BufferGeometry().setFromPoints (Uppoints);
            const uparrow = new THREE.Line (uparrowGeo , defaultLineColorMaterial);

            // Sets all positons for the labels
            downarrow.position.x = STARTINGPOINT + 1.5;
            downarrow.position.y = 3.5;
            
            uparrow.position.x = STARTINGPOINT + 1.5;
            uparrow.position.y = -1;

            frontPtrNode.position.x = STARTINGPOINT - 3;
            backPtrNode.position.x = STARTINGPOINT - 3;
            nullPtrNode.position.x = STARTINGPOINT - 2;
            
            frontPtrNode.position.y = 8;
            backPtrNode.position.y = -8;

            // Adds all Labels to the scene

            QueueLabels.add (frontPtrNode);
            QueueLabels.add (downarrow);
            QueueLabels.add (nullPtrNode);
            QueueLabels.add (uparrow);
            QueueLabels.add (backPtrNode);
        } );
        GenerateOutput ("Queue Initialized");
    } // end of GenerateStartingNodes ()

    /**
     * FUNCTION: PushFunction
     * PURPOSE: Pushes a node to the end of the Queue. Adds a arrow
     * if neccessary.
     */
    function EnqueueFunction ()
    {
        // Checks if a value was entered
        if (!enqueueValue.value.trim().length) // empty check
        {
            console.log ("Entered Value is null")
            return;
        }

        // Uses the fontloader to generate the mesh
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // Generates the geometry for the mesh
            const valueGeo = new TextGeometry( enqueueValue.value, {
                font: font,
                size: 3,
                height: .5
            } );

            var textMesh = new MeshWithValue (valueGeo , defaultNodeColorMaterial , enqueueValue.value.toString());

            // Checks if the Queue is empty
            if (QueueNodes.children.length > 0) // nodes in the Queue
            {
                // Generates a new position to place the new mesh.
                // Gets the position of the previous node and makes a length in 'units' to move the new position forward
                // Adds 5 to give some space.
                // Each character is about 2.5 units long
                var xpos = QueueNodes.children.at(-1).position.x + (QueueNodes.children.at(-1).value.length * 2.5);
                textMesh.position.x = xpos + MINNODEDISTANCE_X;

                // Generates an arrow between nodes
                var arrow = GenerateArrow ();

                // sets the correct position
                arrow.position.x = xpos;
                arrow.position.y = 1.5;
                
                
                QueueArrows.add (arrow);

            }
            else // no nodes in the Queue
            {
                // Inserts the first node then sets NULL to Invisible
                QueueLabels.children[2].visible = false;
                textMesh.position.x = STARTINGPOINT - ((enqueueValue.value.length * 2.5) / 2);
            }

            QueueNodes.add (textMesh);
            CenterLabels ();

        } );
        GenerateOutput (enqueueValue.value.toString() + " was pushed");
    }

    /**
     * FUNCTION: DequeueFunction
     * PURPOSE: Tries to remove the front node from the Queue. Removes 
     * a arrow if neccessary. Then moves all nodes back
     */
    function DequeueFunction ()
    {
        // Check if there are any nodes to pop
        if (QueueNodes.children.length > 0) // There are nodes to pop
        {
            // Store the removed node
            var removedNode = QueueNodes.children.at(0);

            // Generates a distance to move the nodes 
            var distanceToMove = removedNode.value.length * 2.5;
            
            // removes the node
            QueueNodes.remove (removedNode);

            
            if (QueueArrows.children.length > 0) // an arrow needs to be removed
            {
                // removes the arrow
                QueueArrows.remove (QueueArrows.children.at(0));

                // adds the distance to move
                distanceToMove += MINNODEDISTANCE_X;
            }

            // moves all nodes back
            QueueNodes.children.forEach (element => 
            {
                element.position.x -= distanceToMove;
            } );

            // moves all arrows back
            QueueArrows.children.forEach (element => 
            {
                element.position.x -= distanceToMove;
            } );

            // if the nodes list is now empty set the 'null' text object to visible
            if (QueueNodes.children.length == 0)
            {
                QueueLabels.children[2].visible = true;
            }

            // Used to center the labels 
            CenterLabels ();
            
            GenerateOutput (removedNode.value + " was removed");
        }
        else // there are no nodes in the array
        {   
            GenerateOutput ("Pop failed");
        }
    }

    /**
     * FUNCTION: CeneterLabels
     * PURPOSE: When Nodes are added are removed the labels meed to be recentered
     */
    function CenterLabels ()
    {
        if (QueueNodes.children.length > 0) // nodes are in the list
        {
            // find new positions
            var frontposition = QueueNodes.children.at(0).position.x + ((QueueNodes.children.at(0).value.length * 2.5) / 2);
            var backposition = QueueNodes.children.at(-1).position.x + ((QueueNodes.children.at(-1).value.length * 2.5) / 2);
            
            // set new positions
            QueueLabels.children.at(0).position.x = frontposition - 4.5;
            QueueLabels.children.at(1).position.x = frontposition;
            QueueLabels.children.at(3).position.x = backposition;
            QueueLabels.children.at(4).position.x = backposition - 5;
        }
        else // no nodes are in the list
        {
            // set starting positions
            QueueLabels.children.at(0).position.x = STARTINGPOINT - 3;
            QueueLabels.children.at(1).position.x = STARTINGPOINT + 1.5;
            QueueLabels.children.at(3).position.x = STARTINGPOINT + 1.5;
            QueueLabels.children.at(4).position.x = STARTINGPOINT - 3;
        }
        
    }
    
    /**
     * FUNCTION: GenerateArrow ()
     * PURPOSE: Makes an arrow for the queue to use
     * RETURNS: a line object in the form as an arrow that can be moved arround
     */
    function GenerateArrow ()
    {
        // an array of points
        var points = [];
        
        // all the arrow points to generate an arrow
        points.push (new THREE.Vector3 (0 , 0 , 0));
        points.push (new THREE.Vector3 (MINNODEDISTANCE_X , 0 , 0));
        points.push (new THREE.Vector3 (MINNODEDISTANCE_X - 1 , 1 , 0));
        points.push (new THREE.Vector3 (MINNODEDISTANCE_X , 0 , 0));
        points.push (new THREE.Vector3 (MINNODEDISTANCE_X - 1, -1 , 0));

        const arrowGeo = new THREE.BufferGeometry().setFromPoints (points);
        const arrow = new THREE.Line (arrowGeo , defaultLineColorMaterial);

        return arrow;
    } // end of GenerateArrow ()


    /**
     * FUNCTION: GenerateOutput ()
     * PARAMETERS: ouputText -> String : A String to add to the output area on the html page
     * PURPOSE: Provides an easy way to add text output to an output area on the html page.
     * Removes text from the page to prevent crowding when their is too much.
    **/    
    function GenerateOutput (outputText)
    {
        // Add new text to array if there is too many
        outputs.push (outputText);

        // If true removes the first index from the array
        if (outputs.length > MAXOUTPUTS)
        {
            outputs.shift ();
        }

        // Resets the text then adds each element
        elOutput.innerHTML = "";
        outputs.forEach( element => {
            elOutput.innerHTML += element + "<br>";
        } );
        
    } // end of GenerateOutput (string)

} // end of main ()


// Call main
main ();