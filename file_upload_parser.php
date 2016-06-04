<?php
/**
 * Created by PhpStorm.
 * User: liuzh
 * Date: 2016/2/17
 * Time: 12:58
 */

require_once ("resizeImage.php");
require_once ("conf.php");
$link = CONNECT();

if($_POST['createFolder'] != NULL){
    $FOLDER = $_POST['createFolder'];
}else{
    $FOLDER = $_POST['selectFolder'];
}

echo $FOLDER;

if(isset($_FILES["videos"])){
    $fileName = $_FILES["videos"]["name"][0];
    $fileTmpLoc = $_FILES["videos"]["tmp_name"][0];
    $fileErrorMsg = $_FILES["pictures"]["error"][0];
    echo "<br>"."$fileName"."<br>";

    $tempTitle = str_replace(".","_","TITLE".$fileName);
    $tempTitle = str_replace(" ","",$tempTitle);
    $tempDate = str_replace(".","_","DATE".$fileName);
    $tempDate = str_replace(" ","",$tempDate);
    $tempDesc = str_replace(".","_","DESC".$fileName);
    $tempDesc = str_replace(" ","",$tempDesc);

    $title = $_POST["$tempTitle"];
    $description = $_POST["$tempDesc"];
    $date = $_POST["$tempDate"];

    if (!$fileTmpLoc) { // if file not chosen
        echo "ERROR: Please browse for a file before clicking the upload button.";
        exit();
    }

    if($fileErrorMsg > 0){
        switch($fileErrorMsg){
            case 1: echo "上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值 --- ".$fileName;break;
            case 2: echo "上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值 --- ".$fileName;break;
            case 3: echo "文件只有部分被上传 --- ".$fileName;break;
            case 4: echo "没有文件被上传 --- ".$fileName;break;
            case 6: echo "找不到临时文件夹 --- ".$fileName;break;
            case 7: echo "文件写入失败 --- ".$fileName;break;
        }
    }

    $tail=substr(strrchr($fileName, '.'), 1);
    $targetFile = guid().".".$tail;

    if (DIRECTORY_SEPARATOR == "\\") { //windows os
        $DIR = iconv('utf-8', 'gbk', $PICTURES.$FOLDER);
    }else{
        $DIR = $VIDEO.$FOLDER;
    }

    if(!is_dir($DIR)) {
        mkdir($DIR, 0777, true);
    }

    $targetPath = $DIR."/".$targetFile;

    if(move_uploaded_file($fileTmpLoc, $targetPath)){
        $query = "select d_id from description where title='".$title."' and description='".$description."'";
        echo $query;
        $result = mysqli_query($link,$query);
        if(mysqli_num_rows($result)>0){
            $desc_id = mysqli_fetch_row($result)[0];
        }else{
            $query = "insert into description (title,description) VALUES ('$title','$description')";
            echo "<br>".$query."<br>";
            mysqli_query($link,$query);
            $query = "select d_id from description ORDER by d_id desc limit 1";
            $desc_id = mysqli_fetch_row(mysqli_query($link,$query))[0];
        }

        $query = "insert into videos (name,a_name,date,folder,desc_id) VALUES ('$title','$targetFile','$date','$FOLDER',$desc_id)";
        if(mysqli_query($link,$query)){
            echo $fileName." --- Upload Complete!<br>";
        }
    } else {
        echo "move_uploaded_file function failed";
    }

    return;
}


for($i=0;$i<count($_FILES["pictures"]["name"]);$i++){
    $fileName = $_FILES["pictures"]["name"][$i]; // The file name
    $fileTmpLoc = $_FILES["pictures"]["tmp_name"][$i]; // File in the PHP tmp folder
    $fileType = $_FILES["pictures"]["type"][$i]; // The type of file it is
    $fileSize = $_FILES["pictures"]["size"][$i]; // File size in bytes
    $fileErrorMsg = $_FILES["pictures"]["error"][$i]; // 0 for false... and 1 for true

    if($fileType == "image/jpeg"){
        image_fix_orientation($fileTmpLoc);
    }

    $tempTitle = str_replace(".","_","TITLE".$fileName);
    $tempTitle = str_replace(" ","",$tempTitle);
    $tempDate = str_replace(".","_","DATE".$fileName);
    $tempDate = str_replace(" ","",$tempDate);
    $tempDesc = str_replace(".","_","DESC".$fileName);
    $tempDesc = str_replace(" ","",$tempDesc);

    $title = $_POST["$tempTitle"];
    $description = $_POST["$tempDesc"];
    $date = $_POST["$tempDate"];

    if (!$fileTmpLoc) { // if file not chosen
        echo "ERROR: Please browse for a file before clicking the upload button.";
        exit();
    }

    if($fileErrorMsg > 0){
        switch($fileErrorMsg){
            case 1: echo "上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值 --- ".$fileName;break;
            case 2: echo "上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值 --- ".$fileName;break;
            case 3: echo "文件只有部分被上传 --- ".$fileName;break;
            case 4: echo "没有文件被上传 --- ".$fileName;break;
            case 6: echo "找不到临时文件夹 --- ".$fileName;break;
            case 7: echo "文件写入失败 --- ".$fileName;break;
        }
        continue;
    }

    $tail=substr(strrchr($fileName, '.'), 1);
    $targetFile = guid().".".$tail;

    if (DIRECTORY_SEPARATOR == "\\") { //windows os
        $DIR = iconv('utf-8', 'gbk', $PICTURES.$FOLDER);
    }else{
        $DIR = $PICTURES.$FOLDER;
    }

    if(!is_dir($DIR)) {
        mkdir($DIR, 0777, true);
    }
    if(!is_dir($DIR."/thumb")) {
        mkdir($DIR."/thumb", 0777, true);
    }

    $targetPath = $DIR."/".$targetFile;
    $targetSmallPath = $DIR."/thumb/".$targetFile;
    if(move_uploaded_file($fileTmpLoc, $targetPath)){

        $resizeimage=new resizeimage($targetPath,500,0,0,$targetSmallPath);

        $size = getimagesize($targetPath);
        $height = $size[1];
        $width = $size[0];
//        echo $height."*".$width."<br>";

        //record values into database
        $query = "select d_id from description where title='".$title."' and description='".$description."'";
        echo $query;
        $result = mysqli_query($link,$query);
        if(mysqli_num_rows($result)>0){
            $desc_id = mysqli_fetch_row($result)[0];
        }else{
            $query = "insert into description (title,description) VALUES ('$title','$description')";
            echo "<br>".$query."<br>";
            mysqli_query($link,$query);
            $query = "select d_id from description ORDER by d_id desc limit 1";
            $desc_id = mysqli_fetch_row(mysqli_query($link,$query))[0];
        }

        $query = "insert into pictures (name,date,width,height,folder,desc_id) VALUES ('$targetFile','$date',$width,$height,'$FOLDER',$desc_id)";
        if(mysqli_query($link,$query)){
            echo $fileName." --- Upload Complete!<br>";
        }
    } else {
        echo "move_uploaded_file function failed";
    }
}
mysqli_close($link);

function guid(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = chr(123)// "{"
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
            .chr(125);// "}"
        return $uuid;
    }
}

