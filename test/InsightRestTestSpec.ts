// /**
//  * Created by Melauria on 2017-03-10.
//  */
//
//
// import Server from "../src/rest/Server";
// import {expect} from 'chai';
// import Log from "../src/Util";
// import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
// import InsightFacade from "../src/controller/InsightFacade";
//
// var chai = require('chai');
// var chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// chai.should();
//
// let result1 = {
//     render: 'TABLE',
//     result: [{courses_dept: 'epse', courses_avg: 97.09},
//         {courses_dept: 'math', courses_avg: 97.09},
//         {courses_dept: 'math', courses_avg: 97.09},
//         {courses_dept: 'epse', courses_avg: 97.09},
//         {courses_dept: 'math', courses_avg: 97.25},
//         {courses_dept: 'math', courses_avg: 97.25},
//         {courses_dept: 'epse', courses_avg: 97.29},
//         {courses_dept: 'epse', courses_avg: 97.29},
//         {courses_dept: 'nurs', courses_avg: 97.33},
//         {courses_dept: 'nurs', courses_avg: 97.33},
//         {courses_dept: 'epse', courses_avg: 97.41},
//         {courses_dept: 'epse', courses_avg: 97.41},
//         {courses_dept: 'cnps', courses_avg: 97.47},
//         {courses_dept: 'cnps', courses_avg: 97.47},
//         {courses_dept: 'math', courses_avg: 97.48},
//         {courses_dept: 'math', courses_avg: 97.48},
//         {courses_dept: 'educ', courses_avg: 97.5},
//         {courses_dept: 'nurs', courses_avg: 97.53},
//         {courses_dept: 'nurs',courses_avg: 97.53},
//         {courses_dept: 'epse', courses_avg: 97.67}, {courses_dept: 'epse',
//             courses_avg: 97.69
//         }, {courses_dept: 'epse', courses_avg: 97.78}, {courses_dept: 'crwr', courses_avg: 98}, {
//             courses_dept: 'crwr',
//             courses_avg: 98
//         }, {courses_dept: 'epse', courses_avg: 98.08}, {
//             courses_dept: 'nurs',
//             courses_avg: 98.21
//         }, {courses_dept: 'nurs', courses_avg: 98.21}, {
//             courses_dept: 'epse',
//             courses_avg: 98.36
//         }, {courses_dept: 'epse', courses_avg: 98.45}, {
//             courses_dept: 'epse',
//             courses_avg: 98.45
//         }, {courses_dept: 'nurs', courses_avg: 98.5}, {courses_dept: 'nurs', courses_avg: 98.5}, {
//             courses_dept: 'epse',
//             courses_avg: 98.58
//         }, {courses_dept: 'nurs', courses_avg: 98.58}, {
//             courses_dept: 'nurs',
//             courses_avg: 98.58
//         }, {courses_dept: 'epse', courses_avg: 98.58}, {courses_dept: 'epse', courses_avg: 98.7}, {
//             courses_dept: 'nurs',
//             courses_avg: 98.71
//         }, {courses_dept: 'nurs', courses_avg: 98.71}, {
//             courses_dept: 'eece',
//             courses_avg: 98.75
//         }, {courses_dept: 'eece', courses_avg: 98.75}, {
//             courses_dept: 'epse',
//             courses_avg: 98.76
//         }, {courses_dept: 'epse', courses_avg: 98.76}, {courses_dept: 'epse', courses_avg: 98.8}, {
//             courses_dept: 'spph',
//             courses_avg: 98.98
//         }, {courses_dept: 'spph', courses_avg: 98.98}, {
//             courses_dept: 'cnps',
//             courses_avg: 99.19
//         }, {courses_dept: 'math', courses_avg: 99.78}, {courses_dept: 'math', courses_avg: 99.78}]
// }
//
//
// describe("InsightRoomsTestSpec", function () {
//
//     var insightFacade: InsightFacade = null;
//     beforeEach(function () {
//         insightFacade = new InsightFacade();
//     });
//
//     afterEach(function () {
//         insightFacade = null;
//     });
//
//     var fs = require('fs');
//
//     function sanityCheck(response: InsightResponse) {
//         expect(response).to.have.property('code');
//         expect(response).to.have.property('body');
//         expect(response.code).to.be.a('number');
//     }
//
//     before(function () {
//         Log.test('Before: ' + (<any>this).test.parent.title);
//     });
//
//     beforeEach(function () {
//         Log.test('BeforeTest: ' + (<any>this).currentTest.title);
//     });
//
//     after(function () {
//         Log.test('After: ' + (<any>this).test.parent.title);
//     });
//
//     afterEach(function () {
//         Log.test('AfterTest: ' + (<any>this).currentTest.title);
//     });
//
//     it ("DEL description", function () {
//         return chai.request("http://localhost:4321")
//             .del('/dataset/rooms')
//             .then(function (res: any) {
//                 Log.trace('then:');
//                 expect(res.status).to.be.equal(204);
//             })
//             .catch(function (err: any) {
//                 console.log(err);
//                 Log.trace('catch:');
//                 // some assertions
//                 expect.fail();
//             });
//     });
//
//     it ("PUT description - 204", function () {
//         this.timeout(10000);
//         return chai.request("http://localhost:4321")
//             .put('/dataset/rooms')
//             .attach("body", fs.readFileSync('./rooms.zip'), "rooms.zip")
//             .then(function (res: any) {
//                 Log.trace('then:');
//                 expect(res.status).to.be.equal(204);
//             })
//             .catch(function (err: any) {
//                 console.log(err);
//                 Log.trace('catch:');
//                 // some assertions
//                 expect.fail();
//             });
//     });
//
//     it ("PUT description - 201", function () {
//         this.timeout(10000);
//         return chai.request("http://localhost:4321")
//             .put('/dataset/rooms')
//             .attach("body", fs.readFileSync('./rooms.zip'), "rooms.zip")
//             .then(function (res: any) {
//                 Log.trace('then:');
//                 expect(res.status).to.be.equal(201);
//             })
//             .catch(function (err: any) {
//                 console.log(err);
//                 Log.trace('catch:');
//                 // some assertions
//                 expect.fail();
//             });
//     });
//
//     // it ("POST description", function () {
//     //     var query = {
//     //         "WHERE": {
//     //             "GT": {
//     //                 "courses_avg": 97
//     //             }
//     //         }
//     //         ,
//     //         "OPTIONS": {
//     //             "COLUMNS": ["courses_dept", "courses_avg"],
//     //             "ORDER": "courses_avg",
//     //             "FORM": "TABLE"
//     //         }
//     //     };
//     //     return chai.request("http://localhost:4321")
//     //         .post('/query')
//     //         .send(query)
//     //         .then(function (res: any) {
//     //             Log.trace('then:');
//     //             //console.log(res.body);
//     //             expect(res.status).to.be.equal(200);
//     //             expect(res.body).to.deep.equal({
//     //                 render: 'TABLE',
//     //                 result: [{courses_dept: 'epse', courses_avg: 97.09},
//     //                     {courses_dept: 'math', courses_avg: 97.09},
//     //                     {courses_dept: 'math', courses_avg: 97.09},
//     //                     {courses_dept: 'epse', courses_avg: 97.09},
//     //                     {courses_dept: 'math', courses_avg: 97.25},
//     //                     {courses_dept: 'math', courses_avg: 97.25},
//     //                     {courses_dept: 'epse', courses_avg: 97.29},
//     //                     {courses_dept: 'epse', courses_avg: 97.29},
//     //                     {courses_dept: 'nurs', courses_avg: 97.33},
//     //                     {courses_dept: 'nurs', courses_avg: 97.33},
//     //                     {courses_dept: 'epse', courses_avg: 97.41},
//     //                     {courses_dept: 'epse', courses_avg: 97.41},
//     //                     {courses_dept: 'cnps', courses_avg: 97.47},
//     //                     {courses_dept: 'cnps', courses_avg: 97.47},
//     //                     {courses_dept: 'math', courses_avg: 97.48},
//     //                     {courses_dept: 'math', courses_avg: 97.48},
//     //                     {courses_dept: 'educ', courses_avg: 97.5},
//     //                     {courses_dept: 'nurs', courses_avg: 97.53},
//     //                     {courses_dept: 'nurs', courses_avg: 97.53},
//     //                     {courses_dept: 'epse', courses_avg: 97.67},
//     //                     {courses_dept: 'epse', courses_avg: 97.69},
//     //                     {courses_dept: 'epse', courses_avg: 97.78},
//     //                     {courses_dept: 'crwr', courses_avg: 98},
//     //                     {courses_dept: 'crwr', courses_avg: 98},
//     //                     {courses_dept: 'epse', courses_avg: 98.08},
//     //                     {courses_dept: 'nurs', courses_avg: 98.21},
//     //                     {courses_dept: 'nurs', courses_avg: 98.21},
//     //                     {courses_dept: 'epse', courses_avg: 98.36},
//     //                     {courses_dept: 'epse', courses_avg: 98.45},
//     //                     {courses_dept: 'epse', courses_avg: 98.45},
//     //                     {courses_dept: 'nurs', courses_avg: 98.5},
//     //                     {courses_dept: 'nurs', courses_avg: 98.5},
//     //                     {courses_dept: 'epse', courses_avg: 98.58},
//     //                     {courses_dept: 'nurs', courses_avg: 98.58},
//     //                     {courses_dept: 'nurs', courses_avg: 98.58},
//     //                     {courses_dept: 'epse', courses_avg: 98.58},
//     //                     {courses_dept: 'epse', courses_avg: 98.7},
//     //                     {courses_dept: 'nurs', courses_avg: 98.71},
//     //                     {courses_dept: 'nurs', courses_avg: 98.71},
//     //                     {courses_dept: 'eece', courses_avg: 98.75},
//     //                     {courses_dept: 'eece', courses_avg: 98.75},
//     //                     {courses_dept: 'epse', courses_avg: 98.76},
//     //                     {courses_dept: 'epse', courses_avg: 98.76},
//     //                     {courses_dept: 'epse', courses_avg: 98.8},
//     //                     {courses_dept: 'spph', courses_avg: 98.98},
//     //                     {courses_dept: 'spph', courses_avg: 98.98},
//     //                     {courses_dept: 'cnps', courses_avg: 99.19},
//     //                     {courses_dept: 'math', courses_avg: 99.78},
//     //                     {courses_dept: 'math', courses_avg: 99.78}]
//     //             });
//     //         })
//     //         .catch(function (err: any) {
//     //             Log.trace('catch:');
//     //             // some assertions
//     //             expect.fail();
//     //         });
//     // });
//
//     //
//     // it ("POST description", function () {
//     //     var query = {
//     //         "WHERE": {
//     //             "IS": {
//     //                 "courses_title": "path for pt 2"
//     //             }
//     //         },
//     //         "OPTIONS": {
//     //             "COLUMNS": ["courses_dept", "courses_id", "courses_title"],
//     //             "FORM": "TABLE"
//     //         }
//     //     };
//     //     return chai.request("http://localhost:4321")
//     //         .post('/query')
//     //         .send(query)
//     //         .then(function (res: any) {
//     //             Log.trace('then:');
//     //             console.log(res.body);
//     //             expect(res.status).to.be.equal(200);
//     //             expect(res.body).to.be.equal({
//     //                 render: 'TABLE',
//     //                 result: [{
//     //                     courses_dept: 'phth',
//     //                     courses_id: '521',
//     //                     courses_title: 'path for pt 2'
//     //                 },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     },
//     //                     {
//     //                         courses_dept: 'phth',
//     //                         courses_id: '521',
//     //                         courses_title: 'path for pt 2'
//     //                     }]
//     //             });
//     //         })
//     //         .catch(function (err: any) {
//     //             Log.trace('catch:');
//     //             // some assertions
//     //             expect.fail();
//     //         });
//     // });
//
//
// });