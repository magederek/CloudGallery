<?php
/**
 * Created by PhpStorm.
 * User: liuzh
 * Date: 2016/1/18
 * Time: 14:31
 */

header("Content-Type:application/json;charset=utf-8");

require_once ("conf.php");
$link = CONNECT();

if(isset($_POST["deleteFolder"])){
    $folder = $_POST["deleteFolder"];

    if($folder == "delete"){
        echo json_encode("Please select a folder");
        return;
    }

    $sql = "delete from pictures where folder='$folder'";
//    echo $sql;
    $result = mysqli_query($link,$sql);

    $DIR = $PICTURES.$folder."/thumb";
    if (DIRECTORY_SEPARATOR == "\\") { //windows os
        $DIR = iconv('utf-8', 'gbk', $DIR);
    }

    $dh=opendir($DIR);
    while ($file=readdir($dh)) {
        if($file!="." && $file!="..") {
            $fullpath=$DIR."/".$file;
            unlink($fullpath);
        }
    }
    closedir($dh);
    //删除thumb文件夹：
    rmdir($DIR);


    $DIR = $PICTURES.$folder;
    if (DIRECTORY_SEPARATOR == "\\") { //windows os
        $DIR = iconv('utf-8', 'gbk', $DIR);
    }

    $dh=opendir($DIR);
    while ($file=readdir($dh)) {
        if($file!="." && $file!="..") {
            $fullpath=$DIR."/".$file;
            unlink($fullpath);
        }
    }

    closedir($dh);
    //删除当前文件夹：
    if(rmdir($DIR)) {
        echo json_encode("Delect Success!");
        return true;
    } else {
        echo json_encode("Delect folder failed!");
        return false;
    }
}

if(isset($_POST["deleteVFolder"])){
    $folder = $_POST["deleteVFolder"];

    if($folder == "delete"){
        echo json_encode("Please select a folder");
        return;
    }

    $sql = "delete from videos where folder='$folder'";
//    echo $sql;
    $result = mysqli_query($link,$sql);

    $DIR = $VIDEO.$folder;
    if (DIRECTORY_SEPARATOR == "\\") { //windows os
        $DIR = iconv('utf-8', 'gbk', $DIR);
    }

    $dh=opendir($DIR);
    while ($file=readdir($dh)) {
        if($file!="." && $file!="..") {
            $fullpath=$DIR."/".$file;
            unlink($fullpath);
        }
    }

    closedir($dh);
    //删除当前文件夹：
    if(rmdir($DIR)) {
        echo json_encode("Delect Success!");
        return true;
    } else {
        echo json_encode("Delect folder failed!");
        return false;
    }
}

if(isset($_POST["deletePicID"])){
    $sql = "select folder,name from pictures where p_id=".$_POST["deletePicID"];
    $result = mysqli_query($link,$sql);
    $row = mysqli_fetch_row($result);

    $DIR = $PICTURES.$row[0];
    if (DIRECTORY_SEPARATOR == "\\") { //windows os
        $DIR = iconv('utf-8', 'gbk', $DIR);
    }
    $fullpath=$DIR."/".$row[1];
    if(unlink($fullpath)){
        $sql = "delete from pictures where p_id=".$_POST["deletePicID"];
        $result = mysqli_query($link,$sql);

        if($result) {
            echo json_encode("delete success!");
        }else
            echo json_encode("delete fail!");
    }else
        echo json_encode("delete fail!");

    return;
}

if(isset($_POST["revisePicTitle"]) && isset($_POST["revisePicDesc"]) && isset($_POST["revisePicID"])){
    $sql = "insert into description (title, description) VALUES (\"".$_POST["revisePicTitle"]."\",\"".$_POST["revisePicDesc"]."\")";
//    echo $_POST["revisePicTitle"];
    $result = mysqli_query($link,$sql);

    $sql = "select d_id from description order by d_id desc limit 1";
    $result = mysqli_query($link,$sql);
    $row = mysqli_fetch_assoc($result);
    $newID = $row['d_id'];
//    echo "2 ".$sql." ".$newID;

    $sql = "update pictures set desc_id = ".$newID." where p_id=".$_POST["revisePicID"];
    $result = mysqli_query($link,$sql);
//    echo "3 ".$sql;

    echo json_encode("Update Success!");
    return;
}

if($_GET['TYPE'] == "image"){
    $folder = $_GET['folder'];
    $sql = "select * from pictures LEFT JOIN description on pictures.desc_id=description.d_id where pictures.folder='$folder' order by pictures.p_id";
    $result = mysqli_query($link,$sql);
    while($row = mysqli_fetch_assoc($result)){
        $IMAGE[] = array($row["name"],$row["height"],$row["width"],$row["date"],$row["title"],$row["description"],$row["p_id"],$row["desc_id"]);
    }
    if(!isset($IMAGE)) {
        echo json_encode("No Image");
    }else
        echo json_encode($IMAGE);
}elseif($_GET['TYPE'] == "folder") {
    $sql = "SELECT DISTINCT folder from pictures ORDER BY folder";
    $result = mysqli_query($link,$sql);
    while($row = mysqli_fetch_assoc($result)){
        $FOLDER[] = $row['folder'];
    }
    if(!isset($FOLDER)){
        echo json_encode("No Folder");
    }else
        echo json_encode($FOLDER);
}elseif($_GET['TYPE'] == "vfolder") {
    $sql = "SELECT DISTINCT folder from videos ORDER BY folder";
    $result = mysqli_query($link,$sql);
    while($row = mysqli_fetch_assoc($result)){
        $FOLDER[] = $row['folder'];
    }
    if(!isset($FOLDER)){
        echo json_encode("No Folder");
    }else
        echo json_encode($FOLDER);
}elseif($_GET['TYPE'] == "video") {
    $folder = $_GET['folder'];
    $sql = "select * from videos LEFT JOIN description on desc_id=d_id where folder='$folder' order by v_id";
    $result = mysqli_query($link,$sql);
    while($row = mysqli_fetch_assoc($result)){
        $VIDEOS[] = array($row["name"],$row["a_name"],$row["date"],$row["description"],$row["v_id"]);
    }
    if(!isset($VIDEOS)) {
        echo json_encode("No Video");
    }else
        echo json_encode($VIDEOS);
}elseif($_GET['TYPE'] == "login"){
    $username = $_POST['Username'];
    $password = $_POST['Password'];
    
    $sql = "select * from user where username='$username'";
    $result = mysqli_query($link,$sql);
    while($row = mysqli_fetch_assoc($result)){
        $USER = array($row["username"],$row["password"]);
    }
    if(!isset($USER)){
        echo json_encode("No Username");
    }elseif ($USER[1] == $password){
        echo json_encode("Login Success");
    }else{
        echo json_encode("Not Match");
    }
}

?>