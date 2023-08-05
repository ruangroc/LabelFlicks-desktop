import '@testing-library/jest-dom';
import { get } from 'svelte/store';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import * as labeling from "../stores/labeling";
import * as videos from "../stores/videos";
import * as projects from "../stores/projects";

const mockProjects = [
    {
        "name": "cat-videos",
        "id": "project-id-2",
        "frames": [],
        "percent_labeled": 50,
        "videos": [],
        "video_count": 100
    },
    {
        "name": "dog-videos",
        "id": "project-id-3",
        "frames": [],
        "percent_labeled": 60,
        "videos": [],
        "video_count": 100
    }
];

const expectedProjectsTableData = [
    {
        "Project Name": "cat-videos",
        "Number of Videos": "100",
        "Percent Labeled": "50%"
    },
    {
        "Project Name": "dog-videos",
        "Number of Videos": "100",
        "Percent Labeled": "60%"
    },
];

const mockProjectsPlusOne = [
    {
        "name": "cat-videos",
        "id": "project-id-2",
        "frames": [],
        "percent_labeled": 50,
        "videos": [],
        "video_count": 100
    },
    {
        "name": "dog-videos",
        "id": "project-id-3",
        "frames": [],
        "percent_labeled": 60,
        "videos": [],
        "video_count": 100
    },
    {
        "name": "cow-videos",
        "id": "project-id-4",
        "frames": [],
        "percent_labeled": 6,
        "videos": [],
        "video_count": 10
    }
];

const expectedProjectsTableDataPlusOne = [
    {
        "Project Name": "cat-videos",
        "Number of Videos": "100",
        "Percent Labeled": "50%"
    },
    {
        "Project Name": "dog-videos",
        "Number of Videos": "100",
        "Percent Labeled": "60%"
    },
    {
        "Project Name": "cow-videos",
        "Number of Videos": "10",
        "Percent Labeled": "6%"
    },
];

const annotationsPath = {
    "id": "cat-videos",
    "annotations-path": "your/local/path/local_projects/testing-video/annotations"
};

const mockVideos = [
    {
      "name": "cats-1.mp4",
      "project_id": "project-id-2",
      "id": "video-id-1",
      "date_uploaded": "2023-05-16",
      "percent_labeled": 10,
      "number_of_frames": 25,
      "preprocessing_status": "in_progress"
    },
    {
        "name": "cats-2.mp4",
        "project_id": "project-id-2",
        "id": "video-id-2",
        "date_uploaded": "2023-05-16",
        "percent_labeled": 50,
        "number_of_frames": 20,
        "preprocessing_status": "success"
      }
];

const mockFrames = [
    {
      "human_reviewed": false,
      "width": 640,
      "height": 480,
      "project_id": "project-id-3",
      "video_id": "video-id-10",
      "frame_url": "images/0.jpg",
      "id": "frame-id-100",
      "labels": []
    },
    {
      "human_reviewed": false,
      "width": 640,
      "height": 480,
      "project_id": "project-id-3",
      "video_id": "video-id-10",
      "frame_url": "images/1.jpg",
      "id": "frame-id-101",
      "labels": [
        "label-id-10"
      ]
    },
    {
      "human_reviewed": false,
      "width": 640,
      "height": 480,
      "project_id": "project-id-3",
      "video_id": "video-id-10",
      "frame_url": "images/2.jpg",
      "id": "frame-id-102",
      "labels": [
          "label-id-10"
      ]
    },
];

