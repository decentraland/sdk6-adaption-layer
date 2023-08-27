import { loadParcelIdentity } from "./ParcelIdentity"
import { loadWeb3Provider } from "./Web3Provider"

type ModuleDescriptorWithImplementation = ModuleDescriptor & { implementation: any }

function getModuleMethods(module: any) {
  return Object.keys(module).filter((value) => value !== 'default').map((e): MethodDescriptor => ({ name: e }))
}

export async function loadWrappedModule(moduleName: string): Promise<ModuleDescriptorWithImplementation> {
  const emptyModule: ModuleDescriptorWithImplementation = {
    methods: [],
    rpcHandle: 'empty',
    implementation: {}
  }
  try {
    switch (moduleName) {
      case '@decentraland/CommunicationsController': {
        const module = await import(`~system/CommunicationsController`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'communicationsController',
          implementation: module
        }
      }
      case '@decentraland/EnvironmentAPI': {
        const module = await import(`~system/EnvironmentApi`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'environmentApi',
          implementation: module
        }
      }
      case '@decentraland/EthereumController': {
        const module = await import(`~system/EthereumController`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'ethereumController',
          implementation: module
        }
      }
      case '@decentraland/Identity': {
        const module = await import(`~system/UserIdentity`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'identity',
          implementation: module
        }
      }
      case '@decentraland/ParcelIdentity': {
        const module = await import(`~system/Runtime`)
        const wrappedModule = loadParcelIdentity(module.getSceneInformation)
        return {
          methods: getModuleMethods(wrappedModule),
          rpcHandle: 'parcelIdentity',
          implementation: wrappedModule
        }
      }
      case '@decentraland/Players': {
        const module = await import(`~system/Players`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'players',
          implementation: module
        }
      }
      case '@decentraland/PortableExperiences': {
        const module = await import(`~system/PortableExperiences`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'portableExperiences',
          implementation: module
        }
      }
      case '@decentraland/RestrictedActions': {
        const module = await import(`~system/RestrictedActions`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'restrictedActions',
          implementation: module
        }
      }
      case '@decentraland/SignedFetchModule': {
        const module = await import(`~system/SignedFetch`)
        return {
          methods: getModuleMethods(module),
          rpcHandle: 'signedFetchModule',
          implementation: module
        }
      }
      case '@decentraland/SocialController': {
        return emptyModule // this module is empty, even in sdk6
      }
      case '@decentraland/web3-provider': {
        const module = await import(`~system/EthereumController`)
        const wrappedModule = loadWeb3Provider(module.sendAsync)
        return {
          methods: getModuleMethods(wrappedModule),
          rpcHandle: 'web3-provider',
          implementation: wrappedModule
        }
      }
    }
  } catch(e) {
    console.error(`Module '${moduleName}' not found, reason ${e}, returning empty module`)
  }
  return emptyModule
}