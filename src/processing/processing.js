import fs from 'fs';
import { parseString } from 'xml2js';
import axios from 'axios';
import calculateRoadArea from './calculation';

function parseOsmXml(xmlStr) {
    return new Promise((resolve, reject) => {
        parseString(xmlStr, function (err, result) {
            if (err) {
                reject(err);
                return;
            }            
            resolve(cleanDollarSignsAndTags(result));
        });
    });
}

function cleanDollarSignsAndTags(jobj) {
    if ("$" in jobj) {
        const d = jobj["$"];
        for (const k in d) {
            jobj[k] = d[k];
        }
        delete jobj["$"];
    }

    for (const k in jobj) {
        const sub = jobj[k];
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
            const nodes = [];
            for (let i=0; i < sub.length; i++) {
                const nd = cleanDollarSignsAndTags(sub[i]);
                nodes.push(nd["ref"]);
            }
            delete jobj[k];
            jobj["nds"] = nodes;
        }
        else if (jobj[k] !== null && typeof jobj[k] === "object") {
            cleanDollarSignsAndTags(jobj[k]);
        }
    }
    return jobj;
}

function reducedNode(node) {
  return {
    id: node.id,
    lat: node.lat,
    lon: node.lon
  };
}


export default function (left, top, right, bottom, roadOption) {
  // replace this with call
  // GET /api/0.6/map?bbox=left,bottom,right,top
  // const xmlContents = fs.readFileSync(__dirname + "/monash-uni-osm.xml");
//   const url = `https://overpass-api.de/api/map?bbox=${left},${bottom},${right},${top}`;
  const ql = `?data=way[highway](${bottom},${left},${top},${right});(._;>;);out body;`;
  const url = "http://overpass-api.de/api/interpreter" + ql;

  return axios.get(url).then(axRes => {
    return parseOsmXml(axRes.data);
  }).then(parsed => {
    const osm = parsed.osm;
    const nodes = osm.node.reduce((map, n) => {
        map[n.id] = reducedNode(n);
        return map;
    }, {});
    const pRoads = osm.way.filter(f => f.tags != null && f.tags.highway != null);

    let roadTypes = {};
    let roadSummary = {};
    let roads = [];

    for (let i=0; i<pRoads.length; i++) {
      let r = pRoads[i];
          
      const { area, unit } = calculateRoadArea(nodes, r);

      const roadType = r.tags.highway || "unknown";
      const roadName = r.tags.name || "unnamed";

      roadTypes[roadType] = area + (roadType in roadTypes ? roadTypes[roadType] : 0);
      roads.push({ n: roadName, a: area, t: roadType });
      const prev = roadName in roadSummary ? roadSummary[roadName] : undefined;
      roadSummary[roadName] = {
        types: (prev && prev.types) ? 
            (prev.types.indexOf(roadType) >= 0 ? prev.types : prev.types.concat(roadType))
            : [roadType],
        area: area + (prev ? prev.area : 0),
        unit
      };
    }
    return {
        roadSummary,
        roads,
        types: roadTypes
    };
  }); 
}