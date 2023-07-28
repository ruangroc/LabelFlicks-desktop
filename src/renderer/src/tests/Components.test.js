import { cleanup, render, fireEvent, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import { get, set } from 'svelte/store';
import BoxRectangle from '../components/BoxRectangle.svelte';
import Table from '../components/Table.svelte';
import BoxLabel from '../components/BoxLabel.svelte';
import ControlButtons from '../components/ControlButtons.svelte';
import CreateLabel from '../components/CreateLabel.svelte';
import PercentFramesReviewed from '../components/PercentFramesReviewed.svelte';
import SelectBoxes from '../components/SelectBoxes.svelte';
import SelectVideo from '../components/SelectVideo.svelte';
import { 
    selectedFrame, 
    videoFrames, 
    selectedFrameIndex, 
    currentBoxes, 
    sendUpdatedBoundingBoxes,
    updateBoundingBoxesNoPredictions,
    updateReviewedFrames,
    selectedVideoID,
    projectLabels
} from "../stores/labeling";
import { projectVideos } from "../stores/videos";

test('renders a bounding box rectangle with correct width and height', () => {
    const mockBoundingBox = {
        id: "box-id-1",
        x_top_left: 10,
        y_top_left: 10,
        x_bottom_right: 150,
        y_bottom_right: 200,
        width: 140,
        height: 190,
        frame_id: "frame-id-1",
        label_id: "label-id-1",
        prediction: true
    }

    const { container } = render(
        BoxRectangle, 
        { 
            bbox: mockBoundingBox, 
            widthRatio: 1, 
            heightRatio: 1, 
        }
    );
    expect(container).toBeTruthy();

    const svgRectangle = screen.getByTestId('rect-box-id-1', {hidden: true});
    expect(svgRectangle).toBeVisible();
    expect(svgRectangle).toBeDefined();
    expect(svgRectangle).toHaveStyle('width: 140');
    expect(svgRectangle).toHaveStyle('height: 190');
    expect(svgRectangle).toHaveClass('predicted');

    cleanup(container);
});

test('renders a predicted bounding box label with correct css class', () => {
    const predictedBox = {
        id: "box-id-2",
        x_top_left: 10,
        y_top_left: 10,
        x_bottom_right: 50,
        y_bottom_right: 100,
        width: 40,
        height: 90,
        frame_id: "frame-id-2",
        label_id: "label-id-2",
        prediction: true
    }

    const { container } = render(
        BoxLabel, 
        { 
            bbox: predictedBox, 
            boxIndex: 2, 
            displayedLabel: "cat"
        }
    );
    expect(container).toBeTruthy();

    const labelBackground = screen.getByTestId('label-rect-box-id-2', {hidden: true});
    expect(labelBackground).toBeVisible();
    expect(labelBackground).toBeDefined();
    expect(labelBackground).toHaveClass('predicted-label-bg');

    const labelText = screen.getByTestId('label-text-box-id-2', {hidden: true});
    expect(labelText).toBeVisible();
    expect(labelText).toBeDefined();
    expect(labelText).toHaveClass('bounding-box-label');

    cleanup(container);
});

test('renders a reviewed bounding box label with correct css class', () => {
    const nonpredictedBox = {
        id: "box-id-3",
        x_top_left: 100,
        y_top_left: 10,
        x_bottom_right: 140,
        y_bottom_right: 20,
        width: 30,
        height: 10,
        frame_id: "frame-id-3",
        label_id: "label-id-3",
        prediction: false
    }

    const { container } = render(
        BoxLabel, 
        { 
            bbox: nonpredictedBox, 
            boxIndex: 3, 
            displayedLabel: "cat" 
        }
    );
    expect(container).toBeTruthy();

    const labelBackground2 = screen.getByTestId('label-rect-box-id-3', {hidden: true});
    expect(labelBackground2).toBeVisible();
    expect(labelBackground2).toBeDefined();
    expect(labelBackground2).toHaveClass('bounding-box-label-bg');

    const labelText2 = screen.getByTestId('label-text-box-id-3', {hidden: true});
    expect(labelText2).toBeVisible();
    expect(labelText2).toBeDefined();
    expect(labelText2).toHaveClass('bounding-box-label');

    cleanup(container);
});

test('renders a table with data correctly', () => {
    const mockProjects = [
		{
			"Project Name": "seattle-wildlife-project",
			"Date Created": "June 20, 2022",
			"Number of Videos": "6",
			"Percent Labeled": "78%",
		},
		{
			"Project Name": "olympia-state-park",
			"Date Created": "July 3, 2022",
			"Number of Videos": "12",
			"Percent Labeled": "16%",
		},
		{
			"Project Name": "montana-black-bears",
			"Date Created": "May 4, 2022",
			"Number of Videos": "46",
			"Percent Labeled": "100%",
		},
	];

    const { container } = render(
        Table, 
        {tableData: mockProjects}
    );
    expect(container).toBeTruthy();

    const table = screen.getByRole("table");
    expect(table).toBeVisible();
    expect(table).toBeDefined();

    const columnNames = screen.getAllByRole("columnheader");
    expect(columnNames).toHaveLength(4);

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4);

    cleanup(container);
});

