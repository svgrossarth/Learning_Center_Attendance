
var XLSX = require('xlsx');

const arrayOfPossibleChoices = ["Total Count", "Convert Aries Query Fall", "Convert Aries Query Fall With ALL Programs",
    "Update ETS Roster", "Update Migrant Ed Roster", "Update PTS Roster", "Update ELD Roster",
    "Monthly Lunch ASSETs Report", "Monthly After School ASSETs Report"];

var theSelector =  document.getElementById("theSelector");
theSelector.addEventListener('change', UpdateDOMForFileSelection);


var objSheetAr = {
    periodAttendance: "",
    ariesQuery: "",
    etsRoster: "",
    ptsRoster: "",
    migRoster: "",
    eldRoster: "",
};


const theHandler = {
    set(obj, prop, value){
        if(prop == "periodAttendance" && value != ""){
            let sheetAr = TotalCount(objSheetAr["periodAttendance"]);
            CreateNewExcel(sheetAr, "TotalCountReport.xlsx")
        }else if(prop == "ariesQuery" && value !="" && obj["etsRoster"] == "" && obj["ptsRoster"] == "" && obj["migRoster"] == "" && obj["eldRoster"] == ""){
            var sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
            CreateNewExcel(sheetAr, "Parsed Aries Query No Programs.xlsx");
        }else if(obj["ariesQuery"] != "" && obj["etsRoster"] != "" && obj["ptsRoster"] != "" && obj["migRoster"] != "" && obj["eldRoster"] != ""){
            var sheetAr = AriesQuery(objSheetAr["ariesQuery"]);
            sheetAr = AddPrograms(sheetAr);
            CreateNewExcel(sheetAr, "Parsed Aries Query With Programs.xlsx");
        }
    }
};

var theProxy = new Proxy(objSheetAr, theHandler);




function InsertPrograms(theStudent) {
    theStudent.ELD ="";
    theStudent.PTS ="";
    theStudent.ETS ="";
    theStudent.MIG ="";

}


function AddPrograms(sheetAr) {
    let ELDRoster = objSheetAr["eldRoster"];
    let ETSRoster = objSheetAr["etsRoster"];
    let PTSRoster = objSheetAr["ptsRoster"];
    let MIGRoster = objSheetAr["migRoster"];
    for(let i = 0; i < sheetAr.length; i++){
        InsertPrograms(sheetAr[i]);
        for(let ELDIndex = 0; ELDIndex < ELDRoster.length; ELDIndex++){
            if(sheetAr[i]["Student ID"] === ELDRoster[ELDIndex]["Student ID"]){
                sheetAr[i]["ELD"] = "X";
                ELDRoster.splice(ELDIndex, 1);
                break;
            }
        }
        for(let PTSIndex = 0; PTSIndex < PTSRoster.length; PTSIndex++){
            if(sheetAr[i]["Student ID"] === PTSRoster[PTSIndex]["Student ID"]){
                sheetAr[i]["PTS"] = "X";
                PTSRoster.splice(PTSIndex, 1);
                break;
            }
        }
        for(let ETSIndex = 0; ETSIndex < ETSRoster.length; ETSIndex++){
            if(sheetAr[i]["Student ID"] === ETSRoster[ETSIndex]["Student ID"]){
                sheetAr[i]["ETS"] = "X";
                ETSRoster.splice(ETSIndex, 1);
                break;
            }
        }
        for(let MIGIndex = 0; MIGIndex < MIGRoster.length; MIGIndex++){
            if(sheetAr[i]["Student ID"] === MIGRoster[MIGIndex]["Student ID"]){
                sheetAr[i]["MIG"] = "X";
                MIGRoster.splice(MIGIndex, 1);
                break;
            }
        }

    }
    return sheetAr;

}

function TheButGenerator(){
    var theSubBut = document.createElement("button");
    theSubBut.setAttribute("id", "submitButton");
    theSubBut.setAttribute("type", "button");
    var theButText = document.createTextNode("Submit");
    theSubBut.appendChild(theButText);
    theSubBut.addEventListener("click", DetermineRequest);
    return theSubBut;
}


