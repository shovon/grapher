const canvas = document.createElement("canvas") satisfies HTMLCanvasElement;
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

if (!context) {
	throw new Error("Failed to get context");
}

type Point2D = readonly [number, number];

type Range = {
	from: Point2D;
	to: Point2D;
};

const range = {
	from: [-2, 0.8],
	to: [2, -0.8],
} satisfies Range;

function getDelta([from, to]: [number, number]): number {
	const range = [from, to].sort();
	return range[1] - range[0];
}

function ratio([from, to]: [number, number], value: number) {
	const [start] = [from, to].sort();
	const ratio = (value - start) / getDelta([from, to]);
	return ratio;
}

function getPixelPoint(
	{ from, to }: Range,
	dimension: Point2D,
	point: Point2D
): Point2D {
	console.assert(dimension[0] > 0);
	console.assert(dimension[1] > 0);

	const xRatio = ratio([from[0], to[0]], point[0]);
	const yRatio = ratio([from[1], to[1]], point[1]);

	return [xRatio * dimension[0], dimension[1] - yRatio * dimension[1]];
}

console.log(
	getPixelPoint(
		range,
		[
			canvas.getBoundingClientRect().width,
			canvas.getBoundingClientRect().height,
		],
		[-2, 0.8]
	)
);

const max = 100;

const { width, height } = canvas.getBoundingClientRect();

const fn = (x: number) => x ** 3 + 0.25 * x ** 2 - x;

for (let i = 0; i < max; i++) {
	const deltaX = getDelta([range.from[0], range.to[0]]);
	const x = (i / max) * deltaX + range.from[0];

	const y = fn(x);

	const point = getPixelPoint(range, [width, height], [x, y]);

	context.fillStyle = "black";
	context.fillRect(point[0], point[1], 2, 2);
}

export {};
