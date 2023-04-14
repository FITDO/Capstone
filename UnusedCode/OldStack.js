import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// A list of constants of that our Queue uses

// Max outputs for the output area
const MAXOUTPUTS = 5;

// The text path where our font is stored
const TEXTFONTPATH = '../three.js/examples/fonts/helvetiker_regular.typeface.json';

// The starting point of the Stack
const STARTINGPOINT_Y = 35;

// How far must nodes be apart
const MINNODEDISTANCE_Y = 3.5;

// Were the stack should be located
const CENTERAXIS_X = 0;

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

// main sets up everything
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
    const StackNodes = new THREE.Group (); // For Nodes
    const StackArrows = new THREE.Group (); // For Arrows
    const StackLabels = new THREE.Group (); // For Top, Arrow, and Null

    scene.add (StackNodes);
    scene.add (StackArrows);
    scene.add (StackLabels);

    const pushValue = document.getElementById ("pushValue");  
    const pushButton = document.getElementById ("pushButton");
    const popButton = document.getElementById ("popButton");

    // Get the color pickers on our html page
    const defNodeColorPicker = document.getElementById ("defaultNodeColorPicker");
    const defLineColorPicker = document.getElementById ("defaultLineColorPicker");

    // Get the output
    const elOutput = document.getElementById ("output");

    var outputs = [];

    pushButton.addEventListener ('click' , PushFunction);
    popButton.addEventListener ('click' , PopFunction);

    defNodeColorPicker.addEventListener ('input' , NodeColorChange);
    defLineColorPicker.addEventListener ('input' , LineColorChange);
    
    GenerateStartingNodes ();

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
     * Generate a top mesh, null mesh, and arrow
     */
    function GenerateStartingNodes ()
    {
        fontLoader.load ( TEXTFONTPATH , function ( font ) 
        {
            // Generate the text geometries    
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

            // Generate the meshes
            const topPtrNode = new THREE.Mesh (topPtrGeo , defaultNodeColorMaterial);
            const nullPtrNode = new THREE.Mesh (nullPtrGeo , defaultNodeColorMaterial);


            const arrow = GenerateArrow ();

            // set the starting positions

            topPtrNode.position.x = -3.5 + CENTERAXIS_X;
            topPtrNode.position.y = STARTINGPOINT_Y;
            
            arrow.position.y = STARTINGPOINT_Y - 3.5;
            arrow.position.x = CENTERAXIS_X;

            nullPtrNode.position.x = -3 + CENTERAXIS_X;
            nullPtrNode.position.y = STARTINGPOINT_Y - MINNODEDISTANCE_Y * 2;
            

            StackLabels.add (topPtrNode);
            StackLabels.add (arrow);
            StackLabels.add (nullPtrNode);
        } );
        GenerateOutput ("Stack Initialized");
    } // end of GenerateStartingNodes

    /**
     * FUNCTION: PushFunction
     * PURPOSE: Add a value to the stack. Pushes all other values down
     * Generates an arrow if needed
     */
    function PushFunction ()
    {
        if (!pushValue.value.trim().length) // entered null value
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

            // Generate mesh and center along the x axis

            var textMesh = new MeshWithValue (valueGeo , defaultNodeColorMaterial , pushValue.value.toString());
            CenterMesh (textMesh);

            if (StackNodes.children.length > 0) // stack has nodes
            {
                var distanceToMove = MINNODEDISTANCE_Y * 2;

                textMesh.position.y = StackNodes.children.at(0).position.y;

                // iterate though all nodes and move them
                StackNodes.children.forEach ( element => {
                    element.position.y -= distanceToMove;
                })

                // generate an arrow and place it in the scene
                var arrow = GenerateArrow ();

                arrow.position.x = CENTERAXIS_X;

                if (StackArrows.children.length > 0) // list is not empty
                {
                    arrow.position.y = StackArrows.children.at(-1).position.y - distanceToMove;
                }
                else // list is empty
                {
                    arrow.position.y = StackLabels.children.at(1).position.y - distanceToMove;
                }

                StackArrows.add (arrow);

            }
            else // stack is empty
            {
                // add mesh to the scene
                StackLabels.children[2].visible = false;
                textMesh.position.y = STARTINGPOINT_Y - MINNODEDISTANCE_Y * 2;
            }

            // splice list to make sure newest node is on the top
            StackNodes.children.splice (0 , 0 , textMesh);
            GenerateOutput (textMesh.value + " was added to the stack");
        } );
        
    } // end of PushFunction ()

    /**
     * FUNCTION: PopFunction
     * PURPOSE: Removes the top value from the stack. Pushes all other values
     * up. Removes an arrow if needed
     */
    function PopFunction ()
    {
        if (StackNodes.children.length > 0) // There are nodes to pop
        {
            // figures out the distance needed to move
            var distanceToMove = MINNODEDISTANCE_Y + 3.5;

            // pop the node
            var nodetxt = StackNodes.children.at(0).value;
            
            // removes the first value
            StackNodes.children.shift ();

            // adds the distance to y for every node in the list
            StackNodes.children.forEach ( element => {
                element.position.y += distanceToMove;
            })

            // checks if there is an arrow to remove
            if (StackArrows.children.length > 0) // arrow needs to be removed
            {
                StackArrows.children.pop();
            }

            // checks if there are any nodes left
            if (StackNodes.children.length == 0)
            {
                // set the null mesh to visible
                StackLabels.children.at(2).visible = true;
            }
            
            GenerateOutput (nodetxt + " was removed");
        }
        else // there are no nodes in the array
        {   
            GenerateOutput ("Pop failed");
        }
    } // end of PopFunction ()

    /**
     * FUNCTION: CenterMesh
     * PARAMETER: mesh -> MeshWithValue
     * PURPOSE: Centers a mesh along the center axis
     */
    function CenterMesh (mesh)
    {
        var xpos = ((mesh.value.length * 2.5) / 2) * -1;
        mesh.position.x = xpos + CENTERAXIS_X;
    } // end of CenterMesh (mesh)

    /**
     * FUNCTION: GenerateArrow ()
     * PURPOSE: Makes an arrow for the queue to use
     * RETURNS: a line object in the form as an arrow that can be moved arround
     */
    function GenerateArrow () 
    {
        var points = [];
        points.push (new THREE.Vector3 (0 , MINNODEDISTANCE_Y , 0));
        points.push (new THREE.Vector3 (0 , 0 , 0));
        points.push (new THREE.Vector3 (-1.5 , 1.5 , 0));
        points.push (new THREE.Vector3 (0 , 0 , 0));
        points.push (new THREE.Vector3 (1.5 , 1.5 , 0));

        const arrowGeo = new THREE.BufferGeometry().setFromPoints (points);
        const arrow = new THREE.Line (arrowGeo , defaultLineColorMaterial);

        return arrow;
    } // GenerateArrow ()

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

// call main