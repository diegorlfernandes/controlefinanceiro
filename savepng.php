<?php
//create the parent folder
if (!is_dir('./Files/')) {
mkdir('./Files/');
}
//get the file name
$file = basename($_REQUEST['file']);
$file = 'Files/'. $file;
//get the file contents
$content = $_REQUEST['content'];
//clean the file contents
$content = str_replace('data:image/png;base64,', '', $content);
$content = str_replace('data:image/jpeg;base64,', '', $content);
$content = str_replace('data:image/gif;base64,', '', $content);
$content = str_replace(' ', '+', $content);
$content = base64_decode($content);
// save the file
$success = file_put_contents($file, $content);
echo $file;
?>
