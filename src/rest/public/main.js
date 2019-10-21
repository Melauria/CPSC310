/**
 * Created by melauria on 2017-03-28.
 */

var markers = [];

$("#manage_dataset").click(function (e) {
    e.preventDefault();

    $("#manage").show();
    $("#courses_nav").hide();
    $("#rooms_nav").hide();
    $("#scheduling_nav").hide();

})

$("#course_explorer").click(function (e) {
    e.preventDefault();

    $("#manage").hide();
    $("#courses_nav").show();
    $("#rooms_nav").hide();
    $("#scheduling_nav").hide();

})

$("#room_explorer").click(function (e) {
    e.preventDefault();

    $("#manage").hide();
    $("#courses_nav").hide();
    $("#rooms_nav").show();
    $("#scheduling_nav").hide();

})

$("#scheduling").click(function (e) {
    e.preventDefault();

    $("#manage").hide();
    $("#courses_nav").hide();
    $("#rooms_nav").hide();
    $("#scheduling_nav").show();

})


$("#AddDataset").click(function (e) {
    e.preventDefault();

    var fileToLoad = document.getElementById("fileUpload").files[0];
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileToLoad);
    fileReader.onload = function (evt) {
        var id = fileToLoad.name.split('.')[0];
        var content = evt.target.result;
        var formData = new FormData();
        formData.append('body', new Blob([content]));

        $.ajax({
            url: 'http://localhost:4321/dataset/' + id,
            type: 'put',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (data) {
            alert(fileToLoad.name + ' was successfully uploaded.');
        }).fail(function (data) {
            alert('ERROR - Failed to upload ' + fileToLoad.name + '.');
        });
    }
});

$("#RemoveDataset").click(function (e) {
    e.preventDefault();

    var id = $("input[name=remove]:checked").val();

    console.log(id);

    $.ajax({
        url: 'http://localhost:4321/dataset/' + id,
        type: 'delete'
    }).done(function (data) {
        alert(id + ' was successfully removed.');
    }).fail(function (data) {
        alert('ERROR - Failed to remove ' + id + '.');
    });
});

$("#btnSubmit").click(function (e) {
    e.preventDefault();

    var query = $("#txtQuery").val();

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: query,
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        generateTable(data.result, "manage");
    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });
});


$("#btnCourses").click(function (e) {
    e.preventDefault();

    $('.myCheckbox').click(function() {
        $(this).siblings('input:checkbox').prop('checked', false);
    });

    var sizeFilter = $("input:radio[name=filter]:checked").val();
    var sectionSize = $("#courses_sectionSize").val();
    var department = $("#courses_dept").val();
    var courseNum = $("#courses_id").val();
    var instructor = $("#courses_instructor").val();
    var title = $("#courses_title").val();
    var avgSort = $("input:radio[name=sort]:checked").val();
    var passFailSort = [];
    $(':checkbox:checked').each(function(i){
        passFailSort[i] = $(this).val();
    });
    var groupBy = $("input:radio[name=group]:checked").val();

    var query = {};
    var where = [];
    var options = {};
    var trans = {
        "GROUP": [],
        "APPLY": []
    }
    var dir;
    var keys = [];

    if (sectionSize != "" && sizeFilter != "") {
        if (sizeFilter === "gt") {
            where.push({"GT": {"courses_size": Number(sectionSize)}});
        } else if (sizeFilter === "lt") {
            where.push({"LT": {"courses_size": Number(sectionSize)}});
            console.log(where);
        } else if (sizeFilter === "eq") {
            where.push({"EQ": {"courses_size": Number(sectionSize)}});
        }
    }
    if (department != "") {
        where.push({"IS": {"courses_dept": department}});
    }
    if (courseNum != "") {
        where.push({"IS": {"courses_id": courseNum.toString()}});
    }
    if (instructor != "") {
        where.push({"IS": {"courses_instructor": instructor}});
    }
    if (title != "") {
        where.push({"IS": {"courses_title": title}});
    }

    if (where.length == 0) {
        query.WHERE = [];
    } else if (where.length >= 2) {
        query.WHERE = {
            "AND": where
        };
    } else {
        query.WHERE = where[0];
    }

    if (groupBy == "yes") {
        trans.GROUP = ["courses_dept", "courses_id"];
    }

    if (trans["GROUP"].length >= 1) {
        options = {
            "COLUMNS": [
                "courses_dept",
                "courses_id"
            ],
            "FORM": "TABLE"
        };
        query.TRANSFORMATIONS = trans;
    } else {
        options = {
            "COLUMNS": [
                "courses_dept",
                "courses_id",
                "courses_instructor",
                "courses_title",
                "courses_avg",
                "courses_size",
                "courses_pass",
                "courses_fail"
            ],
            "FORM": "TABLE"
        };
    }

    if (avgSort == "highAvg") {
        dir = "DOWN";
        keys.push("courses_avg");

        if (passFailSort.length != 0){
            dir = "DOWN";
            keys.push(passFailSort);
        }

        options.ORDER = {
            "dir": dir,
            "keys": keys
        }

    } else if (avgSort == "lowAvg") {
        dir = "UP";
        keys.push("courses_avg");

        options.ORDER = {
            "dir": dir,
            "keys": keys
        }
    } else if (passFailSort.length != 0){

        console.log("hi");
        dir = "DOWN";
        for (var i = 0; i < passFailSort.length; i++){
            keys.push(passFailSort[i]);
        }

        options.ORDER = {
            "dir": dir,
            "keys": keys
        }
    }

    query.OPTIONS = options;

    console.log(JSON.stringify(query));

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: JSON.stringify(query),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        console.log("Response", data);
        generateTable(data.result, "courses");
    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });
});


