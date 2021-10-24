<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    $tblname = "hist_main";
    $points = 450; // 1 point / 10 minutes
    $curtime = new DateTime();
    $lastdate = $curtime->format('Y-m-d H:i:s');
    $firstdate = date('Y-m-d H:i:s', strtotime('-'.($points*10).' minutes'));
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $sql = "select count(`id`) from `param`";
            $res = $mysqli->query($sql);
            if($res){
                $rec_id = $res->fetch_row();
                $res->close();
                $tanksCount = intval($rec_id[0]);                
            }
            else{
                $mysqli->close();
                die("mysql error: can't get count of tanks from `param` table".PHP_EOL);
            }
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `id_rez` mediumint(9) NOT NULL,
                    `temp` float DEFAULT NULL,
                    `prod_lev` double DEFAULT NULL,
                    `prod_vol` double DEFAULT NULL,
                    `water_lev` double DEFAULT NULL,
                    `water_vol` double DEFAULT NULL,
                    `potential_deliver` mediumint(9) DEFAULT NULL,
                    `tank_status` varchar(2) DEFAULT NULL,
                    `low_prod_al` tinyint(1) NOT NULL DEFAULT '0',
                    `hi_water_al` tinyint(1) NOT NULL DEFAULT '0',
                    `hi_prod_al` tinyint(1) NOT NULL DEFAULT '0',
                    `date_lev` datetime NOT NULL,
                    `density` double DEFAULT NULL,
                    `density_base` double DEFAULT NULL,
                    `density_aver` double DEFAULT NULL,
                    `density_base_aver` double DEFAULT NULL,
                    `date_dens` datetime NOT NULL,
                    `date` datetime NOT NULL,
                    `delta` double DEFAULT NULL,
                    `denscalc` float DEFAULT NULL,
                    `vol15` double DEFAULT '0',
                    `dens15` double DEFAULT NULL,
                    `mass` double DEFAULT '0',
                    `sts_deliver` tinyint(1) DEFAULT '0',
                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`),
                    INDEX(`date`),
                    INDEX(`id_rez`)
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

                $res = $mysqli->query($sql); 
                $totalrows = 0;
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    $bgtank= [ 'capacity' => 600000, 'height' => 10000];
                    $smtank = [ 'capacity' => 25000, 'height' => 2000];
                    for($i = 0; $i < $points; $i++){
                        $sampledate = $firstdate;
                        for($j = 1; $j <= $tanksCount; $j++){
                            $recdate = date('Y-m-d H:i:s', strtotime($sampledate.'+'.intval($j*2).' seconds'));
                            $totalrows ++;
                            $dens = mt_rand(8250,8349)*0.1;
                            $prod_vol = ($j <= 3) ? (mt_rand(400000,500000)) : (mt_rand(18000,22000)); // l
                            $prod_lev = ($j <= 3) ? round((($prod_vol / $bgtank['capacity']))*$bgtank['height'],1) : round((($prod_vol / $smtank['capacity']))*$smtank['height'],1) ; // cm
                            $prod_temp = round((mt_rand(140,160)*0.1),1); // °C
                            $temp_coef = ($prod_temp < 15.0) ? (1 + (15.0 - $prod_temp)*0.03) : (1 - ($prod_temp - 15.0)*0.03);
                            $prod_vol15 = round($prod_vol / $temp_coef,1);
                            $dens15 = round($dens * $temp_coef,1);
                            $mass = round($prod_vol * $dens * 0.001,1);
                            $sql = "INSERT INTO `".$tblname."` 
                            (`id_rez`, `temp`, `prod_lev`, `prod_vol`,
                            `water_lev`, `water_vol`, `potential_deliver`, `tank_status`, `low_prod_al`, `hi_water_al`, `hi_prod_al`, `date_lev`,
                            `density`, `density_base`, `density_aver`, `density_base_aver`, `date_dens`, `date`,
                            `delta`, `denscalc`, `vol15`, `dens15`, `mass`, `sts_deliver`) VALUES 
                            ('".$j."','".$prod_temp."','".$prod_lev."','".$prod_vol."',
                            0, 0, -1, '0', 0, 0, 0, '".$recdate."',
                            '".$dens."','".($dens-(mt_rand(15,20)*0.1))."', '".($dens-(mt_rand(17,19)*0.1))."', '".($dens-(mt_rand(17,19)*0.1))."','".$recdate."','".$recdate."',
                            '0.0','".($dens-(mt_rand(19,21)*0.1))."', '".$prod_vol15."', '".$dens15."','".$mass."',0)";
                            $res = $mysqli->query($sql);
                            if(!$res){
                                $mysqli->close();
                                die("mysql error: can't seed table `".$tblname."` at row ".$totalrows.PHP_EOL);
                            }
                        }
                        $firstdate = date('Y-m-d H:i:s', strtotime($sampledate.'+'.intval(10).' minutes'));
                    }
                    if($res){
                        echo "success : table `".$tblname."` has been seeded. inserted ".$totalrows.' records'.PHP_EOL;
                    }
                    if(!$res){
                        $mysqli->close();
                        die("mysql error: can't seed table `".$tblname."`".PHP_EOL);
                    }
                    for($j = 1; $j <= $tanksCount; $j++){
                        $sql = "update `cur` set 
                        `temp` = round((select `temp` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),1),
                        `prod_lev` = (select `prod_lev` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),
                        `prod_vol` = (select `prod_vol` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),
                        `vol15` = (select `vol15` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),
                        `date` = (select `date` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),
                        `dateupdt` = (select `date_lev` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),   
                        `date_dens` = (select `date_dens` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1),                                             
                        `dens15` = (select `dens15` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1), 
                        `mass` = (select `mass` from `hist_main` where `id_rez`='".$j."' order by id desc limit 1) where `id`='".$j."'";
                        $res = $mysqli->query($sql);
                        if(!$res){
                            $mysqli->close();
                            die("mysql error: can't seed table `".$tblname."` at row ".$totalrows.PHP_EOL);
                        }
                    }
                    if($res){
                        echo "success : table `cur` has been updated with last values.".PHP_EOL;
                    }
                    if(!$res){
                        $mysqli->close();
                        die("mysql error: can't update table `cur` with last values".PHP_EOL);
                    }                    
                }
                else{
                    $mysqli->close();
                    die("mysql error: can't create table `".$tblname."` before seed".PHP_EOL);
                }
            }
            else{
                $mysqli->close();
                die("mysql error: can't delete table `".$tblname."` before seed".PHP_EOL);
            }
            $mysqli->close();
            die('end of dbseed script');
        }
    } catch(mysqli_sql_exception $e){
        echo var_dump($e);
    }

    function getSqlAssocData($res){
        $ret = [];
        while($data = $res->fetch_assoc()){
            foreach($data as $key => $keyval){
                $temp[$key] = $keyval;
            }
            array_push($ret, $temp);
        }
        return $ret;
    }


?>