function DetermineRequest() {
    if(theSelector.value == arrayOfPossibleChoices[0]){
        GetSingleFile("periodAttendance");


    }else if(theSelector.value == arrayOfPossibleChoices[1]){
        GetSingleFile("ariesQuery");

    }else if(theSelector.value == arrayOfPossibleChoices[2]){
        GetEachProgramRoster();
    }else if(theSelector.value === arrayOfPossibleChoices[7]){
        GetSingleFile("periodAttendance");
    }
}

function GetEachProgramRoster() {
    var alignerDiv = document.getElementById("aligner");
    var numOfFiles = alignerDiv.children.length;
    var arOfInputs = alignerDiv.children;
    for(var i = 0; i < numOfFiles; i++){(function (file, i){
        var reader = new FileReader();
        reader.onload = function (e) {
            if(i == 0){
                ConvertSheetToJSON(e, 0, "ariesQuery");
            }else if(i == 1){
                ConvertSheetToJSONAllPrograms(e)
            }
        };
        reader.readAsArrayBuffer(file);

    })(arOfInputs[i].children[0].files[0], i)}
}


function CorrectHeaders(workSheet) {
    let initalJSON = XLSX.utils.sheet_to_json(workSheet);
    for(var i = 0; i < initalJSON.length; i++) {
        let getOut = false;
        for (cell in initalJSON[i]) {
            if (initalJSON[i][cell] === "Student ID") {
                getOut = !getOut;
                break;
            }
        }
        if (getOut) {
            break;
        }
    }
    let correctJSON = XLSX.utils.sheet_to_json(workSheet, {range: i + 1});
    return correctJSON;
}

function ConvertSheetToJSONAllPrograms(e){
    var data = e.target.result;
    data = new Uint8Array(data);
    var workBook = XLSX.read(data, {type: 'array'});
    var arSheets = workBook.SheetNames;
    for(sheet in arSheets){
        if(arSheets[sheet].includes("ELD")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["eldRoster"] = json;
            theProxy["eldRoster"] = json;
        }else if(arSheets[sheet].includes("ME")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["migRoster"] = json;
            theProxy["migRoster"] = json;

        }else if(arSheets[sheet].includes("ETS")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["etsRoster"] = json;
            theProxy["etsRoster"] = json;

        }else if(arSheets[sheet].includes("PTS")){
            var workSheet = workBook.Sheets[arSheets[sheet]];
            var json = CorrectHeaders(workSheet);
            objSheetAr["ptsRoster"] = json;
            theProxy["ptsRoster"] = json;

        }
    }

}


function GetSingleFile(sheetName){
    var file = document.getElementById("fileInput0").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        ConvertSheetToJSON(e, 0, sheetName);

    };
    reader.readAsArrayBuffer(file);

}

function AttachInputTextInital(textNode){
    var innerInputDiv0 = document.getElementById("innerInputDiv0");
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("id", "fileInput0");
    input.style.borderStyle = "solid";
    innerInputDiv0.appendChild(input);
    var textDiv1 = document.createElement("Div");
    textDiv1.setAttribute("id", "text1");
    textDiv1.appendChild(textNode);
    textDiv1.style.paddingLeft = "5px";
    textDiv1.style.paddingRight = "5px";
    innerInputDiv0.appendChild(textDiv1);

}

