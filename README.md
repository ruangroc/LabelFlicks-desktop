# LabelFlicks Desktop Application

The LabelFlicks Desktop Application is the frontend client for the overall LabelFlicks project, which aims to automate the process of converting videos into fully-labeled object detection datasets for training computer vision models.

The LabelFlicks client application presents a streamlined process for creating a project, uploading videos, labeling video frames, and exporting the labels. The labeling screen (pictured below) offers a "video frame player" for flipping through the frames as you would when watching a video with the bounding boxes and predicted labels overlaid on top. The labeling timelines to the right of the screen to navigate between frames and visualize your labeling progress in terms of each label in your project. 

The desktop application was built using Electron and Svelte. The intended backend component can be found in the [video-labeling-backend](https://github.com/ruangroc/video-labeling-backend) repo.

https://github.com/ruangroc/video-labeling-electron/assets/43560455/eab69375-e1bb-4d4e-a3fa-6a8819ed8208

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





