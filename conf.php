<?php
$DBHOST = "localhost";
$DBUSER = "root";
$DBPASS = "liu000806";
$DB	= "CloudGallery";
function CONNECT(){
        global $DBHOST, $DBUSER, $DBPASS, $DB;
        $link = @mysqli_connect($DBHOST, $DBUSER, $DBPASS, $DB);
        if(!$link){
                echo "FAILURE";
                die("Connect Failure%s \n".mysqli_connect_error());
                exit;
        }
        mysqli_select_db($link,$DB);
        if (!mysqli_set_charset($link, "utf8")) {
                printf("Error loading character set utf8: %s\n", mysqli_error($link));
        }
        return $link;
}

$PICTURES = "./Upload/Pictures/";
$VIDEO = "./Upload/Video/";

function image_fix_orientation($filename) {
        $exif = exif_read_data($filename);
        if (!empty($exif['Orientation'])) {
                $image = imagecreatefromjpeg($filename);
                switch ($exif['Orientation']) {
                        case 3:
                                $image = imagerotate($image, 180, 0);
                                break;

                        case 6:
                                $image = imagerotate($image, -90, 0);
                                break;

                        case 8:
                                $image = imagerotate($image, 90, 0);
                                break;
                }

                imagejpeg($image, $filename, 90);
        }
}