function AttachInputTextRec(textNodeArray, i, totalNumFiles) {
    var alignerDiv = document.getElementById("aligner");
    var innerInputDiv = document.createElement("div");
    innerInputDiv.setAttribute("id","innerInputDiv" + i);
    innerInputDiv.style.display = "flex";
    innerInputDiv.style.flexDirection = "row";
    alignerDiv.appendChild(innerInputDiv);
    var innerFileInput = document.createElement("input");
    innerFileInput.setAttribute("type", "file");
    innerFileInput.setAttribute("id", "fileInput" + i);
    innerFileInput.style.borderStyle = "solid";
    innerInputDiv.appendChild(innerFileInput);
    var newTextDiv = document.createElement("Div");
    newTextDiv.setAttribute("id", "text" + i + 1);
    newTextDiv.style.paddingLeft = "5px";
    newTextDiv.style.paddingRight = "5px";
    newTextDiv.appendChild(textNodeArray[i]);
    innerInputDiv.appendChild(newTextDiv);
    var fileInput = document.getElementById("fileInput" + i + 1);

    if(i == totalNumFiles - 1){
        var theSubBut = TheButGenerator();
        innerInputDiv.appendChild(theSubBut);


    }else{
        i++;
        AttachInputTextRec(textNodeArray, i, totalNumFiles);
    }



}


