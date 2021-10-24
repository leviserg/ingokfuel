<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    $tblname = "fueltypes";
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{     
            $prodnames = ['ДТ','Бензин','Керосин'];
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `fueltype` varchar(10) NOT NULL, 
                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`)  
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    for($i = 0; $i < count($prodnames); $i++){
                        $sql = "INSERT INTO `".$tblname."` (`fueltype`) VALUES ('".$prodnames[$i]."')";
                        $res = $mysqli->query($sql);
                        if(!$res){
                            $mysqli->close();
                            die("mysql error: can't seed table `".$tblname."` at row ".($i+1).PHP_EOL);
                        }
                    }
                    if(!$res){
                        $mysqli->close();
                        die("mysql error: can't seed table `".$tblname."`".PHP_EOL);
                    }
                    else{
                        echo "success : table `".$tblname."` has been seeded".PHP_EOL;
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