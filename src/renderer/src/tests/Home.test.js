import {rest} from 'msw';
import {setupServer} from 'msw/node';
import { cleanup, render, fireEvent, screen } from '@testing-library/svelte';
import Home from "../routes/Home.svelte";
import { expect } from 'vitest';
import { get } from 'svelte/store';
import { allProjects, projectsTableData } from "../store.js";

const server_port = process.env.SERVER_PORT || 5000;
const server = setupServer(
    rest.get(`http://localhost:${server_port}/projects`, (req, res, ctx) => {
      return res(ctx.json([
        {
          "name": "raccoon-sightings",
          "id": "f9db1507-3997-4890-b51a-283722c41b44",
          "frame_extraction_rate": 1,
          "frames": [],
          "percent_labeled": 17,
          "videos": [],
          "video_count": 20
        },
        {
          "name": "neighborhood-cats",
          "id": "f9db1507-3997-4890-b51a-283722c41b40",
          "frame_extraction_rate": 2,
          "frames": [],
          "percent_labeled": 20,
          "videos": [],
          "video_count": 10
        }
      ]));
    }),
);
  
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Home.svelte", () => {
    afterEach(() => cleanup());

    // Apparently rendering the Home component doesn't trigger
    // the onMount fetch call so we're doing it here instead
    beforeAll(async () => {
        fetch(`http://localhost:${server_port}/projects`)
        .then(response => response.json())
        .then(data => {
            allProjects.set(data);
        });
        
    })

    it('loads the Home screen', async () => {
        const { container } = render(Home);
        expect(container).toBeTruthy();

        // Expecting the main features to be present
        const createButton = screen.getByRole("button");
        expect(createButton).toBeDefined();

        const table = screen.queryAllByRole("table");
        expect(table).toBeDefined();

        // Expecting the project stores to contain project data
        const projectsStore = get(allProjects);
        expect(projectsStore).toBeDefined();
        expect(projectsStore.length).toEqual(2);

        const projectsTableDataStore = get(projectsTableData);
        expect(projectsTableDataStore).toBeDefined();
        expect(projectsTableDataStore.length).toEqual(2);
    });

    it('shows modal when create new project button is clicked', async () => {
        const { component } = render(Home);

        // Expecting Home component variable showCreateProjectModal to be true
        const createButton = screen.getByRole("button");
        await fireEvent.click(createButton);
        expect(component.$$.ctx[0]).toBeTruthy();

        // Expecting the main modal elements to be on the screen
        const projectNameField = screen.getByPlaceholderText("project-name");
        expect(projectNameField).toBeDefined();

        const modalHeader = screen.getByText("Create a New Labeling Project");
        expect(modalHeader).toBeDefined();
    });
});
