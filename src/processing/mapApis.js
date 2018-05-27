import axios from 'axios';
import ReducedNode from './models/ReducedNode';
import { parseOsmXml } from './xmlHelper';

/**
 * returns a Node from the OSM node (object)
 * @param {object} node - OSM node
 * @returns {ReducedNode}
 */
function reducedNode(node) {
    return new ReducedNode(node.id, node.lat, node.lon);
}


export async function getOSMData(left, top, right, bottom) {
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
export async function getOSMBackupData(left, top, right, bottom) {
// const url = `https://overpass-api.de/api/map?bbox=${left},${bottom},${right},${top}`;
// may need credentials or API key for OpenStreetMap
const url = `https://api.openstreetmap.org/api/0.6/map?bbox=${left},${bottom},${right},${top}`;
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
  
export async function getVicroadsOpenData(left, top, right, bottom) {
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