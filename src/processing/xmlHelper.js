import fs from 'fs';
import { parseString } from 'xml2js';

/**
 * Parses an XML string (usually from the server), 
 * cleans up any fragments or weirdness from the
 * XML parser and some special tags
 * @param {String} xmlStr - an xml file as a string to parse
 * @returns {Promise<Object>} A promise of a (JSON) object that represents the xml file
 */
export function parseOsmXml(xmlStr) {
    return new Promise((resolve, reject) => {
      parseString(xmlStr, function (err, result) {
        if (err) return reject(err);
        const res = cleanDollarSignsAndTags(result);
        resolve(res);
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