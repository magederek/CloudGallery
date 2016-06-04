/**
 * Created by liuzh on 2016/1/26.
 */

var IMAGES;
var SLIDER;
var FOLDER = "default";

$(document).ready(function(){
    $(".container").height(document.body.clientHeight);
    if(document.body.clientWidth > 768){
        var FLAG = true;
    }else{
        var FLAG = false;
    }

    $('.menu .browse')
        .popup({
            inline   : true,
            hoverable: true,
            position : 'bottom left',
            setFluidWidth: false,
            delay: {
                show: 300,
                hide: 800
            }
        })
    ;

    FOLDER = _("selectFolder").innerHTML;

    defaultLoad(FLAG);
});

function zoomOut(index){
    var sliderDiv = '<div class="ui basic modal middle center" id="sliderParent" onclick="closeModal();"> <div id="slider"> </div> </div>';
    $("body").append(sliderDiv);

    for (var i=index;i<IMAGES.length;i++){  //add the picture after the selected image
        var img = '<img data-src="'+"Upload/Pictures/"+FOLDER+"/"+IMAGES[i][0]+'" title="'+IMAGES[i][4]+'" data-text="'+IMAGES[i][3]+'" alt="'+IMAGES[i][5]+'" />';
        $("#slider").append(img);
    }
    for (var i=0;i<index;i++){  //add the picture before the selected image
        var img = '<img data-src="'+"Upload/Pictures/"+FOLDER+"/"+IMAGES[i][0]+'" title="'+IMAGES[i][4]+'" data-text="'+IMAGES[i][3]+'" alt="'+IMAGES[i][5]+'" />';
        $("#slider").append(img);
    }

    SLIDER = new IdealImageSlider.Slider('#slider');
    SLIDER.addCaptions();

    $('.ui.basic.modal')
        .modal('show')
    ;
}
function closeModal(){
    $('.ui.basic.modal')
        .modal('hide')
    ;
    $("#sliderParent").remove();
}
function defaultLoad(FLAG) {
    if(FLAG){
        var column =    '<div class="ui six column grid"> ' +
                            '<div class="column" id="column1"></div> ' +
                            '<div class="column" id="column2"></div> ' +
                            '<div class="column" id="column3"></div> ' +
                            '<div class="column" id="column4"></div> ' +
                            '<div class="column" id="column5"></div> ' +
                            '<div class="column" id="column6"></div> ' +
                        '</div>';
    }else{
        var column =    '<div class="ui four column grid"> ' +
                            '<div class="column" id="column1"></div> ' +
                            '<div class="column" id="column2"></div> ' +
                            '<div class="column" id="column3"></div> ' +
                            '<div class="column" id="column4"></div>' +
                        '</div>';
    }
    $(".container").append(column);

    loadFolder();

    $.ajax({
        url: 'Server_SQL.php?TYPE=image&folder='+FOLDER,
        data: {},
        async: true,
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (data) {
            if(data == "No Image"){
                return;
            }
            IMAGES = data;
            addPic(FLAG,data);
        },
        error: function () {
            alert("connect error!");
        }
    });
}
function loadFolder(){
    $.ajax({
        url: 'Server_SQL.php?TYPE=folder',
        data: {},
        async: true,
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (data) {
            if(data == "No Folder"){
                return;
            }
            for(var i=0;i<data.length;i++){
                var url = "/CloudGallery/showPic.php?folder="+data[i];
                var temp = ' <button class="ui basic button" style="margin-bottom: 0.5em;" onclick="javascript:window.location=\''+url+'\'"> <i class="folder outline icon"> '+data[i]+' </i></button>';
                $("#folderContainer").append(temp);
            }
        },
        error: function () {
            alert("connect error!");
        }
    });
}
function addPic(FLAG,Images){
    if(FLAG){
        var Column = [{height: 0, col: $("#column1")},{height: 0, col: $("#column2")},{height: 0, col: $("#column3")},{height: 0, col: $("#column4")},{height: 0, col: $("#column5")},{height: 0, col: $("#column6")}];
    }else{
        var Column = [{height: 0, col: $("#column1")},{height: 0, col: $("#column2")},{height: 0, col: $("#column3")},{height: 0, col: $("#column4")}];
    }

    var WIDTH = Column[0].col.width();
    var tempHeight=0;
    for(var i=0; i<Images.length;i++){
        var img =   '<div class="row" id="'+Images[i][6]+'" onmouseover="showDelete(\'' + Images[i][6] + '\');" onmouseout="hideDelete(\'' + Images[i][6] + '\');"> ' +
                        '<div class="ui fluid image"> ' +
                            '<img class="ui image hvr-grow-shadow" width="100%" onclick="zoomOut('+i+');" src="'+"Upload/Pictures/"+FOLDER+"/thumb/"+Images[i][0]+'"> ' +
                            '<div class="floatingLeft ui label"> ' +
                                '<a class="circular ui icon button" onclick="deletePic(\'' + Images[i][6] + '\')" style="display: none"> <i class="erase icon"></i></a> ' +
                            '</div> ' +
                            '<div class="floatingRight ui label"> ' +
                                '<a class="circular ui icon button" href="'+"Upload/Pictures/"+FOLDER+"/"+Images[i][0]+'" download="'+Images[i][0]+'" style="display: none"><i class="cloud download icon"></i></a> ' +
                            '</div>' +
                            '<div class="floatingRightDown ui label"> ' +
                                '<a class="circular ui icon button" onclick="revisePic(\''+ Images[i][6] +'\', \''+Images[i][4]+'\', \''+Images[i][5]+'\')" style="display: none"> <i class="paint brush icon"></i></a> ' +
                            '</div>' +
                        '</div>'+
                    '</div>';
        Column.sort(function(a,b){
            return a.height - b.height;
        })
        Column[0].col.append(img);
        tempHeight = Images[i][1]*WIDTH/Images[i][2];
        Column[0].height += tempHeight;
    }
}
function deletePic(id){
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this picture!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        $.ajax({
            url: 'Server_SQL.php',
            data: {deletePicID: id},
            async: true,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function (data) {
                swal({
                    title: "Deleted!",
                    text: "Your picture have been deleted.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#8CD4F5",
                    confirmButtonText: "OK!",
                    closeOnConfirm: true
                }, function () {
                    _(id).remove();
                });
            },
            error: function () {
                alert("connect error!");
            }
        });
    });
}
function revisePic(id,title,desc){
    $("#PicTitle").val(title);
    $("#PicDesc").val(desc);
    $('.small.modal')
        .modal({
            closable  : false,
            onDeny    : function(){

            },
            onApprove : function() {
                swal({
                    title: "Are you sure?",
                    text: "You will change the information!",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    closeOnConfirm: false
                }, function () {
                    var picTitle = $("#PicTitle")[0].value;
                    var picDesc = $("#PicDesc")[0].value;
                    $.ajax({
                        url: 'Server_SQL.php',
                        data: {revisePicID: id,revisePicTitle: picTitle, revisePicDesc: picDesc},
                        async: true,
                        type: 'post',
                        cache: false,
                        dataType: 'json',
                        success: function (data) {
                            swal({
                                title: "Success!",
                                text: "Your changes have been confirmed!",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#8CD4F5",
                                confirmButtonText: "OK!",
                                closeOnConfirm: true
                            }, function () {
                                location.reload(true);
                            });
                        },
                        error: function () {
                            alert("connect error!");
                        }
                    });
                });
                return false;
            }
        })
        .modal('show')
    ;
}
function showDelete(id){
    var a = "#"+id;
    $(a).find("a").css("display", "block");
}
function hideDelete(id){
    var a = "#"+id;
    $(a).find("a").css("display", "none");
}
function _(item){
    return document.getElementById(item);
}
