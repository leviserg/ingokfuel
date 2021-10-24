<?php
    $fname = "public/images/localazs.svg";
    /*
    $fhandle = fopen($fname,"r");
    $content = fread($fhandle,filesize($fname));
    $content = str_replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '', $content);
    //$content = str_replace('width="100%"', 'width="1830"', $content);
    $content = str_replace('width="457"', 'width="100%"', $content);
    //$content = str_replace('height="800"', 'height="auto"', $content);
    $content = str_replace('height="800"', 'height="auto"', $content);    
    $fhandle = fopen($fname,"w");
    fwrite($fhandle,$content);
    fclose($fhandle);
    */
    require $fname;
?>