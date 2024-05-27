import path from 'path'
import fs from 'fs'
import PQueue from 'p-queue';

async function downloadFile(dest: string, url: string) {
    const res = await fetch(url)
    const data = await res.arrayBuffer()
    await fs.promises.writeFile(dest, Buffer.from(data))
}

// Download example for bun
async function main(){

    const parcel = '-120,133'
    const req1 = await fetch('https://peer-ec1.decentraland.org/content/entities/active', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pointers: [parcel]
        })
    }) 

    const res1 = await req1.json()

    const sceneDownloadPath = path.resolve(process.cwd(), 'scene-downloaded')
    if (await fs.promises.exists(sceneDownloadPath)) {
        await fs.promises.rm(sceneDownloadPath, { recursive: true , force: true})
    }
    await fs.promises.mkdir(sceneDownloadPath, { recursive: true })

    const queue = new PQueue({concurrency: 16})
    let total = 0

    const content = res1[0].content
    const N = content.length
    for (const entry of content) {
        const file = entry.file
        const hash = entry.hash

        const filePath = path.resolve(sceneDownloadPath, file)
        const fileFolderPath = path.dirname(filePath)
        const fileName = path.basename(filePath)

        fs.mkdirSync(fileFolderPath, { recursive: true })

        queue.add(async () => {
            await downloadFile(filePath, `https://peer-ec1.decentraland.org/content/contents/${hash}`)
            
            total += 1
            console.log(`${total}/${N}, downloaded ${fileName} inside ${fileFolderPath}`)
        })
    }

}

main().then().catch(console.error)