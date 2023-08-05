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