$("#btnRooms").click(function (e) {
    e.preventDefault();

    var shortName = $("#rooms_shortname").val();
    var roomNumber = $("#rooms_number").val();
    var roomSize = $("#rooms_seats").val();
    var roomType = $("#rooms_type").val();
    var furnitureType = $("#rooms_furniture").val();
    var distance = $("#rooms_location").val();

    if (distance == "") {
        var query = {};
        var where = [];
        var options = {
            "COLUMNS": [
                "rooms_shortname",
                "rooms_fullname",
                "rooms_number",
                "rooms_seats",
                "rooms_type",
                "rooms_furniture",
                "rooms_lat",
                "rooms_lon"
            ],
            "FORM": "TABLE"
        };

        if (shortName != "") {
            where.push({"IS": {"rooms_shortname": shortName}});
        }
        if (roomNumber != "") {
            where.push({"IS": {"rooms_number": roomNumber.toString()}});
        }
        if (roomSize != "") {
            where.push({"GT": {"rooms_seats": Number(roomSize)}});
        }
        if (roomType != "") {
            where.push({"IS": {"rooms_type": roomType}});
        }
        if (furnitureType != "") {
            where.push({"IS": {"rooms_furniture": furnitureType}});
        }

        if (where.length == 0) {
            query.WHERE = [];
        } else if (where.length >= 2) {
            query.WHERE = {
                "AND": where
            };
        } else {
            query.WHERE = where[0];
        }

        query.OPTIONS = options;

        $.ajax({
            url: 'http://localhost:4321/query',
            type: 'post',
            data: JSON.stringify(query),
            dataType: 'json',
            contentType: 'application/json'
        }).done(function (data) {
            console.log("Response", data);
            generateTable(data.result, "rooms");

            if (data.result.length != 0) {
                var largeInfowindow = new google.maps.InfoWindow();
                // var markers = [];

                for (var i = 0; i < data.result.length; i++){
                    var lat = data.result[i]["rooms_lat"];
                    var lon = data.result[i]["rooms_lon"];
                    var shortname = data.result[i]["rooms_shortname"];
                    var fullname = data.result[i]["rooms_fullname"];

                    var title = shortname + "<br>"
                        + fullname + "<br>"
                        + " lat: " + lat + "<br>"
                        + " lon: " + lon;

                    var position = {lat: lat, lng: lon};

                    var marker = new google.maps.Marker({
                        map: map,
                        position: position,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        id: i
                    });

                    markers.push(marker);

                    marker.addListener('click', function() {
                        populateInfoWindow(this, largeInfowindow);
                    });
                }
            }

        }).fail(function () {
            console.error("ERROR - Failed to submit query");
        });

    } else {
        if (shortName != "") {
            var query2 = {
                "WHERE": {
                    "IS": {
                        "rooms_shortname": shortName
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_lat",
                        "rooms_lon"
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname", "rooms_lat", "rooms_lon"],
                    "APPLY": []
                }
            };

            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(query2),
                dataType: 'json',
                contentType: 'application/json'
            }).done(function (data2) {

                if (data2.result.length != 0) {
                    var lat1 = data2.result[0]["rooms_lat"];
                    var lon1 = data2.result[0]["rooms_lon"];

                    var query = {};
                    var where = [];
                    var options = {
                        "COLUMNS": [
                            "rooms_shortname",
                            "rooms_fullname",
                            "rooms_number",
                            "rooms_seats",
                            "rooms_type",
                            "rooms_furniture",
                            "rooms_lat",
                            "rooms_lon"
                        ],
                        "FORM": "TABLE"
                    };

                    where.push({"IS": {"rooms_shortname": "**"}});

                    if (roomNumber != "") {
                        where.push({"IS": {"rooms_number": roomNumber.toString()}});
                    }
                    if (roomSize != "") {
                        where.push({"GT": {"rooms_seats": Number(roomSize)}});
                    }
                    if (roomType != "") {
                        where.push({"IS": {"rooms_type": roomType}});
                    }
                    if (furnitureType != "") {
                        where.push({"IS": {"rooms_furniture": furnitureType}});
                    }

                    if (where.length == 0) {
                        query.WHERE = [];
                    } else if (where.length >= 2) {
                        query.WHERE = {
                            "AND": where
                        };
                    } else {
                        query.WHERE = where[0];
                    }

                    query.OPTIONS = options;

                    $.ajax({
                        url: 'http://localhost:4321/query',
                        type: 'post',
                        data: JSON.stringify(query),
                        dataType: 'json',
                        contentType: 'application/json'
                    }).done(function (data3) {
                        var roomsArr = data3.result;
                        var roomsArrLength = roomsArr.length;
                        var roomsList = [];
                        for (var i = 0; i < roomsArrLength; i++) {
                            var currentRoom = roomsArr[i];
                            var lat2 = currentRoom["rooms_lat"];
                            var lon2 = currentRoom["rooms_lon"];
                            var d = calDistance(lat1, lon1, lat2, lon2);
                            if (d <= distance) {
                                roomsList.push(currentRoom);
                            }
                        }
                        console.log("roomsArr", roomsList);
                        generateTable(roomsList, "rooms");

                        if (roomsList.length != 0) {
                            var largeInfowindow = new google.maps.InfoWindow();
                            //var markers = [];

                            for (var i = 0; i < roomsList.length; i++){
                                var lat = roomsList[i]["rooms_lat"];
                                var lon = roomsList[i]["rooms_lon"];
                                var shortname = roomsList[i]["rooms_shortname"];
                                var fullname = roomsList[i]["rooms_fullname"];

                                var title = shortname + "<br>"
                                    + fullname + "<br>"
                                    + " lat: " + lat + "<br>"
                                    + " lon: " + lon;

                                var position = {lat: lat, lng: lon};

                                var marker = new google.maps.Marker({
                                    map: map,
                                    position: position,
                                    title: title,
                                    animation: google.maps.Animation.DROP,
                                    id: i
                                });

                                markers.push(marker);

                                marker.addListener('click', function() {
                                    populateInfoWindow(this, largeInfowindow);
                                });
                            }
                        }
                    }).fail(function () {
                        console.error("ERROR - Failed to submit query");
                    });

                }

            }).fail(function () {
                console.error("ERROR - Failed to submit query");
            });
        } else {
            alert("Error - the building name shoud not be empty");

        }
    }
});