const server_port = process.env.SERVER_PORT || 5000;
const server = setupServer(
    rest.get(`http://localhost:${server_port}/projects`, (req, res, ctx) => {
        return res(ctx.json(mockProjects));
    }),
    rest.post(`http://localhost:${server_port}/projects`, (req, res, ctx) => {
        return res(ctx.json({
            "name": "cow-videos",
            "id": "project-id-4",
            "frames": [],
            "percent_labeled": 6,
            "videos": [],
            "video_count": 10
        }));
    }),
    rest.get(`http://localhost:${server_port}/projects/project-id-2/annotations`, (req, res, ctx) => {
        return res(ctx.json(annotationsPath));
    }),
    rest.get(`http://localhost:${server_port}/projects/project-id-2/videos`, (req, res, ctx) => {
        return res(ctx.json({
            "project_id": "project-id-1",
            "videos": mockVideos,
        }));
    }),
    rest.get(`http://localhost:${server_port}/projects/project-id-2/labels`, (req, res, ctx) => {
        return res(ctx.json({
            "project_id": "project-id-2",
            "labels": [
                {
                  "name": "Siamese",
                  "project_id": "project-id-2",
                  "id": "label-id-1"
                },
                {
                  "name": "Tabby",
                  "project_id": "project-id-2",
                  "id": "label-id-2"
                },
                {
                  "name": "Persian Blue",
                  "project_id": "project-id-2",
                  "id": "label-id-3"
                },
            ]
          }));
    }),
    rest.get(`http://localhost:${server_port}/videos/video-id-10/frames`, (req, res, ctx) => {
        return res(ctx.json({
            "video_id": "video-id-10",
            "frames": mockFrames
        }));
    }),
    rest.get(`http://localhost:${server_port}/frames/frame-id-102/inferences`, (req, res, ctx) => {
        return res(ctx.json({
            "frame_id": "frame-id-102",
            "bounding_boxes": [
              {
                "x_top_left": 107,
                "y_top_left": 150,
                "x_bottom_right": 148,
                "y_bottom_right": 208,
                "width": 40,
                "height": 57,
                "frame_id": "frame-id-102",
                "label_id": "label-id-10"
              },
              {
                "x_top_left": 268,
                "y_top_left": 26,
                "x_bottom_right": 286,
                "y_bottom_right": 83,
                "width": 18,
                "height": 57,
                "frame_id": "frame-id-102",
                "label_id": "label-id-10"
              },
            ]
          }));
    }),
);
  
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('selectedProject setter and getter', () => {
    const mockProject = {
        "name": "testing-video",
        "id": "video-id-1",
        "frames": [],
        "percent_labeled": 20,
        "videos": [],
        "video_count": 10
    };
    expect(get(projects.selectedProject)).toEqual({});
    projects.selectedProject.set(mockProject);
    expect(get(projects.selectedProject)).toEqual(mockProject);
});

test('fetchProjects will populate allProjects and projectsTableData', async () => {
    expect(get(projects.allProjects)).toEqual([]);
    expect(get(projects.projectsTableData)).toEqual([]);
    await projects.fetchProjects();
    expect(get(projects.allProjects)).toEqual(mockProjects);
    expect(get(projects.projectsTableData)).toEqual(expectedProjectsTableData);
});

test('createNewProject will add another project to allProjects and projectsTableData', async () => {
    expect(get(projects.allProjects)).toEqual(mockProjects);
    expect(get(projects.projectsTableData)).toEqual(expectedProjectsTableData);
    await projects.createNewProject("cow-videos");
    console.log(get(projects.allProjects));
    expect(get(projects.allProjects)).toEqual(mockProjectsPlusOne);
    expect(get(projects.projectsTableData)).toEqual(expectedProjectsTableDataPlusOne);
});

test('downloadAnnotations will return annotations path', async () => {
    const res = await projects.downloadAnnotations("project-id-2");
    expect(res).toEqual(annotationsPath);
});

