<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    $tblname = "cur";
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
                    `id` int(11) NOT NULL,                
                    `temp` double DEFAULT NULL,
                    `prod_lev` double DEFAULT NULL,
                    `prod_vol` double DEFAULT NULL,
                    `water_lev` double DEFAULT NULL,
                    `water_vol` double DEFAULT NULL,
                    `potential_deliver` double DEFAULT NULL,
                    `tank_status` varchar(2) DEFAULT NULL,
                    `low_prod_al` tinyint(1) NOT NULL DEFAULT '0',
                    `hi_water_al` tinyint(1) NOT NULL DEFAULT '0',
                    `hi_prod_al` tinyint(1) NOT NULL DEFAULT '0',
                    `date` datetime NOT NULL,
                    `density` varchar(45) DEFAULT '0',
                    `density_base` varchar(45) DEFAULT '0',
                    `density_aver` varchar(45) DEFAULT '0',
                    `density_base_aver` varchar(45) DEFAULT '0',
                    `date_dens` datetime DEFAULT NULL,
                    `delta` double DEFAULT NULL,
                    `denscalc` float DEFAULT NULL,
                    `vol15` double DEFAULT '0',
                    `conect` tinyint(1) NOT NULL DEFAULT '0',
                    `dateupdt` datetime DEFAULT NULL,
                    `dens15` double DEFAULT NULL,
                    `mass` double DEFAULT NULL,
                    `sts_deliver` tinyint(1) DEFAULT '0'
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    $bgtank= [ 'capacity' => 600000, 'height' => 10000];
                    $smtank = [ 'capacity' => 25000, 'height' => 2000];
                    for($i = 0; $i < $tanksCount; $i++){
                        $dens = mt_rand(8250,8349)*0.1;
                        $prod_vol = ($i < 3) ? (mt_rand(100000,500000)) : (mt_rand(10000,22000)); // l
                        $prod_lev = ($i < 3) ? round((($prod_vol / $bgtank['capacity']))*$bgtank['height'],1) : round((($prod_vol / $smtank['capacity']))*$smtank['height'],1) ; // cm
                        $prod_temp = (mt_rand(100,180)*0.1); // °C
                        $temp_coef = ($prod_temp < 15.0) ? (1 + (15.0 - $prod_temp)*0.03) : (1 - ($prod_temp - 15.0)*0.03);
                        $prod_vol15 = round($prod_vol / $temp_coef,1);
                        $dens15 = round($dens * $temp_coef,1);
                        $mass = round($prod_vol * $dens * 0.001,1);
                        $sql = "INSERT INTO `".$tblname."` 
                        (`id`,`temp`,`prod_lev`,`prod_vol`,
                        `water_lev`,`water_vol`,`potential_deliver`,`tank_status`,`low_prod_al`,`hi_water_al`,`hi_prod_al`,`date`,
                        `density`,`density_base`,`density_aver`,`density_base_aver`,`date_dens`,
                        `delta`,`denscalc`,`vol15`,`conect`,`dateupdt`, `dens15`,`mass`,`sts_deliver`) VALUES 
                        ('".($i+1)."','".$prod_temp."','".$prod_lev."','".$prod_vol."',
                        0, 0, -1, '0', 0, 0, 0, now(),
                        '".$dens."','".($dens-(mt_rand(10,30)*0.1))."', '".($dens-(mt_rand(15,25)*0.1))."', '".($dens-(mt_rand(18,22)*0.1))."', now(),
                        '0.0','".($dens-(mt_rand(19,21)*0.1))."', '".$prod_vol15."', '1', now(), '".$dens15."','".$mass."',0)";
                        $res = $mysqli->query($sql);
                        if($res){
                            echo "success : inserted record at row ".($i+1).PHP_EOL;
                        }else{
                            $mysqli->close();
                            die("mysql error: can't seed table `".$tblname."` at row ".($i+1).PHP_EOL);
                        }
                    }
                    if(!$res){
                        $mysqli->close();
                        die("mysql error: can't seed table `".$tblname."`".PHP_EOL);
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
?>