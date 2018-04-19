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

function distanceBetweenAllPoints(pts) {
    let distance = 0.0;
    for (let i=0; i < pts.length-1; i++) {
        distance += distanceBetweenCoordinates(pts[i], pts[i+1]);
    }
    return distance;
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function distanceBetweenCoordinates(p1, p2) {
    // φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km) 
    // a = sin²(φB - φA/2) + cos φA * cos φB * sin²(λB - λA/2)
    // c = 2 * atan2( √a, √(1−a) )
    // d = R ⋅ c

    // Coordinates in decimal degrees (e.g. 2.89078, 12.79797)
    const lat1 = p1.lat;
    const lon1 = p2.lon;
    const lat2 = p2.lat;
    const lon2 = p2.lon;

    const R = 6371000;  //  radius of Earth in meters
    const phi_1 = toRadians(lat1);
    const phi_2 = toRadians(lat2);

    const delta_phi = toRadians(lat2 - lat1);
    const delta_lambda = toRadians(lon2 - lon1);

    const a = Math.pow(Math.sin(delta_phi / 2.0), 2) + Math.cos(phi_1) * Math.cos(phi_2) * Math.pow(Math.sin(delta_lambda / 2.0), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const meters = R * c;  // output distance in meters

    return meters;
}


function calculateRoadArea(nodes, road) {

    let width = road.tags.width || 8.0;
    // calculate total distance between nodes
    const orderedCoordinatePairs = road.nds.map((nd, idx) => nodes[nd]);
    let distance = distanceBetweenAllPoints(orderedCoordinatePairs);

    const area = width * distance;

    return {
        area, unit: "m^2"
    };


    // return {
    //     area: road.nds.length,
    //     unit: "nodes"
    // };
}

export default function (left, top, right, bottom, roadOption) {
  // replace this with call
  // GET /api/0.6/map?bbox=left,bottom,right,top
  // const xmlContents = fs.readFileSync(__dirname + "/monash-uni-osm.xml");
  const url = `https://overpass-api.de/api/map?bbox=${left},${bottom},${right},${top}`;
  console.log("Road Option", roadOption);

  return axios.get(url).then(axRes => {
    return parseOsmXml(axRes.data);
  }).then(parsed => {
    const osm = parsed.osm;
    const nodes = osm.node.reduce((map, n) => {
        map[n.id] = reducedNode(n);
        return map;
    }, {});
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