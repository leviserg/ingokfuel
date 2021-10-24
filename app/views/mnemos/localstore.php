<?php
    $fname = "public/images/localstore.svg";
    /*
    $fhandle = fopen($fname,"r");
    $content = fread($fhandle,filesize($fname));
    $content = str_replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '', $content);
    $content = str_replace('width="900"', 'width="100%"', $content);
    //$content = str_replace('width="98%"', 'width="100%"', $content);//915
    //$content = str_replace('height="800"', 'height="auto"', $content);
    $content = str_replace('height="780"', 'height="auto"', $content);    
    $fhandle = fopen($fname,"w");
    fwrite($fhandle,$content);
    fclose($fhandle);
    */
    require $fname;
?>