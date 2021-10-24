<?php
    $db = [ 'host' => 'localhost', 'dbname' => 'ingokfuel', 'user' => "leviserg", 'pwd'  => "!Aaa111274pohtefdg" ];
    $tblname = "fuelalarmhist";
    $defaultalarms = [
        ['web_name' => 'pump9', 'description' => 'Ошибка насосов Н9/10', 'status' => 0],
        ['web_name' => 'pump10', 'description' => 'Ошибка насосов Н4/5', 'status' => 0],
        ['web_name' => 'pumpker', 'description' => 'Ошибка насоса Н1', 'status' => 0],
        ['web_name' => 'pumpotv', 'description' => 'Ошибка насоса ЖДЦ Отвальная', 'status' => 0],
        ['web_name' => 'pumpprom', 'description' => 'Ошибка насоса ЖДЦ Промышленная', 'status' => 0],                
        ['web_name' => 'hpR22', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р22', 'status' => 0],
        ['web_name' => 'lpR22', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р22', 'status' => 0],
        ['web_name' => 'hwR22', 'description' => 'Аварийно высокий уровень воды в резервуаре Р22', 'status' => 0],
        ['web_name' => 'hpR23', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р23', 'status' => 0],
        ['web_name' => 'lpR23', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р23', 'status' => 0],
        ['web_name' => 'hwR23', 'description' => 'Аварийно высокий уровень воды в резервуаре Р23', 'status' => 0],
        ['web_name' => 'hpR24', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р24', 'status' => 0],
        ['web_name' => 'lpR24', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р24', 'status' => 0],
        ['web_name' => 'hwR24', 'description' => 'Аварийно высокий уровень воды в резервуаре Р24', 'status' => 0], 
        ['web_name' => 'hpR11', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р11', 'status' => 0],
        ['web_name' => 'lpR11', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р11', 'status' => 0],
        ['web_name' => 'hwR11', 'description' => 'Аварийно высокий уровень воды в резервуаре Р11', 'status' => 0],         
        ['web_name' => 'hpR12', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р12', 'status' => 1],
        ['web_name' => 'lpR12', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р12', 'status' => 0],
        ['web_name' => 'hwR12', 'description' => 'Аварийно высокий уровень воды в резервуаре Р12', 'status' => 0],         
        ['web_name' => 'hpR92', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р92', 'status' => 0],
        ['web_name' => 'lpR92', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р92', 'status' => 0],
        ['web_name' => 'hwR92', 'description' => 'Аварийно высокий уровень воды в резервуаре Р92', 'status' => 0], 
        ['web_name' => 'hpR16', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р16', 'status' => 0],
        ['web_name' => 'lpR16', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р16', 'status' => 0],
        ['web_name' => 'hwR16', 'description' => 'Аварийно высокий уровень воды в резервуаре Р16', 'status' => 0],
        ['web_name' => 'hpR2', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р2', 'status' => 0],
        ['web_name' => 'lpR2', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р2', 'status' => 0],
        ['web_name' => 'hwR2', 'description' => 'Аварийно высокий уровень воды в резервуаре Р2', 'status' => 0],
        ['web_name' => 'hpR4', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р4', 'status' => 0],
        ['web_name' => 'lpR4', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р4', 'status' => 0],
        ['web_name' => 'hwR4', 'description' => 'Аварийно высокий уровень воды в резервуаре Р4', 'status' => 0],
        ['web_name' => 'hpR5', 'description' => 'Аварийно высокий уровень топлива в резервуаре Р5', 'status' => 0],
        ['web_name' => 'lpR5', 'description' => 'Аварийно низкий уровень топлива в резервуаре Р5', 'status' => 0],
        ['web_name' => 'hwR5', 'description' => 'Аварийно высокий уровень воды в резервуаре Р5', 'status' => 0], 
        ['web_name' => 'hpRGS25O', 'description' => 'Аварийно высокий уровень топлива в резервуаре РГС25 Отвальн', 'status' => 0],
        ['web_name' => 'lpRGS25O', 'description' => 'Аварийно низкий уровень топлива в резервуаре РГС25 Отвальн', 'status' => 0],
        ['web_name' => 'hwRGS25O', 'description' => 'Аварийно высокий уровень воды в резервуаре РГС25 Отвальн', 'status' => 0],
        ['web_name' => 'hpRGS25P', 'description' => 'Аварийно высокий уровень топлива в резервуаре РГС25 Пром', 'status' => 0],
        ['web_name' => 'lpRGS25P', 'description' => 'Аварийно низкий уровень топлива в резервуаре РГС25 Пром', 'status' => 0],
        ['web_name' => 'hwRGS25P', 'description' => 'Аварийно высокий уровень воды в резервуаре РГС25 Пром', 'status' => 0],
        ['web_name' => 'colNova', 'description' => 'Отсутсвует связь с колонкой Nova склада ГСМ', 'status' => 0],
        ['web_name' => 'colR2', 'description' => 'Отсутсвует связь с колонкой Р2 АЗС АТЦ', 'status' => 0],     
        ['web_name' => 'colR4', 'description' => 'Отсутсвует связь с колонкой Р4 АЗС АТЦ', 'status' => 0],
        ['web_name' => 'colR5', 'description' => 'Отсутсвует связь с колонкой Р5 АЗС АТЦ', 'status' => 0],          
        ['web_name' => 'plcGsm', 'description' => 'Отсутсвует связь с ПЛК склада ГСМ', 'status' => 0],         
        ['web_name' => 'plcOtv', 'description' => 'Отсутсвует связь с ПЛК ЖДЦ Отвальная', 'status' => 0],  
        ['web_name' => 'plcProm', 'description' => 'Отсутсвует связь с ПЛК ЖДЦ Промышленная', 'status' => 0], 
        ['web_name' => 'fafnir', 'description' => 'Отсутсвует связь с консолью Fafnir', 'status' => 0],
        ['web_name' => 'almR22', 'description' => 'Ошибка датчика уровня резервуара R22', 'status' => 0],
        ['web_name' => 'almR23', 'description' => 'Ошибка датчика уровня резервуара R23', 'status' => 0],
        ['web_name' => 'almR24', 'description' => 'Ошибка датчика уровня резервуара R24', 'status' => 0],
        ['web_name' => 'almR11', 'description' => 'Ошибка датчика уровня резервуара R11', 'status' => 0],
        ['web_name' => 'almR12', 'description' => 'Ошибка датчика уровня резервуара R12', 'status' => 0], 
        ['web_name' => 'almR92', 'description' => 'Ошибка датчика уровня резервуара R92', 'status' => 0],
        ['web_name' => 'almR16', 'description' => 'Ошибка датчика уровня резервуара R16', 'status' => 0],
        ['web_name' => 'almR2', 'description' => 'Ошибка датчика уровня резервуара R2', 'status' => 0], 
        ['web_name' => 'almR4', 'description' => 'Ошибка датчика уровня резервуара R4', 'status' => 0],
        ['web_name' => 'almR5', 'description' => 'Ошибка датчика уровня резервуара R5', 'status' => 0], 
        ['web_name' => 'almRGS25O', 'description' => 'Ошибка датчика уровня резервуара РГС25 Отв', 'status' => 0],
        ['web_name' => 'almRGS25P', 'description' => 'Ошибка датчика уровня резервуара РГС25 Пром', 'status' => 0]         
    ];
    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            die('error db connection');
        }
        else{
            $sql = "drop table if exists `".$tblname."`";
            $res = $mysqli->query($sql);
            if($res){
                echo "success : table `".$tblname."` has been deleted".PHP_EOL;
                $sql = "CREATE TABLE `".$tblname."` (
                    `id` int(5) NOT NULL AUTO_INCREMENT,
                    `recdate` datetime DEFAULT NOW(),                   
                    `status` int(2) DEFAULT '0',
                    `alarm_id`  int(3) NOT NULL,
                    `notes` varchar(90) DEFAULT NULL,
                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`),
                    foreign key `fk_alarm_id` (`alarm_id`) references `fuelalarms` (`id`)
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    $sql = "";
                    for($i = 0; $i < count($defaultalarms); $i++){
                        $sql = "INSERT INTO `".$tblname."` (`status`,`alarm_id`) VALUES ('".$defaultalarms[$i]["status"]."','".($i+1)."')";
                        $res = $mysqli->query($sql);
                        if($res){
                            echo "success : inserted record at row ".($i+1).PHP_EOL;
                        }else{
                            $mysqli->close();
                            echo $sql.PHP_EOL;
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