import './style.scss'
import * as THREE from 'three'

import { gsap } from 'gsap'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Prism from 'prismjs'

import * as Tone from 'tone'

import vertexShader from './shaders/vertex.glsl'

import fragmentShader1 from './shaders/fragment-1.glsl'

import fragmentShader2 from './shaders/fragment-2.glsl'

import fragmentShader3 from './shaders/fragment-3.glsl'

import fragmentShader4 from './shaders/fragment-4.glsl'

import fragmentShader5 from './shaders/fragment-5.glsl'


const snippet = document.getElementById('snipp')



const fragArrayRiver = [fragmentShader1, fragmentShader2, fragmentShader3, fragmentShader4, fragmentShader5]

const fragArrayLightning = [fragmentShader1, fragmentShader2, fragmentShader3, fragmentShader4, fragmentShader5]

const fragArrayCloud = [fragmentShader1, fragmentShader2, fragmentShader3, fragmentShader4, fragmentShader5]

// let riverSelected = Math.floor(Math.random() * fragArray.length )

let riverSelected = 0
let cloudSelected = 1
let lightningSelected = 0

// snippet.textContent = fragArray[riverSelected]
const points =[
  {
    position: new THREE.Vector3(4.55, 0.3, -6.6),
    element: document.querySelector('.point-0')
  },
  {
    position: new THREE.Vector3(4.55, -2.3, -6.6),
    element: document.querySelector('.point-1')
  }

]

console.log(Prism)
Prism.highlightAll()
document.onkeydown = checkKey



function resetL(){
  gsap.to(left.position, { duration: .5, y: left.position.y + 0.005, delay: 0, onComplete: buttonStill  })
}

function resetR(){
  gsap.to(right.position, { duration: .5, y: right.position.y + 0.005, delay: 0, onComplete: buttonStill })
}


function buttonStill(){
  buttonMoving = false
}

const synth =  new Tone.FMSynth().toDestination();

let buttonMoving = false

function scrollRiver(){
  // synth.triggerAttackRelease("C4", "8n");
  snippet.textContent = fragArrayRiver[riverSelected]
  Prism.highlightAll()
  // if(!buttonMoving){
  //   buttonMoving = true
  //   gsap.to(left.position, { duration: .5, y: left.position.y - 0.005, delay: 0, onComplete: resetL })
  // }
  // left.position.y -=.001
  if(riverSelected > 0){
    riverSelected --
    riverMaterial.needsUpdate=true

    riverMaterial.fragmentShader = fragArrayRiver[riverSelected]
  } else if(riverSelected === 0){
    riverSelected = fragArrayRiver.length -1
    riverMaterial.needsUpdate=true

    riverMaterial.fragmentShader = fragArrayRiver[riverSelected]
  }


}

function scrollCloud(){
  // synth.triggerAttackRelease("E4", "8n");
  snippet.textContent = fragArrayCloud[cloudSelected]
  Prism.highlightAll()
  // if(!buttonMoving){
  //   buttonMoving = true
  //   gsap.to(right.position, { duration: .5, y: right.position.y - 0.005, delay: 0, onComplete: resetR })
  // }
  if(cloudSelected < fragArrayCloud.length -1){
    cloudSelected ++
    cloudMaterial.needsUpdate=true

    cloudMaterial.fragmentShader = fragArrayCloud[cloudSelected]
  } else  if(cloudSelected === fragArrayCloud.length -1){
    cloudSelected = 0
    cloudMaterial.needsUpdate=true

    cloudMaterial.fragmentShader = fragArrayCloud[cloudSelected]
  }
}


function scrollLightning(){
  // synth.triggerAttackRelease("E4", "8n");
  snippet.textContent = fragArrayLightning[lightningSelected]
  Prism.highlightAll()
  // if(!buttonMoving){
  //   buttonMoving = true
  //   gsap.to(right.position, { duration: .5, y: right.position.y - 0.005, delay: 0, onComplete: resetR })
  // }
  if(lightningSelected < fragArrayLightning.length -1){
    lightningSelected ++
    lightningMaterial.needsUpdate=true

    lightningMaterial.fragmentShader = fragArrayLightning[lightningSelected]
  } else  if(lightningSelected === fragArrayLightning.length -1){
    lightningSelected = 0
    lightningMaterial.needsUpdate=true

    lightningMaterial.fragmentShader = fragArrayLightning[lightningSelected]
  }
}



function checkKey(e) {
  e.preventDefault()
  e = e || window.event
  console.log(e)
  if (e.keyCode === 38) {
    // up arrow
    // console.log(riverSelected)
  } else if (e.keyCode === 40) {
    // down arrow
    // console.log(fragArray[riverSelected])
  } else if (e.keyCode === 37) {
    // left arrow
    // scrollLeft()

  } else if (e.keyCode === 39) {
    // right arrow
    // console.log(riverSelected)

    // scrollRight()

  } else if (e.keyCode === 27) {
  // esc
  // console.log(riverSelected)
    modal.style.display = 'none'
  }

}

var modal = document.getElementById('myModal')

var refresh = document.getElementById('refresh')

refresh.onclick = function(){
  // scrollRight()
}

