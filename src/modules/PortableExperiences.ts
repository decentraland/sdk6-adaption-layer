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
  async function spawn(
    pid: PortableExperienceUrn
  ): Promise<PortableExperienceHandle> {
    throw new Error('TODO')
  }

  /**
   * Stops a portable experience. Only the executor that spawned the portable experience has permission to kill it.
   * @param  {string} [pid] - The portable experience process id
   *
   * Returns true if was able to kill the portable experience, false if not.
   */
  async function kill(pid: PortableExperienceUrn): Promise<boolean> {
    throw new Error('TODO')
  }

  /**
   * Stops a portable experience from the current running portable scene.
   *
   * Returns true if was able to kill the portable experience, false if not.
   */
  async function exit(): Promise<boolean> {
    throw new Error('TODO')
  }

  /**
   *
   * Returns current portable experiences loaded with ids and parentCid
   */
  async function getPortableExperiencesLoaded(): Promise<PortableExperienceLoaded> {
    throw new Error('TODO')
  }

  return {
    spawn,
    kill,
    exit,
    getPortableExperiencesLoaded
  }
}
