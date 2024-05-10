/// --- Set up a system ---
import * as utils from '@dcl/ecs-scene-utils'

// class RotatorSystem {
//   // this group will contain every entity that has a Transform component
//   group = engine.getComponentGroup(Transform)

//   update(dt: number) {
//     // iterate over the entities of the group
//     for (const entity of this.group.entities) {
//       // get the Transform component of the entity
//       const transform = entity.getComponent(Transform)

//       // mutate the rotation
//       transform.rotate(Vector3.Up(), dt * 10)
//     }
//   }
// }

// // Add a new instance of the system to the engine
// engine.addSystem(new RotatorSystem())

// /// --- Spawner function ---

// function spawnCube(x: number, y: number, z: number) {
//   // create the entity
//   const cube = new Entity()

//   // add a transform to the entity
//   cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

//   // add a shape to the entity
//   cube.addComponent(new BoxShape())

//   const material = new Material()
//   material.albedoColor = Color3.Red()
//   cube.addComponent(material)

//   // add the entity to the engine
//   engine.addEntity(cube)

//   cube.addComponent(
//     new utils.TriggerComponent(
//       new utils.TriggerBoxShape(new Vector3(5,5,5)), //shape
//       {
//         onCameraEnter: () => {
//           cube.getComponent(Material).albedoColor = Color3.Blue()
//         },
//         onCameraExit: () => {
//           cube.getComponent(Material).albedoColor = Color3.Red()
//         }
//       }
//     )
//   )

//   cube.addComponent(
//     new OnPointerUp(() => {
//       log('OnPointerUp', cube)
//     })
//   )
//   return cube
// }

// /// --- Spawn a cube ---

// const cube = spawnCube(8, 1, 8)
// log('Hello world')
// cube.addComponent(
//   new OnPointerDown(() => {
//     log('OnPointerDown')
//     cube.getComponent(Transform).scale.z *= 1.1
//     cube.getComponent(Transform).scale.x *= 0.9

//     spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
//   })
// )


// cube.addComponent(
//   new OnPointerHoverEnter(() => {
//     log('OnPointerHoverEnter')
//   })
// )
// cube.addComponent(
//   new OnPointerHoverExit(() => {
//     log('OnPointerHoverExit')
//   })
// )

function testUiA() {
    // Create screenspace component
    const canvas = new UICanvas()
    canvas.width = "100%"
    canvas.height = "100%"
    canvas.positionX = 0
    canvas.positionY = 0

    const image = new UIImage(canvas, new Texture('images/scene-thumbnail.png'))
    image.sourceLeft = 0
    image.sourceTop = 0
    image.sourceWidth = 228
    image.sourceHeight = 160
    image.positionX = 0
    image.positionY = 0
    image.hAlign = 'center'
    image.vAlign = 'bottom'
    image.width = "100%"
    image.height = "100%"  // (160 / 228) * 512
    image.opacity = 0.5
    image.paddingBottom = 0
    image.paddingTop = 0
    image.paddingLeft = 0
    image.paddingRight = 0
    image.isPointerBlocker = false


    // Create a textShape component, setting the canvas as parent
    const text = new UIText(canvas)
    text.value = 'SDK6 adaptation layer!!'
}

