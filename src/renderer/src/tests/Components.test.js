import { cleanup, render, fireEvent, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import BoxRectangle from '../components/BoxRectangle.svelte';
import Table from '../components/Table.svelte';


test('renders a bounding box rectangle with correct width and height', () => {
    const mockBoundingBox = {
        id: "box-id-1",
        x_top_left: 10,
        y_top_left: 10,
        x_bottom_right: 150,
        y_bottom_right: 150,
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