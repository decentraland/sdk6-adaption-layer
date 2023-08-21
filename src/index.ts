import { TextDecoder } from "text-encoding"
import { readFile } from "~system/Runtime"
import { customEval } from "./sandbox"
import { AdaptionLayer } from "./runtime/DecentralandInterface"

export async function main() {
  const res = await readFile({ fileName: 'sdk6/game.js' })
  var code = new TextDecoder().decode(res.content)

  const newDcl = await AdaptionLayer.createDecentralandInterface()
  await customEval(code, { dcl: newDcl })
}
