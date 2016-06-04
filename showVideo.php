<?php
if(isset($_GET['folder'])){
    $selectFolder = $_GET['folder'];
}else
    $selectFolder = "default";
?>

<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width" />
    <title>Video Gallery</title>
    <link rel="stylesheet" href="Semantic/semantic.css">
    <style>
        .folder.outline.icon {
            display: table-row;
        }
        #column-desc::-webkit-scrollbar { width: 0 !important }
    </style>
</head>

<body>
<div class="ui sidebar">

</div>
<div class="pusher">
    <div class="ui menu">
        <a class="item" onclick="callSidebar();">
            <i class="sidebar icon"></i>
            Home
        </a>
        <a class="browse item">
            Select Folder
            <i class="dropdown icon"></i>
        </a>
        <div class="ui fluid popup bottom left transition " style="top: 554px; left: 1px; bottom: auto; right: auto; width: auto;">
            <div id="folderContainer">

            </div>
        </div>
    </div>
    <div id="selectFolder" hidden><?php echo $selectFolder ?></div>
    <div class="ui container">
        <div class="ui grid">
            <div class="twelve wide column" id="column-main">
                <!--<div class="ui link cards" id="column-video">-->
                    <!--<div class="card" style="width: 100%">-->
                        <!--<div class="image">-->
                            <!--<video id="myPlayer" controls="controls" width="100%">-->
                                <!--<source src="Upload/Video/Descendants.Of.The.Sun.2016.EP01.HD720P.X264.AAC.mp4" type="video/mp4">-->
                                <!--您的浏览器不支持 video 标签。-->
                            <!--</video>-->
                        <!--</div>-->
                        <!--<div class="content">-->
                            <!--<div class="header">太阳的后裔第一集</div>-->
                            <!--<div class="meta">-->
                                <!--<span class="date">Joined in 2016-03-16</span>-->
                            <!--</div>-->
                            <!--<div class="description">-->
                                <!--lalala,找了好久-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            <div class="four wide column" id="column-desc" style="overflow: scroll">
                <div class="ui styled accordion" id="add-desc">

                </div>
            </div>
        </div>
    </div>
</div>





    <script src="Public/jquery.min.js"></script>
    <script src="Semantic/semantic.js"></script>
    <script src="Public/sweetalert.min.js"></script>
    <script src="sidebar.js"></script>
    <script src="showVideo.js"></script>
</body>
