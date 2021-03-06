/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest, FILTER, TRANSFORMATIONS} from "./IInsightFacade";

import Log from "../Util";
// add some
"use strict";
import {parse} from "querystring";
import forEach = require("core-js/fn/array/for-each");


var fs: any = require("fs");
var JSZip: any = require("jszip");
var missingIds: any[] = [];
const parse5 = require('parse5');
var http = require('http');
var coursedata1: any = [];
var roomdata1: any = [];

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        let that = this;

        return new Promise(function (fulfill, reject) {

            let jszip = new JSZip();
            var indicator = 0;

            jszip.loadAsync(content, {base64: true}).then(function (zip: JSZip) {
                let promiseArray: any[] = [];
                let promiseForIndex: any;
                zip.forEach(function (relativePath, file) {

                    if (id === 'rooms') {
                        // roomcontent
                        var nameOfFile = relativePath.split("/")[relativePath.split("/").length - 1];
                        if (nameOfFile === "index.htm") {
                            let buildingContent = file.async('string').then(function (content) {
                                var indexdoc = parse5.parse(content);
                                var indexNode = InsightFacade.findNode(indexdoc, "class", "views-table cols-5 table");
                                var buildings = indexNode.childNodes[3].childNodes;
                                var buildingArray: any[] = [];

                                for (var i = 1; i < buildings.length; i = i + 2) {
                                    var shortName = (parse5.serialize(buildings[i].childNodes[3]).trim());
                                    buildingArray.push(shortName);
                                }
                                return buildingArray;
                            });
                            promiseForIndex = buildingContent;
                        }
                        else if (file.dir === false && nameOfFile.indexOf("_") === -1) {
                            let roomContent = file.async('string').then(function (content) {
                                try {
                                    var roomArray: any[] = [];
                                    var document = parse5.parse(content);
                                    var node = InsightFacade.findNode(document, "id", "building-info");
                                    var fullname: string = parse5.serialize(node.childNodes[1].childNodes[0]);
                                    var address: string = parse5.serialize(node.childNodes[3].childNodes[0]);

                                    var nodetemp = InsightFacade.findNode(document, "class", "views-table cols-5 table");
                                    var node1 = nodetemp.childNodes[3];

                                    var ADDRESS = encodeURI(address);
                                    var url = 'http://skaha.cs.ubc.ca:11316/api/v1/team25/' + ADDRESS;

                                    // let p = new Promise(function (fulfill, reject) {
                                    //
                                    //     http.get(url, function (res: any) {
                                    //         var body = '';
                                    //         res.on('data', function (chunk: any) {
                                    //             body += chunk;
                                    //         });
                                    //         res.on('end', function () {
                                    //             // Data reception is done, do whatever with it!
                                    //             var parsed = JSON.parse(body);
                                    //             fulfill(parsed);
                                    //         })
                                    //     })
                                    // })

                                    return InsightFacade.latlonPromise(url).then(function (latlon: any) {

                                        if (node1.childNodes.length >= 1) {

                                            for (var i = 1; i < node1.childNodes.length; i = i + 2) {
                                                var number: string = parse5.serialize(node1.childNodes[i].childNodes[1].childNodes[1]);
                                                var furniture = parse5.serialize(node1.childNodes[i].childNodes[5]).trim().replace("&amp;", "&");

                                                //var room_address = (address).toString();
                                                // var ADDRESS = (address).toString();
                                                // console.log(ADDRESS);

                                                var myObj: any = {
                                                    "rooms_fullname": (fullname).toString(),
                                                    "rooms_shortname": (nameOfFile).toString(),
                                                    "rooms_number": (parse5.serialize(node1.childNodes[i].childNodes[1].childNodes[1])).toString(),
                                                    "rooms_name": (nameOfFile + "_" + number).toString(),
                                                    "rooms_address": (address).toString(),
                                                    "rooms_seats": Number(parse5.serialize(node1.childNodes[i].childNodes[3])),
                                                    "rooms_type": (parse5.serialize(node1.childNodes[i].childNodes[7]).trim()).toString(),
                                                    "rooms_furniture": (furniture).toString(),
                                                    "rooms_href": (node1.childNodes[i].childNodes[9].childNodes[1].attrs[0].value).toString(),
                                                    "rooms_lat": Number(latlon.lat),
                                                    "rooms_lon": Number(latlon.lon)
                                                };

                                                //console.log(myObj);

                                                roomArray.push(JSON.stringify(myObj));
                                            }
                                        }
                                        if (roomArray.length != 0) {
                                            indicator = 1;
                                        }
                                        return roomArray;
                                    })
                                }
                                catch (err) {
                                }
                            });
                            promiseArray.push(roomContent);
                        }
                    }
                    else {
                        let readContent = file.async('string').then(function (content) {
                            try {
                                var courseArray: any[] = [];
                                var a = JSON.parse(content);

                                if (Array.isArray(a[Object.keys(a)[0]])) {
                                    if (a[Object.keys(a)[0]].length != 0) {
                                        for (var j = 0; j < a[Object.keys(a)[0]].length; j++) {
                                            var currentObject = a[Object.keys(a)[0]][j];
                                            var year = 0;
                                            if (currentObject.hasOwnProperty('Subject') &&
                                                currentObject.hasOwnProperty('Course') &&
                                                currentObject.hasOwnProperty('Avg') &&
                                                currentObject.hasOwnProperty('Professor') &&
                                                currentObject.hasOwnProperty('Title') &&
                                                currentObject.hasOwnProperty('Pass') &&
                                                currentObject.hasOwnProperty('Fail') &&
                                                currentObject.hasOwnProperty('Audit') &&
                                                currentObject.hasOwnProperty('id') &&
                                                (currentObject.hasOwnProperty('Year') ||
                                                ((currentObject.hasOwnProperty('Section')) && (currentObject.Section === "overall")))) {
                                                if ((currentObject.hasOwnProperty('Section')) && (currentObject.Section === "overall")) {
                                                    year = 1900;
                                                } else {
                                                    year = currentObject.Year;
                                                }
                                                var myObj: any = {
                                                    "courses_dept": (currentObject.Subject).toString(),
                                                    "courses_id": (currentObject.Course).toString(),
                                                    "courses_avg": Number(currentObject.Avg),
                                                    "courses_instructor": (currentObject.Professor).toString(),
                                                    "courses_title": (currentObject.Title).toString(),
                                                    "courses_pass": Number(currentObject.Pass),
                                                    "courses_fail": Number(currentObject.Fail),
                                                    "courses_audit": Number(currentObject.Audit),
                                                    "courses_uuid": (currentObject.id).toString(),
                                                    "courses_year": Number(year),
                                                    "courses_size": Number(currentObject.Pass + currentObject.Fail)
                                                };
                                                courseArray.push(JSON.stringify(myObj));
                                            }
                                        }
                                    }
                                }
                                if (courseArray.length != 0) {
                                    indicator = 1;
                                }
                                return courseArray;
                            }
                            catch (err) {

                            }
                        });

                        promiseArray.push(readContent);

                    }
                });
                if (id === "courses") {

                    Promise.all(promiseArray).then(function (parameter: any) {

                        if (indicator === 0) {
                            reject({code: 400, body: {"error": 'zip does not contain any real data.'}});
                        }

                        let coursesArray: any[] = [];
                        for (var i = 0; i < parameter.length; i++) {
                            if (Array.isArray((parameter[i])) && parameter[i].length != 0) {
                                for (var j = 0; j < parameter[i].length; j++) {
                                    //TODO
                                    coursesArray.push(parameter[i][j]);
                                    coursedata1.push(JSON.parse(parameter[i][j]));

                                }
                            }
                        }

                        //TODO
                        // for (var i = 0; i < coursesArray.length; i++) {
                        //     coursedata1.push(JSON.parse(coursesArray[i]));
                        // }
                        //coursedata1 = coursesArray;

                        var folder = './datasets';

                        fs.exists(folder, function (exists: any) {
                            if (!exists) {
                                fs.mkdirSync(folder);
                            }

                            var path = folder + '/' + id + '.json';

                            fs.exists(path, function (exists: any) {
                                if (exists) { // id exists, add to replace it
                                    fs.writeFile(path, '[' + coursesArray + ']', (err: any) => {
                                        if (err) {
                                            reject({code: 400, body: {"error": 'the operation failed.'}});
                                            throw err;
                                        } else {
                                            fulfill({code: 201, body: {"success": 'the operation was successful.'}});
                                        }
                                    });
                                } else { // id doesn't exist, add id
                                    fs.writeFile(path, '[' + coursesArray + ']', (err: any) => {
                                        if (err) {
                                            reject({code: 400, body: {"error": 'the operation failed.'}});
                                            throw err;
                                        } else {
                                            fulfill({code: 204, body: {"success": 'the operation was successful.'}});
                                        }
                                    });
                                }
                            });
                        });

                    }).catch(function (err) {
                        reject({code: 400, body: {"error": 'the operation failed.'}});
                    })
                }
                else {
                    Promise.all(promiseArray).then(function (parameter: any) {
                        promiseForIndex.then(function (result: any[]) {
                            if (indicator === 0) {
                                reject({code: 400, body: {"error": 'zip does not contain any real data.'}});
                            }

                            let roomsArray: any[] = [];
                            let buildingArray: any[] = [];
                            buildingArray = result;

                            for (var i = 0; i < parameter.length; i++) {
                                if (Array.isArray((parameter[i])) && parameter[i].length != 0) {
                                    for (var j = 0; j < parameter[i].length; j++) {

                                        var temp = parameter[i][j];
                                        var temp1 = JSON.parse(temp).rooms_shortname;

                                        if (buildingArray.indexOf(temp1) !== -1) {
                                            //TODO
                                            roomsArray.push(parameter[i][j]);
                                            roomdata1.push(JSON.parse(parameter[i][j]));
                                        }

                                    }
                                }
                            }
                            //TODO
                            // for (var i = 0; i < roomsArray.length; i++) {
                            //     roomdata1.push(JSON.parse(roomsArray[i]));
                            // }
                            //roomdata1 = roomsArray;

                            var folder = './datasets';

                            fs.exists(folder, function (exists: any) {
                                if (!exists) {
                                    fs.mkdirSync(folder);
                                }

                                var path = folder + '/' + id + '.json';

                                fs.exists(path, function (exists: any) {
                                    if (exists) { // id exists, add to replace it
                                        fs.writeFile(path, '[' + roomsArray + ']', (err: any) => {
                                            if (err) {
                                                reject({code: 400, body: {"error": 'the operation failed.'}});
                                                throw err;
                                            } else {
                                                fulfill({
                                                    code: 201,
                                                    body: {"success": 'the operation was successful.'}
                                                });
                                            }
                                        });
                                    } else { // id doesn't exist, add id
                                        fs.writeFile(path, '[' + roomsArray + ']', (err: any) => {
                                            if (err) {
                                                reject({code: 400, body: {"error": 'the operation failed.'}});
                                                throw err;
                                            } else {
                                                fulfill({
                                                    code: 204,
                                                    body: {"success": 'the operation was successful.'}
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        });

                    }).catch(function (err) {
                        reject({code: 400, body: {"error": 'the operation failed.'}});
                    })
                }

            }).catch(function (err: any) {
                reject({code: 400, body: {"error": 'no such zip file exists.'}});
            })
        });
    }

    public static latlonPromise(url: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {

            var rooms_lat = 0;
            var rooms_lon = 0;

            http.get(url, function (res: any) {
                var body = '';
                res.on('data', function (chunk: any) {
                    body += chunk;
                });
                res.on('end', function () {
                    // Data reception is done, do whatever with it!
                    var parsed = JSON.parse(body);

                    // rooms_lat = parsed.lat;
                    // rooms_lon = parsed.lon;
                    //
                    // myObj["rooms_lat"] = rooms_lat;
                    // myObj["rooms_lon"] = rooms_lat;

                    fulfill(parsed);
                });
            });
        })
    }

    public static findNode(content: any, name: any, value: any): any {
        if (typeof (content.attrs) !== "undefined") {
            for (var i = 0; i < content.attrs.length; i++) {
                if (content.attrs[i].name === name && content.attrs[i].value === value) {
                    return content;
                }
            }
        }
        if (typeof (content.childNodes) !== "undefined") {
            if (content.childNodes.length !== 0) {
                for (var i = 0; i < content.childNodes.length; i++) {
                    var result = this.findNode(content.childNodes[i], name, value);
                    if (result !== null) {
                        return result;
                    }
                }
            }
        }
        return null;
    }

    removeDataset(id: string): Promise<InsightResponse> {

        return new Promise(function (fulfill, reject) {

            var path = './datasets/' + id + '.json';

            fs.exists(path, function (exists: any) {
                if (exists) {
                    fs.unlink(path);
<<<<<<< HEAD
                    //TODO: check!!!不知道对不对
=======
>>>>>>> 13415e254bb5a7561255ab32c4ce09cbe4615a2f
                    if (id === "courses") {
                        coursedata1 = [];
                    } else if (id === "rooms") {
                        roomdata1 = [];
                    }

                    fulfill({code: 204, body: {"success": "the operation was successful."}});
                } else {
                    reject({
                        code: 404, body: {
                            "error": "the operation was unsuccessful because the delete " +
                            "was for a resource that was not previously added."
                        }
                    });
                }
            });
        });
    }

    public static controlFilter(body: FILTER, result: any[], coursedata: any[], roomdata: any[]): any {
        let that = this;
        var errmessage = "";

        if (typeof(body.AND) !== "undefined"
            && typeof (body.OR) === "undefined"
            && typeof (body.LT) === "undefined"
            && typeof (body.GT) === "undefined"
            && typeof (body.EQ) === "undefined"
            && typeof (body.IS) === "undefined"
            && typeof (body.NOT) === "undefined") {
            try {
                var and: any[] = body.AND;
                if (and.length === 0) {
                    errmessage = "AND is empty";
                    throw new Error(errmessage);
                }
                var and0: any[] = that.controlFilter(and[0], [], coursedata, roomdata);
                if (and.length === 1) {
                    return (and0);
                }

                var checkAnd: any = {};
                var tempSolution: any[] = [];
                //determine the id of the result
                if (and0.length !== 0) {
                    var keys = Object.keys(and0[0]);
                    var checkId = keys[0].split("_")[0];
                    if (checkId === "rooms") {
                        for (var i = 0; i < and0.length; i++) {
                            checkAnd[and0[i].rooms_name] = 1;
                            tempSolution[i] = and0[i];
                        }
                    } else {
                        for (var i = 0; i < and0.length; i++) {
                            checkAnd[and0[i].courses_uuid] = 1;
                            tempSolution[i] = and0[i];
                        }
                    }


                    var length = and.length;

                    for (var i = 1; i < and.length; i++) {
                        var andi: any[] = InsightFacade.controlFilter(and[i], [], coursedata, roomdata);
                        if (andi.length !== 0) {
                            if (checkId !== Object.keys(andi[0])[0].split("_")[0]) {
                                errmessage = "the keys are different in AND";
                                throw new Error(errmessage);
                            }

                            if (checkId === "rooms") {
                                andi.forEach(function (element: any) {
                                    if (checkAnd.hasOwnProperty(element.rooms_name)) {
                                        checkAnd[element.rooms_name] = checkAnd[element.rooms_name] + 1;
                                    }
                                });
                            } else {
                                andi.forEach(function (element: any) {
                                    if (checkAnd.hasOwnProperty(element.courses_uuid)) {
                                        checkAnd[element.courses_uuid] = checkAnd[element.courses_uuid] + 1;
                                    }
                                });
                            }
                        }
                    }
                    if (checkId === "rooms") {
                        for (var i = 0; i < tempSolution.length; i++) {
                            if (length === checkAnd[tempSolution[i].rooms_name]) {
                                result.push(tempSolution[i]);
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < tempSolution.length; i++) {
                            if (length === checkAnd[tempSolution[i].courses_uuid]) {
                                result.push(tempSolution[i]);
                            }
                        }
                    }
                }
                return result;
            }
            catch (err) {
                throw new Error(errmessage);
            }
        }
        else if (typeof(body.AND) === "undefined"
            && typeof (body.OR) !== "undefined"
            && typeof (body.LT) === "undefined"
            && typeof (body.GT) === "undefined"
            && typeof (body.EQ) === "undefined"
            && typeof (body.IS) === "undefined"
            && typeof (body.NOT) === "undefined") {
            try {
                var or: any[] = body.OR;
                if (or.length === 0) {
                    errmessage = "OR is empty";
                    throw new Error(errmessage);
                }
                var checkOr: any = {};
                var checkDifferentIds: string = " ";

                for (var i = 0; i < or.length; i++) {
                    var ori: any[] = InsightFacade.controlFilter(or[i], [], coursedata, roomdata);
                    if (ori.length !== 0) {

                        var keys = Object.keys(ori[0]);
                        var checkId = keys[0].split("_")[0];
                        if (checkDifferentIds === " ") {
                            checkDifferentIds = checkId;
                        }
                        if (checkId !== checkDifferentIds) {
                            errmessage = "the keys are different in OR";
                            throw new Error(errmessage);
                        }
                        else {
                            if (checkId === "rooms") {
                                ori.forEach(function (element: any) {
                                    if (!checkOr.hasOwnProperty(element.rooms_name)) {
                                        checkOr[element.rooms_name] = 1;
                                        result.push(element);
                                    }
                                });
                            }
                            else {
                                ori.forEach(function (element: any) {
                                    if (!checkOr.hasOwnProperty(element.courses_uuid)) {
                                        checkOr[element.courses_uuid] = 1;
                                        result.push(element);
                                    }
                                });
                            }
                        }
                    }
                }
                return result;
            }
            catch (err) {
                throw new Error(errmessage);
            }
        }
        else if (typeof(body.AND) === "undefined"
            && typeof (body.OR) === "undefined"
            && typeof (body.LT) !== "undefined"
            && typeof (body.GT) === "undefined"
            && typeof (body.EQ) === "undefined"
            && typeof (body.IS) === "undefined"
            && typeof (body.NOT) === "undefined") {
            try {
                var lt: any = body.LT;
                if (Object.keys(lt).length === 1) {
                    var key1: string = Object.keys(lt)[0];
                    var arr: String[] = key1.split("_");
                    var value = arr[1];
                    var checkid = arr[0];
                    if (checkid === "rooms") {
                        if (value !== "fullname" && value !== "shortname" && value !== "number"
                            && value !== "name" && value !== "address" && value !== "lat"
                            && value !== "lon" && value !== "seats" && value !== "type"
                            && value !== "furniture" && value !== "href") {
                            errmessage = "the key is not a valid key";
                        }
                    } else {
                        if (value !== "dept" && value !== "id" && value !== "avg"
                            && value !== "instructor" && value !== "title" && value !== "pass"
                            && value !== "fail" && value !== "audit" && value !== "uuid" && value !== "year"
                            && value != "size") {
                            errmessage = "the key is not a valid key";
                        }
                    }
                    if (typeof(lt[key1]) === "number") {
                        var number: number = lt[key1];
                    } else {
                        errmessage = "LT input is not a number.";
                    }
                }
                else {
                    errmessage = "the number of object in LT is not 1";
                }

                var arr: String[] = key1.split("_");
                var id = arr[0];
                var path = './datasets/' + id + '.json';


                if (fs.existsSync(path)) {

                    if (id === "courses") {

                        coursedata.forEach(function (elements: any) {
                            //var element = JSON.parse(elements);
                            if (elements[key1] < number) {
                                result.push(elements);
                            }
                        });
                    }

                    if (id === "rooms") {
                        roomdata.forEach(function (elements: any) {
                            //var element = JSON.parse(elements);
                            if (elements[key1] < number) {
                                result.push(elements);
                            }
                        });
                    }


                    // var data = JSON.parse(fs.readFileSync(path).toString());
                    // data.forEach(function (element: any) {
                    //     if (element[key1] < number) {
                    //         result.push(element);
                    //     }
                    // });
                }
                else {
                    var checkExist = false;
                    missingIds.forEach(function (element) {
                        if (element === id) {
                            checkExist = true;
                        }
                    });
                    if (!checkExist) {
                        missingIds.push(id);
                    }
                }

                if (errmessage !== "") {
                    throw new Error(errmessage);
                }

                return (result);
            }
            catch (err) {
                throw new Error(errmessage);
            }
        }
        else if (typeof(body.AND) === "undefined"
            && typeof (body.OR) === "undefined"
            && typeof (body.LT) === "undefined"
            && typeof (body.GT) !== "undefined"
            && typeof (body.EQ) === "undefined"
            && typeof (body.IS) === "undefined"
            && typeof (body.NOT) === "undefined") {
            try {
                var gt: any = body.GT;
                if (Object.keys(gt).length === 1) {
                    var key1: string = Object.keys(gt)[0];
                    var arr: String[] = key1.split("_");
                    var value = arr[1];
                    var checkid = arr[0];
                    if (checkid === "rooms") {
                        if (value !== "fullname" && value !== "shortname" && value !== "number"
                            && value !== "name" && value !== "address" && value !== "lat"
                            && value !== "lon" && value !== "seats" && value !== "type"
                            && value !== "furniture" && value !== "href") {
                            errmessage = "the key is not a valid key";
                        }
                    } else {
                        if (value !== "dept" && value !== "id" && value !== "avg"
                            && value !== "instructor" && value !== "title" && value !== "pass"
                            && value !== "fail" && value !== "audit" && value !== "uuid" && value !== "year"
                            && value != "size") {
                            errmessage = "the key is not a valid key";
                        }
                    }
                    if (typeof(gt[key1]) === "number") {
                        var number: number = gt[key1];
                    } else {
                        errmessage = "GT input is not a number.";
                    }
                }
                else {
                    errmessage = "the number of object in GT is not 1";
                }

                var arr: String[] = key1.split("_");
                var id = arr[0];
                var path = './datasets/' + id + '.json';

                if (fs.existsSync(path)) {

                    if (id === "courses") {

                        coursedata.forEach(function (elements: any) {
                            //var element = JSON.parse(elements);
                            if (elements[key1] > number) {
                                result.push(elements);
                            }
                        });
                    }

                    if (id === "rooms") {
                        roomdata.forEach(function (elements: any) {
                            //var element = JSON.parse(elements);
                            if (elements[key1] > number) {
                                result.push(elements);
                            }
                        });
                    }
                }
                else {
                    var checkExist = false;
                    missingIds.forEach(function (element) {
                        if (element === id) {
                            checkExist = true;
                        }
                    });
                    if (!checkExist) {
                        missingIds.push(id);
                    }
                }

                if (errmessage !== "") {
                    throw new Error(errmessage);
                }

                return result;
            }
            catch (err) {
                throw new Error(errmessage);
            }
        }
        else if (typeof(body.AND) === "undefined"
            && typeof (body.OR) === "undefined"
            && typeof (body.LT) === "undefined"
            && typeof (body.GT) === "undefined"
            && typeof (body.EQ) !== "undefined"
            && typeof (body.IS) === "undefined"
            && typeof (body.NOT) === "undefined") {
            try {
                var eq: any = body.EQ;
                if (Object.keys(eq).length === 1) {
                    var key1: string = Object.keys(eq)[0];
                    var arr: String[] = key1.split("_");
                    var value = arr[1];
                    var checkid = arr[0];
                    if (checkid === "rooms") {
                        if (value !== "fullname" && value !== "shortname" && value !== "number"
                            && value !== "name" && value !== "address" && value !== "lat"
                            && value !== "lon" && value !== "seats" && value !== "type"
                            && value !== "furniture" && value !== "href") {
                            errmessage = "the key is not a valid key";
                        }
                    } else {
                        if (value !== "dept" && value !== "id" && value !== "avg"
                            && value !== "instructor" && value !== "title" && value !== "pass"
                            && value !== "fail" && value !== "audit" && value !== "uuid" && value !== "year"
                            && value != "size") {
                            errmessage = "the key is not a valid key";
                        }
                    }
                    if (typeof(eq[key1]) === "number") {
                        var number: number = eq[key1];
                    } else {
                        errmessage = "EQ input is not a number.";
                    }
                }
                else {
                    errmessage = "the number of object in EQ is not 1";
                }

                var arr: String[] = key1.split("_");
                var id = arr[0];
                var path = './datasets/' + id + '.json';

                if (fs.existsSync(path)) {

                    if (id === "courses") {

                        coursedata.forEach(function (elements: any) {
                            //var element = JSON.parse(elements);
                            if (elements[key1] === number) {
                                result.push(elements);
                            }
                        });
                    }

                    if (id === "rooms") {
                        roomdata.forEach(function (elements: any) {
                            //var element = JSON.parse(elements);
                            if (elements[key1] === number) {
                                result.push(elements);
                            }
                        });
                    }

                    // var data = JSON.parse(fs.readFileSync(path).toString());
                    // data.forEach(function (element: any) {
                    //     if (element[key1] < number) {
                    //         result.push(element);
                    //     }
                    // });
                }
                else {
                    var checkExist = false;
                    missingIds.forEach(function (element) {
                        if (element === id) {
                            checkExist = true;
                        }
                    });
                    if (!checkExist) {
                        missingIds.push(id);
                    }
                }

                if (errmessage !== "") {
                    throw new Error(errmessage);
                }

                return (result);
            }
            catch (err) {
                throw new Error(errmessage);
            }
        }
        else if (typeof(body.AND) === "undefined"
            && typeof (body.OR) === "undefined"
            && typeof (body.LT) === "undefined"
            && typeof (body.GT) === "undefined"
            && typeof (body.EQ) === "undefined"
            && typeof (body.IS) !== "undefined"
            && typeof (body.NOT) === "undefined") {
            try {
                var is: any = body.IS;
                if (Object.keys(is).length === 1) {
                    var key1: string = Object.keys(is)[0];
                    var arr: String[] = key1.split("_");
                    var value = arr[1];
                    var checkid = arr[0];
                    if (checkid === "rooms") {
                        if (value !== "fullname" && value !== "shortname" && value !== "number"
                            && value !== "name" && value !== "address" && value !== "lat"
                            && value !== "lon" && value !== "seats" && value !== "type"
                            && value !== "furniture" && value !== "href") {
                            errmessage = "the key is not a valid key";
                        }
                    } else {
                        if (value !== "dept" && value !== "id" && value !== "avg"
                            && value !== "instructor" && value !== "title" && value !== "pass"
                            && value !== "fail" && value !== "audit" && value !== "uuid" && value !== "year"
                            && value != "size") {
                            errmessage = "the key is not a valid key";
                        }
                    }
                    var substring: string = is[key1];
                    var length_substring = substring.length;
                }
                else {
                    errmessage = "the number of object in IS is not 1";
                }
                var arr: String[] = key1.split("_");
                var id = arr[0];
                var path = './datasets/' + id + '.json';

                if (id === "courses") {
                    data = coursedata;
                } else if (id === "rooms") {
                    data = roomdata;
                } else {
                    var checkExist = false;
                    missingIds.forEach(function (element) {
                        if (element === id) {
                            checkExist = true;
                        }
                    });
                    if (!checkExist) {
                        missingIds.push(id);
                    }
                }
                data.forEach(function (element: any) {
                    var wholeArray: any[] = element[key1].split('');
                    if (substring.charAt(0) === '*' && substring.charAt(length_substring - 1) === '*') {
                        var subArray: any[] = substring.substring(1, length_substring - 1).split('');
                        if (InsightFacade.matchString(wholeArray, subArray) && wholeArray.length > subArray.length) {
                            result.push(element);
                        }
                    } else if (substring.charAt(substring.length - 1) === '*') {
                        var subArray: any[] = substring.substring(0, length_substring - 1).split('');
                        var checkExist: boolean = true;
                        for (var i = 0; i < length_substring - 1; i++) {
                            if (wholeArray[i] != subArray[i]) {
                                checkExist = false;
                            }
                        }
                        if (checkExist && wholeArray.length > subArray.length) {
                            result.push(element);
                        }
                    } else if (substring.charAt(0) === '*') {
                        var subArray: any[] = substring.substring(1, length_substring).split('');
                        var checkExist: boolean = true;
                        var checkEnter: boolean = false;
                        var j = wholeArray.length;
                        for (var i = subArray.length - 1; i >= 0; i--) {
                            if (wholeArray[j - 1] != subArray[i] && j - 1 >= 0) {
                                checkExist = false;
                            }
                            j--;
                        }
                        if (checkExist && wholeArray.length > subArray.length) {
                            result.push(element);
                        }
                    } else {
                        var subArray: any[] = substring.split('');
                        var checkExist: boolean = true;
                        if (wholeArray.length === subArray.length) {
                            for (var i = 0; i < length_substring; i++) {
                                if (wholeArray[i] != subArray[i]) {
                                    checkExist = false;
                                }
                            }
                            if (checkExist) {
                                result.push(element);
                            }
                        }
                    }

                });

                if (errmessage !== "") {

                    throw new Error(errmessage);
                }

                return (result);
            }
            catch (err) {
                throw new Error(errmessage);
            }
        }
        else if (typeof(body.AND) === "undefined"
            && typeof (body.OR) === "undefined"
            && typeof (body.LT) === "undefined"
            && typeof (body.GT) === "undefined"
            && typeof (body.EQ) === "undefined"
            && typeof (body.IS) === "undefined"
            && typeof (body.NOT) !== "undefined") {
            try {
                var not: any = body.NOT;
                var filterResult: any[] = InsightFacade.controlFilter(not, [], coursedata, roomdata);
                var u: any = {};

                //determine id for the result
                var keys = Object.keys(filterResult[0]);
                var checkId = keys[0].split("_")[0];
                if (checkId === "rooms") {
                    for (var i = 0; i < filterResult.length; i++) {
                        var uuid = filterResult[i].rooms_name;
                        u[uuid] = 1;
                    }
                    var data = roomdata;
                    data.forEach(function (element: any) {
                        if (!u.hasOwnProperty(element.rooms_name)) {
                            result.push(element);
                        }
                    });
                    return result;
                }
                else if (checkId === "courses") {
                    for (var i = 0; i < filterResult.length; i++) {
                        var uuid = filterResult[i].courses_uuid;
                        u[uuid] = 1;
                    }

                    var data = coursedata;
                    data.forEach(function (element: any) {
                        if (!u.hasOwnProperty(element.courses_uuid)) {
                            result.push(element);
                        }
                    });
                    return result;
                } else {
                    var checkExist = false;
                    missingIds.forEach(function (element) {
                        if (element === checkId) {
                            checkExist = true;
                        }
                    });
                    if (!checkExist) {
                        missingIds.push(checkId);
                    }
                }
            }
            catch (err) {
                errmessage = err.message;
                throw new Error(errmessage);
            }
        }
        else {
            errmessage = "the query failed because the type in FILTER contains zero or more than one instruction";
            throw new Error(errmessage);
        }
    }


    public static matchTable(c: string[]): any[] {
        let that = this;
        var length = c.length;
        var a: any[] = [];
        a[0] = -1;
        var i = 0;
        var j = 0;
        for (j = 1; j < length; j++) {
            i = a[j - 1];
            while (i >= 0 && c[j] != c[i + 1]) {
                i = a[i];
            }
            if (c[j] === c[i + 1]) {
                a[j] = i + 1;
            } else {
                a[j] = -1;
            }
        }
        return a;
    }

    public static matchString(s: any[], t: any[]): boolean {
        let that = this;
        var next: any[] = InsightFacade.matchTable(t);
        var i = 0;
        var j = 0;
        while (i <= s.length - 1 && j <= t.length - 1) {
            if (j === -1 || s[i] === t[j]) {
                i++;
                j++;
            } else {
                j = next[j];
            }
        }
        if (j < t.length) {
            return false;
        } else
            return true;
    }

    public static controlTransformations(transformation: TRANSFORMATIONS, filterResult: any[]): any {
        try {
            var errmessage = "";

            var group = transformation.GROUP;
            var apply = transformation.APPLY;

            var newResult: any[] = [];
            var checkList: any = {};
            var currentIndex = 0;

            if (apply.length === 0) {
                for (var i = 0; i < filterResult.length; i++) {
                    var currentObj = filterResult[i];
                    var newObj: any = {};
                    for (var j = 0; j < group.length; j++) {
                        var currentKey: string = group[j];
                        if (currentObj.hasOwnProperty(currentKey)) {
                            var currentValue: any = currentObj[currentKey];
                            newObj[currentKey] = currentValue;
                        }
                        else {
                            errmessage = "the transformations failed because keys in group are invalid";
                            throw new Error(errmessage);
                        }
                    }
                    if (!checkList.hasOwnProperty(JSON.stringify(newObj))) {
                        newResult.push(newObj);
                        checkList[JSON.stringify(newObj)] = currentIndex;
                        currentIndex++;
                    }
                }
            } else if (apply.length > 0) {
                var groupArray: any[][] = [];
                for (var i = 0; i < filterResult.length; i++) {
                    var currentObj = filterResult[i];
                    var newObj: any = {};
                    for (var j = 0; j < group.length; j++) {
                        var currentKey: string = group[j];
                        //console.log(currentKey);
                        if (currentObj.hasOwnProperty(currentKey)) {
                            var currentValue: any = currentObj[currentKey];
                            newObj[currentKey] = currentValue;
                        } else {
                            errmessage = "the transformations failed because keys in group are invalid";
                            throw new Error(errmessage);
                        }
                    }


                    if (!checkList.hasOwnProperty(JSON.stringify(newObj))) {
                        newResult[currentIndex] = newObj;
                        checkList[JSON.stringify(newObj)] = currentIndex;
                        var emptyArray: any[] = [];
                        groupArray.push(emptyArray);
                        groupArray[currentIndex].push(currentObj);

                        currentIndex = currentIndex + 1;
                    } else {
                        var a = checkList[JSON.stringify(newObj)];
                        groupArray[a].push(currentObj);
                    }
                }
                // groupArray中存的是2dimensional array 每一个group被存在了一个相同的array中

                for (var q = 0; q < apply.length; q++) {
                    var akeys = Object.keys(apply[q]);
                    if (akeys.length !== 1) {
                        errmessage = "the transformations failed because the type in apply contains zero or more than one keys";
                        throw new Error(errmessage);
                    }
                    var applyKey = akeys[0];
                    if (applyKey.indexOf("_") !== -1) {
                        errmessage = "the transformations failed because apply key contains '_' ";
                        throw new Error(errmessage);
                    }
                    var objectInsideApply = apply[q][applyKey];
                    var functionKeys = Object.keys(objectInsideApply);
                    if (functionKeys.length !== 1) {
                        errmessage = "the transformations failed because the value inside apply contains zero or more than one keys";
                        throw new Error(errmessage);
                    }
                    var functionName = functionKeys[0];
                    var functionKey = objectInsideApply[functionName];
                    var arr: String[] = functionKey.split("_");
                    var value = arr[1];
                    var checkid = arr[0];
                    if (checkid === "rooms") {
                        if (value !== "fullname" && value !== "shortname" && value !== "number"
                            && value !== "name" && value !== "address" && value !== "lat"
                            && value !== "lon" && value !== "seats" && value !== "type"
                            && value !== "furniture" && value !== "href") {
                            errmessage = "the key is not a valid key";
                            throw new Error(errmessage);
                        }
                    } else {
                        if (value !== "dept" && value !== "id" && value !== "avg"
                            && value !== "instructor" && value !== "title" && value !== "pass"
                            && value !== "fail" && value !== "audit" && value !== "uuid" && value !== "year"
                            && value != "size") {
                            errmessage = "the key is not a valid key";
                            throw new Error(errmessage);
                        }
                    }
                    if (functionName === "COUNT") {
                        for (var f = 0; f < groupArray.length; f++) {
                            var count = InsightFacade.functionCount(groupArray[f], functionKey);
                            newResult[f][applyKey] = count;
                        }
                    } else if (functionName === "MAX") {
                        if (typeof (groupArray[0][0][functionKey]) !== "number") {
                            errmessage = "MAX filed is not number";
                            throw new Error(errmessage);
                        }
                        for (var f = 0; f < groupArray.length; f++) {
                            var max = InsightFacade.functionMax(groupArray[f], functionKey);
                            newResult[f][applyKey] = max;
                        }
                    } else if (functionName === "MIN") {
                        if (typeof (groupArray[0][0][functionKey]) !== "number") {
                            errmessage = "MIN filed is not number";
                            throw new Error(errmessage);
                        }
                        for (var f = 0; f < groupArray.length; f++) {
                            var min = InsightFacade.functionMin(groupArray[f], functionKey);
                            newResult[f][applyKey] = min;
                        }
                    } else if (functionName === "AVG") {
                        if (typeof (groupArray[0][0][functionKey]) !== "number") {
                            errmessage = "AVG filed is not number";
                            throw new Error(errmessage);
                        }
                        for (var f = 0; f < groupArray.length; f++) {
                            var avg = InsightFacade.functionAvg(groupArray[f], functionKey);
                            newResult[f][applyKey] = avg;
                        }
                    } else if (functionName === "SUM") {
                        if (typeof (groupArray[0][0][functionKey]) !== "number") {
                            errmessage = "SUM filed is not number";
                            throw new Error(errmessage);
                        }
                        for (var f = 0; f < groupArray.length; f++) {
                            var sum = InsightFacade.functionSum(groupArray[f], functionKey);
                            newResult[f][applyKey] = sum;
                        }
                    } else {
                        errmessage = "the transformations failed because APPPLYTOKEN is invalid";
                        throw new Error(errmessage);
                    }
                }
            }
            return newResult;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public static functionMax(oneGroup: any[], key: string): number {
        var maxNumber = -1;
        for (var i = 0; i < oneGroup.length; i++) {
            var currentObject = oneGroup[i];
            var tempNumber = currentObject[key];
            if (tempNumber > maxNumber) {
                maxNumber = tempNumber;
            }
        }
        return maxNumber;
    }

    public static functionMin(oneGroup: any[], key: string): number {
        var minNumber = -1;
        for (var i = 0; i < oneGroup.length; i++) {
            var currentObject = oneGroup[i];
            var tempNumber = currentObject[key];
            if (tempNumber < minNumber || minNumber === -1) {
                minNumber = tempNumber;
            }
        }
        return minNumber;
    }

    public static functionSum(oneGroup: any[], key: string): number {
        var sum = 0;
        for (var i = 0; i < oneGroup.length; i++) {
            var currentObject = oneGroup[i];
            var tempNumber = currentObject[key];
            sum = sum + tempNumber;
        }
        return sum;
    }

    public static functionCount(oneGroup: any[], key: string): number {
        var count = 0;
        var countArray: any[] = [];
        for (var i = 0; i < oneGroup.length; i++) {
            if (oneGroup[i].hasOwnProperty(key) && !countArray.includes(oneGroup[i][key])) {
                countArray.push(oneGroup[i][key]);
                count = count + 1;
            }
        }
        return count;
    }

    public static functionAvg(oneGroup: any[], key: string): number {
        var sum = 0;
        var count = 0;
        for (var i = 0; i < oneGroup.length; i++) {
            var currentObject = oneGroup[i];
            var tempNumber = currentObject[key];
            tempNumber = tempNumber * 10;
            tempNumber = Number(tempNumber.toFixed(0));
            sum = sum + tempNumber;
            count++;
        }
        var avg = sum / count;
        var avg = avg / 10;
        return Number(avg.toFixed(2));
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return new Promise(function (fulfill, reject) {
            try {
                var resultArray: any = [];
                var applyKeyArray: any = [];
                var groupArray: any = [];
                var answer = {render: "", result: resultArray};
                var error = "";
                var coursedata: any = [];
                var roomdata: any = [];

                if (query.hasOwnProperty("WHERE") && query.hasOwnProperty("OPTIONS")) {

                    var body = query.WHERE;
                    var options = query.OPTIONS;
                    var columns = options.COLUMNS;

                    //find key for this query
                    var idForThisQuery: string;
                    if (query.hasOwnProperty("TRANSFORMATIONS")) {
                        groupArray = query.TRANSFORMATIONS.GROUP;
                        if (groupArray.length === 0) {
                            reject({code: 400, body: {"error": "Group cannot be empty"}});
                        }
                        idForThisQuery = groupArray[0].split("_")[0];

                    } else {
                        if (columns.length === 0) {
                            reject({code: 400, body: {"error": "Error: columns length is 0"}});
                        }
                        idForThisQuery = columns[0].split("_")[0]
                    }

                    if (idForThisQuery === "courses") {
                        coursedata = coursedata1;
                        if (coursedata.length == 0) {

                            if (fs.existsSync('./datasets/courses.json')) {
                                var data1 = JSON.parse(fs.readFileSync('./datasets/courses.json').toString());
                                coursedata = data1;
                            } else {
                                //reject({code: 424, body: {"error": "Error: Course dataset does not exist."}});
                                var checkExist = false;
                                missingIds.forEach(function (element) {
                                    if (element === idForThisQuery) {
                                        checkExist = true;
                                    }
                                });
                                if (!checkExist) {
                                    missingIds.push(idForThisQuery);
                                }
                            }
                            // try {
                            //     var data1 = JSON.parse(fs.readFileSync('./datasets/courses.json').toString());
                            //     coursedata = data1;
                            // } catch (err) {
                            //     reject({code: 400, body: {"error": "Error: Should not be able to perform query when dataset has not been added."}});
                            // }
                        }
                    } else if (idForThisQuery === "rooms") {
                        roomdata = roomdata1;
                        if (roomdata.length == 0) {

                            if (fs.existsSync('./datasets/rooms.json')) {
                                var data2 = JSON.parse(fs.readFileSync('./datasets/rooms.json').toString());
                                roomdata = data2;
                            } else {
                                //reject({code: 424, body: {"error": "Error: Room dataset does not exist."}});
                                var checkExist = false;
                                missingIds.forEach(function (element) {
                                    if (element === idForThisQuery) {
                                        checkExist = true;
                                    }
                                });
                                if (!checkExist) {
                                    missingIds.push(idForThisQuery);
                                }
                            }
                            // try {
                            //     var data2 = JSON.parse(fs.readFileSync('./datasets/rooms.json').toString());
                            //     roomdata = data2;
                            // } catch (err) {
                            //     reject({code: 400, body: {"error": "Error: Should not be able to perform query when dataset has not been added."}});
                            // }
                        }
                    } else {
                        var checkExist = false;
                        missingIds.forEach(function (element) {
                            if (element === idForThisQuery) {
                                checkExist = true;
                            }
                        });
                        if (!checkExist) {
                            missingIds.push(idForThisQuery);
                        }
                    }


                    if (query.hasOwnProperty("TRANSFORMATIONS")) {

                        var applyArray = query.TRANSFORMATIONS.APPLY;
                        for (var i = 0; i < applyArray.length; i++) {
                            var akeys = Object.keys(applyArray[i]);
                            var applyKey = akeys[0];
                            applyKeyArray.push(applyKey);
                        }
                    }


                    if (options.FORM != "TABLE") {
                        reject({code: 400, body: {"error": "invalid FORM — missing FORM or FORM is not TABLE."}});
                    } else {
                        var view = options.FORM;
                    }
                    if (options.ORDER != null) {
                        var order = options.ORDER;
                        var con = 0;

                        if (query.hasOwnProperty("TRANSFORMATIONS")) {

                            for (var i = 0; i < columns.length; i++) {

                                for (var j = 0; j < applyKeyArray.length; j++) {
                                    if (columns[i] === applyKeyArray[j]) {
                                        con = 1;
                                    }
                                }

                                //groupArray = query.TRANSFORMATIONS.GROUP;
                                for (var m = 0; m < groupArray.length; m++) {
                                    if (columns[i] === groupArray[m]) {
                                        con = 1;
                                    }
                                }

                            }

                            if (con === 0) {
                                reject({
                                    code: 400,
                                    body: {"error": "COLUMNS array does not contain any key in GROUP and APPLY."}
                                });
                            }

                        } else {
                            for (var i = 0; i < columns.length; i++) {

                                if (typeof(order) === "string"){
                                    if (order === columns[i]) {
                                        con = 1;
                                    }
                                } else if (typeof(order) === "object") {
                                    var orderKeys = order.keys;
                                    for (var j = 0; j < orderKeys.length; j++){
                                        if (orderKeys[j] === columns[i]){
                                            con = 1;
                                        }
                                    }
                                }
                            }

                            if (con === 0) {
                                reject({
                                    code: 400,
                                    body: {"error": "COLUMNS array does not contain the key in ORDER."}
                                });
                            }
                        }
                    }

                    answer.render = view;

                    if (query.hasOwnProperty("TRANSFORMATIONS")) {
                        for (var i = 0; i < columns.length; i++) {
                            var key = columns[i];
                            if (applyKeyArray.length !== 0) {
                                if (!applyKeyArray.includes(key) && !query.TRANSFORMATIONS.GROUP.includes(key)) {
                                    reject({code: 400, body: {"error": "Error: the key is not a valid key"}});
                                }
                            } else {
                                if (!query.TRANSFORMATIONS.GROUP.includes(key)) {
                                    reject({code: 400, body: {"error": "Error: the key is not a valid key"}});
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < columns.length; i++) {
                            var key = columns[i];
                            var arr: String[] = key.split("_");
                            var id = arr[0];
                            if (id !== "courses" && id != "rooms") {
                                var checkExist = false;
                                missingIds.forEach(function (element) {
                                    if (element === id) {
                                        checkExist = true;
                                    }
                                });
                                if (!checkExist) {
                                    missingIds.push(id);
                                }
                            }
                            var value = arr[1];
                            var checkid = arr[0];

                            if (checkid === "rooms") {
                                if (value !== "fullname" && value !== "shortname" && value !== "number"
                                    && value !== "name" && value !== "address" && value !== "lat"
                                    && value !== "lon" && value !== "seats" && value !== "type"
                                    && value !== "furniture" && value !== "href") {
                                    reject({code: 400, body: {"error": "Error: the key is not a valid key"}});
                                }
                            } else {
                                if (value !== "dept" && value !== "id" && value !== "avg"
                                    && value !== "instructor" && value !== "title" && value !== "pass"
                                    && value !== "fail" && value !== "audit" && value !== "uuid" && value !== "year"
                                    && value != "size") {
                                    reject({code: 400, body: {"error": "Error: the key is not a valid key"}});
                                }
                            }
                            // }
                        }
                    }

                    if (Object.keys(body).length !== 0) {
                        try {
                            resultArray = InsightFacade.controlFilter(body, resultArray, coursedata, roomdata);
                            if (query.hasOwnProperty("TRANSFORMATIONS")) {
                                resultArray = InsightFacade.controlTransformations(query.TRANSFORMATIONS, resultArray);
                            }

                        } catch (err) {
                            error = err.toString();
                        }
                    } else if ((Object.keys(body).length === 0)) {

                        if (query.hasOwnProperty("TRANSFORMATIONS")) {
                            try {

                                var key1: string = query.TRANSFORMATIONS.GROUP[0];
                                var arr: String[] = key1.split("_");
                                var id = arr[0];

                                if (id === "rooms") {
                                    resultArray = InsightFacade.controlTransformations(query.TRANSFORMATIONS, roomdata);
                                }

                                if (id === "courses") {
                                    resultArray = InsightFacade.controlTransformations(query.TRANSFORMATIONS, coursedata);
                                }
                            } catch (err) {
                                reject({code: 400, body: {"error": err.message}});
                            }
                        } else {

                            var key1: string = columns[0];
                            var arr: String[] = key1.split("_");
                            var id = arr[0];

                            if (id === "rooms"){
                                resultArray = roomdata;
                            }
                            if (id === "courses"){
                                resultArray = coursedata;
                            }

                        }
                    }

                    // column
                    var newresult: any = [];
                    for (var i = 0; i < resultArray.length; i++) {
                        var obj: any = {};
                        for (var j = 0; j < columns.length; j++) {
                            var current = columns[j];
                            obj[current] = resultArray[i][current];
                        }
                        newresult.push(obj);
                    }

                    // sort and order

                    if (typeof(order) === "string") {
                        newresult.sort(InsightFacade.keysrt(order));
                    } else if (typeof(order) === "object") {
                        var dir = order.dir;
                        var keys = order.keys;
                        var lengthofkeys = keys.length;

                        //console.log(keys.slice().shift());
                        //
                        // for (var i = 0; i < lengthofkeys; i++){
                        //     newresult = newresult.sort(InsightFacade.keysrt(order.keys[0]));
                        //     console.log(newresult);
                        // }


                        if (dir === "UP") {
                            // newresult.sort(function (x: any, y: any) {
                            //     // for (var i = 0; i < lengthofkeys; i++){
                            //     //     var n = x[keys[i]] - y[keys[i]];
                            //     //     if (n !== 0) {
                            //     //         return n;
                            //     //     }
                            //     //
                            //     //     return x[keys[i+1]] - y[keys[i+1]];
                            //     // }
                            //
                            //     // TODO:
                            //
                            // });
                            newresult.sort(InsightFacade.multiKeysrt(keys, lengthofkeys));

                        } else if (dir === "DOWN") {
                            newresult.sort(InsightFacade.multiKeysrt(keys, lengthofkeys));
                            newresult = newresult.reverse();
                        } else {
                            reject({code: 400, body: {"error": "the sorting direction is invalid."}});
                        }
                    }

                    answer.result = newresult;

                    //console.log(answer);

                    //console.log(error);

                    if (missingIds.length === 0) {
                        if (error === "") {
                            return fulfill({code: 200, body: answer});
                        } else {
                            reject({code: 400, body: {"error": error}});
                        }
                    } else {
                        var newmissing = missingIds;
                        missingIds = [];
                        reject({code: 424, body: {"missing": newmissing}});
                    }

                }
                else {
                    reject({
                        code: 400,
                        body: {"error": "the query failed because it does not contain proper form of query."}
                    });
                }
            } catch (err) {
                reject({code: 400, body: {"error": err.toString()}});
            }
        })
    }


    public static keysrt(key: any) {
        return function (key1: any, key2: any) {
            if (key1[key] > key2[key]) {
                return 1;
            }
            if (key1[key] < key2[key]) {
                return -1;
            }
            return 0;
        }
    }

    public static multiKeysrt (keys: any[], size: number) {
        return function (A: any, B: any) {
            var result: any;
            for (var i = 0; i < size; i++) {
                result = 0;
                var key = keys[i];
                var a = A[key];
                var b = B[key];
                if (a < b) {
                    result = -1;
                }
                if (a > b) {
                    result = 1;
                }
                if (result !== 0) break;
            }
            return result;
        }
    }

}