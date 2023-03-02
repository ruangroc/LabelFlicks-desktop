import {rest} from 'msw';
import {setupServer} from 'msw/node';
import { cleanup, render, fireEvent, screen } from '@testing-library/svelte';
import Home from "../routes/Home.svelte";
import { expect } from 'vitest';

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

    it('mounts', () => {
        const { container } = render(Home);
        expect(container).toBeTruthy();
        const createButton = screen.getByRole("button");
        expect(createButton).toBeDefined();
        const table = screen.queryAllByRole("table");
        expect(table).toBeDefined();
    });
});

