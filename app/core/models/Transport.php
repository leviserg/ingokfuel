<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;

    class Transport extends Db {

        private static function table(){
            return "transports";
        }

        public static function insert($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "insert into `".self::table()."` (`org`,`mark`,`num`,`rfid`,`driv`,`lim`,`notes`,`updtime`,`bindto`,`mvz`,`spp`)
                        values
                        ('".$data['org']."','".$data['mark']."','".$data['num']."','".$data['rfid']."','".$data['driv']."','".$data['lim']."','".$data['notes']."', now(),'".$data['bindto']."','".$data['mvz']."','".$data['spp']."')";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $mysqli->close();
                    return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function update($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "update `".self::table()."` set 
                 `org` =  '".$data['org']."',
                 `mark` =  '".$data['mark']."',
                 `num` =  '".$data['num']."',                 
                 `rfid` =  '".$data['rfid']."',                 
                 `driv` =  '".$data['driv']."', 
                 `lim` =  '".$data['lim']."',                  
                 `notes` =  '".$data['notes']."',
                 `updtime` =  now(),
                 `mvz` = '".$data['mvz']."', 
                 `spp` = '".$data['spp']."',              
                 `bindto` = '".$data['bindto']."' where `id` = '".$data['id']."'";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $mysqli->close();
                    //return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
            if($data['bindto'] == 2){
                try{
                    $mysqli_iazs = new mysqli($db['host'],$db['user'],$db['pwd'],'iazs');
                    $sql_iazs = "set @id = (select `id` from `ccards` where `number` = '".$data['rfid']."')";
                    //echo(var_dump($mysqli_iazs->connect_errno));
                    if ($mysqli_iazs->connect_errno == 0) {
                        $res_iazs = $mysqli_iazs->query($sql_iazs);
                        $res_iazs = $mysqli_iazs->query("update `ccardlimits` set `orderVolume` = '".$data['lim']."' where `cardId` = @id");
                        $mysqli_iazs->close();
                        return  $res_iazs;
                    }
                    else{
                        return null;
                    }
                } catch(mysqli_sql_exception $e){
                    return null;
                }
            }
            return true;
        }

        public static function selectAll($bindTo){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $where = '';
                if(intval($bindTo) == 2 || intval($bindTo) == 1){
                    $where = " where `".self::table()."`.`bindto` = '".$bindTo."'";
                }
                elseif(intval($bindTo) == 3){
                    $where = " where `".self::table()."`.`bindto` in (0,3,4)";
                }
                $sql = "select 
                    `".self::table()."`.`id` as id,
                    `organizations`.`orgname` as org,
                    `".self::table()."`.`mark` as mark,
                    `".self::table()."`.`num` as num,
                    `".self::table()."`.`rfid` as rfid,
                    `".self::table()."`.`driv` as driv,
                    `".self::table()."`.`lim` as lim,
                    `".self::table()."`.`notes` as notes,
                    `".self::table()."`.`updtime` as updtime,
                    `".self::table()."`.`bindto` as bindto,
                    `mvz`.`desc` as mvz_desc
                from `".self::table()."`
                    inner join `mvz` on
                    `".self::table()."`.`mvz` = `mvz`.`id`                
                inner join `organizations` on
                    `".self::table()."`.`org` = `organizations`.`id`".$where;
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
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

        public static function selectNums($fillunit){
            $bindto = 0;
            if($fillunit === "F1"){
                $bindto = 1;                
            }
            elseif($fillunit === "FOtv"){
                $bindto = 3;
            }
            elseif($fillunit === "FProm"){
                $bindto = 4;                
            }
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select 
                    `".self::table()."`.`id` as id,
                    `".self::table()."`.`num` as num
                from `".self::table()."` where (`".self::table()."`.`bindto` in (0,".$bindto.") and `".self::table()."`.`id`>0)";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $res = $mysqli->query($sql);
                    $ret['transports'] = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    require 'Destination.php';
                    $ret['destinations'] = Destination::selectAll();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function selectOne($id){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select 
                    `".self::table()."`.`id` as id,
                    `".self::table()."`.`org` as selorg,
                    `organizations`.`orgname` as org,
                    `".self::table()."`.`mark` as mark,
                    `".self::table()."`.`num` as num,
                    `".self::table()."`.`rfid` as rfid,
                    `".self::table()."`.`driv` as driv,
                    `".self::table()."`.`lim` as lim,
                    `".self::table()."`.`notes` as notes,
                    `".self::table()."`.`updtime` as updtime,
                    `".self::table()."`.`bindto` as bindto,
                    `".self::table()."`.`mvz` as mvz,
                    `".self::table()."`.`spp` as spp from `".self::table()."` inner join `organizations` on
                    `".self::table()."`.`org` = `organizations`.`id` where `".self::table()."`.`id`='".$id."'";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);

                    $sql = "select * from organizations";
                    $res = $mysqli->query($sql);
                    $orgdata = self::getAssocData($res);
                    $orgs = ['orgs' => $orgdata];

                    $sql = "select * from mvz";
                    $res = $mysqli->query($sql);
                    $mvzdata = self::getAssocData($res);
                    $mvz = ['mvz' => $mvzdata];

                    $sql = "select * from spp";
                    $res = $mysqli->query($sql);
                    $sppdata = self::getAssocData($res);
                    $spp = ['spp' => $sppdata];

                    array_push($ret, $orgs);
                    array_push($ret, $mvz);
                    array_push($ret, $spp);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getOrgMvzSpp(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{

                    $ret = [];

                    $sql = "select * from organizations";
                    $res = $mysqli->query($sql);
                    $orgdata = self::getAssocData($res);
                    $orgs = ['orgs' => $orgdata];

                    $sql = "select * from mvz";
                    $res = $mysqli->query($sql);
                    $mvzdata = self::getAssocData($res);
                    $mvz = ['mvz' => $mvzdata];

                    $sql = "select * from spp";
                    $res = $mysqli->query($sql);
                    $sppdata = self::getAssocData($res);
                    $spp = ['spp' => $sppdata];

                    array_push($ret, $orgs);
                    array_push($ret, $mvz);
                    array_push($ret, $spp);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }
    }
?>