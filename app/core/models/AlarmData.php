<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;
    use DateTime;

    class AlarmData extends Db {

        private static function table(){
            return "fuelalarms";
        }

        public static function almcount(){
            return self::getCount(self::table(),'id','where `status` > 0');
        }

        public static function getAlarms(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select * from `fuelalarms` order by `status` desc, `dateon` desc";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            } 
            //return self::getSingleTable(self::table(),'status','desc');
        }

        public static function getActAlarms(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select id, dateon as recdate, description, status from `fuelalarms` where `status`='1' order by `dateon` desc";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            } 
            //return self::getSingleTable(self::table(),'status','desc');
        }

        public static function getAlarmHist(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select hist.id as id, hist.recdate as recdate, alarm.description as description, hist.status as status from fuelalarmhist as hist 
                    inner join fuelalarms as alarm on hist.alarm_id = alarm.id
                    order by hist.id desc limit 2500";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            } 
            //return self::getSingleTable(self::table(),'status','desc');
        }



    }
?>