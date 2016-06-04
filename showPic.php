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
    <title>Picture Gallery</title>
    <link rel="stylesheet" href="Semantic/semantic.css">
    <link rel="stylesheet" href="Public/IdealSlider/ideal-image-slider.css">
    <link rel="stylesheet" href="Public/sweetalert.css">
    <link rel="stylesheet" href="showPic.css">
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
        <div class="ui popup bottom center transition ">
            <div id="folderContainer">

            </div>
        </div>
    </div>

    <div id="selectFolder" hidden><?php echo $selectFolder ?></div>
    <div class="ui container">

    </div>
</div>

<div class="ui small modal">
    <div class="header">
        Update Description
    </div>
    <div class="content">
        <div class="ui form">
            <div class="field">
                <label>Title</label>
                <input id="PicTitle" placeholder="Your Title"/>
            </div>

            <div class="field">
                <label>Description</label>
                <textarea id="PicDesc" placeholder="Your Description"></textarea>
            </div>
        </div>
    </div>
    <div class="actions">
        <div class="ui red basic cancel button">
            <i class="remove icon"> Cancel </i>
        </div>
        <div class="ui green basic ok button">
            <i class="checkmark icon"> Confirm </i>
        </div>
    </div>
</div>

<script src="Public/jquery.min.js"></script>
<script src="Semantic/semantic.js"></script>
<script src="Public/IdealSlider/ideal-image-slider.js"></script>
<script src="Public/IdealSlider/iis-captions.js"></script>
<script src="Public/sweetalert.min.js"></script>
<script src="sidebar.js"></script>
<script src="showPic.js"></script>
<script>
    $(".row").hover(function(){
        $(this).find("a").css("display", "block");
    }, function(){
        $(this).find("a").css("display", "none");
    });
</script>

</body>
</html>
