import * as CommunicationsController from './CommunicationsController'
import * as EnvironmentAPI from './EnvironmentApi'
import * as EthereumController from './EthereumController'
import * as Identity from './Identity'
import * as ParcelIdentity from './ParcelIdentity'
import * as Players from './Players'
import * as PortableExperiences from './PortableExperiences'
import * as RestrictedActions from './RestrictedActions'
import * as SignedFetch from './SignedFetch'
import * as SocialController from './SocialController'
import * as web3Provider from './Web3Provider'

type ModuleDescriptorWithImplementation = ModuleDescriptor & {
  implementation: any
}

function getModuleMethods(module: any): MethodDescriptor[] {
  return Object.keys(module)
    .filter((value) => value !== 'default')
    .map((e): MethodDescriptor => ({ name: e }))
}

const LoadableModules: Record<string, () => Record<string, any>> = {
  '@decentraland/CommunicationsController': CommunicationsController.create,
  '@decentraland/EnvironmentAPI': EnvironmentAPI.create,
  '@decentraland/EthereumController': EthereumController.create,
  '@decentraland/Identity': Identity.create,
  '@decentraland/ParcelIdentity': ParcelIdentity.create,
  '@decentraland/Players': Players.create,
  '@decentraland/PortableExperiences': PortableExperiences.create,
  '@decentraland/RestrictedActions': RestrictedActions.create,
  '@decentraland/RestrictedActionModule': RestrictedActions.create,
  '@decentraland/SignedFetch': SignedFetch.create,
  '@decentraland/SocialController': SocialController.create,
  '@decentraland/web3-provider': web3Provider.create
}

export function loadWrappedModule(
  moduleName: string
): ModuleDescriptorWithImplementation {
  if (moduleName in LoadableModules) {
    console.log(`Loading module ${moduleName}`)
    const module = LoadableModules[moduleName]()
    return {
      methods: getModuleMethods(module),
      rpcHandle: moduleName,
      implementation: module
    }
  } else {
    console.error(`Module '${moduleName}' not found, returning empty module`)
    return {
      methods: [],
      rpcHandle: 'empty',
      implementation: {}
    }
  }
}
