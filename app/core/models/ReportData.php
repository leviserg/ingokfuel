<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;
    use DateTime;

    class ReportData extends Db {

        private static function table(){
            return "fuelreports";
        }

        public static function getReports($limit){
            return self::getSingleTable(self::table(),'createdate','desc', $limit);
        }

        public static function createExcelReport($data){
            $db = self::dbconn();
            $jsondata = json_decode($data,true);
            $startdate = $jsondata["startdate"];
            $enddate = $jsondata["enddate"];
            $plc_n = $jsondata["plc_n"];
            $id_rez = $jsondata["id_rez"];
            if($plc_n == 100 ){
                $searchcond = "`naliv_plc`.`plc_n` in ('4','5','6')";
            }
            elseif($plc_n == 200 ){
                $searchcond = "`naliv_plc`.`plc_n` in ('7','8')";
            }
            elseif($plc_n == 300 ){
                $searchcond = "`naliv_plc`.`plc_n`<9"; // all plc_n
            }          
            elseif($plc_n != 0 ){
                $searchcond = "`naliv_plc`.`plc_n`='".$plc_n."'";
            }
            else{
                $searchcond = "`naliv_plc`.`plc_n`<4";
            }
            if($id_rez != 0 ){
                $searchcond .= " and `naliv_plc`.`id_rez`='".$id_rez."'";
            }
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select 
                            `destinations`.`name` as `dest`,
                            `transports`.`mark` as `mark`,
                            `transports`.`num` as `num`,
                            `naliv_plc`.`date_start` as `start`,
                            `naliv_plc`.`date_end` as `finish`,
                            `naliv_plc`.`f_mass` as `f_mass`,
                            coalesce(`naliv_plc`.`f_volume`,0) as `actvol`,
                            `naliv_plc`.`dens` as `dens`,
                            `naliv_plc`.`temp` as `temp`, 
                            `naliv_plc`.`z_volume` as `setvol`,
                            `fueltypes`.`fueltype` as `fueltype`,
                            `meters`.`title` as `title`,
                            `param`.`fulltitle` as `tank`,
                            `mvz`.`id` as `mvz`,
                            `mvz`.`desc` as `mvz_desc`,                         
                            `spp`.`desc` as `spp`
                        from `naliv_plc` as `naliv_plc`
                        inner join `meters` on `naliv_plc`.`plc_n`=`meters`.`id`
                        inner join `destinations` on `naliv_plc`.`destination` = `destinations`.`id` 
                        inner join `transports` on `naliv_plc`.`transport` = `transports`.`id` 
                        inner join `fueltypes` on `meters`.`fueltype`=`fueltypes`.`id`
                        inner join `param` on `naliv_plc`.`id_rez`=`param`.`id`
                        inner join `mvz` on `transports`.`mvz` = `mvz`.`id`
                        inner join `spp` on `transports`.`spp` = `spp`.`id`
                        where (".$searchcond." and `naliv_plc`.`date_start` between '".$startdate." 00:00:00' and '".$enddate." 23:59:59')
                    order by `naliv_plc`.`id` asc";
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

        public static function createMonthExcelReport($data){
            $db = self::dbconn();
            $jsondata = json_decode($data,true);
            $startdate = $jsondata["startdate"];
            $enddate = $jsondata["enddate"];
            $bindTo = $jsondata["bindto"];
            if($bindTo == 0){
                $searchcond = "`naliv_plc`.`plc_n` in ('7', '8')";
            }        
            elseif($bindTo == 1){
                $searchcond = "`naliv_plc`.`plc_n` in ('1','2','3')";
            }
            elseif($bindTo == 2){
                $searchcond = "`naliv_plc`.`plc_n` in ('4','5','6')";
            }
            elseif($bindTo == 3){
                $searchcond = "`naliv_plc`.`plc_n`='7'";
            }
            elseif($bindTo == 4){
                $searchcond = "`naliv_plc`.`plc_n`='8'";
            }
            else{
                $searchcond = "`naliv_plc`.`plc_n`< 9";
            }
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select transports.num as num, transports.mark as mark, sum(naliv_plc.f_volume) as f_vol,
                                (CASE WHEN fueltypes.id = 1
                                    THEN 1 ELSE 0 END) as DT,
                                (CASE WHEN fueltypes.id = 2
                                    THEN 1 ELSE 0 END) as A92,
                                (CASE WHEN fueltypes.id = 3
                                    THEN 1 ELSE 0 END) as KER,
                                `mvz`.`id` as mvz,
                                `mvz`.`desc` as mvz_desc,                         
                                `spp`.`desc` as spp
                            from naliv_plc
                            inner join transports on naliv_plc.transport = transports.id
                            inner join meters on naliv_plc.plc_n = meters.id
                            inner join fueltypes on meters.fueltype = fueltypes.id
                            inner join `mvz` on `transports`.`mvz` = `mvz`.`id`
                            inner join `spp` on `transports`.`spp` = `spp`.`id`                            
                        where (".$searchcond." and `naliv_plc`.`date_start` between '".$startdate." 00:00:00' and '".$enddate." 23:59:59')
                        group by num, mark, DT, A92, KER, mvz, mvz_desc, spp";
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