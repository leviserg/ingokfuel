<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "root", 'pwd'  => "1111" ];
    $tblname = "pumps";
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $firstdate = date('Y-m-d H:i:s');
            $pumps = [
                ['web_name' => 'pump9', 'title' => 'Насос №9', 'status' => 0, 'lastdate' => date('Y-m-d H:i:s', strtotime($firstdate.'-11 minutes'))],
                ['web_name' => 'pump10', 'title' => 'Насос №10', 'status' => 4, 'lastdate' => date('Y-m-d H:i:s', strtotime($firstdate.'-22 minutes'))],
                ['web_name' => 'pumpker', 'title' => 'Насос керосина', 'status' => 1, 'lastdate' => date('Y-m-d H:i:s', strtotime($firstdate.'-33 minutes'))],
                ['web_name' => 'pumpotv', 'title' => 'Насос ДТ Отвальная', 'status' => 1, 'lastdate' => date('Y-m-d H:i:s', strtotime($firstdate.'-44 minutes'))],
                ['web_name' => 'pumpprom', 'title' => 'Насос ДТ Промышленная', 'status' => 0, 'lastdate' => date('Y-m-d H:i:s', strtotime($firstdate.'-55 minutes'))]
            ];
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(5) NOT NULL auto_increment,
                    `web_name` varchar(10) NOT NULL,
                    `title` varchar(40) DEFAULT NULL,
                    `status` int(5) DEFAULT '0',
                    `lastdate` datetime NOT NULL,
                    `command` int(5) DEFAULT '0',
                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    for($i = 0; $i < count($pumps); $i++){
                        $sql = "INSERT INTO `".$tblname."` 
                        (`web_name`,`title`, `status`, `lastdate`,`command`) VALUES 
                        ('".$pumps[$i]['web_name']."', '".$pumps[$i]['title']."','".$pumps[$i]['status']."','".$pumps[$i]['lastdate']."','0')";
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