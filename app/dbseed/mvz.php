<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "" ];
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $tblname = "mvz";
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
                    $mvz = [];
                    $mvz[0] = ['id' => 0, 'desc' => "Не назначено"];                    
                    $mvz[1] = ['id' => 38020501, 'desc' => "Грузовой транспорт"];
                    $mvz[2] = ['id' => 38020502, 'desc' => "Специальный транспорт"];
                    $mvz[3] = ['id' => 38020503, 'desc' => "Пассажирский транспорт (автоб)"];
                    $mvz[4] = ['id' => 38020504, 'desc' => "Легковой транспорт"];
                    $mvz[5] = ['id' => 38020505, 'desc' => "Фонд госимущества"];
                    $mvz[6] = ['id' => 38020506, 'desc' => "Общецеховые расходы"];                    

                    for($i = 0; $i < count($mvz); $i++){
                        $sql = "INSERT INTO `".$tblname."` (`id`,`desc`) VALUES ('".($mvz[$i]["id"])."','".($mvz[$i]["desc"])."')";
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