function testUiB() {
    // Create screenspace component
    const canvas = new UICanvas()

    const back1 = new UIContainerRect(canvas)
    back1.color = Color4.Red()
    back1.positionX = 0
    back1.positionY = 0
    back1.hAlign = 'center'
    back1.vAlign = 'bottom'
    back1.width = "100%"
    back1.height = "100%"
    back1.opacity = 0.5
    back1.isPointerBlocker = true

    const back2 = new UIContainerRect(canvas)
    back2.color = Color4.Blue()
    back2.positionX = 0
    back2.positionY = 0
    back2.hAlign = 'center'
    back2.vAlign = 'top'
    back2.width = "50%"
    back2.height = "50%"
    back2.opacity = 0.5
    back2.isPointerBlocker = false

    // Create a textShape component, setting the canvas as parent
    const text = new UIText(back2)
    text.value = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed felis enim, placerat vel magna in, vehicula finibus leo. Nam rhoncus gravida rhoncus. Vivamus id velit ultrices, congue nulla ut, accumsan turpis. Nulla iaculis sagittis maximus. Nullam quam odio, ultrices nec lorem congue, posuere egestas ligula. Etiam ac consequat arcu. Vivamus ut velit felis. Curabitur eget lorem non odio ullamcorper pharetra ut ac justo. Cras sit amet velit mauris. Pellentesque nec cursus nulla, et facilisis nisl. Nunc porttitor velit eu metus elementum, id sodales mi faucibus. In hac habitasse platea dictumst. Phasellus eget dignissim tortor, sed vulputate ipsum. Pellentesque varius lacus vel nibh fringilla, eu fringilla nulla imperdiet. Curabitur sed nisl facilisis orci porta malesuada. In hac habitasse platea dictumst.

    Pellentesque porttitor mauris ac orci tempor tempor. In hac habitasse platea dictumst. Duis a pellentesque quam. Donec congue ex id bibendum maximus. Fusce vel interdum tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque mauris tellus, egestas non dui eu, scelerisque dignissim arcu. Suspendisse et pellentesque elit. Cras iaculis odio eget ultrices pharetra. Nullam felis enim, finibus eget orci a, gravida imperdiet mi. `
    text.vTextAlign = 'top'
    text.hTextAlign = 'left'
    text.vAlign = 'top'
    text.hAlign = 'left'
    text.textWrapping = true
    text.width = "100%"
    
    const back3 = new UIContainerRect(text)
    back3.color = Color4.Green()
    back3.positionX = 0
    back3.positionY = 0
    back3.hAlign = 'left'
    back3.vAlign = 'bottom'
    back3.width = "100%"
    back3.height = "100%"
    back3.opacity = 0.8
    back3.isPointerBlocker = false

}

function createContainer(x: number, y: number, hAlign: string, vAlign: string, width: string, height: string, color: Color4, parent: UIShape, isPointerBlocker: boolean = false) {
    const container = new UIContainerRect(parent)
    container.color = color
    container.positionX = x
    container.positionY = y
    container.hAlign = hAlign
    container.vAlign = vAlign
    container.width = width
    container.height = height
    container.isPointerBlocker = false
    return container
}

function createText(parent: UIShape, value: string, hTextAlign: string, vTextAlign: string, hAlign: string, vAlign: string, width: string, height: string, color: Color4, opacity: number, textWrapping: boolean = false, isPointerBlocker: boolean = false) {
    const text = new UIText(parent)
    text.value = value
    text.hTextAlign = hTextAlign
    text.vTextAlign = vTextAlign
    text.hAlign = hAlign
    text.vAlign = vAlign
    text.width = width
    text.height = height
    text.color = color
    text.opacity = opacity
    text.isPointerBlocker = false
    text.textWrapping = textWrapping
    return text
}

function createImage(parent: UIShape, texture: Texture, sourceLeft: number, sourceTop: number, sourceWidth: number, sourceHeight: number, positionX: number, positionY: number, hAlign: string, vAlign: string, width: string, height: string, opacity: number, isPointerBlocker: boolean = false) {
    const image = new UIImage(parent, texture)
    image.sourceLeft = sourceLeft
    image.sourceTop = sourceTop
    image.sourceWidth = sourceWidth
    image.sourceHeight = sourceHeight
    image.positionX = positionX
    image.positionY = positionY
    image.hAlign = hAlign
    image.vAlign = vAlign
    image.width = width
    image.height = height
    image.opacity = opacity
    image.isPointerBlocker = false
    return image
}

function testUiC() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'bottom', '100%', '100%', Color4.Red(), canvas, true)

    const childA = createContainer(0, 0, 'left', 'top', '20%', '20%', Color4.Green(), superParent)
    const childB = createContainer(0, 0, 'left', 'center', '20%', '20%', Color4.Blue(), superParent)
    const childC = createContainer(0, 0, 'left', 'bottom', '20%', '20%', Color4.Purple(), superParent)
    const childD = createContainer(0, 0, 'center', 'top', '10%', '20%', Color4.Green(), superParent)
    const childE = createContainer(0, 0, 'center', 'center', '10%', '20%', Color4.Blue(), superParent)
    const childF = createContainer(0, 0, 'center', 'bottom', '10%', '20%', Color4.Purple(), superParent)
    const childG = createContainer(0, 0, 'right', 'top', '20%', '10%', Color4.Green(), superParent)
    const childH = createContainer(0, 0, 'right', 'center', '20%', '10%', Color4.Blue(), superParent)
    const childI = createContainer(0, 0, 'right', 'bottom', '20%', '10%', Color4.Purple(), superParent)

    const textA = createText(childE, ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed felis enim, placerat vel magna in, vehicula finibus leo. Nam rhoncus gravida rhoncus. Vivamus id velit ultrices, congue nulla ut, accumsan turpis. Nulla iaculis sagittis maximus. Nullam quam odio, ultrices nec lorem congue, posuere egestas ligula. Etiam ac consequat arcu. Vivamus ut velit felis. Curabitur eget lorem non odio ullamcorper pharetra ut ac justo. Cras sit amet velit mauris. Pellentesque nec cursus nulla, et facilisis nisl. Nunc porttitor velit eu metus elementum, id sodales mi faucibus. In hac habitasse platea dictumst. Phasellus eget dignissim tortor, sed vulputate ipsum. Pellentesque varius lacus vel nibh fringilla, eu fringilla nulla imperdiet. Curabitur sed nisl facilisis orci porta malesuada. In hac habitasse platea dictumst.

    Pellentesque porttitor mauris ac orci tempor tempor. In hac habitasse platea dictumst. Duis a pellentesque quam. Donec congue ex id bibendum maximus. Fusce vel interdum tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque mauris tellus, egestas non dui eu, scelerisque dignissim arcu. Suspendisse et pellentesque elit. Cras iaculis odio eget ultrices pharetra. Nullam felis enim, finibus eget orci a, gravida imperdiet mi. `, 'left', 'top', 'left', 'top', '100%', '100%', Color4.Black(), 1)
}

