
var XLSX = require('xlsx');

var theSelector =  document.getElementById("theSelector");
theSelector.addEventListener('change', UpdateDOMForFileSelection);

/*
var fileInput = document.getElementById("inputFile");
fileInput.addEventListener('change', FindFileInital);
*/


function AttachInputTextInital(textNode){
    var selectorDiv = document.getElementById("selectorDiv");
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("id", "fileInput1");
    selectorDiv.appendChild(input);
    var textDiv1 = document.createElement("Div");
    textDiv1.setAttribute("id", "text1");
    textDiv1.appendChild(textNode);
    selectorDiv.appendChild(textDiv1);
    var fileInput = document.getElementById("fileInput1");
    fileInput.addEventListener('change', FindFileInital);
}

function AttachInputTextRec(textNodeArray, i, totalNumFiles) {
    var inputDiv = document.getElementById("inputDiv");
    var innerInputDiv = document.createElement("div");
    innerInputDiv.setAttribute("id","innerInputDiv" + i);
    innerInputDiv.style.display = "flexbox";
    innerInputDiv.style.flexDirection = "row";
    inputDiv.appendChild(innerInputDiv);
    var innerFileInput = document.createElement("input");
    innerFileInput.setAttribute("type", "file");
    innerFileInput.setAttribute("id", "fileInput" + i + 1);
    innerInputDiv.appendChild(innerFileInput);
    var newTextDiv = document.createElement("Div");
    newTextDiv.setAttribute("id", "text" + i + 1);
    newTextDiv.appendChild(textNodeArray[i]);
    innerInputDiv.appendChild(newTextDiv);
    var fileInput = document.getElementById("fileInput" + i + 1);
    fileInput.addEventListener('change', FindFileInital);

    if(i == totalNumFiles - 1){

    }else{
    }



}