test('renders the control buttons correctly', () => {
    selectedVideoID.set("video-id-1");
    selectedFrame.set({
        human_reviewed: false,
        width: 640,
        height: 480,
        project_id: "project-id-1",
        video_id: "video-id-1",
        frame_url: "path/to/a/frame/0.jpg",
        id: "frame-id-1",
        labels: []
    });

    const { container } = render(ControlButtons);
    expect(container).toBeTruthy();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    console.log(buttons);

    const frameIndicatorTimeline = screen.getByTestId("frame-indicator-timeline");
    expect(frameIndicatorTimeline).toBeVisible();
    expect(frameIndicatorTimeline).toBeDefined();

    const frameText = screen.getByTestId("frame-text");
    expect(frameText).toBeVisible();
    expect(frameText).toBeDefined();
    expect(frameText).toHaveTextContent("Frame: 0.jpg");

    cleanup(container);
});

test('renders the create label modal correctly', () => {
    const { container } = render(CreateLabel, {showCreateLabelModal: true});
    expect(container).toBeTruthy();

    const heading = screen.getByTestId("modal-heading");
    expect(heading).toBeDefined();
    expect(heading).toHaveTextContent("Create a New Label");

    const input = screen.getByTestId("modal-input");
    expect(input).toBeDefined();
    
    const cancelButton = screen.getByTestId("cancel-button");
    expect(cancelButton).toHaveTextContent("Cancel");

    const createButton = screen.getByTestId("create-button");
    expect(createButton).toHaveTextContent("Create Label");

    cleanup(container);
});

test('renders the percent of frames reviewed correctly', () => {
    videoFrames.set([
        {
            human_reviewed: false,
            width: 640,
            height: 480,
            project_id: "project-id-1",
            video_id: "video-id-1",
            frame_url: "path/to/a/frame/0.jpg",
            id: "frame-id-1",
            labels: []
        }
    ]);

    const { container } = render(PercentFramesReviewed);
    expect(container).toBeTruthy();

    const text = screen.getByTestId("percent-reviewed");
    expect(text).toBeDefined();
    expect(text).toHaveTextContent("0% of 1 total frames reviewed");
});

test('renders box selection div correctly', () => {
    projectLabels.set([
        {
            id: "label-id-1",
            name: "cat"
        },
        {
            id: "label-id-2",
            name: "dog"
        },
    ]);

    currentBoxes.set([
        {
            id: "box-id-1",
            x_top_left: 10,
            y_top_left: 10,
            x_bottom_right: 150,
            y_bottom_right: 200,
            width: 140,
            height: 190,
            frame_id: "frame-id-1",
            label_id: "label-id-1",
            prediction: true
        }
    ]);

    const { container } = render(SelectBoxes);
    expect(container).toBeTruthy();

    const heading = screen.getByRole("heading");
    expect(heading).toBeDefined();
    expect(heading).toHaveTextContent("Individual Box Selection");

    const input = screen.getByRole("checkbox");
    expect(input).toBeDefined();
    expect(input).toHaveAccessibleName("Label: cat | Box Index: 0");
});

test('renders video selection dropdown correctly', () => {
    projectVideos.set([
        {
            "name": "sidewalk-cats.mp4",
            "project_id": "project-id-1",
            "id": "video-id-1",
            "date_uploaded": "2023-05-16",
            "percent_labeled": 0,
            "number_of_frames": 2,
            "preprocessing_status": "success"
          }
    ])
    selectedVideoID.set("video-id-1");

    const { container } = render(SelectVideo);
    expect(container).toBeTruthy();

    const heading = screen.getByRole("heading");
    expect(heading).toBeDefined();
    expect(heading).toBeVisible();
    expect(heading).toHaveAccessibleName("Video:");

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeDefined();
    expect(dropdown).toBeVisible();

    const dropdownOption = screen.getByRole("option");
    expect(dropdownOption).toBeDefined();
    expect(dropdownOption).toHaveAccessibleName("sidewalk-cats.mp4");
});
