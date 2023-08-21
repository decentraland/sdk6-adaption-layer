//import { ecs7EnsureEntity } from '../ecs7/ECS7'
import { ECS6State } from '../types'

export function update(state: ECS6State, ecs6EntityId: EntityID, payload: any) {
  //const ecs7Entity = ecs7EnsureEntity(state, ecs6EntityId)

  console.log('Uuid update', payload)
}

export function remove(state: ECS6State, ecs6EntityId: EntityID) {
  //const ecs7Entity = ecs7EnsureEntity(state, ecs6EntityId)
  console.log('Uuid remove')
}