function UpdateDOMForFileSelection(e) {
    var textNodeArray = [];
    var textNode = document.createTextNode("Please Select Aries Query");
    textNodeArray.push(textNode);
    if(theSelector.value == "Total Count"){
        var textNodeAttendance = document.createTextNode("Please Select Attendence File");
        AttachInputTextInital(textNodeAttendance);
    }else if(theSelector.value == "Convert Aries Query Fall"){
        AttachInputTextInital(textNode);
    }else if(theSelector.value == "Update ETS Roster"){
        var textNode1 = document.createTextNode("Please Select ETS Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == "Update Migrant Ed Roster"){
        var textNode1 = document.createTextNode("Please Select Migrant Ed Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == "Update PTS Roster"){
        var textNode1 = document.createTextNode("Please Select PTS Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == "Update ELD Roster"){
        var textNode1 = document.createTextNode("Please Select ELD Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }
    else if(theSelector.value == "Convert Aries Query Fall With ALL Programs"){
        var textNode1 = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }


}

function TotalCount (sheetAr){
    for(let i = 0; i < sheetAr.length; i++){
        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["ID's"] == sheetAr[j]["ID's"]){
                if(i != j){
                    removeSubjectDuplicates(sheetAr, i, j);
                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                    sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                    sheetAr.splice(j, 1);
                    console.log(sheetAr.length);
                    j--;
                }
            }
        }

    }
}

function AriesQuery (sheetAr){
    var keyword = "Class";
    for(let i = 0; i < sheetAr.length; i++){
        AddClassSlots(sheetAr[i], keyword);

        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["Student ID"] == sheetAr[j]["Student ID"]){
                if(i != j){
                    if(sheetAr[j]["Semester"] != "S"){
                        var period = sheetAr[j]["Period"];
                        keyword = keyword + period;
                        sheetAr[i][keyword] = period + " - " + sheetAr[j]["Course title"];
                        AVIDChecker(sheetAr[i], sheetAr[j]["Course title"]);
                        sheetAr.splice(j, 1);
                        console.log(sheetAr.length);
                        j--;
                        keyword = "Class";
                    }else {
                        sheetAr.splice(j, 1);
                        j--;
                    }
                }
            }
        }
    }
}

function AddClassSlots(singleObject, keyword){
    singleObject.Class0 = "";
    singleObject.Class1 = "";
    singleObject.Class2 = "";
    singleObject.Class3 = "";
    singleObject.Class4 = "";
    singleObject.Class5 = "";
    singleObject.Class6 = "";
    singleObject.Class7 = "";
    singleObject.Class8 = "";
    singleObject.Class9 = "";
    singleObject.AVID = "";
    var period = singleObject["Period"];
    keyword = keyword + period;
    singleObject[keyword] = period + " - " + singleObject["Course title"];
    AVIDChecker(singleObject, singleObject["Course title"]);
    delete singleObject["Course title"];
    delete singleObject["Period"];
    delete singleObject["Semester"];

}

function AVIDChecker(outLoopStudent, innerLoopSubject) {
    if(innerLoopSubject.includes("AVID")){
        outLoopStudent["AVID"] = "X";
    }


}


function TestFunc1(sheetAr) {
    console.log("Single file test")

}

function HandleSheets(arraySheetAr) {
    console.log("Test");

}

function ConvertFileToJSON(e, allFiles, i, arraySheetAr) {

        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        var workSheet = workBook.Sheets[arSheets[0]];
        arraySheetAr.push(XLSX.utils.sheet_to_json(workSheet));
        if(allFiles.length != arraySheetAr.length){
            FindFile(allFiles, i, arraySheetAr);
        }else{
            HandleSheets(arraySheetAr);
        }



}

function FindFileInital(eInitial){
        var arraySheetAr = [];
        var file = eInitial.target.files[0];
        var allFiles = eInitial.target.files;
        var reader = new FileReader();
        reader.onload = function (e){
            ConvertFileToJSON(e, allFiles, 0, arraySheetAr);

        };
        reader.readAsArrayBuffer(file);


}

function FindFile(allFiles, i, arraySheetAr){
    i++;
    //WORK HERE i NEED TO MAKE ONE OF THOSE INSTANT FUNCTION THINGS, SO THERE IS A CLOSURE
   /* for (; i < allFiles.length; i++){
        (function (file,allFiles, i, arraySheetAr) {
            var reader = new FileReader();
            reader.onload = function (e) {
                ConvertFileToJSON(e, allFiles, i, arraySheetAr);

            }
            reader.readAsArrayBuffer(file);
        })(allFiles[i],allFiles, i, arraySheetAr);
    }*/
    var file = allFiles[i];
    var reader = new FileReader();
    reader.onload = function (e) {
        ConvertFileToJSON(e, allFiles, i, arraySheetAr);

    }
    reader.readAsArrayBuffer(file);

}


/*
function FindFile(e){

    if(e.target.files.length == 1){
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            data = new Uint8Array(data);
            var workBook = XLSX.read(data, {type: 'array'});
            var arSheets = workBook.SheetNames;
            var workSheet = workBook.Sheets[arSheets[0]];
            var sheetAr = XLSX.utils.sheet_to_json(workSheet);
            TestFunc1(sheetAr);
        };
        reader.readAsArrayBuffer(file);

    }
    else if(e.target.files.length == 2){
        var files = e.target.files;
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            data = new Uint8Array(data);
            var workBook = XLSX.read(data, {type: 'array'});
            var arSheets = workBook.SheetNames;
            var workSheet = workBook.Sheets[arSheets[0]];
            var sheetAr = XLSX.utils.sheet_to_json(workSheet);
            TestFunc1(sheetAr);
        };
        reader.readAsArrayBuffer(files);

    }*/

/*
    //this bit here is the magic that takes the file and makes it so it is read able by sheetjs
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        var workSheet = workBook.Sheets[arSheets[0]];
        var sheetAr = XLSX.utils.sheet_to_json(workSheet);
        return sheetAr;
    }
    reader.readAsArrayBuffer(file);


        if(selector.value == "Total Count"){
            TotalCount(sheetAr);
        }
        else if(selector.value == "Convert Aries Query Fall"){
            AriesQuery(sheetAr);
            CreateNewExcel(sheetAr);

        }
        // ParseSheet(sheetAr);
        // CreateNewExcel(sheetAr);




}*/


function ParseSheet(sheetAr){

    for(let i = 0; i < sheetAr.length; i++){
        for(let j = 0; j < sheetAr.length; j++){
            if(sheetAr[i]["ID's"] == sheetAr[j]["ID's"]){
                if(i != j){
                    removeSubjectDuplicates(sheetAr, i, j);
                    sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                    sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                    sheetAr.splice(j, 1);
                    console.log(sheetAr.length);
                    j--;
                }
            }
        }

    }
}


function CreateNewExcel(sheetAr){
    var newSheet = XLSX.utils.json_to_sheet(sheetAr);
    var newWorkBook = XLSX.utils.book_new();
    var convertedSheet = "The compiled Sheet";
    XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
    XLSX.writeFile(newWorkBook, 'parsedStudentRoster.xlsx');
}

function removeSubjectDuplicates(sheetAr, i, j){
    var outterLoopSubjects = sheetAr[i]["Subject"].split(",");
    var innerLoopSubjects = sheetAr[j]["Subject"].split(",");
    var newUniqueSubject = true;

    for(let j2 = 0; j2 < innerLoopSubjects.length; j2++){
        for(let i2 = 0; i2 < outterLoopSubjects.length; i2++){
            if(innerLoopSubjects[j2].trim() == outterLoopSubjects[i2].trim()){
                newUniqueSubject = false;
                break;
            }
        }

        if(newUniqueSubject){
            sheetAr[i]["Subject"] = sheetAr[i]["Subject"] + "," + innerLoopSubjects[j2].trim();
            outterLoopSubjects = sheetAr[i]["Subject"].split(",");
        }

        newUniqueSubject = true;
    }
}