$("#btnSchedule").click(function (e) {
    e.preventDefault();

    var department = $("#schedule_dept").val();
    var courseNum = $("#schedule_id").val();
    var bldName = $("#schedule_bldName").val();
    var distance = $("#schedule_distance").val();

    console.log(department);
    console.log(courseNum);
    console.log(bldName);
    console.log(distance);

    var query = {};
    var where = [{"EQ": {"courses_year": 2014}}];

    // if (department != "") {
    //     where.push({"IS": {"courses_dept": department}});
    // }
    // if (courseNum != "") {
    //     where.push({"IS": {"courses_id": courseNum}});
    // }
    if (department != "") {
        var deptArr = department.split(",");
        if (courseNum != "") {
            var sectionArr = courseNum.split(",");
            if (deptArr.length != sectionArr.length) {
                alert("the number of element in department is not equal to the number of elements in course number!");
            } else {
                var temp = [];
                for (var i = 0; i < deptArr.length; i++) {
                    temp.push({
                        "AND": [{"IS": {"courses_dept": deptArr[i]}},
                            {"IS": {"courses_id": sectionArr[i]}}]
                    })
                }
                if (temp.length >= 2) {
                    where.push({
                        "OR": temp
                    });
                } else {
                    where.push(temp[0]);
                }
            }
        } else {
            var temp = [];
            for (var i = 0; i < deptArr.length; i++) {
                temp.push({"IS": {"courses_dept": deptArr[i]}})
            }
            if (temp.length >= 2) {
                where.push({
                    "OR": temp
                });
            } else {
                where.push(temp[0]);
            }
        }
    } else {
        if (courseNum != "") {
            var sectionArr = courseNum.split(",");
            var temp = [];
            for (var i = 0; i < sectionArr.length; i++) {
                temp.push({"IS": {"courses_id": sectionArr[i]}})
            }
            if (temp.length >= 2) {
                where.push({
                    "OR": temp
                });
            } else {
                where.push(temp[0]);
            }
        }
    }


    if (where.length >= 2) {
        query.WHERE = {
            "AND": where
        };
    } else {
        query.WHERE = where[0];
    }

    query.OPTIONS = {
        "COLUMNS": [
            "courses_size",
            "courses_dept",
            "courses_id"
        ],
        "FORM": "TABLE"
    }

    console.log(query);

    $.ajax({
        url: 'http://localhost:4321/query',
        type: 'post',
        data: JSON.stringify(query),
        dataType: 'json',
        contentType: 'application/json'
    }).done(function (data) {
        //console.log("Response", data);
        var coursesArr = data.result;

        var coursesList = [];
        var checkList = [];
        var coursesArrLength = coursesArr.length;


        for (var i = 0; i < coursesArrLength; i++) {
            var currentObj = coursesArr[i];
            var currentCourseDept = currentObj["courses_dept"];
            var currentCourseNumber = currentObj["courses_id"];
            var currentCourseSectionSize = currentObj["courses_size"];
            //console.log(currentCourseSectionSize);
            var checkId = currentCourseDept + currentCourseNumber;
            var index = checkList.indexOf(checkId);

            if (index === -1) {
                checkList.push(checkId);
                var newObj = {
                    "courses_sectionSize": currentCourseSectionSize,
                    "courses_dept": currentCourseDept,
                    "courses_id": currentCourseNumber,
                    "courses_sectionNumber": 1
                }
                coursesList.push(newObj);
            } else {
                ObjInList = coursesList[index];
                coursesList[index]["courses_sectionNumber"] = ObjInList["courses_sectionNumber"] + 1;
                if (currentCourseSectionSize > ObjInList["courses_sectionSize"]) {
                    coursesList[index]["courses_sectionSize"] = currentCourseSectionSize;
                }
            }
        }
        //在这里我们得到了coursesList 是符合条件的course array： sectionNumber：是有多少个section（还没有除以3）
        // sectionSize：是最大的section有多少人
        //console.log("test", coursesList);
        //generateTable(data.result, "scheduling");

        // 下面要拿到building的lat lon


        if (distance == "") {
            var where1 = {};
            if (bldName != "") {
                var bldNameArr = bldName.split(",");
                var temp = [];
                for (var i = 0; i < bldNameArr.length; i++) {
                    temp.push({"IS": {"rooms_shortname": bldNameArr[i]}})
                }
                if (temp.length >= 2) {
                    where1 = {"OR": temp};
                } else {
                    where1 = temp[0];
                }
            }
            query3 = {
                "WHERE": where1,
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_number",
                        "rooms_seats"
                    ],
                    "FORM": "TABLE"
                }
            };
            $.ajax({
                url: 'http://localhost:4321/query',
                type: 'post',
                data: JSON.stringify(query3),
                dataType: 'json',
                contentType: 'application/json'
            }).done(function (data3) {
                var result = performScheduling(coursesList, data3.result);
                var resultArr = result["resultArr"];
                var countOfUnsheduledSection = result["countOfUnsheduledSection"];
                var totalNumOfSection = result ["totalNumOfSection"];
                var quality = countOfUnsheduledSection / totalNumOfSection;

                document.getElementById("quality").innerHTML = quality;

                //console.log("test1", resultArr);
                console.log(quality);
                console.log(countOfUnsheduledSection);
                console.log(totalNumOfSection);
                generateTable(resultArr, "scheduling");
            }).fail(function () {
                console.error("ERROR - Failed to submit query");
            });
        } else {
            if (bldName == "") {
                alert("the building name here could not be empty");
            }
            else if (bldName.indexOf(",") != -1) {
                alert("the number of building name shoud be exactly one");
            } else {
                var query2 = {
                    "WHERE": {"IS": {"rooms_shortname": bldName}},
                    "OPTIONS": {
                        "COLUMNS": [
                            "rooms_lat",
                            "rooms_lon"
                        ],
                        "FORM": "TABLE"
                    },
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname", "rooms_lat", "rooms_lon"],
                        "APPLY": []
                    }
                };

                $.ajax({
                    url: 'http://localhost:4321/query',
                    type: 'post',
                    data: JSON.stringify(query2),
                    dataType: 'json',
                    contentType: 'application/json'
                }).done(function (data2) {
                    //console.log(data2.result);
                    if (data2.result.length != 0) {
                        var lat1 = data2.result[0]["rooms_lat"];
                        var lon1 = data2.result[0]["rooms_lon"];
                        //得到lat lon 之后 现在要把roomsList roomsList 里面应该存所有符合条件的room
                        var query3 = {
                            "WHERE": {
                                "IS": {
                                    "rooms_shortname": "**"
                                }
                            },
                            "OPTIONS": {
                                "COLUMNS": [
                                    "rooms_shortname",
                                    "rooms_number",
                                    "rooms_seats",
                                    "rooms_lat",
                                    "rooms_lon"
                                ],
                                "FORM": "TABLE"
                            }
                        }

                        $.ajax({
                            url: 'http://localhost:4321/query',
                            type: 'post',
                            data: JSON.stringify(query3),
                            dataType: 'json',
                            contentType: 'application/json'
                        }).done(function (data3) {
                            var roomsArr = data3.result;
                            var roomsArrLength = roomsArr.length;
                            var roomsList = [];
                            for (var i = 0; i < roomsArrLength; i++) {
                                var currentRoom = roomsArr[i];
                                var lat2 = currentRoom["rooms_lat"];
                                var lon2 = currentRoom["rooms_lon"];
                                var d = calDistance(lat1, lon1, lat2, lon2);
                                if (d <= distance) {
                                    roomsList.push(currentRoom);
                                }
                            }
                            console.log("roomsArr", roomsList);
                            var result = performScheduling(coursesList, roomsList);
                            var resultArr = result["resultArr"];
                            var countOfUnsheduledSection = result["countOfUnsheduledSection"];
                            var totalNumOfSection = result ["totalNumOfSection"];
                            var quality = countOfUnsheduledSection / totalNumOfSection;
                            console.log(countOfUnsheduledSection);
                            console.log(totalNumOfSection);
                            console.log(quality);
                            document.getElementById("quality").innerHTML = quality;
                            //console.log("test1", resultArr);
                            //console.log("test1", resultArr);
                            generateTable(resultArr, "scheduling");
                        }).fail(function () {
                            console.error("ERROR - Failed to submit query");
                        });
                    }

                }).fail(function () {
                    console.error("ERROR - Failed to submit query");
                });
            }
        }

    }).fail(function () {
        console.error("ERROR - Failed to submit query");
    });
});

