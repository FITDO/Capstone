import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SingleLinkNode } from './Nodes.js';


// A list of constants of that our Linked List uses

// Max outputs for the output area
const MAXOUTPUTS = 5;

// The text path where our font is stored
const TEXTFONTPATH = '../three.js/examples/fonts/helvetiker_regular.typeface.json';

// The starting point of the Linked list
const STARTINGPOINT = -65;

// How far must nodes be apart
const MINNODEDISTANCE_X = 4;

// Scene dimensions
const SCENEHEIGHT = 725;
const SCENEWIDTH = 1535;

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
    const LinkedListNodes = new THREE.Group (); // For Nodes
    const LinkedListArrows = new THREE.Group (); // For Arrows
    const LinkedListLabels = new THREE.Group (); // For Top, Arrow, and Null

    scene.add (LinkedListNodes);
    scene.add (LinkedListArrows);
    scene.add (LinkedListLabels);

    // Get the buttons on the html page 
    const pushValue = document.getElementById ("pushValue");  
    const pushButton = document.getElementById ("pushButton");
    const popButton = document.getElementById ("popButton");
    const indexValue = document.getElementById ("insIndex");
    const insValue = document.getElementById ("indexValue");  
    const deletionIndex = document.getElementById ("delIndex");
    const insertionButton = document.getElementById ("insertButton");
    const deletionButton = document.getElementById ("deletionButton");
    const iterButton = document.getElementById ("iterationButton");

    // Get the color pickers on our html page
    const defNodeColorPicker = document.getElementById ("defaultNodeColorPicker");
    const defLineColorPicker = document.getElementById ("defaultLineColorPicker");
    
    // Get our output
    const elOutput = document.getElementById ("output");

    // A list of outputs that is used by the output area
    var outputs = [];

    // Add Event listeners to the buttons and color pickers
    pushButton.addEventListener ('click' , PushFunction);
    popButton.addEventListener ('click' , PopFunction);
    iterButton.addEventListener ('click' , IterateLinkedList);
    insertionButton.addEventListener ('click' , InsertionFunction);
    deletionButton.addEventListener ('click' , DeletionFunction);

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
     * FUNCTION: GeneraateStartingNodes
     * PURPOSE: Makes the starting nodes in the scene Top and null
     */
    
    function GenerateStartingNodes ()
    {
        // Use the fontloader load function and our text path to load
        // the meshes
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            const topPtrGeo = new TextGeometry( "Top" , {
                font: font,
                size: 3,
                height: .5
            } );

            const nullPtrGeo = new TextGeometry ( "Null" , {
                font: font,
                size: 3,
                height: .5
            } );

            const topPtrNode = new THREE.Mesh (topPtrGeo , defaultNodeColorMaterial);
            const nullPtrNode = new THREE.Mesh (nullPtrGeo , defaultNodeColorMaterial);

            var points = [];
            var midArrow = new THREE.Vector3 (STARTINGPOINT + 1.5 , 4 , 0);
            points.push (new THREE.Vector3 (STARTINGPOINT + 1.5 , 7.5 , 0));
            points.push (midArrow);
            points.push (new THREE.Vector3 (STARTINGPOINT + .5 , 6 , 0));
            points.push (midArrow);
            points.push (new THREE.Vector3 (STARTINGPOINT + 2.5 , 6 , 0));

            const arrowGeo = new THREE.BufferGeometry().setFromPoints (points);
            const arrow = new THREE.Line (arrowGeo , defaultLineColorMaterial);
            

            topPtrNode.position.x = STARTINGPOINT - 2;
            nullPtrNode.position.x = STARTINGPOINT - 2;
            topPtrNode.position.y = 8;

            LinkedListLabels.add (topPtrNode);
            LinkedListLabels.add (arrow);
            LinkedListLabels.add (nullPtrNode);
        } );
        GenerateOutput ("Linked List Initialized");
    } // end of GenerateStartingNodes ()
    
    /**
     * FUNCTION: PushFunction
     * PURPOSE: Pushes a node to the end of the linked list. Adds a arrow
     * if neccessary.
     */
    function PushFunction ()
    {
        // Checks if a value was entered
        if (!pushValue.value.trim().length) // empty check
        {
            console.log ("Entered Value is null")
            return;
        }

        // Uses the fontloader to generate the mesh
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // Generates the geometry for the mesh
            const valueGeo = new TextGeometry( pushValue.value, {
                font: font,
                size: 3,
                height: .5
            } );

            var textMesh = new SingleLinkNode (valueGeo , defaultNodeColorMaterial , pushValue.value.toString());

            // Checks if the list is empty
            if (LinkedListNodes.children.length > 0) // nodes in the Linked List
            {
                // Generates a new position to place the new mesh.
                // Gets the position of the previous node and makes a length in 'units' to move the new position forward
                // Adds 5 to give some space.
                // Each character is about 2.5 units long
                var xpos = LinkedListNodes.children.at(-1).position.x + (LinkedListNodes.children.at(-1).value.length * 2.5);
                textMesh.position.x = xpos + MINNODEDISTANCE_X;

                // Generates an arrow between nodes
                var arrow = GenerateArrow ();

                // sets the correct position
                arrow.position.x = xpos;
                arrow.position.y = 1.5;
                LinkedListArrows.add (arrow);
            }
            else // no nodes in the Linked List
            {
                // Inserts the first node then sets NULL to Invisible
                LinkedListLabels.children[2].visible = false;
                textMesh.position.x = STARTINGPOINT;
            }

            LinkedListNodes.add (textMesh);
            
        } );
        GenerateOutput (pushValue.value.toString() + " was pushed");
    }
    
    /**
     * FUNCTION: PopFunction 
     * PURPOSE: Removes the last node in the linked list
     */
    function PopFunction ()
    {
        // Check if there are any nodes to pop
        if (LinkedListNodes.children.length > 0) // There are nodes to pop
        {
            // pop the node
            var nodetxt = LinkedListNodes.children.at(-1).value;
            LinkedListNodes.remove (LinkedListNodes.children.at(-1));
            // Check if there are any arrows to pop
            // May not have any arrows even though the regular linkedlist does
            if (LinkedListArrows.children.length > 0)
            {
                LinkedListArrows.remove (LinkedListArrows.children.at(-1));
            }

            // if the nodes list is now empty set the 'null' text object to visible
            if (LinkedListNodes.children.length == 0)
            {
                LinkedListLabels.children[2].visible = true;
            }
            
            GenerateOutput (nodetxt + " was removed");
        }
        else // there are no nodes in the array
        {   
            GenerateOutput ("Pop failed");
        }
    } // end of PopFunction ()

    /**
     * FUNCTION: InsertionFunction
     * PURPOSE: Insert a value at a given index
     */
    function InsertionFunction ()
    {
        // store the index and value 
        var index = indexValue.value;
        var value = insValue.value.toString();

        // null check
        if (!index.trim().length || !value.trim().length)
        {
            console.log ("Entered Value is null")
            return;
        }

        // if the index is possible
        if (index < 0 || index > LinkedListNodes.children.length)
        {
            GenerateOutput ("Invalid Index");
            return;
        }

        // use the load function from the fontloader
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // generate the mesh geometry
            const valueGeo = new TextGeometry( value, {
                font: font,
                size: 3,
                height: .5
            } );

            var textMesh = new SingleLinkNode (valueGeo , defaultNodeColorMaterial , value);

            // check where the index is placed
            if (LinkedListNodes.children.length == index) // value is inserted at the end
            {
                if (LinkedListNodes.children.length > 0) // nodes in the Linked List
                {
                    // Generates a new position to place the new mesh.
                    // Gets the position of the previous node and makes a length in 'units' to move the new position forward
                    // Adds 5 to give some space.
                    // Each character is about 2.5 units long
                    var xpos = LinkedListNodes.children.at(-1).position.x + (LinkedListNodes.children.at(-1).value.length * 2.5);
                    textMesh.position.x = xpos + MINNODEDISTANCE_X;

                    // Generates an arrow between nodes
                    var arrow = GenerateArrow ();
                    arrow.position.x = xpos;
                    arrow.position.y = 1.5;
                    LinkedListArrows.add (arrow);
                }
                else // no nodes in the Linked List
                {
                    // Inserts the first node then sets NULL to Invisible
                    LinkedListLabels.children[2].visible = false;
                    textMesh.position.x = STARTINGPOINT;
                }
            }
            else // value is not inserted at the end
            {
                // figure out how far the distance to move is
                var distanceToMove = (value.length * 2.5) + MINNODEDISTANCE_X;

                // how many nodes have to move
                var TempListOfNodes = LinkedListNodes.children.slice (index);
                var TempListOfArrows = LinkedListArrows.children.slice (index);

                TempListOfNodes.forEach ( element => {
                    element.position.x += distanceToMove;
                });

                TempListOfArrows.forEach ( element => {
                    element.position.x += distanceToMove;
                });

                if (index == 0) // First node
                {
                    textMesh.position.x = STARTINGPOINT;

                    var arrow = GenerateArrow ();
                    arrow.position.x = STARTINGPOINT + textMesh.value.length * 2.5; 
                    arrow.position.y = 1.5;

                    LinkedListArrows.children.splice (index , 0 , arrow);
                }
                else // Not first node
                {
                    textMesh.position.x = LinkedListNodes.children.at(index - 1).position.x + LinkedListNodes.children.at(index - 1).value.length * 2.5 + MINNODEDISTANCE_X;
                    var xpos = textMesh.position.x + textMesh.value.length * 2.5;
                    var arrow = GenerateArrow ();
                    arrow.position.x = xpos;
                    arrow.position.y = 1.5;

                    LinkedListArrows.children.splice (index , 0 , arrow);
                }

                

            }
            LinkedListNodes.children.splice (index , 0 , textMesh);
        } );

        GenerateOutput ("Value " + value.toString() + " was inserted at " + index.toString());
    } // end of InsertionFunction ()

    /**
     * FUNCTION: DeletionFunction
     * PURPOSE: Remove a node at a selected index
     */
    function DeletionFunction ()
    {
        // store the index as a variable
        var index = deletionIndex.value;

        // check if a index was entered
        if (!index.trim().length)
        {
            console.log ("Entered Value is null")
            return;
        }

        // check if index is possible
        if (index < 0 || index >= LinkedListNodes.children.length)
        {
            GenerateOutput ("Invalid Index");
            return;
        }

        // checks where the node is
        if (LinkedListNodes.children.length == 1) // node is the only one there
        {
            // removes the node and set the 'null' object to be visible
            LinkedListNodes.remove (LinkedListNodes.children.at(0));
            LinkedListLabels.children.at(2).visible = true;
        }
        else if (index == LinkedListNodes.children.length - 1) // node is at the end of the list
        {
            // Remove the last node
            LinkedListNodes.remove (LinkedListNodes.children.at(-1));
            LinkedListArrows.remove (LinkedListArrows.children.at(-1));
        }
        else // node is in the middle of the list
        {
            // calculate how far every node has to move
            var distanceToMove = LinkedListNodes.children.at(index).value.length * 2.5 + MINNODEDISTANCE_X;

            // remove the correct node
            LinkedListNodes.remove (LinkedListNodes.children.at(index));
            LinkedListArrows.remove (LinkedListArrows.children.at(index));

            // get a list of all the nodes that need to move then iterate through them and move them
            var tempListNodes = LinkedListNodes.children.slice(index);
            var tempListArrows = LinkedListArrows.children.slice(index);

            tempListNodes.forEach ( element => {
                element.position.x -= distanceToMove;
            } );
            
            tempListArrows.forEach ( element => {
                element.position.x -= distanceToMove;
            } );
        }

        GenerateOutput ("Index " + index + " was removed");
    } // end of DeletionFunction ()


    /**
     * FUNCTION: GenerateArrow ()
     * PURPOSE: Makes an arrow for the linkedlist to use
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
     * FUNCTION: IterateLinkedList ()
     * PURPOSE: Iterates through Linked List and sends them to the Output Area
     */
    function IterateLinkedList ()
    {
        
        // A string to store the values
        var iterString = "[ ";

        // iterates through each node and stores the value
        LinkedListNodes.children.forEach ( element => {
            
            iterString += element.value + " ";
        } );

        iterString += "]";

        // Calls the GenerateOutput function
        GenerateOutput (iterString);
    } // end of IterateLinkedList ()


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

main ();