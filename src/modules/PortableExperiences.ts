import {
  exit,
  getPortableExperiencesLoaded,
  kill,
  spawn
} from '~system/PortableExperiences'

type PortableExperienceUrn = string
type PortableExperienceHandle = {
  pid: PortableExperienceUrn
  parentCid: string // Identifier of who triggered the PE to allow to kill it only to who created it
}
type PortableExperienceLoaded = {
  portableExperiences: PortableExperienceHandle[]
}

export function create(): Record<string, any> {
  /**
   * Starts a portable experience.
   * @param  {SpawnPortableExperienceParameters} [pid] - Information to identify the PE
   *
   * Returns the handle of the portable experience.
   */
  async function internalSpawn(
    pid: PortableExperienceUrn
  ): Promise<PortableExperienceHandle> {
    const response = await spawn({ pid })
    return {
      pid: response.pid,
      parentCid: response.parentCid
    }
  }

  /**
   * Stops a portable experience. Only the executor that spawned the portable experience has permission to kill it.
   * @param  {string} [pid] - The portable experience process id
   *
   * Returns true if was able to kill the portable experience, false if not.
   */
  async function internalKill(pid: PortableExperienceUrn): Promise<boolean> {
    const response = await kill({ pid })
    return response.status
  }

  /**
   * Stops a portable experience from the current running portable scene.
   *
   * Returns true if was able to kill the portable experience, false if not.
   */
  async function internalExit(): Promise<boolean> {
    const response = await exit({})
    return response.status
  }

  /**
   *
   * Returns current portable experiences loaded with ids and parentCid
   */
  async function internalGetPortableExperiencesLoaded(): Promise<PortableExperienceLoaded> {
    const response = await getPortableExperiencesLoaded({})
    return {
      portableExperiences: response.loaded
    }
  }

  return {
    spawn: internalSpawn,
    kill: internalKill,
    exit: internalExit,
    getPortableExperiencesLoaded: internalGetPortableExperiencesLoaded
  }
}
