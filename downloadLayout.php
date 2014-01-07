<?php

$layoutName  = $_POST['layoutName'];
$htmlContent = $_POST['htmlContent'];

$layoutDir = 'http://pearledit.aws.af.cm/public/views/layouts/' . $layoutName;

$zipFileName = 'PearlEdit-' . $layoutName . '.zip';
$decompressedFolderName = 'PearlEdit-' . $layoutName;

$zip = new ZipArchive();

$zip->open($zipFileName, ZipArchive::CREATE);

if($zip)
{
	// Add index.html
	$zip->addFromString('index.html', $htmlContent);

	// Add CSS Folder
	$cssContent = file_get_contents($layoutDir . '/css/default.css', false);
	$zip->addFromString('css/default.css', $cssContent);

	// Add IMG Folder

} else {
	echo 'Could not create zip';
}

$zip->close();

header('Content-Type: application/octet-type');
header('Content-Disposition: attachment; filename=PearlEdit-' . $layoutName . '.zip');
header('Content-Length: ' . filesize($zipFileName)); 

ob_clean();
flush();
echo file_get_contents($zipFileName);
exit;

?>