function performScheduling(coursesList, roomsList) {
    var timeTable = ["MWF 8:00-9:00", "MWF 9:00-10:00", "MWF 10:00-11:00", "MWF 11:00-12:00", "MWF 12:00-13:00",
        "MWF 13:00-14:00", "MWF 14:00-15:00", "MWF 15:00-16:00", "MWF 16:00-17:00", "TT 8:00-9:30", "TT 9:30-11:00",
        "TT 11:00-12:30", "TT 12:30-14:00", "TT 14:00-15:30", "TT 15:30-17:00"];
    //console.log(coursesList)
    var countOfUnsheduledSection = 0;
    var totalNumOfSection = 0;
    var resultArr = [];
    roomsList.sort(keysrt("rooms_seats")).reverse();
    coursesList.sort(keysrt("courses_sectionSize")).reverse();
    var timeTableIndex = 0;
    var roomIndex = 0;
    var totalNumOfRooms = roomsList.length;
    // console.log(roomsList);
    // console.log(coursesList);
    for (var i = 0; i < coursesList.length; i++) {
        var currentCourse = coursesList[i];
        var sectionNumber = Math.ceil(currentCourse["courses_sectionNumber"] / 3);
        totalNumOfSection = totalNumOfSection + sectionNumber;
        var sectionSize = currentCourse["courses_sectionSize"];
        if (sectionNumber > 15) {
            countOfUnsheduledSection = countOfUnsheduledSection + sectionNumber - 15;
            sectionNumber = 15;
        }
        for (var j = 0; j < sectionNumber; j++) {
            if (timeTableIndex == 15) {
                timeTableIndex = 0;
                roomIndex = roomIndex + 1;
            }
            if (roomIndex < totalNumOfRooms) {
                var currentRoom = roomsList[roomIndex];
                var currentTimeForThisRoom = timeTable[timeTableIndex];
                if (sectionSize <= currentRoom["rooms_seats"]) {
                    timeTableIndex = timeTableIndex + 1;
                    var newObj = {
                        "rooms_shortname": currentRoom["rooms_shortname"],
                        "rooms_number": currentRoom["rooms_number"],
                        "rooms_seats": currentRoom["rooms_seats"],
                        "time": currentTimeForThisRoom,
                        "courses_sectionSize": sectionSize,
                        "courses_dept": currentCourse["courses_dept"],
                        "courses_id": currentCourse["courses_id"],
                        "courses_sectionNumber": sectionNumber
                    }
                    resultArr.push(newObj);
                } else {
                    countOfUnsheduledSection++;
                }
            } else {
                countOfUnsheduledSection++;
            }
        }
    }
    var result = {};
    result["resultArr"]= resultArr;
    result["countOfUnsheduledSection"] = countOfUnsheduledSection;
    result["totalNumOfSection"] = totalNumOfSection;
    return result;
    //console.log(resultArr);
}

