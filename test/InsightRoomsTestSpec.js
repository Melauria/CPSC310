"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
describe("InsightRoomsTestSpec", function () {
    var fs = require('fs');
    var file;
    var content;
    var insightFacade = null;
    beforeEach(function () {
        insightFacade = new InsightFacade_1.default();
    });
    afterEach(function () {
        insightFacade = null;
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
    });
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    before(function () {
        Util_1.default.test('Before: ' + this.test.parent.title);
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    it("Query 1", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
            chai_1.expect(query.body).to.deep.equal({
                "render": "TABLE",
                "result": [{
                        "rooms_name": "DMP_101"
                    }, {
                        "rooms_name": "DMP_110"
                    }, {
                        "rooms_name": "DMP_201"
                    }, {
                        "rooms_name": "DMP_301"
                    }, {
                        "rooms_name": "DMP_310"
                    }]
            });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("Room LT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "LT": {
                    "rooms_seats": 10
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_seats"
                ],
                "ORDER": "rooms_seats",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("Room NOT GT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "GT": {
                        "rooms_seats": 10
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_seats"
                ],
                "ORDER": "rooms_seats",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("Room GT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "rooms_lat": 49.2699
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_lat"
                ],
                "ORDER": "rooms_lat",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("Room EQ", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "EQ": {
                    "rooms_lon": -123.24673
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_lat", "rooms_lon"
                ],
                "ORDER": "rooms_lat",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("test1", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
            chai_1.expect(query.body).to.deep.equal({
                "render": "TABLE",
                "result": [{
                        "rooms_shortname": "OSBO",
                        "maxSeats": 442
                    }, {
                        "rooms_shortname": "HEBB",
                        "maxSeats": 375
                    }, {
                        "rooms_shortname": "LSC",
                        "maxSeats": 350
                    }]
            });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("test2", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": []
            }
        })
            .then(function (query) {
            chai_1.expect(query.code).to.equal(200);
            chai_1.expect(query.body).to.deep.equal({
                "render": "TABLE",
                "result": [{
                        "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Fixed Tablets"
                    }, {
                        "rooms_furniture": "Classroom-Hybrid Furniture"
                    }, {
                        "rooms_furniture": "Classroom-Learn Lab"
                    }, {
                        "rooms_furniture": "Classroom-Movable Tables & Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Movable Tablets"
                    }, {
                        "rooms_furniture": "Classroom-Moveable Tables & Chairs"
                    }, {
                        "rooms_furniture": "Classroom-Moveable Tablets"
                    }]
            });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("test3", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type", "totalSeats"
                ],
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": [{
                        "totalSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
            }
        }).then(function (query) {
            console.log(query.body);
            chai_1.expect(query.code).to.equal(200);
            chai_1.expect(query.body).to.deep.equal({
                render: 'TABLE',
                result: [{ "rooms_type": 'Tiered Large Group', "totalSeats": 12306 },
                    { "rooms_type": 'Case Style', "totalSeats": 1525 },
                    { "rooms_type": 'Open Design General Purpose', "totalSeats": 4475 },
                    { "rooms_type": 'Small Group', "totalSeats": 3752 },
                    { "rooms_type": 'TBD', "totalSeats": 929 },
                    { "rooms_type": '', "totalSeats": 60 },
                    { "rooms_type": 'Active Learning', "totalSeats": 272 },
                    { "rooms_type": 'Studio Lab', "totalSeats": 150 }]
            });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it.only("ORDER!!!", function () {
        return insightFacade.performQuery({
            "WHERE": { "GT": { "rooms_seats": 200 } },
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "rooms_seats"],
                "ORDER": { "dir": "UP", "keys": ["rooms_seats"] },
                "FORM": "TABLE"
            }
        })
            .then(function (query) {
            console.log(query.body);
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("empty APPLY", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type"
                ],
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_type"],
                "APPLY": []
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("all room types", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type"
                ],
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("MIN", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "OR": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "minSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["minSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }]
            }
        })
            .then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("all rooms data", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_number",
                    "rooms_name"
                ],
                "FORM": "TABLE"
            }
        })
            .then(function (query) {
            console.log(query.body);
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("sort in multiple keys", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "GT": {
                    "rooms_seats": 300
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["maxSeats", "rooms_shortname"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        })
            .then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("COUNT", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "COUNT": "rooms_seats"
                        }
                    }]
            }
        })
            .then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("SUM", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
            }
        })
            .then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("AVG", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "AVG": "rooms_seats"
                        }
                    }]
            }
        })
            .then(function (query) {
            chai_1.expect(query.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("APPLY has _", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "rooms_furniture": "*Tables*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "min_Seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["min_Seats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "min_Seats": {
                            "MIN": "rooms_seats"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.property('error');
            chai_1.expect(err.body).to.deep.equal({ error: "Error: the transformations failed because apply key contains '_' " });
        });
    });
    it("MAX not number", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "MAX": "rooms_furniture"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.property('error');
            chai_1.expect(err.body).to.deep.equal({ error: "MAX filed is not number" });
        });
    });
    it("MIN not number", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "MIN": "rooms_furniture"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.property('error');
            chai_1.expect(err.body).to.deep.equal({ error: "MIN filed is not number" });
        });
    });
    it("SUM not number", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "SUM": "rooms_furniture"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.property('error');
            chai_1.expect(err.body).to.deep.equal({ error: "SUM filed is not number" });
        });
    });
    it("AVG not number", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture", "numSeats"
                ],
                "ORDER": "rooms_furniture",
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [{
                        "numSeats": {
                            "AVG": "rooms_furniture"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.property('error');
            chai_1.expect(err.body).to.deep.equal({ error: "AVG filed is not number" });
        });
    });
    it("424 - one in IS", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "IS": {
                    "r_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.property('missing');
            chai_1.expect(err.body).to.deep.equal({ missing: ['r'] });
        });
    });
    it("424 - one in NOT", function () {
        return insightFacade.performQuery({
            "WHERE": {
                "NOT": {
                    "GT": {
                        "room_seats": 10
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_seats"
                ],
                "ORDER": "rooms_seats",
                "FORM": "TABLE"
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.property('missing');
            chai_1.expect(err.body).to.deep.equal({ missing: ['room'] });
        });
    });
    it("empty GROUP", function () {
        return insightFacade.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_type", "totalSeats"
                ],
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [],
                "APPLY": [{
                        "totalSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
            }
        }).then(function (query) {
            chai_1.expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.property('error');
            chai_1.expect(err.body).to.deep.equal({ error: "Group cannot be empty" });
        });
    });
});
//# sourceMappingURL=InsightRoomsTestSpec.js.map