import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { BasicNode } from "./Structures/Nodes.js"
import { LinkedList } from './Structures/DataStructures.js';


// A list of constants of that our Linked List uses

// Max outputs for the output area
const MAXOUTPUTS = 5;

// The text path where our font is stored
const TEXTFONTPATH = '../three.js/examples/fonts/helvetiker_regular.typeface.json';

// The starting point of the Linked list
const STARTINGPOINT = new THREE.Vector3 (-65 , 0 , 0);

// How far must nodes be apart
const NODEDISTANCE = new THREE.Vector3 (5 , 0 , 0);

// Scene dimensions
const SCENEHEIGHT = 725;


// Main sets everything up
function main ()
{
    
    // Declare basic variables that are used to set up the scene

    const scene = new THREE.Scene();
    scene.background = new THREE.Color (0xb6b6b6);
    const camera = new THREE.PerspectiveCamera 
    (
        45 ,
        (window.innerWidth - 325) / SCENEHEIGHT , 
        1 ,
        1000
    );
    camera.position.set( 0 , 0 , 100 );

    // Set the renderer up and attach it to the sceneContanier on the html page
    const renderer = new THREE.WebGLRenderer ();
    renderer.setSize (window.innerWidth - 325 , SCENEHEIGHT);
    const sceneContanier = document.getElementById ("sceneContanier");
    sceneContanier.appendChild (renderer.domElement);
    
    // the orbital controls and font loader to generate the meshes and control the scene
    const controls = new OrbitControls ( camera, renderer.domElement );
    const fontLoader = new FontLoader ();

    // A few materials for the nodes
    const nodeColorMaterial = new THREE.MeshBasicMaterial ( {color: 0x0000ff} ); // blue
    const lineColorMaterial = new THREE.MeshBasicMaterial ( {color: 0xff0000} ); // red
    
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
    const nodeColorPicker = document.getElementById ("nodeColorPicker");
    const lineColorPicker = document.getElementById ("lineColorPicker");
    
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

    nodeColorPicker.addEventListener ('input' , NodeColorChange);
    lineColorPicker.addEventListener ('input' , LineColorChange);


    // Add event listener to window resize to make sure scene always fits
    window.addEventListener ( "resize" , OnWindowResize );


    const myLinkedList = new LinkedList (STARTINGPOINT , NODEDISTANCE , lineColorMaterial);
    myLinkedList.AddToScene (scene);

    elOutput.innerHTML = "Linked List Initialized"

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
        nodeColorMaterial.color.setHex (ReformatColor(nodeColorPicker.value));
    } // end of NodeColorChange ()

    /**
     * FUNCTION: LineColorChange
     * PURPOSE: Called everytime the Line color picker is changed
     */
    function LineColorChange ()
    {
        // Set the material's hex to a new hext using the GetColor Function
        lineColorMaterial.color.setHex (ReformatColor(lineColorPicker.value));
    } // end of LineColorChange ()

    /**
     * FUNCTION: GetColor
     * PARAMETERS: hexColor -> recieved as the incorrect format
     * RETURNS: string -> a hex value in the correct formate
     * PURPOSE: Changes the format recived from the color picker and changes it to the
     * correct format three.js uses
     */
    function ReformatColor (hexvalue)
    {
        return '0x' + hexvalue.slice (1);
    } // end of GetColor (hexvalue)
    
    /**
     * FUNCTION: PushFunction
     * PURPOSE: Pushes a node to the end of the linked list.
     */
    function PushFunction ()
    {
        const value = pushValue.value;
        // Checks if a value was entered
        if (!value.trim().length) // empty check
        {
            console.log ("Entered Value is null")
            return;
        }

        // Uses the fontloader to generate the geometry for the mesh
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // Generates the geometry for the mesh
            const textGeometry = new TextGeometry( value, {
                font: font,
                size: 3,
                height: .5
            } );

            // Push the new Mesh to the linkedlist
            myLinkedList.Push (new BasicNode (textGeometry , nodeColorMaterial , value));
            
        } );
        GenerateOutput (pushValue.value.toString() + " was pushed");
    }
    
    /**
     * FUNCTION: PopFunction 
     * PURPOSE: Pops a node from the linked list
     */
    function PopFunction ()
    {
        if (!myLinkedList.IsEmpty()) // List is not empty
        {
            const value = myLinkedList.Pop ();
            GenerateOutput (value + " was popped");
        }
        else // List is empty
        {   
            GenerateOutput ("Pop failed");
        }
    } // end of PopFunction ()

    /**
     * FUNCTION: InsertionFunction
     * PURPOSE: Insert a node at a given index
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
        if (index < 0 || index > myLinkedList.GetLength())
        {
            GenerateOutput ("Invalid Index");
            return;
        }

        // use the load function from the fontloader
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // generate the mesh geometry
            const textGeometry = new TextGeometry( value, {
                font: font,
                size: 3,
                height: .5
            } );

            myLinkedList.Insert (new BasicNode (textGeometry , nodeColorMaterial , value) , index);
            
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
        if (index < 0 || index >= myLinkedList.GetLength())
        {
            GenerateOutput ("Invalid Index");
            return;
        }

        myLinkedList.Delete (index);

        GenerateOutput ("Index " + index + " was removed");
    } // end of DeletionFunction ()

    /**
     * FUNCTION: IterateLinkedList ()
     * PURPOSE: Iterates through Linked List and sends them to the Output Area
     */
    function IterateLinkedList ()
    {
        
        // A string to store the values
        var iterString = myLinkedList.Iterate ();

        // Calls the GenerateOutput function
        GenerateOutput (iterString);
    } // end of IterateLinkedList ()

    /**
     * FUNCTION: OnWindowResize
     * PURPOSE: Makes sure the placement of the scene on the webpage is
     * correct
     */
    function OnWindowResize ()
    {
        camera.aspect = (window.innerWidth - 325) / SCENEHEIGHT;
        camera.updateProjectionMatrix ();
        renderer.setSize (window.innerWidth - 325 , SCENEHEIGHT);
    } // end of OnWindowResize ()


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