<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    $tblname = "meters";
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $firstdate = date('Y-m-d H:i:s');
            $meters = [];
            $meters[0] = [
                'id' => 'F1',
                'fulltitle' => 'Узел учета F1 (Optimass)',
                'vol' => 555.5,
                'mass' => 501.7,                
                'sumvol' => 8765432.1,
                'summass' => 1234567.8,
                'temp' => 20.8,
                'dens' => 909.4,
                'dailyvol' => 95692.4, 
                'dailymass' => 92345.4, 
                'trans' => 1,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-60 minutes'))
            ];
            $meters[1] = [
                'id' => 'F2',
                'fulltitle' => 'Узел учета F2 (Имп. ППВ-100)',                
                'vol' => 780.5,
                'mass' => -1,
                'sumvol' => 858935.4,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 15692.4, 
                'dailymass' => -1,                 
                'trans' => 2,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-65 minutes'))
            ];
            $meters[2] = [
                'id' => 'colNova',
                'fulltitle' => 'Автозапр. колонка NOVA 2101', 
                'vol' => 450.8,
                'mass' => -1,                
                'sumvol' => 942351.5,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 7894.1, 
                'dailymass' => -1,         
                'trans' => 3,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-70 minutes'))
            ]; 
            $meters[3] = [
                'id' => 'colR2',
                'fulltitle' => 'Автозапр. колонка АБП-2', 
                'vol' => 55.0,
                'mass' => -1,                
                'sumvol' => 182975.0,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 2154.4, 
                'dailymass' => -1,         
                'trans' => 4,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-12 minutes'))
            ]; 
            $meters[4] = [
                'id' => 'colR4',
                'fulltitle' => 'Автозапр. колонка АБП-4', 
                'vol' => 15.3,
                'mass' => -1,                
                'sumvol' => 2265448.2,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 3148.7, 
                'dailymass' => -1,         
                'trans' => 5,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-18 minutes'))
            ];
            $meters[5] = [
                'id' => 'colR5',
                'fulltitle' => 'Автозапр. колонка АБП-5', 
                'vol' => 28.5,
                'mass' => -1,                
                'sumvol' => 34789810.4,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 56471.2, 
                'dailymass' => -1,         
                'trans' => 6,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-22 minutes'))
            ];
            $meters[6] = [
                'id' => 'FOtv',
                'fulltitle' => 'Заправ. пост ЖДЦ "Отвальная"', 
                'vol' => 132.7,
                'mass' => -1,                
                'sumvol' => 498713654.4,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 48791.3, 
                'dailymass' => -1,         
                'trans' => 7,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-21 minutes'))
            ];
            $meters[7] = [
                'id' => 'FProm',
                'fulltitle' => 'Заправ. пост ЖДЦ "Промышленная"', 
                'vol' => 95.2,
                'mass' => -1,                
                'sumvol' => 56782523.4,
                'summass' => -1,
                'temp' => -1,
                'dens' => -1,
                'dailyvol' => 854547.1, 
                'dailymass' => -1,         
                'trans' => 1,       
                'date' => date('Y-m-d H:i:s', strtotime($firstdate.'-32 minutes'))
            ];
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(5) NOT NULL auto_increment,
                    `web_name` varchar(10) NOT NULL,
                    `title` varchar(40) DEFAULT NULL,
                    `fueltype` int(5) DEFAULT NULL,                    
                    `vol` decimal(6,2) DEFAULT NULL,
                    `mass` decimal(6,2) DEFAULT NULL,
                    `sumvol` decimal(14,2) DEFAULT NULL,
                    `summass` decimal(14,2) DEFAULT NULL,
                    `temp` decimal(5,2) DEFAULT NULL,
                    `dens` decimal(6,2) DEFAULT NULL, 
                    `dailyvol` decimal(14,2) DEFAULT NULL,
                    `dailymass` decimal(14,2) DEFAULT NULL,
                    `trans` int(10) DEFAULT NULL,
                    `lastdate` datetime NOT NULL

                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    for($i = 0; $i < count($meters); $i++){
                        if($i == 1){
                            $ftype = '3';
                        }
                        elseif($i == 2 || $i == 3){
                            $ftype = '2';
                        }
                        else{
                            $ftype = '1';
                        }
                        $sql = "INSERT INTO `".$tblname."` 
                        (`web_name`,`title`,`fueltype`,`vol`,`mass`,`sumvol`,`summass`,`temp`,`dens`,`dailyvol`,`dailymass`,`trans`,`lastdate`) VALUES 
                        ('".$meters[$i]['id']."', '".$meters[$i]['fulltitle']."','".$ftype."','".$meters[$i]['vol']."','".$meters[$i]['mass']."','".$meters[$i]['sumvol']."','".$meters[$i]['summass']."',
                        '".$meters[$i]['temp']."','".$meters[$i]['dens']."','".$meters[$i]['dailyvol']."','".$meters[$i]['dailymass']."','".$meters[$i]['trans']."','".$meters[$i]['date']."')";
                        $res = $mysqli->query($sql);
                        if($res){
                            echo "success : inserted record at row ".($i+1).PHP_EOL;
                        }else{
                            $mysqli->close();
                            echo "mysql error: can't seed table `".$tblname."` at row ".($i+1).PHP_EOL;
                            die($sql);
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