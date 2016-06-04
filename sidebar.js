/**
 * Created by liuzhuoling on 16/4/9.
 */

$(document).ready(function(){
    
    var sidebar =   '<a class="item" href="index.html">'+
                        '<i class="home icon"></i>Home'+
                    '</a>'+
                    '<a class="item" href="uploadPic.html">'+
                        '<i class="photo icon"></i>Pic Upload'+
                    '</a>'+
                    '<a class="item" href="showPic.php">'+
                        '<i class="photo icon"></i>Pictures'+
                    '</a>'+
                    '<a class="item">'+
                        '<i class="sound icon"></i>Music Upload'+
                    '</a>'+
                    '<a class="item">'+
                        '<i class="sound icon"></i>Musics'+
                    '</a>'+
                    '<a class="item" href="uploadVideo.html">'+
                        '<i class="film icon"></i>Movie Upload'+
                    '</a>'+
                    '<a class="item" href="showVideo.php">'+
                        '<i class="film icon"></i>Movies'+
                    '</a>'+
                    '<a class="item">'+
                        '<i class="file icon"></i>Doc Upload'+
                    '</a>'+
                    '<a class="item">'+
                        '<i class="file icon"></i>Documents'+
                    '</a>';
    $(".ui.sidebar").addClass( "left demo vertical labeled icon menu" );
    $(".ui.sidebar").append(sidebar);
    
});

function callSidebar() {
    $('.ui.labeled.icon.sidebar')
        .sidebar('toggle')
    ;
}