// Get the button that opens the modal
var btn = document.getElementById('myBtn')

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0]

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = 'block'
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none'
  }
}

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
// scene.background = new THREE.Color( 0xffffff )
const loadingBarElement = document.querySelector('.loading-bar')
const loadingBarText = document.querySelector('.loading-bar-text')
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () =>{
    window.setTimeout(() =>{
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''

      loadingBarText.classList.add('fade-out')

    }, 500)
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) =>{
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`

  }
)

const gtlfLoader = new GLTFLoader(loadingManager)

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
  uniforms:
    {
      uAlpha: { value: 1 }
    },
  transparent: true,
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
  uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


const riverMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,
  fragmentShader: fragArrayRiver[riverSelected],
  side: THREE.DoubleSide
})

const cloudMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,
  fragmentShader: fragArrayCloud[cloudSelected],
  side: THREE.DoubleSide
})

const lightningMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,
  fragmentShader: fragArrayLightning[lightningSelected],
  side: THREE.DoubleSide
})
// console.log(riverMaterial)
let sceneGroup, left, right, river, display, mixer, cloud, lightning

const intersectsArr = []
gtlfLoader.load(
  'styx.glb',
  (gltf) => {
    console.log(gltf)

    if(gltf.animations[0]){
      mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
      const action2 = mixer.clipAction(gltf.animations[1])
        // const action3 = mixer.clipAction(gltf.animations[0])
    // action.play()
    action2.play()
      // action3.play()
  }
    gltf.scene.scale.set(4.5,4.5,4.5)
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    sceneGroup.position.y -= 3
    scene.add(sceneGroup)



    left = gltf.scene.children.find((child) => {
      return child.name === 'Left'
    })

    right = gltf.scene.children.find((child) => {
      return child.name === 'Right'
    })

    river = gltf.scene.children.find((child) => {
      return child.name === 'River'
    })

    display = gltf.scene.children.find((child) => {
      return child.name === 'Scene'
    })

    lightning = gltf.scene.children.find((child) => {
      return child.name === 'Lightning'
    })

    cloud = gltf.scene.children.find((child) => {
      return child.name === 'Cloud'
    })
    intersectsArr.push(river, lightning, cloud)
    river.needsUpdate = true

    river.material = riverMaterial
    lightning.material = lightningMaterial
    cloud.material = cloudMaterial


  }
)


const light = new THREE.AmbientLight( 0x404040 ) // soft white light
scene.add( light )

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.25 )
scene.add( directionalLight )

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))

  cloudMaterial.uniforms.uResolution.value.x = renderer.domElement.width
  cloudMaterial.uniforms.uResolution.value.y = renderer.domElement.height

  lightningMaterial.uniforms.uResolution.value.x = renderer.domElement.width
  lightningMaterial.uniforms.uResolution.value.y = renderer.domElement.height

  riverMaterial.uniforms.uResolution.value.x = renderer.domElement.width
  riverMaterial.uniforms.uResolution.value.y = renderer.domElement.height

})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = -10
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
//controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 0 )
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener( 'pointerdown', onClick, false )

function onClick(e) {
  event.preventDefault()
  console.log(e)
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  console.log(mouse)
  raycaster.setFromCamera( mouse, camera )

  var intersects = raycaster.intersectObjects( intersectsArr, true )

  if ( intersects.length > 0 ) {
    // console.log( 'Intersection:', intersects[0].object.parent.name );
//console.log(intersects[0])
    if(intersects[0].object.name === 'Cloud'){
      scrollCloud()
    }
    if(intersects[0].object.name === 'Lightning'){
      scrollLightning()
    }
    if(intersects[0].object.name === 'River'){
      scrollRiver()
    }
  }


}


const clock = new THREE.Clock()

const tick = () =>{
  if ( mixer ){
    mixer.update( clock.getDelta() )
    // console.log(mixer)
  }
  const elapsedTime = clock.getElapsedTime()

  if(cloudMaterial.uniforms.uResolution.value.x === 0 && cloudMaterial.uniforms.uResolution.value.y === 0 ){
    cloudMaterial.uniforms.uResolution.value.x = renderer.domElement.width
    cloudMaterial.uniforms.uResolution.value.y = renderer.domElement.height

    lightningMaterial.uniforms.uResolution.value.x = renderer.domElement.width
    lightningMaterial.uniforms.uResolution.value.y = renderer.domElement.height

    riverMaterial.uniforms.uResolution.value.x = renderer.domElement.width
    riverMaterial.uniforms.uResolution.value.y = renderer.domElement.height

  }


  if(sceneGroup){
    // sceneGroup.rotation.y += .001
    river.needsUpdate = true
  }
  if(sceneGroup){
    sceneGroup.rotation.y += .001
    // cloud.rotation.x += .01
    // river.rotation.y += .01
    // lightning.rotation.z += .01
    for(const point of points){
      const screenPosition = point.position.clone()
      screenPosition.project(camera)
      raycaster.setFromCamera(screenPosition, camera)

      const intersects = raycaster.intersectObjects(scene.children, true)
      if(intersects.length === 0){
        // point.element.classList.add('visible')
      }else{
        const intersectionDistance  = intersects[0].distance
        const pointDistance = point.position.distanceTo(camera.position)
        if(intersectionDistance < pointDistance){
          point.element.classList.remove('visible')
        } else {
          // point.element.classList.add('visible')
        }

      }

      const translateX = screenPosition.x * sizes.width * 0.5
      const translateY = - screenPosition.y * sizes.height * 0.5
      point.element.style.transform = `translate(${translateX}px, ${translateY}px)`

    }

  }


  // Update controls
  controls.update()

  riverMaterial.uniforms.uTime.value = elapsedTime
  cloudMaterial.uniforms.uTime.value = elapsedTime
  lightningMaterial.uniforms.uTime.value = elapsedTime
  // riverMaterial.fragmentShader = fragArray[riverSelected]




  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
