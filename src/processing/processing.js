
import { calculateRoadArea, getReducedOrderedNodeSet } from './calculation';
import { getOSMData } from './mapApis';

import ReducedNode from './models/ReducedNode';
import Mode from './mode';

function round2Decimal(n) {
  return Math.round(n * 100) / 100;
}

function generateIntersectionMap(roads) {
  return roads.reduce((m, road) => {
    for (let i=0; i<road.nds.length; i++) {
      const k = road.nds[i];
      m[k] = (k in m ? m[k] : []).concat(road.id);      }
      return m;
  }, {});
}

/**
 * The manager for the calculations, it handles getting the information
 * @param {Number} left 
 * @param {Number} top 
 * @param {Number} right 
 * @param {Number} bottom 
 * @param {String} mode 
 */
export async function calculate(left, top, right, bottom, mode) {
  const bounds = { left, top, right, bottom };

  const osm = await getOSMData(left, top, right, bottom);
  
  const { nodes, roads } = osm;

  let roadTypes = {};
  let roadNames = {};
  let nodeIdToRoad = {}; // used for finding intersections
  let processedRoads = [];

  if (mode == Mode.truncate) {
    nodeIdToRoad = generateIntersectionMap(roads);
  }

  const start = new Date();
  for (let i=0; i<roads.length; i++) {
    let road = roads[i];
      
    const { area, unit } = calculateRoadArea(mode, bounds, nodeIdToRoad, nodes, road);

    const roadType = road.tags.highway || "unknown";
    const roadName = road.tags.name || "unnamed";

    roadTypes[roadType] = area + (roadType in roadTypes ? roadTypes[roadType] : 0);
    processedRoads.push({ n: roadName, a: area, t: roadType });
    const prev = roadName in roadNames ? roadNames[roadName] : undefined;
    roadNames[roadName] = {
    types: (prev && prev.types) ? 
      (prev.types.indexOf(roadType) >= 0 ? prev.types : prev.types.concat(roadType))
      : [roadType],
    area: round2Decimal(area + (prev ? prev.area : 0)),
    unit
    };
  }
  console.log(`processing time for ${roads.length} roads was: ${new Date().getTime() - start.getTime()} ms`);
  return {
    roadNames,
    roads: processedRoads,
    types: roadTypes
  }; 
}

export async function getNodes(left, top, right, bottom, mode) {
  const bounds = { left, right, top, bottom };
  const osm = await getOSMData(left, top, right, bottom);
  
  const { nodes, roads } = osm;
  let nodeIdToRoad = {}; // used for finding intersections
  let processedRoads = [];

  if (mode == Mode.truncate) {
    nodeIdToRoad = generateIntersectionMap(roads);
  }


  for (let i=0; i<roads.length; i++) {
    let road = roads[i];
    const reduced = getReducedOrderedNodeSet(mode, bounds, nodeIdToRoad, nodes, road);
    processedRoads.push(reduced.map(val => [val.lon, val.lat]));
  }
  return processedRoads;
}