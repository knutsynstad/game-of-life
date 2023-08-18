import { Context, Devvit } from "@devvit/public-api";
import Cell from "./Cell.js";

const size = 23;
const createBlankData = Array.from({ length: size * size }, () => false);

function createRandomData() {
  return Array.from({ length: size * size }, () => Math.random() < 1 / 4);
}

function getCellIndex(x: number, y: number) {
  return x + y * size;
}

function getCellCoords(index: number) {
  return {
    x: index % size,
    y: Math.floor(index / size),
  };
}

function getCell(x: number, y: number, data: boolean[]) {
  const index = getCellIndex(x, y);
  return data[index];
}

function countNeighbors(x: number, y: number, data: boolean[]) {
  let count = 0;
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) continue;
      if (getCell(x + offsetX, y + offsetY, data)) count++;
    }
  }
  return count;
}

export function GameOfLife({ useState, useInterval }: Context) {
  const [simulating, setSimulating] = useState(false);
  const [data, setData] = useState(createRandomData());

  function toggleCell(x: number, y: number) {
    setData((data) => {
      const index = getCellIndex(x, y);
      const newData = [...data];
      newData[index] = !newData[index];
      return newData;
    });
  }

  function tick() {
    if (!simulating) return;
    setData((currentData) => {
      const newData = [...currentData];
      newData.forEach((_, cellIndex) => {
        const { x, y } = getCellCoords(cellIndex);
        const neighbors = countNeighbors(x, y, currentData);
        if (getCell(x, y, currentData) && (neighbors < 2 || neighbors > 3)) {
          newData[cellIndex] = false;
        } else if (neighbors === 3) {
          newData[cellIndex] = true;
        }
      });

      return newData;
    });
  }

  const simulationLoop = useInterval(tick, 250);

  function toggleSimulation() {
    setSimulating((prevSimulating) => {
      if (prevSimulating) {
        simulationLoop.stop();
      } else {
        simulationLoop.start();
      }
      return !prevSimulating;
    });
  }

  return (
    <blocks height="tall">
      <vstack
        padding="medium"
        cornerRadius="medium"
        alignment="middle center"
        height={100}
        border="thin"
      >
        {/* Grid */}
        <vstack>
          {Array.from({ length: size }, (_, y) => (
            <hstack>
              {Array.from({ length: size }, (_, x) => (
                <Cell
                  alive={getCell(x, y, data)}
                  onPress={() => toggleCell(x, y)}
                />
              ))}
            </hstack>
          ))}
        </vstack>

        <spacer size="xsmall" grow />

        {/* Controls */}
        <hstack gap="medium" width={100}>
          <button
            icon={simulating ? "pause" : "play"}
            grow
            onPress={() => toggleSimulation()}
          >
            {simulating ? "Pause" : "Play"}
          </button>
          <button
            icon="delete"
            grow
            onPress={() => setData(createBlankData)}
          >
            Clear
          </button>
          <button
            icon="random"
            grow
            onPress={() => setData(createRandomData())}
          >
            Random
          </button>
        </hstack>
      </vstack>
    </blocks>
  );
}
