/**
 * Created by liuzhuoling on 16/4/19.
 */

var VIDEOS;
var FOLDER = "default";

$(document).ready(function(){
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

    $('.accordion')
        .accordion({
            selector: {
                trigger: '.title'
            }
        })
    ;

    FOLDER = $("#selectFolder").text();
    
    defaultLoad(FLAG);
});

function defaultLoad(FLAG) {

    loadFolder();

    if(FLAG){
        var video_html = '<div class="ui link cards" id="column-video">'+
                        '<div class="card" style="width: 100%">'+
                            '<div class="image">'+
                                '<video id="myPlayer" controls="controls" width="100%">'+
                                    '<source src="Upload/Video/Descendants.Of.The.Sun.2016.EP01.HD720P.X264.AAC.mp4" type="video/mp4">'+
                                    '您的浏览器不支持 video 标签。'+
                                '</video>'+
                            '</div>'+
                            '<div class="content">'+
                                '<div class="header" id="video_name">Title...</div>'+
                                '<div class="meta">'+
                                    '<span class="date" id="video_date">Joined date...</span>'+
                                '</div>'+
                                '<div class="description" id="video_desc">'+
                                    'Description...'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        $("#column-main").append(video_html);
        
        

        var h = $("#column-video").height();
        $("#column-desc").height(h);
    }else{
        var column =    '<div class="ui four column grid"> ' +
            '<div class="column" id="column1"></div> ' +
            '<div class="column" id="column2"></div> ' +
            '<div class="column" id="column3"></div> ' +
            '<div class="column" id="column4"></div>' +
            '</div>';
    }

    $.ajax({
        url: 'Server_SQL.php?TYPE=video&folder='+FOLDER,
        data: {},
        async: true,
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (data) {
            if(data == "No Video"){
                return;
            }
            VIDEOS = data;
            loadVideo(FLAG,data);
        },
        error: function () {
            alert("connect error!");
        }
    });

}

function loadFolder(){
    $.ajax({
        url: 'Server_SQL.php?TYPE=vfolder',
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
                var url = "/CloudGallery/showVideo.php?folder="+data[i];
                var temp = ' <button class="ui basic button" style="margin-bottom: 0.5em;" onclick="javascript:window.location=\''+url+'\'"> <i class="folder outline icon"> '+data[i]+' </i></button>';
                $("#folderContainer").append(temp);
            }
        },
        error: function () {
            alert("connect error!");
        }
    });
}

function loadVideo(FLAG, Videos) {
    // if(FLAG){
    //     var Column = [{height: 0, col: $("#column1")},{height: 0, col: $("#column2")},{height: 0, col: $("#column3")},{height: 0, col: $("#column4")},{height: 0, col: $("#column5")},{height: 0, col: $("#column6")}];
    // }else{
    //     var Column = [{height: 0, col: $("#column1")},{height: 0, col: $("#column2")},{height: 0, col: $("#column3")},{height: 0, col: $("#column4")}];
    // }
    var video_desc = "";
    for(var i=0; i<Videos.length;i++){
        if(Videos[i][3] == null){
            Videos[i][3] = "暂时没有描述信息..."
        }
        if(i>=1){
            var video = '<div class="title">'+
                '<i class="dropdown icon"></i>'+
                Videos[i][0]+
                '</div>'+
                '<div class="content">'+
                '<p>'+ Videos[i][3] +'</p>'+
                '<button class="ui button tiny teal" onclick="changeVideo(\''+ Videos[i][1] +'\', \''+Videos[i][0]+'\', \''+Videos[i][2]+'\', \''+Videos[i][3]+'\')">'+
                '<i class="play icon"></i>'+
                'Play'+
                '</button>'+
                '</div>';
        }
        else {
            var video = '<div class="active title">'+
                '<i class="dropdown icon"></i>'+
                Videos[i][0]+
                '</div>'+
                '<div class="active content">'+
                '<p>'+ Videos[i][3] +'</p>'+
                '<button class="ui button tiny teal" onclick="changeVideo(\''+ Videos[i][1] +'\', \''+Videos[i][0]+'\', \''+Videos[i][2]+'\', \''+Videos[i][3]+'\')">'+
                '<i class="play icon"></i>'+
                'Play'+
                '</button>'+
                '</div>';
        }
        video_desc = video_desc + video;
    }
    $("#add-desc").append(video_desc);
}

function changeVideo(Vpath,Vname,Vdate,Vdesc){
    var path = "Upload/Video/"+FOLDER+'/';
    var vedioFile = path + Vpath;

    $("#video_name").html(Vname);
    $("#video_date").html(Vdate);
    $("#video_desc").html(Vdesc);

    $("#myPlayer").html('<source src="'+ vedioFile +'" type="video/mp4">');
    $("#myPlayer").load();
    $("#myPlayer").get(0).play();


}