function keysrt(key) {
    return function (key1, key2) {
        if (key1[key] > key2[key]) {
            return 1;
        }
        if (key1[key] < key2[key]) {
            return -1;
        }
        return 0;
    };
};

function calDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var a = radLat1 - radLat2;
    var b = toRad(lng1) - toRad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137.0;
    s = Math.round(s * 10000) / 10000;
    return s;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180.0;
}

function generateTable(data, id) {
    $("tbody").remove();
    var tbl_body = document.createElement("tbody");
    var odd_even = false;
    console.log("DATA", data);
    var first_row = tbl_body.insertRow();
    first_row.className = odd_even ? "odd" : "even";
    $.each(data[0], function (k, v) {
        var cell = first_row.insertCell();
        cell.appendChild(document.createTextNode(k.toString()));
    });
    odd_even = !odd_even;
    $.each(data, function () {
        var tbl_row = tbl_body.insertRow();
        tbl_row.className = odd_even ? "odd" : "even";
        $.each(this, function (k, v) {
            var cell = tbl_row.insertCell();
            cell.appendChild(document.createTextNode(v.toString()));
        });
        odd_even = !odd_even;
    });
    if (id === "manage") {
        document.getElementById("tblResults").appendChild(tbl_body);
    } else if (id === "courses") {
        document.getElementById("courseResults").appendChild(tbl_body);
    } else if (id === "rooms") {
        document.getElementById("roomsResults").appendChild(tbl_body);
    } else if (id === "scheduling") {
        document.getElementById("scheduleResults").appendChild(tbl_body);
    }
}

function populateInfoWindow(marker, infowindow) {

    if (infowindow.marker != marker) {

        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);

        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

