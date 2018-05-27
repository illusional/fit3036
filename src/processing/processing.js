import fs from 'fs';
import { parseString } from 'xml2js';
import axios from 'axios';
import { calculateRoadArea, getReducedOrderedNodeSet } from './calculation';
import ReducedNode from './models/ReducedNode';
import Mode from './mode';

/**
 * Parses an XML string (usually from the server), 
 * cleans up any fragments or weirdness from the
 * XML parser and some special tags
 * @param {String} xmlStr - an xml file as a string to parse
 * @returns {Promise<Object>} A promise of a (JSON) object that represents the xml file
 */
function parseOsmXml(xmlStr) {
  return new Promise((resolve, reject) => {
    parseString(xmlStr, function (err, result) {
      if (err) reject(err);
      else resolve(cleanDollarSignsAndTags(result));
    });
  });
}

/**
 * Recursively cleans up $ tags from the javascript object, and rewraps
 * - List of tags into 'tags' object
 * - List od nodes into 'nds' reduced array
 * @param {Object} jobj
 * @returns {Object} The same object after some housework
 */
function cleanDollarSignsAndTags(jobj) {

  // clean up the $ artifact for child tags from the XMl parser
  // and place as a property on the actual object
  if ("$" in jobj) {
    const d = jobj["$"];
    for (const k in d) {
      jobj[k] = d[k];     // set the properties on this
    }
    delete jobj["$"];
  }

  // next, we'll go through each object now, and recursively clean up all the children
  // and specifically handle a few special cases
  for (const k in jobj) {
    const sub = jobj[k];
    // such as the tag array, which we'll set to be properties on a 'tags' child
    if (k === "tag") {
      const tags = {};
      for (let i=0; i < sub.length; i++) {
        const tag = cleanDollarSignsAndTags(sub[i]);
        tags[tag["k"]] = tag["v"];
      }
      delete jobj[k];
      jobj["tags"] = tags;
    }
    else if (k === "nd") {
      // same for the list of nodes, clean it and them reduce it to Node
      const nodes = [];
      for (let i=0; i < sub.length; i++) {
        const nd = cleanDollarSignsAndTags(sub[i]);
        nodes.push(nd["ref"]);
      }
      delete jobj[k];
      jobj["nds"] = nodes;
    }
    // then recursively deal with everything else
    else if (jobj[k] !== null && typeof jobj[k] === "object") {
      cleanDollarSignsAndTags(jobj[k]);
    }
  }
  return jobj;
}

/**
 * returns a Node from the OSM node (object)
 * @param {object} node - OSM node
 * @returns {ReducedNode}
 */
function reducedNode(node) {
  return new ReducedNode(node.id, node.lat, node.lon);
}


async function getOSMData(left, top, right, bottom) {
  const ql = `?data=way[highway](${bottom},${left},${top},${right});(._;>;);out body;`;
  const url = "http://overpass-api.de/api/interpreter" + ql;
  
  try {
    const axRes = await axios.get(url);
    const parsed = await parseOsmXml(axRes.data);
    const osm = parsed.osm;
    const nodes = osm.node.reduce((map, n) => {
      map[n.id] = reducedNode(n);
      return map;
    }, {});

    return {
      nodes,
      roads: osm.way.filter(f => f.tags != null && f.tags.highway != null)
    };
  }
  catch (error) { throw error; }
}

/**
 * Backup method to get OpenStreetMapData, may require additional testing and an API key
 * @param {Number} left 
 * @param {Number} top 
 * @param {Number} right 
 * @param {Number} bottom 
 */
async function getOSMBackupData(left, top, right, bottom) {
  // const url = `https://overpass-api.de/api/map?bbox=${left},${bottom},${right},${top}`;
  // may need credentials or API key for OpenStreetMap
  const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${left},${bottom},${right},${top}`
  try {
    const axRes = await axios.get(url);
    const parsed = await parseOsmXml(axRes.data);
    const osm = parsed.osm;
    const nodes = osm.node.reduce((map, n) => {
      map[n.id] = reducedNode(n);
      return map;
    }, {});

    return {
      nodes,
      roads: osm.way.filter(f => f.tags != null && f.tags.highway != null)
    };
  }
  catch (error) { throw error; }
}

async function getVicroadsOpenData(left, top, right, bottom) {
  const geometryQuery = `geometry=${left}%2C${bottom}%2C${right}%2C${top}`;
  const query = `?where=1%3D1&outFields=*&${geometryQuery}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelContains&outSR=4326&f=json`;
  const url = "https://services2.arcgis.com/18ajPSI0b3ppsmMt/arcgis/rest/services/Road_Width_and_Number_of_Lanes/FeatureServer/0/query" + query;

  try {
    const axRes = await axios.get(url);
    return axRes.data.features;
  } catch (error) {
    
    return null;
  }
}


function round2Decimal(n) {
  return Math.round(n * 100) / 100;
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
    nodeIdToRoad = roads.reduce((m, road) => {
      for (let i=0; i<road.nds.length; i++) {
        nodeIdToRoad[road.nds[i]] = (nodeIdToRoad[road.nds[i]] || []).concat(road.id);
      }
    }, {});
  }


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
    nodeIdToRoad = roads.reduce((m, road) => {
      for (let i=0; i<road.nds.length; i++) {
        nodeIdToRoad[road.nds[i]] = (nodeIdToRoad[road.nds[i]] || []).concat(road.id);
      }
    }, {});
  }


  for (let i=0; i<roads.length; i++) {
    let road = roads[i];
    const reduced = getReducedOrderedNodeSet(mode, bounds, nodeIdToRoad, nodes, road);
    processedRoads.push(reduced.map(val => [val.lon, val.lat]));
  }
  return processedRoads;
}