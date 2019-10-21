/**
 * Created by chenyumeng on 17/2/6.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("InsightFacedeTestSpec", function () {

    var insightFacade: InsightFacade = null;

    var fs = require('fs');
    var file, file1, file2, file3;
    var content: any, norealdata: any, xyz: any, rooms: any;

    before(function () {
        Log.info('InsightController::before() - start');


        file = fs.readFileSync('./courses.zip');
        file1 = fs.readFileSync('./norealdata.zip');
        file2 = fs.readFileSync('./xyz.zip');
        file3 = fs.readFileSync('./rooms.zip');

        content = new Buffer(file).toString('base64');
        norealdata = new Buffer(file1).toString('base64');
        xyz = new Buffer(file2).toString('base64');
        rooms = new Buffer(file3).toString('base64');

        Log.info('InsightController::before() - done');
    });


    beforeEach(function () {
        insightFacade = new InsightFacade();
    });

    afterEach(function () {
        insightFacade = null;
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);

        //fs.unlinkSync("./datasets/courses.json");
    });

    // var fs = require('fs');
    //
    // var file = fs.readFileSync('./courses.zip');
    // var file1 = fs.readFileSync('./norealdata.zip');
    // var file2 = fs.readFileSync('./xyz.zip');
    //
    // var content = new Buffer(file).toString('base64');
    // var norealdata = new Buffer(file1).toString('base64');
    // var xyz = new Buffer(file2).toString('base64');

    let invalidQuery = {
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg",
            "FORM": "TABLE"
        }
    }

    let query1: QueryRequest = {
        "WHERE": {
            "GT": {
                "courses_avg": 97
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg",
            "FORM": "TABLE"
        }
    }

    let query2: QueryRequest = {
        "WHERE": {
            "OR": [
                {
                    "AND": [
                        {
                            "GT": {
                                "courses_avg": 90
                            }
                        },
                        {
                            "IS": {
                                "courses_dept": "adhe"
                            }
                        }
                    ]
                },
                {
                    "EQ": {
                        "courses_avg": 95
                    }
                }
            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            "ORDER": "courses_avg",
            "FORM": "TABLE"
        }
    }

    let result1 = {
        render: 'TABLE',
        result: [{courses_dept: 'epse', courses_avg: 97.09}, {
            courses_dept: 'math',
            courses_avg: 97.09
        }, {courses_dept: 'math', courses_avg: 97.09}, {
            courses_dept: 'epse',
            courses_avg: 97.09
        }, {courses_dept: 'math', courses_avg: 97.25}, {
            courses_dept: 'math',
            courses_avg: 97.25
        }, {courses_dept: 'epse', courses_avg: 97.29}, {
            courses_dept: 'epse',
            courses_avg: 97.29
        }, {courses_dept: 'nurs', courses_avg: 97.33}, {
            courses_dept: 'nurs',
            courses_avg: 97.33
        }, {courses_dept: 'epse', courses_avg: 97.41}, {
            courses_dept: 'epse',
            courses_avg: 97.41
        }, {courses_dept: 'cnps', courses_avg: 97.47}, {
            courses_dept: 'cnps',
            courses_avg: 97.47
        }, {courses_dept: 'math', courses_avg: 97.48}, {
            courses_dept: 'math',
            courses_avg: 97.48
        }, {courses_dept: 'educ', courses_avg: 97.5}, {courses_dept: 'nurs', courses_avg: 97.53}, {
            courses_dept: 'nurs',
            courses_avg: 97.53
        }, {courses_dept: 'epse', courses_avg: 97.67}, {
            courses_dept: 'epse',
            courses_avg: 97.69
        }, {courses_dept: 'epse', courses_avg: 97.78}, {courses_dept: 'crwr', courses_avg: 98}, {
            courses_dept: 'crwr',
            courses_avg: 98
        }, {courses_dept: 'epse', courses_avg: 98.08}, {
            courses_dept: 'nurs',
            courses_avg: 98.21
        }, {courses_dept: 'nurs', courses_avg: 98.21}, {
            courses_dept: 'epse',
            courses_avg: 98.36
        }, {courses_dept: 'epse', courses_avg: 98.45}, {
            courses_dept: 'epse',
            courses_avg: 98.45
        }, {courses_dept: 'nurs', courses_avg: 98.5}, {courses_dept: 'nurs', courses_avg: 98.5}, {
            courses_dept: 'epse',
            courses_avg: 98.58
        }, {courses_dept: 'nurs', courses_avg: 98.58}, {
            courses_dept: 'nurs',
            courses_avg: 98.58
        }, {courses_dept: 'epse', courses_avg: 98.58}, {courses_dept: 'epse', courses_avg: 98.7}, {
            courses_dept: 'nurs',
            courses_avg: 98.71
        }, {courses_dept: 'nurs', courses_avg: 98.71}, {
            courses_dept: 'eece',
            courses_avg: 98.75
        }, {courses_dept: 'eece', courses_avg: 98.75}, {
            courses_dept: 'epse',
            courses_avg: 98.76
        }, {courses_dept: 'epse', courses_avg: 98.76}, {courses_dept: 'epse', courses_avg: 98.8}, {
            courses_dept: 'spph',
            courses_avg: 98.98
        }, {courses_dept: 'spph', courses_avg: 98.98}, {
            courses_dept: 'cnps',
            courses_avg: 99.19
        }, {courses_dept: 'math', courses_avg: 99.78}, {courses_dept: 'math', courses_avg: 99.78}]
    }

    let result2 = {
        render: 'TABLE',
        result: [{courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02}, {
            courses_dept: 'adhe',
            courses_id: '412',
            courses_avg: 90.16
        }, {courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17}, {
            courses_dept: 'adhe',
            courses_id: '412',
            courses_avg: 90.18
        }, {courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5}, {
            courses_dept: 'adhe',
            courses_id: '330',
            courses_avg: 90.72
        }, {courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82}, {
            courses_dept: 'adhe',
            courses_id: '330',
            courses_avg: 90.85
        }, {courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29}, {
            courses_dept: 'adhe',
            courses_id: '330',
            courses_avg: 91.33
        }, {courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33}, {
            courses_dept: 'adhe',
            courses_id: '330',
            courses_avg: 91.48
        }, {courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54}, {
            courses_dept: 'adhe',
            courses_id: '329',
            courses_avg: 93.33
        }, {courses_dept: 'rhsc', courses_id: '501', courses_avg: 95}, {
            courses_dept: 'bmeg',
            courses_id: '597',
            courses_avg: 95
        }, {courses_dept: 'bmeg', courses_id: '597', courses_avg: 95}, {
            courses_dept: 'cnps',
            courses_id: '535',
            courses_avg: 95
        }, {courses_dept: 'cnps', courses_id: '535', courses_avg: 95}, {
            courses_dept: 'cpsc',
            courses_id: '589',
            courses_avg: 95
        }, {courses_dept: 'cpsc', courses_id: '589', courses_avg: 95}, {
            courses_dept: 'crwr',
            courses_id: '599',
            courses_avg: 95
        }, {courses_dept: 'crwr', courses_id: '599', courses_avg: 95}, {
            courses_dept: 'crwr',
            courses_id: '599',
            courses_avg: 95
        }, {courses_dept: 'crwr', courses_id: '599', courses_avg: 95}, {
            courses_dept: 'crwr',
            courses_id: '599',
            courses_avg: 95
        }, {courses_dept: 'crwr', courses_id: '599', courses_avg: 95}, {
            courses_dept: 'crwr',
            courses_id: '599',
            courses_avg: 95
        }, {courses_dept: 'sowk', courses_id: '570', courses_avg: 95}, {
            courses_dept: 'econ',
            courses_id: '516',
            courses_avg: 95
        }, {courses_dept: 'edcp', courses_id: '473', courses_avg: 95}, {
            courses_dept: 'edcp',
            courses_id: '473',
            courses_avg: 95
        }, {courses_dept: 'epse', courses_id: '606', courses_avg: 95}, {
            courses_dept: 'epse',
            courses_id: '682',
            courses_avg: 95
        }, {courses_dept: 'epse', courses_id: '682', courses_avg: 95}, {
            courses_dept: 'kin',
            courses_id: '499',
            courses_avg: 95
        }, {courses_dept: 'kin', courses_id: '500', courses_avg: 95}, {
            courses_dept: 'kin',
            courses_id: '500',
            courses_avg: 95
        }, {courses_dept: 'math', courses_id: '532', courses_avg: 95}, {
            courses_dept: 'math',
            courses_id: '532',
            courses_avg: 95
        }, {courses_dept: 'mtrl', courses_id: '564', courses_avg: 95}, {
            courses_dept: 'mtrl',
            courses_id: '564',
            courses_avg: 95
        }, {courses_dept: 'mtrl', courses_id: '599', courses_avg: 95}, {
            courses_dept: 'musc',
            courses_id: '553',
            courses_avg: 95
        }, {courses_dept: 'musc', courses_id: '553', courses_avg: 95}, {
            courses_dept: 'musc',
            courses_id: '553',
            courses_avg: 95
        }, {courses_dept: 'musc', courses_id: '553', courses_avg: 95}, {
            courses_dept: 'musc',
            courses_id: '553',
            courses_avg: 95
        }, {courses_dept: 'musc', courses_id: '553', courses_avg: 95}, {
            courses_dept: 'nurs',
            courses_id: '424',
            courses_avg: 95
        }, {courses_dept: 'nurs', courses_id: '424', courses_avg: 95}, {
            courses_dept: 'obst',
            courses_id: '549',
            courses_avg: 95
        }, {courses_dept: 'psyc', courses_id: '501', courses_avg: 95}, {
            courses_dept: 'psyc',
            courses_id: '501',
            courses_avg: 95
        }, {courses_dept: 'econ', courses_id: '516', courses_avg: 95}, {
            courses_dept: 'adhe',
            courses_id: '329',
            courses_avg: 96.11
        }]
    }

    // before(function () {
    //     Log.test('Before: ' + (<any>this).test.parent.title);
    // });
    //
    // beforeEach(function () {
    //     Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    // });
    //
    // after(function () {
    //     Log.test('After: ' + (<any>this).test.parent.title);
    // });
    //
    // afterEach(function () {
    //     Log.test('AfterTest: ' + (<any>this).currentTest.title);
    // });

    it("Add xyz", function () {
        this.timeout(10000);
        return insightFacade.addDataset('courses', xyz);
    })

    it("Add with no real data (400)", function () {
        return insightFacade.addDataset('courses', norealdata).then(function (val: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'zip does not contain any real data.'});
        })
    })

    it ("Remove", function () {
        return insightFacade.removeDataset('courses');
    })


    // it ("No dataset", function () {
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "LT": {
    //                 "courses_avg": 99.19,
    //                 "courses_id": 99.19
    //             }
    //         }
    //         ,
    //         "OPTIONS": {
    //             "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect.fail();
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect(err.code).to.equal(424);
    //         expect(err.body).to.have.property('missing');
    //         expect(err.body).to.deep.equal({missing: ['courses']});
    //     })
    // })

    it("Add courses", function () {
        this.timeout(10000);
        return insightFacade.addDataset('courses', content);
    })

    it ("Add rooms", function () {
        this.timeout(10000);
        return insightFacade.addDataset('rooms', rooms);
    })

    it("Add not exist (400)", function () {
        return insightFacade.addDataset('courses', './haha.zip').then(function (val: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'no such zip file exists.'});
        })
    })


    it("Remove with no file exists", function () {
        return insightFacade.removeDataset('yes').then(function (val: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(404);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'});
        })
    })

    it("Query 2 - complex", function () {
        this.timeout(10000);
        return insightFacade.performQuery(query2)
            .then(function (query: InsightResponse) {
                expect(query.code).to.equal(200);
                expect(query.body).to.deep.equal(result2);
            }).catch(function (err) {
                console.log(err.toString());
                Log.test('Error: ' + err.toString());
                expect.fail();
            })
    })

    it("Query 1 - simply", function () {
        return insightFacade.performQuery(query1)
            .then(function (query: InsightResponse) {
                expect(query.code).to.equal(200);
                expect(query.body).to.deep.equal(result1);
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
    })

    it("Query 2 - complex", function () {
        this.timeout(10000);
        return insightFacade.performQuery(query2).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal(result2);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Less than", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_avg": 40
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal({
                render: 'TABLE',
                result: [
                    {courses_id: '202', courses_avg: 0},
                    {courses_id: '100', courses_avg: 0},
                    {courses_id: '100', courses_avg: 0},
                    {courses_id: '475', courses_avg: 1},
                    {courses_id: '330', courses_avg: 4},
                    {courses_id: '330', courses_avg: 4},
                    {courses_id: '362', courses_avg: 4.5},
                    {courses_id: '403', courses_avg: 33},
                    {courses_id: '120', courses_avg: 33.2},
                    {courses_id: '102', courses_avg: 34},
                    {courses_id: '172', courses_avg: 39.03},
                    {courses_id: '172', courses_avg: 39.03}]
            });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Greater than", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal({
                render: 'TABLE',
                result: [{courses_dept: 'epse', courses_avg: 97.09},
                    {courses_dept: 'math', courses_avg: 97.09},
                    {courses_dept: 'math', courses_avg: 97.09},
                    {courses_dept: 'epse', courses_avg: 97.09},
                    {courses_dept: 'math', courses_avg: 97.25},
                    {courses_dept: 'math', courses_avg: 97.25},
                    {courses_dept: 'epse', courses_avg: 97.29},
                    {courses_dept: 'epse', courses_avg: 97.29},
                    {courses_dept: 'nurs', courses_avg: 97.33},
                    {courses_dept: 'nurs', courses_avg: 97.33},
                    {courses_dept: 'epse', courses_avg: 97.41},
                    {courses_dept: 'epse', courses_avg: 97.41},
                    {courses_dept: 'cnps', courses_avg: 97.47},
                    {courses_dept: 'cnps', courses_avg: 97.47},
                    {courses_dept: 'math', courses_avg: 97.48},
                    {courses_dept: 'math', courses_avg: 97.48},
                    {courses_dept: 'educ', courses_avg: 97.5},
                    {courses_dept: 'nurs', courses_avg: 97.53},
                    {courses_dept: 'nurs', courses_avg: 97.53},
                    {courses_dept: 'epse', courses_avg: 97.67},
                    {courses_dept: 'epse', courses_avg: 97.69},
                    {courses_dept: 'epse', courses_avg: 97.78},
                    {courses_dept: 'crwr', courses_avg: 98},
                    {courses_dept: 'crwr', courses_avg: 98},
                    {courses_dept: 'epse', courses_avg: 98.08},
                    {courses_dept: 'nurs', courses_avg: 98.21},
                    {courses_dept: 'nurs', courses_avg: 98.21},
                    {courses_dept: 'epse', courses_avg: 98.36},
                    {courses_dept: 'epse', courses_avg: 98.45},
                    {courses_dept: 'epse', courses_avg: 98.45},
                    {courses_dept: 'nurs', courses_avg: 98.5},
                    {courses_dept: 'nurs', courses_avg: 98.5},
                    {courses_dept: 'epse', courses_avg: 98.58},
                    {courses_dept: 'nurs', courses_avg: 98.58},
                    {courses_dept: 'nurs', courses_avg: 98.58},
                    {courses_dept: 'epse', courses_avg: 98.58},
                    {courses_dept: 'epse', courses_avg: 98.7},
                    {courses_dept: 'nurs', courses_avg: 98.71},
                    {courses_dept: 'nurs', courses_avg: 98.71},
                    {courses_dept: 'eece', courses_avg: 98.75},
                    {courses_dept: 'eece', courses_avg: 98.75},
                    {courses_dept: 'epse', courses_avg: 98.76},
                    {courses_dept: 'epse', courses_avg: 98.76},
                    {courses_dept: 'epse', courses_avg: 98.8},
                    {courses_dept: 'spph', courses_avg: 98.98},
                    {courses_dept: 'spph', courses_avg: 98.98},
                    {courses_dept: 'cnps', courses_avg: 99.19},
                    {courses_dept: 'math', courses_avg: 99.78},
                    {courses_dept: 'math', courses_avg: 99.78}]
            });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Fail greater than 100000", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_fail": 100000
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Equal", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 99.19
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal({
                render: 'TABLE',
                result: [{courses_dept: 'cnps', courses_id: '574', courses_avg: 99.19}]
            });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Course avg for a course", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_uuid": "11801"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg"
                ],
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal({render: 'TABLE', result: [{courses_avg: 82.93}]});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Order by dept", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 95
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Order by uuid", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 95
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid",
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Order by pass", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 95
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid",
                    "courses_pass",
                    "courses_avg"
                ],
                "ORDER": "courses_pass",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Find by different keys", function () {
        this.timeout(10000);
        return insightFacade.performQuery({
            "WHERE": {
                "OR": [
                    {"GT": {"courses_avg": 99}},
                    {"EQ": {"courses_audit": 0}},
                    {
                        "NOT": {
                            "GT": {"courses_fail": 1}
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_audit",
                    "courses_fail",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("sort multiple keys - uuid", function () {
        return insightFacade.performQuery({
                "WHERE": {
                    "GT": {
                        "courses_avg": 98
                    }
                },
                "OPTIONS": {
                    "COLUMNS": ["courses_uuid", "courses_title","courses_avg"],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["courses_uuid"]
                    },
                    "FORM": "TABLE"
                }
            }
        )
            .then(function (query: InsightResponse) {
                expect(query.code).to.equal(200);
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
    })

    // it("Complex AND, OR", function () {
    //     this.timeout(500000);
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "OR": [
    //                 {
    //                     "AND": [
    //                         {"GT": {"courses_avg": 98}},
    //                         {"IS": {"courses_dept": "adhe"}}
    //                     ]
    //                 },
    //                 {
    //                     "EQ": {"courses_avg": 99}
    //                 },
    //                 {
    //                     "AND": [
    //                         {"GT": {"courses_avg": 85}},
    //                         {"IS": {"courses_dept": "adhe"}}
    //                     ]
    //                 },
    //                 {
    //                     "OR": [
    //                         {
    //                             "AND": [
    //                                 {"GT": {"courses_avg": 97}},
    //                                 {"IS": {"courses_dept": "adhe"}}
    //                             ]
    //                         },
    //                         {"EQ": {"courses_avg": 98}},
    //                         {
    //                             "AND": [
    //                                 {"GT": {"courses_avg": 90}},
    //                                 {"IS": {"courses_dept": "cpsc"}}
    //                             ]
    //                         },
    //                         {
    //                             "AND": [
    //                                 {"GT": {"courses_avg": 99}},
    //                                 {"IS": {"courses_dept": "adhe"}}
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": [
    //                 "courses_id",
    //                 "courses_avg"],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect(query.code).to.equal(200);
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect.fail();
    //     })
    // })

    // it("Double NOT", function () {
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "NOT": {
    //                 "NOT": {
    //                     "GT": {
    //                         "courses_avg": 98
    //                     }
    //                 }
    //             }
    //         }
    //         ,
    //         "OPTIONS": {
    //             "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect(query.code).to.equal(200);
    //         expect(query.body).to.deep.equal({
    //             render: 'TABLE',
    //             result: [{courses_dept: 'epse', courses_id: '421', courses_avg: 98.08},
    //                 {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.21},
    //                 {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.21},
    //                 {courses_dept: 'epse', courses_id: '421', courses_avg: 98.36},
    //                 {courses_dept: 'epse', courses_id: '519', courses_avg: 98.45},
    //                 {courses_dept: 'epse', courses_id: '519', courses_avg: 98.45},
    //                 {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.5},
    //                 {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.5},
    //                 {courses_dept: 'epse', courses_id: '449', courses_avg: 98.58},
    //                 {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.58},
    //                 {courses_dept: 'epse', courses_id: '449', courses_avg: 98.58},
    //                 {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.58},
    //                 {courses_dept: 'epse', courses_id: '421', courses_avg: 98.7},
    //                 {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.71},
    //                 {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.71},
    //                 {courses_dept: 'eece', courses_id: '541', courses_avg: 98.75},
    //                 {courses_dept: 'eece', courses_id: '541', courses_avg: 98.75},
    //                 {courses_dept: 'epse', courses_id: '449', courses_avg: 98.76},
    //                 {courses_dept: 'epse', courses_id: '449', courses_avg: 98.76},
    //                 {courses_dept: 'epse', courses_id: '449', courses_avg: 98.8},
    //                 {courses_dept: 'spph', courses_id: '300', courses_avg: 98.98},
    //                 {courses_dept: 'spph', courses_id: '300', courses_avg: 98.98},
    //                 {courses_dept: 'cnps', courses_id: '574', courses_avg: 99.19},
    //                 {courses_dept: 'math', courses_id: '527', courses_avg: 99.78},
    //                 {courses_dept: 'math', courses_id: '527', courses_avg: 99.78}]
    //         });
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect.fail();
    //     })
    // })


    it("IS with starting *", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_title": "*xpl earth"
                }
            },
            "OPTIONS": {
                "COLUMNS": ["courses_id", "courses_title"],
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("IS with starting * 2", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_uuid": "*934"
                }
            },
            "OPTIONS": {
                "COLUMNS": ["courses_uuid", "courses_title"],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("IS with ending *", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_title": "observi*"
                }
            },
            "OPTIONS": {
                "COLUMNS": ["courses_uuid", "courses_title"],
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("IS with two *", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_instructor": "*nichol*"
                }
            },
            "OPTIONS": {
                "COLUMNS": ["courses_instructor", "courses_title"],
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("IS by title no *", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_title": "path for pt 2"
                }
            },
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_title"],
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal({
                render: 'TABLE',
                result: [{
                    courses_dept: 'phth',
                    courses_id: '521',
                    courses_title: 'path for pt 2'
                },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    },
                    {
                        courses_dept: 'phth',
                        courses_id: '521',
                        courses_title: 'path for pt 2'
                    }]
            });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("NOT LT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "LT": {
                        "courses_avg": 98
                    }
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
            expect(query.body).to.deep.equal({
                render: 'TABLE',
                result: [{courses_dept: 'crwr', courses_id: '599', courses_avg: 98},
                    {courses_dept: 'crwr', courses_id: '599', courses_avg: 98},
                    {courses_dept: 'epse', courses_id: '421', courses_avg: 98.08},
                    {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.21},
                    {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.21},
                    {courses_dept: 'epse', courses_id: '421', courses_avg: 98.36},
                    {courses_dept: 'epse', courses_id: '519', courses_avg: 98.45},
                    {courses_dept: 'epse', courses_id: '519', courses_avg: 98.45},
                    {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.5},
                    {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.5},
                    {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.58},
                    {courses_dept: 'nurs', courses_id: '578', courses_avg: 98.58},
                    {courses_dept: 'epse', courses_id: '449', courses_avg: 98.58},
                    {courses_dept: 'epse', courses_id: '449', courses_avg: 98.58},
                    {courses_dept: 'epse', courses_id: '421', courses_avg: 98.7},
                    {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.71},
                    {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.71},
                    {courses_dept: 'eece', courses_id: '541', courses_avg: 98.75},
                    {courses_dept: 'eece', courses_id: '541', courses_avg: 98.75},
                    {courses_dept: 'epse', courses_id: '449', courses_avg: 98.76},
                    {courses_dept: 'epse', courses_id: '449', courses_avg: 98.76},
                    {courses_dept: 'epse', courses_id: '449', courses_avg: 98.8},
                    {courses_dept: 'spph', courses_id: '300', courses_avg: 98.98},
                    {courses_dept: 'spph', courses_id: '300', courses_avg: 98.98},
                    {courses_dept: 'cnps', courses_id: '574', courses_avg: 99.19},
                    {courses_dept: 'math', courses_id: '527', courses_avg: 99.78},
                    {courses_dept: 'math', courses_id: '527', courses_avg: 99.78}]
            });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })


    // it("Triple NOT", function () {
    //     this.timeout(10000);
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "AND": [
    //                 {
    //                     "NOT": {
    //                         "NOT": {
    //                             "NOT": {
    //                                 "LT": {"courses_avg": 90}
    //                             }
    //                         }
    //                     }
    //                 },
    //                 {"IS": {"courses_dept": "adhe"}}
    //             ]
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
    //             "ORDER": "courses_id",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect(query.code).to.equal(200);
    //         //expect(query.body).to.deep.equal();
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect.fail();
    //     })
    // })

    // it("Non-integer number: NOT+GT ", function () {
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "NOT": {
    //                 "GT": {
    //                     "courses_avg": 5.5
    //                 }
    //             }
    //         }
    //         ,
    //         "OPTIONS": {
    //             "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect(query.code).to.equal(200);
    //         // expect(query.body).to.deep.equal({
    //         //     render: 'TABLE',
    //         //     result: [
    //         //         {courses_dept: 'epse', courses_id: '421', courses_avg: 98.7},
    //         //         {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.71},
    //         //         {courses_dept: 'nurs', courses_id: '509', courses_avg: 98.71},
    //         //         {courses_dept: 'eece', courses_id: '541', courses_avg: 98.75},
    //         //         {courses_dept: 'eece', courses_id: '541', courses_avg: 98.75},
    //         //         {courses_dept: 'epse', courses_id: '449', courses_avg: 98.76},
    //         //         {courses_dept: 'epse', courses_id: '449', courses_avg: 98.76},
    //         //         {courses_dept: 'epse', courses_id: '449', courses_avg: 98.8},
    //         //         {courses_dept: 'spph', courses_id: '300', courses_avg: 98.98},
    //         //         {courses_dept: 'spph', courses_id: '300', courses_avg: 98.98},
    //         //         {courses_dept: 'cnps', courses_id: '574', courses_avg: 99.19},
    //         //         {courses_dept: 'math', courses_id: '527', courses_avg: 99.78},
    //         //         {courses_dept: 'math', courses_id: '527', courses_avg: 99.78}]});
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect.fail();
    //     })
    // })

    it("Empty result", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [
                    {
                        "LT": {
                            "courses_avg": 85
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 85
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })


    // it("test", function () {
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "IS": {
    //                 "courses_dept": "cpsc"
    //             }
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": [
    //                 "courses_dept",
    //                 "courses_avg",
    //                 "courses_uuid"
    //             ],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         console.log(query.body);
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect.fail();
    //     })
    // })


    it("Audit equal to -200", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_audit": -200
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Avg greater than 100", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_avg": 101
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Avg less than 0", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_avg": -10
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Pass less than 0", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_pass": 0
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Avg equal to -5", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": -5
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })


    it("Order by courses_year", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_avg": 99
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_year",
                    "courses_uuid"
                ],
                "ORDER": "courses_year",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("Year = 2013 when avg = 98", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 98
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg",
                    "courses_year"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect(query.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })


    //==========================================================fails==================================================

    it("Invalid query", function () {
        return insightFacade.performQuery(invalidQuery).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'the query failed because it does not contain proper form of query.'});
        })
    })

    it("Empty AND", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": []
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'Error: AND is empty'});
        })
    })

    it("Empty OR", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "OR": []
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'Error: OR is empty'});
        })
    })

    it("Order not in columns", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_avg"],
                "ORDER": "courses_id",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'COLUMNS array does not contain the key in ORDER.'});
        })
    })

    it("Order not in columns - also missing", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [
                    {
                        "LT": {
                            "instructor_avg": 85
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 85
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "cour_instructor"
                ],
                "ORDER": "cou_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'COLUMNS array does not contain the key in ORDER.'});
        })
    })

    it("Missing FORM", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_avg": 75
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'invalid FORM — missing FORM or FORM is not TABLE.'});
        })
    })

    it("FORM is not TABLE", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 3
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid",
                    "courses_pass"
                ],
                "ORDER": "courses_avg",
                "FORM": "DATA"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'invalid FORM — missing FORM or FORM is not TABLE.'});
        })
    })

    it("EQ is not number", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_uuid": "42697"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_uuid",
                    "courses_pass"
                ],
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'Error: EQ input is not a number.'});
        })
    })

    it("GT is not number", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_dept": "cpsc"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'Error: GT input is not a number.'});
        })
    })

    it("LT is not number", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_instructor": "coops, nicholas charles"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: 'Error: LT input is not a number.'});
        })
    })

    it("424 - one in COLUMNS", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_avg": 90
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "student_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['student']});
        })
    })


    // it("424 - two in WHERE", function () {
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "AND": [
    //                 {
    //                     "LT": {
    //                         "instructor_avg": 85
    //                     }
    //                 },
    //                 {
    //                     "GT": {
    //                         "name_avg": 85
    //                     }
    //                 }
    //             ]
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": [
    //                 "courses_avg",
    //                 "courses_instructor"
    //             ],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect.fail();
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect(err.code).to.equal(424);
    //         expect(err.body).to.have.property('missing');
    //         expect(err.body).to.deep.equal({missing: ['instructor', 'name']});
    //     })
    // })

    it("424 - ont in WHERE, one in COLUMN", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [
                    {
                        "LT": {
                            "instructor_avg": 85
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 85
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "cour_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['cour', 'instructor']});
        })
    })

    it("424 - three in COLUMN", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "EQ": {
                        "student_avg": 98
                    }
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["school_dept", "ubc_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['school', 'ubc', 'student']});
        })
    })

    it("424 - one in GT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "GT": {
                        "student_avg": 98
                    }
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['student']});
        })
    })

    it("424 - one in LT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "students_avg": 90
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['students']});
        })
    })

    // it("424 - two in IS, EQ", function () {
    //     return insightFacade.performQuery({
    //         "WHERE": {
    //             "OR": [
    //                 {
    //                     "AND": [
    //                         {
    //                             "GT": {
    //                                 "courses_avg": 90
    //                             }
    //                         },
    //                         {
    //                             "IS": {
    //                                 "c_dept": "adhe"
    //                             }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "EQ": {
    //                         "hi_avg": 95
    //                     }
    //                 }
    //             ]
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": [
    //                 "courses_dept",
    //                 "courses_id",
    //                 "courses_avg"
    //             ],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     }).then(function (query: InsightResponse) {
    //         expect.fail();
    //     }).catch(function (err) {
    //         Log.test('Error: ' + err);
    //         expect(err.code).to.equal(424);
    //         expect(err.body).to.have.property('missing');
    //         expect(err.body).to.deep.equal({missing: ['c', 'hi']});
    //     })
    // })

    it("424 - two missing and one invalid key", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [
                    {
                        "LT": {
                            "instructor_avg": "60"
                        }
                    },
                    {
                        "GT": {
                            "courses_a": 85
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "cour_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['cour', 'instructor']});
        })
    })

    it("424 - two missing, one invalid key and one invalid LT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [
                    {
                        "LT": {
                            "instructor_avg": "85"
                        }
                    },
                    {
                        "GT": {
                            "courses_a": 85
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "cour_instructor"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.property('missing');
            expect(err.body).to.deep.equal({missing: ['cour', 'instructor']});
        })
    })

    it("Invalid key in EQ", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "EQ": {
                        "courses_abc": 98
                    }
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the key is not a valid key"});
        })
    })

    it("Invalid key in COLUMNS", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "EQ": {
                        "courses_avg": 98
                    }
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_iiiid", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the key is not a valid key"});
        })
    })

    it("Invalid key", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "EQ": {
                        "courses_abc": 98
                    }
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_depttt", "courses_iiid", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the key is not a valid key"});
        })
    })

    it("# Equal != 1", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "courses_avg": 99.19,
                    "courses_id": 99.19
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the number of object in EQ is not 1"});
        })
    })

    it("# GT != 1", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "courses_avg": 99.19,
                    "courses_id": 99.19
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the number of object in GT is not 1"});
        })
    })


    it("# LT != 1", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "courses_avg": 99.19,
                    "courses_id": 99.19
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the number of object in LT is not 1"});
        })
    })


    it("# IS != 1", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "courses_dept": "cpsc",
                    "courses_instructor": "*a*"
                }
            }
            ,
            "OPTIONS": {
                "COLUMNS": ["courses_dept", "courses_id", "courses_avg"],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }).then(function (query: InsightResponse) {
            expect.fail();
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.property('error');
            expect(err.body).to.deep.equal({error: "Error: the number of object in IS is not 1"});
        })
    })


});