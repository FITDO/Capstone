import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { BasicNode } from './Structures/Nodes.js';
import { Queue } from './Structures/DataStructures.js';

// A list of constants of that our Queue uses

// Max outputs for the output area
const MAXOUTPUTS = 5;

// The text path where our font is stored
const TEXTFONTPATH = '../three.js/examples/fonts/helvetiker_regular.typeface.json';

// The starting point of the Queue
const STARTINGPOINT = new THREE.Vector3 (-65 , 0 , 0);

// How far must nodes be apart
const NODEDISTANCE = new THREE.Vector3 (5 , 0 , 0);;

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
        (window.innerWidth - 300) / SCENEHEIGHT , 
        1 ,
        1000
    );
    camera.position.set( 0 , 0 , 100 );

    // Set the renderer up and attach it to the sceneContanier on the html page
    const renderer = new THREE.WebGLRenderer ();
    renderer.setSize (window.innerWidth - 310 , SCENEHEIGHT);
    const sceneContanier = document.getElementById ("sceneContanier");
    sceneContanier.appendChild (renderer.domElement);
    
    // the orbital controls and font loader to gener the meshes and drag the scene
    const controls = new OrbitControls( camera, renderer.domElement );
    const fontLoader = new FontLoader();

    // A few materials for the nodes
    const defaultNodeColorMaterial = new THREE.MeshBasicMaterial ( {color: 0x0000ff} ); // blue
    const defaultLineColorMaterial = new THREE.MeshBasicMaterial ( {color: 0xff0000} ); // red

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

    // Add event listener to window resize to make sure scene always fits
    window.addEventListener ( "resize" , OnWindowResize );

    const myQueue = new Queue (STARTINGPOINT , NODEDISTANCE , defaultLineColorMaterial);
    myQueue.AddToScene (scene);

    elOutput.innerHTML = "Queue Initialized"

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
     * FUNCTION: EnqueueFunction
     * PURPOSE: Add a node to the end of the Queue
     */
    function EnqueueFunction ()
    {
        const value = enqueueValue.value;
        // Checks if a value was entered
        if (!value.trim().length) // empty check
        {
            console.log ("Entered Value is null")
            return;
        }

        // Uses the fontloader to generate the mesh
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // Generates the geometry for the mesh
            const textGeometry = new TextGeometry( enqueueValue.value, {
                font: font,
                size: 3,
                height: .5
            } );

            
            myQueue.Enqueue (new BasicNode (textGeometry , defaultNodeColorMaterial , value));
        } );
        GenerateOutput (enqueueValue.value.toString() + " was enqueued");
    } // end of EnqueueFunction ()

    /**
     * FUNCTION: DequeueFunction
     * PURPOSE: Tries to remove the front node from the Queue. Removes 
     * a arrow if neccessary. Then moves all nodes back
     */
    function DequeueFunction ()
    {
        // Check if there are any nodes to dequeue
        if (!myQueue.IsEmpty()) // There are nodes to dequeue
        {
            const value = myQueue.Dequeue();
            GenerateOutput (value + " was dequeued");
        }
        else // there are no nodes in the queue
        {   
            GenerateOutput ("Dequeue Failed");
        }
    } // end of DequeueFunction ()

    /**
     * FUNCTION: OnWindowResize
     * PURPOSE: Makes sure the placement of the scene on the webpage is
     * correct
     */
    function OnWindowResize ()
    {
        camera.aspect = (window.innerWidth - 300) / SCENEHEIGHT;
        camera.updateProjectionMatrix ();
        renderer.setSize (window.innerWidth - 300 , SCENEHEIGHT);
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


// Call main
main ();