function UpdateDOMForFileSelection(e) {
    var textNodeArray = [];
    var textNode = document.createTextNode("Please Select Aries Query");
    textNodeArray.push(textNode);
    if(theSelector.value == arrayOfPossibleChoices[0]){
        var textNodeAttendance = document.createTextNode("Please Select Attendance File");
        AttachInputTextInital(textNodeAttendance);
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);
    }else if(theSelector.value == arrayOfPossibleChoices[1]){
        AttachInputTextInital(textNode);
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);
    } else if(theSelector.value == arrayOfPossibleChoices[2]){
        var textNode1 = document.createTextNode("Please Select Excel Sheet Containing All Program Roster's");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[3]){
        var textNode1 = document.createTextNode("Please Select ETS Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[4]){
        var textNode1 = document.createTextNode("Please Select Migrant Ed Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[5]){
        var textNode1 = document.createTextNode("Please Select PTS Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value == arrayOfPossibleChoices[6]){
        var textNode1 = document.createTextNode("Please Select ELD Roster");
        textNodeArray.push(textNode1);
        AttachInputTextInital(textNode);
        AttachInputTextRec(textNodeArray, 1, 2);

    }else if(theSelector.value === arrayOfPossibleChoices[7]){
        var textNodeAttendance = document.createTextNode("Please Select Attendance File");
        textNodeArray.push(textNodeAttendance);
        AttachInputTextInital(textNodeAttendance);
        AttachMonthInput();
        var theSubBut = TheButGenerator();
        document.getElementById("innerInputDiv0").appendChild(theSubBut);

    }
}



function AttachMonthInput() {
    var textMonthInput = document.createTextNode("Please Enter Month As A Number")
    var innerInputDiv0 = document.getElementById("innerInputDiv0");
    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", "0");
    input.setAttribute("id", "fileInput1");
    input.style.borderStyle = "solid";
    innerInputDiv0.appendChild(input);
    var textDiv2 = document.createElement("Div");
    textDiv2.setAttribute("id", "text2");
    textDiv2.appendChild(textMonthInput);
    textDiv2.style.paddingLeft = "5px";
    textDiv2.style.paddingRight = "5px";
    innerInputDiv0.appendChild(textDiv2);


}

function AddAndRemoveKeys(student) {
    AddCountOuter(student);
    delete student["Student Sign Out (Tutor Name)"];
    delete student["Time In"];
    delete student["Time Out"];
    delete student["Period"];
    delete student["Date"];
    delete student["ELD"];
    delete student["PTS"];
    delete student["ETS"];
    delete student["MIG"];

}

function ConcatenateOtherSubject(sheetAr, i, j){
    if(sheetAr[i]["Other Subject"] === undefined && !(sheetAr[j]["Other Subject"] === undefined)) {
        sheetAr[i]["Other Subject"] = sheetAr[j]["Other Subject"];
    }else if(!(sheetAr[i]["Other Subject"] === undefined) && !(sheetAr[j]["Other Subject"] === undefined)){
        sheetAr[i]["Other Subject"] =  sheetAr[i]["Other Subject"] + "," + sheetAr[j]["Other Subject"];
    }
}

function TotalCount (sheetAr){
    for(let i = 0; i < sheetAr.length; i++){
        if(!(sheetAr[i]["Student ID"] === undefined)) {
            AddAndRemoveKeys(sheetAr[i]);
            for (let j = 0; j < sheetAr.length; j++) {
                if (!(sheetAr[j]["Student ID"] === undefined)) {
                    if (sheetAr[i]["Student ID"] === sheetAr[j]["Student ID"]) {
                        if (i !== j) {
                            removeSubjectDuplicates(sheetAr, i, j);
                            ConcatenateOtherSubject(sheetAr, i, j);
                            let innerCount = CheckForCount(sheetAr[j]);
                            if (innerCount) {
                                sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + Number(sheetAr[j]["Count"]);
                            }
                            else {
                                sheetAr[i]["Count"] = Number(sheetAr[i]["Count"]) + 1;
                            }
                            sheetAr[i]["Count"] = sheetAr[i]["Count"].toString();
                            sheetAr.splice(j, 1);
                            console.log(sheetAr.length);
                            j--;
                        }
                    }
                }else{
                    sheetAr.splice(j, 1);
                    j--;
                }
            }
        }else{
            sheetAr.splice(i, 1);
            i--;
        }
    }
    return sheetAr;
}


function CheckForCount(student) {
    const theKeys = Object.keys(student);
    let thereIsCount = false;
    for(let k = 0; k < theKeys.length; k++){
        if(theKeys[k] === "Count"){
            thereIsCount = true;
        }
    }
    return thereIsCount;

}

function AddCountOuter(student){
    let thereIsCount = CheckForCount(student);
    if(!thereIsCount){
        student.Count ="1";
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
    return sheetAr;
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


function ConvertSheetToJSON(e, correctSheet, sheetname) {

        var data = e.target.result;
        data = new Uint8Array(data);
        var workBook = XLSX.read(data, {type: 'array'});
        var arSheets = workBook.SheetNames;
        var workSheet = workBook.Sheets[arSheets[correctSheet]];
        var json = XLSX.utils.sheet_to_json(workSheet);
        objSheetAr[sheetname] = json;
        theProxy[sheetname] = json;

}


function CreateNewExcel(sheetAr, newExcelName){
    var newSheet = XLSX.utils.json_to_sheet(sheetAr);
    var newWorkBook = XLSX.utils.book_new();
    var convertedSheet = "The compiled Sheet";
    XLSX.utils.book_append_sheet(newWorkBook, newSheet, convertedSheet);
    XLSX.writeFile(newWorkBook, newExcelName);
    UpdateUserAboutFile(newExcelName);
}

function  UpdateUserAboutFile(newExcelname) {
    let displayArea = document.getElementById("displayResults");
    let displayText = document.createTextNode(newExcelname + " has been generated!");
    displayArea.appendChild(displayText);
    
}

function removeSubjectDuplicates(sheetAr, i, j){
    if(!(sheetAr[i]["Subject"] === undefined) && !(sheetAr[j]["Subject"] === undefined)) {
        var outterLoopSubjects = sheetAr[i]["Subject"].split(",");
        var innerLoopSubjects = sheetAr[j]["Subject"].split(",");
        var newUniqueSubject = true;

        for (let j2 = 0; j2 < innerLoopSubjects.length; j2++) {
            for (let i2 = 0; i2 < outterLoopSubjects.length; i2++) {
                if (innerLoopSubjects[j2].trim() == outterLoopSubjects[i2].trim()) {
                    newUniqueSubject = false;
                    break;
                }
            }

            if (newUniqueSubject) {
                sheetAr[i]["Subject"] = sheetAr[i]["Subject"] + "," + innerLoopSubjects[j2].trim();
                outterLoopSubjects = sheetAr[i]["Subject"].split(",");
            }

            newUniqueSubject = true;
        }
    }
}
