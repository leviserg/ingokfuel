<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;
    use DateTime;

    class TaskData extends Db {

        public static function getLastTaskData(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $sql = "select `naliv_plc`.`date_start` as `started`,
                                    `naliv_plc`.`date_end` as `finished`,
                                    `naliv_plc`.`closed` as `closed`,                                    
                                    `meters`.`web_name` as `web_name` 
                            from `naliv_plc` 
                            inner join `meters` on `naliv_plc`.`plc_n` = `meters`.`id` 
                            where `naliv_plc`.`plc_n`=1 order by `naliv_plc`.`id` desc limit 1";
                    $res = $mysqli->query($sql);
                    array_push($ret, self::getAssocData($res));
                    $res->close();
                    $sql = "select `naliv_plc`.`date_start` as `started`,
                                `naliv_plc`.`date_end` as `finished`,
                                `naliv_plc`.`closed` as `closed`,  
                                `meters`.`web_name` as `web_name` 
                            from `naliv_plc` 
                            inner join `meters` on `naliv_plc`.`plc_n` = `meters`.`id` 
                            where `naliv_plc`.`plc_n`=2 order by `naliv_plc`.`id` desc limit 1";
                    $res = $mysqli->query($sql);
                    array_push($ret, self::getAssocData($res));
                    $res->close();         
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function getDestinationsForNewTask($web_name){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                     $sql = "select `id`, `name` from `destinations`";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();         
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function getTransportsForNewTask($num){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select `id`,`org`,`mark`,`num`,`lim`,`driv` from `transports` where `num` like '%".$num."%'";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();         
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function insert($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    //$maxid = self::getMax('naliv_plc','id');
                    //$id_z = $maxid + 1;
                    $plc_n = self::getRecordId('meters', 'id', 'web_name', $data['point']);
                    //$sql = "insert into `naliv_plc` (`id_z`,`z_volume`,`date_start`,`plc_n`,`destination`,`transport`,`pump`) values ('".$id_z."','".$data['vol']."',now(),'".$plc_n."','".$data['dest']."','".$data['trans']."','".$data['pump']."')";
                    $sql = "insert into `naliv_plc` (`z_volume`,`date_start`,`plc_n`,`destination`,`transport`,`pump`,`id_rez`) values ('".$data['vol']."',now(),'".$plc_n."','".$data['dest']."','".$data['trans']."','".$data['pump']."','".$data['tank']."')";
                    $res = $mysqli->query($sql);
                    $sql = "update `meters` set `trans`='".$data['trans']."',`cur_setp`='".$data['vol']."', `lastdate`=now() where `id`='".$plc_n."'";
                    $res = $mysqli->query($sql);
                    $mysqli->close();
                    return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function closeTask($meterid, $manstop){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $plc_n = self::getRecordId('meters', 'id', 'web_name', $meterid);
                    if($manstop == 1){
                        $sql = "update `naliv_plc` set `closed`=now(), `date_end`=now()  where (`plc_n`='".$plc_n."' and `date_end` is null) order by id desc";
                    }
                    else{
                        $sql = "update `naliv_plc` set `closed`=now() where (`plc_n`='".$plc_n."' and `closed` is null) order by id desc";
                    }
                    $res = $mysqli->query($sql);
                    $sql = "update `meters` set `lastdate`=now() where `id`='".$plc_n."'";
                    $res = $mysqli->query($sql);                    
                    $mysqli->close();
                    return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function saveNewFillData($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "insert into `naliv_plc` (`id_z`,`z_volume`,`f_volume`,`temp`,`dens`,`date_start`,`date_end`,`closed`,
                                `f_mass`,`counter`,`countermass`,`plc_n`,`destination`,`transport`,`id_rez`)
                        values ('-2','".$data['z_volume']."','".$data['f_volume']."','".$data['temp']."','".$data['dens']."',
                            '".$data['date_start']."','".$data['date_end']."',now(),'".$data['f_mass']."',
                            '".$data['counter']."','".$data['countermass']."','".$data['plc_n']."','".$data['destination']."',
                            '".$data['transport']."','".$data['id_rez']."')";
                    //echo($sql);
                    $res = $mysqli->query($sql);
                    $mysqli->close();
                    return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function updateSetpoint($plc_n, $setpoint){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $plc_n = self::getRecordId('meters', 'id', 'web_name', $plc_n);
                    $sql = "update `meters` set `cur_setp`='".$setpoint."', `command`='10' where `id`='".$plc_n."'";
                    $res = $mysqli->query($sql);
                    if($plc_n < 3){
                        $sql = "update `naliv_plc` set `z_volume`='".$setpoint."' where id = (select max(`id`) from `naliv_plc` where `plc_n`='".$plc_n."')";
                        $res = $mysqli->query($sql);
                    }
                    $mysqli->close();
                    return $plc_n;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getSingleFill($rec_id){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select naliv_plc.id as id, naliv_plc.z_volume as z_volume, naliv_plc.f_volume as f_volume, naliv_plc.temp as temp,
                    naliv_plc.dens as dens, naliv_plc.date_start as date_start, naliv_plc.date_end as date_end, naliv_plc.closed as closed,
                    naliv_plc.f_mass as f_mass, naliv_plc.counter as counter, naliv_plc.countermass as countermass,
                    meters.title as meter, transports.num as transport, param.fulltitle as tank, fueltypes.fueltype as fueltype, 
                    destinations.name as destination from naliv_plc
                    inner join meters on naliv_plc.plc_n = meters.id
                    inner join transports on naliv_plc.transport = transports.id
                    inner join param on naliv_plc.id_rez = param.id
                    inner join destinations on naliv_plc.destination = destinations.id 
                    inner join fueltypes on meters.fueltype = fueltypes.id                             
                    where naliv_plc.id = '".$rec_id."'";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function setSingleFill($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "update `naliv_plc` set `z_volume` = '".$data['z_volume']."', `f_volume` = '".$data['f_volume']."',
                            `temp` = '".$data['temp']."', `dens` = '".$data['dens']."',
                            `date_start` = '".$data['date_start']."',`date_end` = '".$data['date_end']."',
                            `f_mass` = '".$data['f_mass']."',`counter` = '".$data['counter']."',`countermass` = '".$data['countermass']."' where `id` = ".$data['id'];
                    $res = $mysqli->query($sql);
                    $mysqli->close();
                    return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

    }
?>