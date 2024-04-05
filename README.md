# SDK6 Adaption Layer

Adaption Layer from SDK6 to SDK7.

This project is an SDK7 scene that implements SDK6 and provides the parity for SDK7.

The Scene Runtime from the Renderers can use this Scene to inject it when it detects an SDK6 Scene, so they need to implement SDK7.

## Debug - How to run your SDK6 Scene with SDK7

Copy your SDK6 Scene Assets to the root directory and the built script to `sdk6-tests/game.js` and `sdk6-tests/scene.js`. Then run the SDK7 scene with `npm run start`, and you should see your SDK6 Scene running with SDK7.

# Download script

The script is available on the following links

- https://renderer-artifacts.decentraland.org/sdk6-adaption-layer/main/index.js
- https://renderer-artifacts.decentraland.org/sdk6-adaption-layer/main/index.min.js