test('fetchVideos will populate projectVideos and videosTableData and videosExportTableData and ', async () => {
    const expectedVideosTableData = [
        {
            "Name": "cats-1.mp4",
            "Date Uploaded": "2023-05-16",
            "Percent Labeled": "10%",
            "Number of Frames": "25"
        },
        {
            "Name": "cats-2.mp4",
            "Date Uploaded": "2023-05-16",
            "Percent Labeled": "50%",
            "Number of Frames": "20"
        },
    ];
    
    const expectedVideosExportTableData = [
        {
            "Name": "cats-1.mp4",
            "Percent Labeled": "10%",
            "Number of Frames": "25"
        },
        {
            "Name": "cats-2.mp4",
            "Percent Labeled": "50%",
            "Number of Frames": "20"
        },
    ];
    
    const expectedPreprocessingTableData = [
        {
            "Name": "cats-1.mp4",
            "Date Uploaded": "2023-05-16",
            "Status": 1
        },
        {
            "Name": "cats-2.mp4",
            "Date Uploaded": "2023-05-16",
            "Status": 2
        },
    ];

    expect(get(videos.projectVideos)).toEqual([]);
    expect(get(videos.videosTableData)).toEqual([]);
    expect(get(videos.videosExportTableData)).toEqual([]);
    expect(get(videos.preprocessingTableData)).toEqual([]);
    await videos.fetchVideos("project-id-2");
    expect(get(videos.projectVideos)).toEqual(mockVideos);
    expect(get(videos.videosTableData)).toEqual(expectedVideosTableData);
    expect(get(videos.videosExportTableData)).toEqual(expectedVideosExportTableData);
    expect(get(videos.preprocessingTableData)).toEqual(expectedPreprocessingTableData);
});

test('fetchLabels should populate projectLabels and create the mappings between labels IDs and names', async () => {
    const mockLabels = [
        {
          "name": "Siamese",
          "project_id": "project-id-2",
          "id": "label-id-1",
          "hidden": false,
        },
        {
          "name": "Tabby",
          "project_id": "project-id-2",
          "id": "label-id-2",
          "hidden": false,
        },
        {
          "name": "Persian Blue",
          "project_id": "project-id-2",
          "id": "label-id-3",
          "hidden": false,
        },
    ];

    const expectedLabelIdToNameMapping = {
        "label-id-1": "Siamese",
        "label-id-2": "Tabby",
        "label-id-3": "Persian Blue"
    };

    const expectedNameToLabelIdMapping = {
        "Siamese": "label-id-1",
        "Tabby": "label-id-2",
        "Persian Blue": "label-id-3",
    };

    expect(get(labeling.projectLabels)).toEqual([]);
    expect(get(labeling.labelIdToName)).toEqual({});
    expect(get(labeling.nameToLabelId)).toEqual({});
    await labeling.fetchLabels("project-id-2");
    expect(get(labeling.projectLabels)).toEqual(mockLabels);
    expect(get(labeling.labelIdToName)).toEqual(expectedLabelIdToNameMapping);
    expect(get(labeling.nameToLabelId)).toEqual(expectedNameToLabelIdMapping);
});

test('fetchVideoFrames sets videoFrames', async () => {
    expect(get(labeling.videoFrames)).toEqual([]);
    await labeling.fetchVideoFrames("video-id-10");
    expect(get(labeling.videoFrames)).toEqual(mockFrames);
});

test('fetchBoundingBoxes sets currentBoxes', async () => {
    const boxesWithAddedFields = [
        {
            "x_top_left": 107,
            "y_top_left": 150,
            "x_bottom_right": 148,
            "y_bottom_right": 208,
            "width": 40,
            "height": 57,
            "frame_id": "frame-id-102",
            "label_id": "label-id-10",
            "edited": false, 
            "checked": true
          },
          {
            "x_top_left": 268,
            "y_top_left": 26,
            "x_bottom_right": 286,
            "y_bottom_right": 83,
            "width": 18,
            "height": 57,
            "frame_id": "frame-id-102",
            "label_id": "label-id-10",
            "edited": false, 
            "checked": true
          },
    ];

    expect(get(labeling.currentBoxes)).toEqual([]);
    await labeling.fetchBoundingBoxes("frame-id-102");
    expect(get(labeling.currentBoxes)).toEqual(boxesWithAddedFields);
});
