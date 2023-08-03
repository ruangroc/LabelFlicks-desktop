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
        "id": "video-id-2",
        "frames": [],
        "percent_labeled": 50,
        "videos": [],
        "video_count": 100
    },
    {
        "name": "dog-videos",
        "id": "video-id-3",
        "frames": [],
        "percent_labeled": 60,
        "videos": [],
        "video_count": 100
    }
];

const expectedTableData = [
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
        "id": "video-id-2",
        "frames": [],
        "percent_labeled": 50,
        "videos": [],
        "video_count": 100
    },
    {
        "name": "dog-videos",
        "id": "video-id-3",
        "frames": [],
        "percent_labeled": 60,
        "videos": [],
        "video_count": 100
    },
    {
        "name": "cow-videos",
        "id": "video-id-4",
        "frames": [],
        "percent_labeled": 6,
        "videos": [],
        "video_count": 10
    }
];

const expectedTableDataPlusOne = [
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

const server_port = process.env.SERVER_PORT || 5000;
const server = setupServer(
    rest.get(`http://localhost:${server_port}/projects`, (req, res, ctx) => {
        return res(ctx.json(mockProjects));
    }),
    rest.post(`http://localhost:${server_port}/projects`, (req, res, ctx) => {
        return res(ctx.json({
            "name": "cow-videos",
            "id": "video-id-4",
            "frames": [],
            "percent_labeled": 6,
            "videos": [],
            "video_count": 10
        }));
    }),
    rest.get(`http://localhost:${server_port}/projects/cat-videos/annotations`, (req, res, ctx) => {
        return res(ctx.json(annotationsPath));
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
    expect(get(projects.projectsTableData)).toEqual(expectedTableData);
});

test('createNewProject will add another project to allProjects and projectsTableData', async () => {
    expect(get(projects.allProjects)).toEqual(mockProjects);
    expect(get(projects.projectsTableData)).toEqual(expectedTableData);
    await projects.createNewProject("cow-videos");
    console.log(get(projects.allProjects));
    expect(get(projects.allProjects)).toEqual(mockProjectsPlusOne);
    expect(get(projects.projectsTableData)).toEqual(expectedTableDataPlusOne);
});

test('downloadAnnotations will return annotations path', async () => {
    const res = await projects.downloadAnnotations("cat-videos");
    expect(res).toEqual(annotationsPath);
});