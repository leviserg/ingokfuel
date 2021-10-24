<?php
	namespace app\core;
    use mysqli;
    use mysqli_sql_exception;
    use DateTime;

	class Db {

        public static function dbconn(){
            $remote = 0;
            if($remote == 1){
                return [
                    'host' => 'mysql.zzz.com.ua',
                    'dbname' => 'leviserg',
                    'user' => "leviserg",
                    'pwd'  => "Aaa111274"
                ];                
            }
            else{
                return [
                    'host' => 'localhost',
                    'dbname' => 'ingokfuel',
                    'user' => "root",
                    'pwd'  => ""
                ];
            }
        }

        public static function getSingleTable($tablename, $sortcolumn = null, $order = null, $limit = null){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = (isset($order) && isset($sortcolumn)) ? "select * from `".$tablename."` order by `".$sortcolumn."` ".$order : "select * from `".$tablename."`";
                    $slimit = (isset($limit)) ? " limit ".$limit : "";
                    $sql .= $slimit;
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

        public static function getCount($tablename, $column, $condition = null){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = (isset($condition)) ? "select count(`".$column."`) from `".$tablename."` ".$condition : "select count(`".$column."`) from `".$tablename."`";
                    $res = $mysqli->query($sql);
                    if($res){
                        $rec_id = $res->fetch_row();
                        $res->close();
                        $ret = intval($rec_id[0]);
                    }
                    else{
                        $ret = null;
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function getColumns($tablename, $columns, $condition = null){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $columnslist = "";
                    for($i = 0; $i < count($columns); $i++){
                        $columnslist .= "`".$columns[$i]."`,";
                    }
                    $columnslist = substr($columnslist,0,-1);
                    $sql = (isset($condition)) ? "select ".$columnslist." from `".$tablename."` ".$condition : "select ".$columnslist." from `".$tablename."`";
                    $res = $mysqli->query($sql);
                    if($res){
                        $res = $mysqli->query($sql);
                        $ret = self::getAssocData($res);
                        $res->close();
                        $mysqli->close();
                        return $ret;
                    }
                    else{
                        $ret = null;
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function getMax($tablename, $column){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select max(`".$column."`) from `".$tablename."`";
                    $res = $mysqli->query($sql);
                    if($res){
                        $rec_id = $res->fetch_row();
                        $res->close();
                        $ret = $rec_id[0];
                    }
                    else{
                        $ret = null;
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function getMin($tablename, $column){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select min(`".$column."`) from `".$tablename."`";
                    $res = $mysqli->query($sql);
                    if($res){
                        $rec_id = $res->fetch_row();
                        $res->close();
                        $ret = $rec_id[0];
                    }
                    else{
                        $ret = null;
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }

        public static function getRecordId($tablename, $idcolumn, $searchcolumn, $param){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select `".$idcolumn."` from `".$tablename."` where `".$searchcolumn."` = '$param'";
                    $res = $mysqli->query($sql);
                    if($res){
                        $rec_id = $res->fetch_row();
                        $res->close();
                        $ret = $rec_id[0];
                    }
                    else{
                        $ret = null;
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }            
        }
 
        public static function getAssocData($res){
            $ret = [];
            while($data = $res->fetch_assoc()){
                foreach($data as $key => $keyval){
                    $temp[$key] = $keyval;
                }
                array_push($ret, $temp);
            }
            return $ret;
        }

    }
?>