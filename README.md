# LabelFlicks Desktop Application

The LabelFlicks Desktop Application is the frontend client for the overall LabelFlicks project, which aims to improve the process of converting videos into fully-labeled object detection datasets for training computer vision models.

The desktop application was built using Electron and Svelte. The intended backend component can be found in the [video-labeling-backend](https://github.com/ruangroc/video-labeling-backend) repo.


## Getting Started

1. Make sure you have Node version 18.x: https://nodejs.org/en/download/

2. Install dependencies: `npm install`

3. Start the backend server (see instructions in the [backend repo's README](https://github.com/ruangroc/video-labeling-backend)) or start the mock server: `node mock-server/server.js`

    - Note 1: the mock server is much more limited in what it can demonstrate as the labeling screen is very dynamic and it simply wasn't feasible to mock every possible interaction.

    - Note 2: If you change the ports that are used by the client and the backend use, make sure to also create a .env file and define:
        ```
        SVELTE_PORT=<port number>
        SERVER_PORT=<port number>
        ```

4. Run the app: `npm run start`


## Tests

To run the tests, simply run: `npm run test`. No mock server is required.





