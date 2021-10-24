<?php

    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    $tblname = "naliv_plc";
    $points = 120; // 1 point / 10 minutes
    $curtime = new DateTime();
    $lastdate = $curtime->format('Y-m-d H:i:s');
    $firstdate = date('Y-m-d H:i:s', strtotime('-'.($points).' hours'));
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $meters = 0;
            $destinations = 0;
            $transports = 0;

            $sql = "select count(`id`) from `meters`";
            $res = $mysqli->query($sql);
            if($res){
                $rec_id = $res->fetch_row();
                $res->close();
                $meters = intval($rec_id[0]);                
            }
            else{
                $mysqli->close();
                die("mysql error: can't get count from `meters` table".PHP_EOL);
            }

            $sql = "select count(`id`) from `transports`";
            $res = $mysqli->query($sql);            
            if($res){
                $rec_id = $res->fetch_row();
                $res->close();
                $transports = intval($rec_id[0]);                
            }
            else{
                $mysqli->close();
                die("mysql error: can't get count from `transports` table".PHP_EOL);
            }
            
            $sql = "select count(`id`) from `destinations`";
            $res = $mysqli->query($sql);            
            if($res){
                $rec_id = $res->fetch_row();
                $res->close();
                $destinations = intval($rec_id[0]);                
            }
            else{
                $mysqli->close();
                die("mysql error: can't get count from `destinations` table".PHP_EOL);
            }            

            if($meters == 0 || $destinations == 0 || $transports == 0){
                die("mysql error: can't get count of tables".PHP_EOL);                
            }


            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){

                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                        `id` int(11) NOT NULL AUTO_INCREMENT,
                        `id_z` int(11) DEFAULT NULL,
                        `z_volume` double DEFAULT NULL,
                        `f_volume` double DEFAULT NULL,
                        `temp` decimal(6,2) DEFAULT NULL,
                        `dens` decimal(6,2) DEFAULT NULL,
                        `date_start` datetime DEFAULT NULL,
                        `date_end` datetime DEFAULT NULL,
                        `closed` datetime DEFAULT NULL,                        
                        `f_mass` double DEFAULT NULL,
                        `counter` double DEFAULT NULL,
                        `countermass` double DEFAULT NULL,                        
                        `plc_n` smallint(6) DEFAULT NULL,
                        `destination` smallint(6) DEFAULT NULL,
                        `transport` int(10) DEFAULT NULL,
                        `pump` int(3) DEFAULT NULL, 
                        PRIMARY KEY (`id`),
                        unique key `id_UNIQUE` (`id`),
                        INDEX(`date_start`),
                        INDEX(`date_end`),
                        INDEX(`plc_n`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

                $res = $mysqli->query($sql); 
                $counter = [];
                $countermass = [];
                for($i = 0; $i < $meters; $i++){
                    $counter[$i] = 1200;
                    $countermass[$i] = 1000;
                }             
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    $id_z = 0;
                    $pump = 0;
                    for($i = 0; $i < $points; $i++){
                        $recdate = $firstdate;
                        for($j = 1; $j <= $meters; $j++){
                            $id_z ++;
                            $z_volume = mt_rand(10,100);
                            $f_volume = $z_volume - mt_rand(0,10)*0.1;
                            $counter[$j-1] += $f_volume;
                            if($j == 1){
                                $temp = (mt_rand(140,160)*0.1); // °C
                                $dens = mt_rand(8250,8349)*0.1;
                                $fmass = $f_volume * $dens * 0.001;
                                $countermass[$j-1] += $fmass; 
                                $pump = mt_rand(9,10);
                            }
                            else{
                                $temp = -1.0; // °C
                                $dens = -1.0;
                                $fmass = -1.0; 
                                $countermass[$j-1] = -1;
                                $pump = 0;                        
                            }
                            $datestart = date('Y-m-d H:i:s', strtotime($recdate.'+'.intval($j).' minutes'));
                            $dateend = date('Y-m-d H:i:s', strtotime($datestart.'+'.intval(mt_rand(2,10)).' minutes'));
                            $dateclosed = date('Y-m-d H:i:s', strtotime($dateend.'+'.intval(mt_rand(2,120)).' seconds'));
                            $plc_n = $j;
                            $destination = $id_z % $destinations + 1;
                            $transport = $id_z % $transports + 1;
                            $sql = "INSERT INTO `".$tblname."` 
                            (`id_z`, `z_volume`, `f_volume`, `temp`,`dens`,`date_start`,`date_end`,`closed`,
                            `f_mass`, `counter`, `countermass`, `plc_n`, `destination`, `transport`,`pump`) VALUES 
                            ('".$id_z."','".$z_volume."','".$f_volume."','".$temp."','".$dens."','".$datestart."','".$dateend."','".$dateclosed."',
                            '".$fmass."','".$counter[$j-1]."','".$countermass[$j-1]."','".$plc_n."','".$destination."','".$transport."','".$pump."')";
                            $res = $mysqli->query($sql);
                            if(!$res){
                                $mysqli->close();
                                echo $sql.PHP_EOL;
                                die("mysql error: can't seed table `".$tblname."` at row ".$id_z.PHP_EOL);
                            }
                        }
                        $firstdate = date('Y-m-d H:i:s', strtotime($recdate.'+'.intval(1).' hours'));
                    }
                    if($res){
                        echo "success : table `".$tblname."` has been seeded. inserted ".$id_z.' records'.PHP_EOL;
                    }
                    if(!$res){
                        $mysqli->close();
                        die("mysql error: can't seed table `".$tblname."`".PHP_EOL);
                    }
                    for($j = 1; $j <= $meters; $j++){
                        $sql = "update `meters` set 
                        `temp` = round((select `temp` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1),1),
                        `dens` = (select `dens` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1),
                        `vol` = (select `f_volume` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1),
                        `mass` = (select `f_mass` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1), 
                        `trans` = (select `transport` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1),
                        `sumvol` = (select `counter` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1),                        
                        `summass` = (select `countermass` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1),  
                        `lastdate` = (select `date_end` from `naliv_plc` where `plc_n`='".$j."' order by id desc limit 1) where `id`='".$j."'";
                        $res = $mysqli->query($sql);
                        if(!$res){
                            $mysqli->close();
                            echo $sql.PHP_EOL;
                            die("mysql error: can't seed table `".$tblname."` at row ".$id_z.PHP_EOL);
                        }
                    }
                    if($res){
                        echo "success : table `meters` has been updated with last values".PHP_EOL;
                    }
                    if(!$res){
                        $mysqli->close();
                        die("mysql error: can't updated table `meters` with last values".PHP_EOL);
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