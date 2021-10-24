<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $tblname = "spp";
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(11) NOT NULL,                
                    `desc` varchar(40) DEFAULT NULL
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    $spp = [];
                    $spp[0] = ['id' => 0, 'desc' => "Не назначено"];                    
                    $spp[1] = ['id' => 1, 'desc' => "O-A-3867-AB-461"];
                    $spp[2] = ['id' => 2, 'desc' => "O-A-3867-XP-178"];
                    $spp[3] = ['id' => 3, 'desc' => "O-A-3867-XY-535"];
                    $spp[4] = ['id' => 4, 'desc' => "O-A-3867-ZV-127"];
                    $spp[5] = ['id' => 5, 'desc' => "O-A-3867-OP-256"];
                    $spp[6] = ['id' => 6, 'desc' => "O-A-3867-PP-323"];                    

                    for($i = 0; $i < count($spp); $i++){
                        $sql = "INSERT INTO `".$tblname."` (`id`,`desc`) VALUES ('".($spp[$i]["id"])."','".($spp[$i]["desc"])."')";
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