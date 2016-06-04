/**
 * Created by liuzh on 2016/2/29.
 */
var FLAG;
var max = 0;
$(document).ready(function () {
    $(".container").height(document.body.clientHeight);
    if ($(".container").width() > 768) {
        FLAG = true;
    } else {
        FLAG = false;
    }

    _("addButton").addEventListener("click", function () {
        $("#addPictures").click();
    });
    _("uploadButton").addEventListener("click", function () {
        $("#submit").click();
    });
    _("deleteButton").addEventListener("click", deleteFolder);

    loadFolder();

    defaultLoad(FLAG);
});
function defaultLoad(FLAG) {
    if (FLAG == true) {
        _("imageContainer").className = "ui six column grid";
    } else {
        _("imageContainer").className = "ui divided items";
    }
    _("addPictures").addEventListener("change", function () {
        var node = _("imageContainer");
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        for (var i = 0; i < this.files.length; i++) {
            var file = this.files[i];
            if (!/image\/\w+/.test(file.type)) {
                alert("文件必须为图片！");
                return false;
            }
            var reader = new FileReader();

            reader.onload = (function (tempFile) {
                return function (evt) {
                    createDataBindingPic(evt, tempFile)
                };
            })(file);
            reader.readAsDataURL(file);
        }

    });
    $("select").dropdown();

}
;
function createDataBindingPic(evt, file) {
    var date = GetDate();
    
    var titleName = ("TITLE" + file.name).replace(/\./g, '_');
    titleName = titleName.replace(/ /g,'');
    var dateName = ("DATE" + file.name).replace(/\./g, '_');
    dateName = dateName.replace(/ /g,'');
    var descName = ("DESC" + file.name).replace(/\./g, '_');
    descName = descName.replace(/ /g,'');
    var itemView =  '<div class="item" id="'+titleName+'">' +
                        '<div class="image">' +
                            '<a class="ui right corner label" onclick="deleteFile(\'' + titleName + '\')"> ' +
                                '<i class="trash icon"></i> ' +
                            '</a> ' +
                            '<img src="' + evt.target.result + '">' +
                        '</div>' +
                        '<div class="content">' +
                            '<div class="header ui transparent input"> ' +
                                '<input type="text" class="TITLE" placeholder="Title..." name="' + titleName + '" autocomplete="off">' +
                            '</div>' +
                            '<div class="meta">' +
                                '<div class="ui transparent input">' +
                                    '<input maxlength="10" class="form-control datepicker-here" type="text" data-language="en" data-date-format="yyyy-mm-dd" data-position="top left" name="' + dateName + '"  value="' + date + '" required/>' +
                                '</div>' +
                            '</div>' +
                            '<div class="description">' +
                                '<textarea class="DESC" type="text" placeholder="Please input what you want to say" name="' + descName + '"></textarea>' +
                            '</div>' +
                        '</div>'+
                    '</div>';
    var cardView =  '<div class="column" id="'+titleName+'"> ' +
                        '<div class="ui fluid card"> ' +
                            '<div class="image">' +
                                '<a class="ui right corner label" onclick="deleteFile(\'' + titleName + '\')"> ' +
                                    '<i class="trash icon"></i> ' +
                                '</a> ' +
                                '<img src="' + evt.target.result + '" alt=""/> ' +
                            '</div> ' +
                            '<div class="content"> ' +
                                '<div class="header ui transparent input"> ' +
                                    '<input class="TITLE" type="text" placeholder="Title..." name="' + titleName + '" autocomplete="off"> </div><div class="meta ui transparent input">' +
                                    '<input maxlength="10" class="form-control datepicker-here" type="text" data-language="en" data-date-format="yyyy-mm-dd" data-position="top left" name="' + dateName + '"  value="' + date + '" required/>' +
                                '</div> ' +
                                '<div class="meta ui transparent input"> ' +
                                    '<textarea class="DESC" type="text" placeholder="Please input what you want to say" name="' + descName + '"></textarea> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div>' +
                    '</div>';
    if (FLAG == true) {
        $("#imageContainer").append(cardView);
    } else {
        $("#imageContainer").append(itemView);
    }
    $('.datepicker-here').datepicker();
}
function GetDate() {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return year + "-" + month + "-" + day;
}
function _(item) {
    return document.getElementById(item);
}
function deleteFile(fileName){
    _("imageContainer").removeChild(_(fileName));
}
function loadFolder() {
    $.ajax({
        url: 'Server_SQL.php?TYPE=folder',
        data: {},
        async: true,
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (data) {
            if (data == "No Folder") {
                return;
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i] == "Default") {
                    var temp = '<option value="' + data[i] + '">' + data[i] + '</option>';
                    $("#deleteFolder").append(temp);
                    continue;
                }

                var temp = '<option value="' + data[i] + '">' + data[i] + '</option>';
                $("#selectFolder").append(temp);
                $("#deleteFolder").append(temp);
            }
        },
        error: function () {
            alert("connect error!");
        }
    });
}
function deleteFolder() {
    var folder = _("deleteFolder").value;
    if (folder == "delete") {
        swal("Please select a folder!");
        return;
    }
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover these files!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        var folder = _("deleteFolder").value;
        $.ajax({
            url: 'Server_SQL.php',
            data: {deleteFolder: folder},
            async: true,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function (data) {
                swal({
                    title: "Deleted!",
                    text: "Your folder and files have been deleted.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#8CD4F5",
                    confirmButtonText: "OK!",
                    closeOnConfirm: false
                },function(){location.reload(true);});
            },
            error: function () {
                alert("connect error!");
            }
        });
    });
}
function uploadFile() {
    var file = _("addPictures");
    var formdata = new FormData();
    var picName = "pictures[]";
    for(var i=0;i<file.files.length;i++){
        var FILE = file.files[i];
        var fileName = file.files[i].name;

        var titleName = ("TITLE" + fileName).replace(/\./g, '_');
        titleName = titleName.replace(/ /g,'');
        var dateName = ("DATE" + fileName).replace(/\./g, '_');
        dateName = dateName.replace(/ /g,'');
        var descName = ("DESC" + fileName).replace(/\./g, '_');
        descName = descName.replace(/ /g,'');

        if(document.getElementsByName(dateName)[0] === undefined)
            continue;

        formdata.append(picName, FILE);
        formdata.append(titleName, document.getElementsByName(titleName)[0].value);
        formdata.append(dateName, document.getElementsByName(dateName)[0].value);
        formdata.append(descName, document.getElementsByName(descName)[0].value);
    }
    formdata.append("selectFolder", document.getElementsByName("selectFolder")[0].value);
    formdata.append("createFolder", document.getElementsByName("createFolder")[0].value);

    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "file_upload_parser.php");
    ajax.send(formdata);
}
function progressHandler(event) {
    var loaded = Math.round(event.loaded / (1024 * 1024));
    var total = Math.round(event.total / (1024 * 1024));
    var percent =  Math.round((loaded / total) * 100);
    for(var i=0; i < percent-max;i++){
        $('#progressBar').progress('increment');
    }

    max = percent;

    var loading = '<div class="ui active inverted dimmer" id="loading"> <div class="ui large text loader" id="loadingText"> loading </div> </div>';
    if($("#loading").length == 0){
        $("body").append(loading);
    }

    _("loadingText").innerHTML = loaded + "/" + total + "M,  please wait...";

    if(loaded == total){
        _("loadingText").innerHTML = "Processing the pictures,  please wait...";
    }
}
function completeHandler(event) {
    _("loadingText").innerHTML = "Completed!";
    $("#loading").remove();
    swal({
        title: "Completed!",
        type: "success",
        showCancelButton: false,
        confirmButtonColor: "#8CD4F5",
        confirmButtonText: "OK!",
        closeOnConfirm: true
    },function(){location.reload(true);});
}
function errorHandler(event) {
    _("status").innerHTML = "Upload Failed";
}
function abortHandler(event) {
    _("status").innerHTML = "Upload Aborted";
}
function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
}
function isNumeric(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}
function removeSpecial(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /\.|\+|\*|\-|[,\\/<>?:;'"\{}\[\]|=_!@#$%^&()`~ ]/;
    if (regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}