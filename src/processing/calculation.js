import fs from 'fs';
import { parseString } from 'xml2js';
import axios from 'axios';

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

function calculateRoadArea(nodes, road) {

    let width = road.tags.width || 10.0;
    // calculate total distance between nodes
    let distance = road.nds.length;

    const area = width * distance;

    return {
        area, unit: "m^2"
    };


    // return {
    //     area: road.nds.length,
    //     unit: "nodes"
    // };
}

export default function (left, top, right, bottom) {
  // replace this with call
  // GET /api/0.6/map?bbox=left,bottom,right,top
  // const xmlContents = fs.readFileSync(__dirname + "/monash-uni-osm.xml");
  const url = `https://overpass-api.de/api/map?bbox=${left},${bottom},${right},${top}`;

  return axios.get(url).then(axRes => {
    return parseOsmXml(axRes.data);
  }).then(parsed => {
    const osm = parsed.osm;
    const nodes = osm.node.map(n => ({[n.id] : reducedNode(n)}));
    const pRoads = osm.way.filter(f => f.tags != null && f.tags.highway != null);

    let roadTypes = [];

    let roads = [];

    for (let i=0; i<pRoads.length; i++) {
      let r = pRoads[i];
      
      roadTypes.push(r.tags.highway);
    
      const { area, unit } = calculateRoadArea(nodes, r);

      if (area > 0) {
        roads.push({
            name: r.tags.name || "unnamed",
            type: r.tags.highway,
            area,
            unit
          });
      }
    }
    return {
        roads: roads,
        types: Array.from(new Set(roadTypes).values())
    };
  }); 
}