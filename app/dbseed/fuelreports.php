<?php
    namespace app\core;
    require '../core/Db.php';
    use mysqli;
    use mysqli_sql_exception;
    use DOMDocument;
use DOMNode;
use Exception;

$db = Db::dbconn();
    $tblname = "fuelreports";
    $meters = Db::getColumns('meters', ['id','web_name']); 
    $datemax = Db::getMax('naliv_plc','date_end');
    $datemin = Db::getMin('naliv_plc','date_end');

    $datemax = date('Y-m-d', strtotime($datemax));
    $datemax = $datemax.' 23:59:59';

    $datemin = date('Y-m-d', strtotime($datemin));
    $datemin = $datemin.' 00:00:00';

    $days = intval(round((strtotime($datemax) - strtotime($datemin)) / 86400));

    $xmldataarray = [
        'name' => [],
        'date' => [],
        'meters' =>[],
        'tanks' => []
    ];

// *********** get report data ***********

    try{
        $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
        if ($mysqli->connect_errno) {
            return null;
        }
        else{
            for($i = 0; $i < $days; $i++){
                $datestart = $datemin;
                $dateend = date('Y-m-d H:i:s', strtotime($datestart.'+1 days'));
                $sql = "select `naliv_plc`.`plc_n` as id, `meters`.`web_name` as web_name, round(sum(`naliv_plc`.`f_volume`),1) as vol, `fueltypes`.`fueltype` as fueltype
                 from `naliv_plc`
                 inner join `meters` on `naliv_plc`.`plc_n`=`meters`.`id` 
                 inner join `fueltypes` on `meters`.`fueltype`=`fueltypes`.`id` 
                 where `naliv_plc`.`date_end` between '".$datestart."' and '".$dateend."' group by `naliv_plc`.`plc_n`";
                $sql .= "union ";
                $sql .= "select 'total', 'total', round(sum(`f_volume`),1) as vol,'total' from `naliv_plc` where `date_end` between '".$datestart."' and '".$dateend."'";
                $res = $mysqli->query($sql);
                $filename = str_replace([":","-"," "],"",$dateend);
                $xmldataarray['name'][$i] = $filename;
                $xmldataarray['date'][$i] = $dateend;
                $xmldataarray['meters'][$i] = Db::getAssocData($res);
                $res->close();
                $sql = "select `cur`.`id` as id, `param`.`web_name` as web_name, `cur`.`prod_vol` as vol, `fueltypes`.`fueltype` as fueltype
                 from `cur`
                 inner join `param` on `cur`.`id`=`param`.`id` 
                 inner join `fueltypes` on `param`.`fueltype`=`fueltypes`.`id`";
                $sql .= "union ";
                $sql .= "select 'total', 'total', round(sum(`cur`.`prod_vol`),1) as meter_sum,'total' from `cur`";
                $res = $mysqli->query($sql);
                $xmldataarray['tanks'][$i] = Db::getAssocData($res);
                $res->close();
                $datemin = $dateend;
            }
            $mysqli->close();
        }
    } catch(mysqli_sql_exception $e){
        return null;
    }

// *********** save report data to files ***********

    $files = glob('../../public/reports/*'); // get all file names
    foreach($files as $file){ // iterate files
        if(is_file($file))
            unlink($file); // delete file
    }

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
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `createdate` datetime DEFAULT NULL,
                    `filename` varchar(30) DEFAULT NULL,
                    primary key (`id`),
                    unique key `id_UNIQUE` (`id`)
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
                $res = $mysqli->query($sql); 
                $totalrows = 0;
                if($res){
                    echo "success : table `".$tblname."` has been created".PHP_EOL;
                    for($i = 0; $i < $days; $i++){
                        try{
                            saveXml($xmldataarray['name'][$i], $xmldataarray['meters'][$i], $xmldataarray['tanks'][$i]);
                            $sql = "INSERT INTO `".$tblname."` (`createdate`,`filename`) VALUES ('".$xmldataarray['date'][$i]."','".$xmldataarray['name'][$i]."')";
                            $res = $mysqli->query($sql);
                            if($res){
                                echo "success : inserted record at row ".($i+1).PHP_EOL;
                            }else{
                                $mysqli->close();
                                echo "mysql error: can't seed table `".$tblname."` at row ".($i+1).PHP_EOL;
                                die($sql);
                            }
                        }
                        catch(Exception $e){
                            die(var_dump($e));
                        }
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

    function saveXml($filename, $metersdata, $tanksdata){
        $doc = new DOMDocument( );
        $data = $doc->createElement('data');
        $datanode = $doc->appendChild($data);

        $meters = $doc->createElement('meters');
        $metersnode = $datanode->appendChild($meters);
        for($i = 0; $i < count($metersdata); $i++){
            $meterelem = $doc->createElement($metersdata[$i]['web_name']);
                $metertype = $doc->createElement('fueltype', $metersdata[$i]['fueltype']);
                    $meterelem->appendChild($metertype);
                $metervol = $doc->createElement('vol', $metersdata[$i]['vol']);
                    $meterelem->appendChild($metervol);
            $metersnode->appendChild($meterelem);
        }
        $tanks = $doc->createElement('tanks');
        $tanksnode = $datanode->appendChild($tanks);
        for($i = 0; $i < count($tanksdata); $i++){
            $tankelem = $doc->createElement($tanksdata[$i]['web_name']);
                $tanktype = $doc->createElement('fueltype', $tanksdata[$i]['fueltype']);
                    $tankelem->appendChild($tanktype);
                $tankvol = $doc->createElement('vol', $tanksdata[$i]['vol']);
                    $tankelem->appendChild($tankvol);
            $tanksnode->appendChild($tankelem);
        }
        $doc->save( '../../public/reports/'.$filename.'.xml');
    }

?>