function testUiD() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'bottom', '100%', '100%', Color4.Red(), canvas, true)

    const someTexture = new Texture('images/scene-thumbnail.png')
    const childA = createImage(superParent, someTexture, 0,0,228,160, 100, 0, 'left', 'top', '20%', '20%',1.0)
    const childB = createImage(superParent, someTexture, 0,0,228,160, 0, 0, 'left', 'center', '20%', '20%',1.0)
    const childC = createImage(superParent, someTexture, 0,0,228,160, 0, 0, 'left', 'bottom', '20%', '20%',1.0)
    const childD = createImage(superParent, someTexture, 0,0,228,160, 0, 0, 'center', 'top', '10%', '20%',1.0)
    const childE = createImage(superParent, someTexture, 0,0,228,160, -100, 0, 'center', 'center', '10%', '20%',1.0)
    const childF = createImage(superParent, someTexture, 0,0,228,160, 0, -100, 'center', 'bottom', '10%', '20%',1.0)
    const childG = createImage(superParent, someTexture, 0,0,228,160, 0, 0, 'right', 'top', '20%', '10%',1.0)
    const childH = createImage(superParent, someTexture, 0,0,228,160, 0, 0, 'right', 'center', '20%', '10%',1.0)
    const childI = createImage(superParent, someTexture, 0,0,228,160, 100, 0, 'right', 'bottom', '20%', '10%',1.0)

    const loremText =  ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed felis enim, placerat vel magna in, vehicula finibus leo. Nam rhoncus gravida rhoncus. Vivamus id velit ultrices, congue nulla ut, accumsan turpis. Nulla iaculis sagittis maximus. Nullam quam odio, ultrices nec lorem congue, posuere egestas ligula. Etiam ac consequat arcu. Vivamus ut velit felis. Curabitur eget lorem non odio ullamcorper pharetra ut ac justo. Cras sit amet velit mauris. Pellentesque nec cursus nulla, et facilisis nisl. Nunc porttitor velit eu metus elementum, id sodales mi faucibus. In hac habitasse platea dictumst. Phasellus eget dignissim tortor, sed vulputate ipsum. Pellentesque varius lacus vel nibh fringilla, eu fringilla nulla imperdiet. Curabitur sed nisl facilisis orci porta malesuada. In hac habitasse platea dictumst.

    Pellentesque porttitor mauris ac orci tempor tempor. In hac habitasse platea dictumst. Duis a pellentesque quam. Donec congue ex id bibendum maximus. Fusce vel interdum tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque mauris tellus, egestas non dui eu, scelerisque dignissim arcu. Suspendisse et pellentesque elit. Cras iaculis odio eget ultrices pharetra. Nullam felis enim, finibus eget orci a, gravida imperdiet mi. `
    const textA = createText(childE, loremText, 'left', 'top', 'left', 'top', '100%', '100%', Color4.Blue(), 1)
    const textB = createText(childA, loremText, 'left', 'top', 'left', 'top', '100%', '100%', Color4.Green(), 1,true)
    textA.font
}

function testUiE() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'center', '60%', '60%', Color4.Red(), canvas, true)

    const childA = createContainer(50, 0, 'left', 'top', '20%', '20%', Color4.Green(), superParent)
    const childB = createContainer(-50, 0, 'left', 'center', '20%', '20%', Color4.Blue(), superParent)
    const childC = createContainer(0, 0, 'left', 'bottom', '20%', '20%', Color4.Purple(), superParent)
    const childD = createContainer(50, 0, 'center', 'top', '10%', '20%', Color4.Green(), superParent)
    const childE = createContainer(-50, 0, 'center', 'center', '10%', '20%', Color4.Blue(), superParent)
    const childF = createContainer(0, 0, 'center', 'bottom', '10%', '20%', Color4.Purple(), superParent)
    const childG = createContainer(50, 0, 'right', 'top', '20%', '10%', Color4.Green(), superParent)
    const childH = createContainer(-50, 0, 'right', 'center', '20%', '10%', Color4.Blue(), superParent)
    const childI = createContainer(0, 0, 'right', 'bottom', '20%', '10%', Color4.Purple(), superParent)
}

function testUiF() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'center', '60%', '60%', Color4.Red(), canvas, true)

    const childA = createContainer(0, 50, 'left', 'top', '20%', '20%', Color4.Green(), superParent)
    const childD = createContainer(0, -50, 'center', 'top', '10%', '20%', Color4.Green(), superParent)
    const childG = createContainer(0, 0, 'right', 'top', '20%', '10%', Color4.Green(), superParent)
    const childB = createContainer(0, 50, 'left', 'center', '20%', '20%', Color4.Blue(), superParent)
    const childE = createContainer(0, -50, 'center', 'center', '10%', '20%', Color4.Blue(), superParent)
    const childH = createContainer(0, 0, 'right', 'center', '20%', '10%', Color4.Blue(), superParent)
    const childC = createContainer(0, 50, 'left', 'bottom', '20%', '20%', Color4.Purple(), superParent)
    const childF = createContainer(0, -50, 'center', 'bottom', '10%', '20%', Color4.Purple(), superParent)
    const childI = createContainer(0, 0, 'right', 'bottom', '20%', '10%', Color4.Purple(), superParent)
}

function testUiG() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'center', '60%', '60%', Color4.Red(), canvas, true)

    const childA = createContainer(20, 100, 'left', 'bottom', '20%', '20%', Color4.Green(), superParent)
}

function testUiH() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'center', '100%', '100%', Color4.Red(), canvas, true)
    const childA = createContainer(20, 100, 'center', 'center', '20%', '20%', Color4.Green(), superParent)
    childA.thickness = 20
    childA.alignmentUsesSize = true
}


function testUiI() {
    // Create screenspace component
    const canvas = new UICanvas()

    const superParent = createContainer(0, 0, 'center', 'center', '100%', '100%', Color4.Red(), canvas, true)
    
    const someTexture = new Texture('images/scene-thumbnail.png')
    const childA = createImage(superParent, someTexture, 0,0,228,160, 100, 0, 'left', 'center', '20%', '20%', 1.0)
    const childC = createContainer(0, 0, 'center', 'center', '20%', '20%', Color4.Green(), superParent)
    const childB = createImage(superParent, someTexture, 0,0,228,160, 0, 0, 'center', 'center', '20%', '20%', 1.0)
    childB.paddingBottom = 20
    childB.paddingLeft = 20
    childB.paddingRight = 20
    childB.paddingTop = 20

}

testUiI()