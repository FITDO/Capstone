import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { BasicNode } from "./Structures/Nodes.js"
import { Stack } from './Structures/DataStructures.js';

// A list of constants of that our Queue uses

// Max outputs for the output area
const MAXOUTPUTS = 5;

// The text path where our font is stored
const TEXTFONTPATH = '../three.js/examples/fonts/helvetiker_regular.typeface.json';

// The starting point of the Stack
const STARTINGPOINT = new THREE.Vector3 (0 , 35 , 0);

// How far must nodes be apart
const NODEDISTANCE = new THREE.Vector3 (0 , -4 , 0);

// Scene dimensions
const SCENEHEIGHT = 725;

// main sets up everything
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
    const nodeColorMaterial = new THREE.MeshBasicMaterial ( {color: 0x0000ff} ); // blue
    const lineColorMaterial = new THREE.MeshBasicMaterial ( {color: 0xff0000} ); // red

    const myStack = new Stack (STARTINGPOINT , NODEDISTANCE , lineColorMaterial);
    myStack.AddToScene (scene);

    const pushValue = document.getElementById ("pushValue");  
    const pushButton = document.getElementById ("pushButton");
    const popButton = document.getElementById ("popButton");

    // Get the color pickers on our html page
    const nodeColorPicker = document.getElementById ("nodeColorPicker");
    const lineColorPicker = document.getElementById ("lineColorPicker");

    // Get the output
    const elOutput = document.getElementById ("output");

    var outputs = [];

    pushButton.addEventListener ('click' , PushFunction);
    popButton.addEventListener ('click' , PopFunction);

    nodeColorPicker.addEventListener ('input' , NodeColorChange);
    lineColorPicker.addEventListener ('input' , LineColorChange);

    // Add event listener to window resize to make sure scene always fits
    window.addEventListener ( "resize" , OnWindowResize );

    // Update the output area
    elOutput.innerHTML = "Stack Initialized";

    // Call animate to end main
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
    };

    /**
     * FUNCTION: NodeColorChange
     * PURPOSE: Called everytime the Node color picker is changed
     */
    function NodeColorChange ()
    {
        // Set the material's hex to a new hext using the GetColor Function
        nodeColorMaterial.color.setHex (GetColor(nodeColorPicker.value));
    } // end of NodeColorChange ()

    /**
     * FUNCTION: LineColorChange
     * PURPOSE: Called everytime the Line color picker is changed
     */
    function LineColorChange ()
    {
        // Set the material's hex to a new hext using the GetColor Function
        lineColorMaterial.color.setHex (GetColor(lineColorPicker.value));
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
     * FUNCTION: PushFunction
     * PURPOSE: Add a value to the stack. Pushes all other values down
     * Generates an arrow if needed
     */
    function PushFunction ()
    {
        const value = pushValue.value;
        if (!value.trim().length) // entered null value
        {
            console.log ("Entered Value is null")
            return;
        }

        // Uses the fontloader to generate the mesh
        fontLoader.load( TEXTFONTPATH , function ( font ) {

            // Generates the geometry for the mesh
            const textGeometry = new TextGeometry( value , {
                font: font,
                size: 3,
                height: .5
            } );

            myStack.Push (new BasicNode (textGeometry , nodeColorMaterial , value));
            
        } );

        GenerateOutput (value + " was pushed");
        
    } // end of PushFunction ()

    /**
     * FUNCTION: PopFunction
     * PURPOSE: Removes the top value from the stack. Pushes all other values
     * up. Removes an arrow if needed
     */
    function PopFunction ()
    {
        if (!myStack.IsEmpty ()) // There are nodes to pop
        {

            const value = myStack.Pop ();
            
            // add text
            GenerateOutput (value + " was popped");
        }
        else // there are no nodes in the array
        {   
            GenerateOutput ("Pop failed");
        }
    } // end of PopFunction ()

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
     * Removes text from the page to prevent crowding when there is too much text.
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

// call main
main ();