<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;

    class Destination extends Db {

        private static function table(){
            return "destinations";
        }

        public static function insert($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "insert into `".self::table()."` (`name`,`description`) values ('".$data['name']."','".$data['description']."')";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $mysqli->query($sql);
                    $mysqli->close();
                    return true;
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
                $sql = "update `".self::table()."` set `name` =  '".$data['name']."', `description` =  '".$data['description']."' where `id` = '".$data['id']."'";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $mysqli->query($sql);
                    $mysqli->close();
                    return true;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function selectAll(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select  * from `".self::table()."`";
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

        public static function selectOne($id){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select  * from `".self::table()."` where `id`='".$id."'";
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
    }
?>