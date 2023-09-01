/// --- Set up a system ---
import * as utils from '@dcl/ecs-scene-utils'

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    // iterate over the entities of the group
    for (const entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem())

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  const material = new Material()
  material.albedoColor = Color3.Red()
  cube.addComponent(material)

  // add the entity to the engine
  engine.addEntity(cube)

  cube.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(new Vector3(5,5,5)), //shape
      {
        onCameraEnter: () => {
          cube.getComponent(Material).albedoColor = Color3.Blue()
        },
        onCameraExit: () => {
          cube.getComponent(Material).albedoColor = Color3.Red()
        }
      }
    )
  )

  cube.addComponent(
    new OnPointerUp(() => {
      log('OnPointerUp', cube)
    })
  )
  return cube
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8)
log('Hello world')
cube.addComponent(
  new OnPointerDown(() => {
    log('OnPointerDown')
    cube.getComponent(Transform).scale.z *= 1.1
    cube.getComponent(Transform).scale.x *= 0.9

    spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
  })
)


cube.addComponent(
  new OnPointerHoverEnter(() => {
    log('OnPointerHoverEnter')
  })
)
cube.addComponent(
  new OnPointerHoverExit(() => {
    log('OnPointerHoverExit')
  })
)
