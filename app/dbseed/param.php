<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    $tblname = "param";
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $tanknames = ['R22','R23','R24','R11','R12','R92','R16','R2','R4','R5','RGS25O','RGS25P'];
            $tanktitles = [
                'Резервуар №22','Резервуар №23','Резервуар №24','Резервуар №11','Резервуар №12','Резервуар №92','Резервуар №16','Резервуар №2','Резервуар №4','Резервуар №5','Резервуар РГС25 Oтвальн','Резервуар РГС25 Промышл'
            ];
            $shorttitles = ['22','23','24','11','12','92','16','P2','P4','P5','25','25'];            
            $prodtypes = ['1','1','1','2','2','3','3','2','1','1','1','1'];
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(11) NOT NULL,
                    `web_name` varchar(10) NOT NULL, 
                    `fulltitle` varchar(40) NOT NULL,
                    `shorttitle` varchar(5) NOT NULL,                                 
                    `serial_number` int(11) NOT NULL,
                    `tank_name` varchar(11) DEFAULT NULL,
                    `groupe` int(11) NOT NULL,
                    `fueltype` int(5) DEFAULT NULL,
                    `tank_shape` varchar(16) DEFAULT NULL,
                    `dished_end_r` float DEFAULT NULL,
                    `colour` varchar(8) DEFAULT NULL,
                    `tank_diametr` float NOT NULL DEFAULT '0',
                    `capacity` float DEFAULT '0',
                    `work_cap` float DEFAULT '0',
                    `prod_offset` float DEFAULT '0',
                    `water_offset` float DEFAULT '0',
                    `lift_off` float DEFAULT '0',
                    `delivery_timer` int(11) DEFAULT '0',
                    `density` float DEFAULT '0',
                    `temp` float DEFAULT '0',
                    `d_dens` float DEFAULT '0',
                    `min_lev` int(11) DEFAULT '0',
                    `type_rez` varchar(45) DEFAULT NULL,
                    `product_high_high` float DEFAULT NULL,
                    `product_high` float DEFAULT NULL,
                    `product_low` float DEFAULT NULL,
                    `product_low_low` float DEFAULT NULL,
                    `water_high_high` float DEFAULT NULL,
                    `water_high` float DEFAULT NULL,
                    `high_temperature` float DEFAULT NULL,
                    `low_temperature` float DEFAULT NULL,
                    `delivery_start_threshold` float DEFAULT NULL,
                    `delivery_end_threshold` float DEFAULT NULL,
                    `standard_theft_detection` float DEFAULT NULL,
                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`)  
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    $bgtank= [ 'capacity' => 600000, 'height' => 10000];
                    $smtank = [ 'capacity' => 25000, 'height' => 2000];
                    for($i = 0; $i < count($tanknames); $i++){
                        $tank_diametr = ($i<3) ? $bgtank['height'] : $smtank['height'];
                        $capacity = ($i<3) ? $bgtank['capacity'] : $smtank['capacity'];
                        $product_high_high = 250;
                        $product_high = 230;
                        $product_low = 30;
                        $product_low_low = 20;   
                        $water_high_high = 2;
                        $water_high = 1;
                        $high_temperature = 30;
                        $low_temperature = 5;
                        $delivery_start_threshold = 1;
                        $delivery_end_threshold = 1;
                        $standard_theft_detection = 1;
                        $sql = "INSERT INTO `".$tblname."` 
                        (`id`,`web_name`,`fulltitle`,`shorttitle`,`serial_number`, `tank_name`, `groupe`, `fueltype`,
                        `tank_shape`, `dished_end_r`, `colour`, `tank_diametr`, `capacity`, `work_cap`,
                        `prod_offset`, `water_offset`, `lift_off`, `delivery_timer`, `density`, `temp`,`d_dens`,
                        `min_lev`, `type_rez`, `product_high_high`, `product_high`, `product_low`, `product_low_low`, `water_high_high`, `water_high`,
                        `high_temperature`, `low_temperature`, `delivery_start_threshold`, `delivery_end_threshold`, `standard_theft_detection`) VALUES 
                        ('".($i+1)."','".$tanknames[$i]."','".$tanktitles[$i]."','".$shorttitles[$i]."','".($i+1)."','".($i+1)."','1','".$prodtypes[$i]."',
                        NULL, NULL, NULL, '".$tank_diametr."', '".$capacity."', 0, 
                        0, 0, 0, 0, 0, 0, 0,
                        0,'','".$product_high_high."', '".$product_high."', '".$product_low."', '".$product_low_low."', '".$water_high_high."', '".$water_high."',
                        '".$high_temperature."','".$low_temperature."','".$delivery_start_threshold."','".$delivery_end_threshold."','".$standard_theft_detection."')";
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