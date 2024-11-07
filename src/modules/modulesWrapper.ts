import { DEBUG_CONFIG } from '../debug/config'
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
  CommunicationsController: CommunicationsController.create,
  EnvironmentAPI: EnvironmentAPI.create,
  EthereumController: EthereumController.create,
  Identity: Identity.create,
  ParcelIdentity: ParcelIdentity.create,
  Players: Players.create,
  PortableExperiences: PortableExperiences.create,
  RestrictedActions: RestrictedActions.create,
  RestrictedActionModule: RestrictedActions.create,
  SignedFetch: SignedFetch.create,
  SocialController: SocialController.create,
  'web3-provider': web3Provider.create
}

export function loadWrappedModule(
  maybeModuleName: string
): ModuleDescriptorWithImplementation {
  const onlyNameModule = maybeModuleName.replace(/^@decentraland\//, '')
  const moduleName =
    maybeModuleName in LoadableModules ? maybeModuleName : onlyNameModule

  if (moduleName in LoadableModules) {
    if (DEBUG_CONFIG.RPC_MODULE) console.log(`Loading module ${moduleName}`)

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
