<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;
    use DateTime;

    class CurData extends Db {

        public static function getCurData(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select * from `pumps`";
                    $res = $mysqli->query($sql);
                    $pumps = self::getAssocData($res);
                    $res->close();
                    $sql = "select 
                        `param`.`web_name` as `web_name`, 
                        `cur`.`prod_lev` as `level`, 
                        `cur`.`prod_vol` as `vol`, 
                        `param`.`tank_diametr` as `maxlevel`, 
                        `param`.`capacity` as `maxvol`, 
                        `cur`.`temp` as `temp`, 
                        `cur`.`density` as `dens`,
                        `cur`.`tank_status` as `tank_status`,                         
                        `param`.`fulltitle` as `fulltitle`, 
                        `param`.`shorttitle` as `shorttitle`, 
                        `fueltypes`.`fueltype` as `fueltype`, 
                        `cur`.`date` as `date`,                      
                        `cur`.`vol15` as `vol15`, 
                        `cur`.`mass` as `mass`, 
                        `cur`.`water_lev` as `water_lev`, 
                        `cur`.`water_vol` as `water_vol`, 
                        `cur`.`low_prod_al` as `low_prod_al`, 
                        `cur`.`hi_water_al` as `hi_water_al`, 
                        `cur`.`hi_prod_al` as `hi_prod_al`,
                        `cur`.`delta` as `delta`,
                        `param`.`dead_zone` as `dead_zone`
                    from `cur` 
                        inner join `param` on `cur`.`id` = `param`.`id`
                        inner join `fueltypes` on `param`.`fueltype`=`fueltypes`.`id`";
                    $res = $mysqli->query($sql);
                    $tanks = self::getAssocData($res);
                    $res->close();
                    $sql = "select 
                        `meters`.`web_name` as `web_name`,
                        `meters`.`title` as `fulltitle`,
                        `meters`.`vol` as `vol`,
                        `meters`.`mass` as `mass`,
                        `meters`.`sumvol` as `sumvol`, 
                        `meters`.`summass` as `summass`, 
                        `meters`.`temp` as `temp`,
                        `meters`.`dens` as `dens`, 
                        `meters`.`dailyvol` as `dailyvol`,
                        `meters`.`dailymass` as `dailymass`,
                        `transports`.`num` as `trans`,
                        `meters`.`lastdate` as `date`,
                        `meters`.`bitstatus` as `bitstatus`,
                        `fueltypes`.`fueltype` as `fueltype`,
                        `meters`.`cur_setp` as `cur_setp`
                    from `meters` 
                    inner join `transports` on `meters`.`trans` = `transports`.`id` 
                    inner join `fueltypes` on `meters`.`fueltype`=`fueltypes`.`id`";
                    $res = $mysqli->query($sql);
                    $meters = self::getAssocData($res);
                    $res->close();
                    $sql = "select `web_name`, `status`, `dateon` from `fuelalarms` where `web_name` in ('plcGsm', 'plcOtv', 'plcProm','fafnir','krohne','colR2','colR4','colR5')";
                    $res = $mysqli->query($sql);
                    $plcs = self::getAssocData($res);
                    $res->close();
                    $sql = "select TIME_TO_SEC(TIMEDIFF(`cur`.`dateupdt`, NOW())) as timediff from `cur`";
                    $res = $mysqli->query($sql);
                    $apps = self::getAssocData($res);
                    $res->close();        
                    $ret = [
                        'pumps' => $pumps,
                        'tanks' => $tanks,
                        'meters'=> $meters,
                        'plcs' => $plcs,
                        'apps' => $apps
                    ]; 
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getLocalLevelTrends($web_name, $daysago = 15){
            $db = self::dbconn();
            $curtime = new DateTime();
            $l_date = $curtime->format('Y-m-d H:i:s');
            $l_date = date('Y-m-d H:i:s', strtotime($l_date.'+1 hours'));
            $f_date = date('Y-m-d H:i:s', strtotime($l_date.'-'.intval($daysago).' days'));
            //die($l_date);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select 
                            `hist_main`.`date` as `date`,
                            `hist_main`.`prod_lev` as `prod_lev`,
                            `hist_main`.`prod_vol` as `prod_vol`,
                            `hist_main`.`mass` as `mass`,
                            `hist_main`.`temp` as `temp`,
                            `hist_main`.`density` as `dens`
                        from `hist_main`
                        inner join `param` on `hist_main`.`id_rez` = `param`.`id` 
                        where (`param`.`web_name` = '".$web_name."' and `date` between '".$f_date."' and '".$l_date."')
                    order by `hist_main`.`id` asc";
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

        public static function getLocalFillTable($web_name){
            $db = self::dbconn();
            $curtime = new DateTime();
            $daysago = 60;
            $l_date = $curtime->format('Y-m-d H:i:s');
            $l_date = date('Y-m-d H:i:s', strtotime($l_date.'+1 hours'));
            $f_date = date('Y-m-d H:i:s', strtotime($l_date.'-'.intval($daysago).' days'));
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select 
                            `naliv_plc`.`id` as `id`,
                            `naliv_plc`.`date_start` as `start`,
                            `naliv_plc`.`date_end` as `finish`,                            
                            `organizations`.`orgname` as `org`,
                            `transports`.`mark` as `mark`,
                            `transports`.`num` as `num`,
                            `naliv_plc`.`z_volume` as `setvol`,
                            `naliv_plc`.`f_volume` as `actvol`,
                            `naliv_plc`.`f_mass` as `f_mass`,
                            `naliv_plc`.`dens` as `dens`,
                            `naliv_plc`.`temp` as `temp`,                   
                            `destinations`.`name` as `dest`                                                                          
                        from `naliv_plc` as `naliv_plc`
                        inner join `destinations` on `naliv_plc`.`destination` = `destinations`.`id` 
                        inner join `transports` on `naliv_plc`.`transport` = `transports`.`id` 
                        inner join `organizations` on `transports`.`org` = `organizations`.`id`   
                        inner join `meters` on `naliv_plc`.`plc_n` = `meters`.`id`                                                
                        where (`meters`.`web_name` = '".$web_name."' and `naliv_plc`.`date_start` between '".$f_date."' and '".$l_date."')
                    order by `naliv_plc`.`id` desc limit 5000";
                    //die($sql);
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

        public static function getCurElemData($elemid, $elemtype){
            $elems = self::getCurData()[$elemtype];
            for($i=0; $i < count($elems); $i++){
                if($elemid === $elems[$i]['web_name']){
                    if($elemtype = 'tanks'){ // tanks, meters, pumps
                        array_push($elems[$i],['trenddata' => self::getLocalLevelTrends($elems[$i]['web_name']),3]);
                    }
                    return $elems[$i];
                }
            }
            return null;
        }

        public static function getTanks(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select `web_name`,`fulltitle`,`fueltypes`.`fueltype` as fueltype from `param` inner join `fueltypes` on `param`.`fueltype`=`fueltypes`.`id`";
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

        public static function getFillPointsDataTable($names, $daysago = 60){
            $arrnames = explode ( ',' , $names);
            $db = self::dbconn();
            $curtime = new DateTime();
            $l_date = $curtime->format('Y-m-d H:i:s');
            $l_date = date('Y-m-d H:i:s', strtotime($l_date.'+1 hours'));
            $f_date = date('Y-m-d H:i:s', strtotime($l_date.'-'.intval($daysago).' days'));
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $condition = "";
                    $condition .= "`meters`.`web_name` in (";
                    for($i = 0; $i < count($arrnames); $i++){
                        //$condition .= "`meters`.`web_name` = '".$arrnames[$i]."' or ";
                        $condition .= "'".$arrnames[$i]."',";
                    }
                    $condition = substr($condition, 0, -1).")";
                    /*
                    if (in_array( "FOtv", $arrnames, true) || in_array( "FProm", $arrnames, true)){
                        $condition .= " and `naliv_plc`.`f_volume` > 0";
                    }
                    */
                    // $condition = substr($condition, 0, -4);
                    $sql = "select 
                            `naliv_plc`.`id` as `id`,
                            `naliv_plc`.`id_z` as `id_z`,
                            `naliv_plc`.`date_start` as `start`,
                            `naliv_plc`.`date_end` as `finish`,
                            `naliv_plc`.`closed` as `closed`,
                            `transports`.`num` as `num`,
                            `naliv_plc`.`z_volume` as `setvol`,
                            `naliv_plc`.`f_volume` as `actvol`,
                            `naliv_plc`.`temp` as `temp`,
                            `naliv_plc`.`dens` as `dens`,                       
                            `destinations`.`name` as `dest`,
                            `meters`.title as `title`,
                            `meters`.`web_name` as `web_name`,
                            `fueltypes`.`fueltype` as `fueltype`,
                            `naliv_plc`.`f_mass` as `f_mass`,
                            concat(`mvz`.`id`, ' : ', `mvz`.`desc`) as `mvz`,
                            `spp`.`desc` as `spp`
                        from `naliv_plc`
                        inner join `destinations` on `naliv_plc`.`destination` = `destinations`.`id` 
                        inner join `transports` on `naliv_plc`.`transport` = `transports`.`id` 
                        inner join `mvz` on `transports`.`mvz` = `mvz`.`id`
                        inner join `spp` on `transports`.`spp` = `spp`.`id`
                        inner join `meters` on `naliv_plc`.`plc_n` = `meters`.`id` 
                        inner join `fueltypes` on `meters`.`fueltype` = `fueltypes`.`id`                                                                       
                        where ((".$condition.") and `naliv_plc`.`date_start` between '".$f_date."' and now())
                    order by `naliv_plc`.`id` desc limit 5000";
                    //echo $sql;
                    //inner join `organizations` on `transports`.`org` = `organizations`.`id` 
                    //die($sql);
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

        public static function setPumpCommand($name, $command){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "update `meters` set `command`='".$command."' where `web_name`='".$name."'";
                    $res = $mysqli->query($sql);                   
                    $mysqli->close();
                    return $res;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getDeadZones(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "select `id`,`web_name`,`title`,`dead_zone` from `meters` where `id` in ('1','2','7','8')";
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

        public static function setDeadZones($data){
            $db = self::dbconn();
            $data = json_decode($data,true);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $sql = "update `meters` set `dead_zone`='".$data['F1']."' where `web_name`='F1'";
                    $res = $mysqli->query($sql);
                    $sql = "update `meters` set `dead_zone`='".$data['F2']."' where `web_name`='F2'";
                    $res = $mysqli->query($sql);
                    $sql = "update `meters` set `dead_zone`='".$data['FOtv']."' where `web_name`='FOtv'";
                    $res = $mysqli->query($sql);
                    $sql = "update `meters` set `dead_zone`='".$data['FProm']."' where `web_name`='FProm'";
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