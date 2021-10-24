<?php
    namespace app\core;
    use mysqli_sql_exception;
    use mysqli;

    class UserData extends Db {

        public static function getusers($type = null){
            $db = self::dbconn();
            $tblname = "users";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select `id`,`login`,`password`,`adm`,`enctrl`,`department` from `".$tblname."`";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = [];
                    while($data = $res->fetch_assoc()){
                        if(!isset($type)){
                            $temp = [
                                'id'   =>  $data['id'],
                                'login' =>  $data['login'],
                                'password' =>  md5($data['password']),
                                'adm' => $data['adm'],
                                'enctrl' => $data['enctrl'],
                                'department' => $data['department']
                            ];
                        }
                        else{
                            $temp = [
                                $type   =>  $data[$type]
                            ];
                        }
                        array_push($ret, $temp);
                    }
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function loginrecord($user_id){
            $db = self::dbconn();
            $tblname = "usershistory";
            $rec_id = null;
            $user_ip = $_SERVER['REMOTE_ADDR'];
            $user_data = json_decode(self::getUserRemData($user_ip), true);
            $usershortdata = [];
            if($user_data != null){
                $usershortdata = [
                    'ip' => $user_ip,
                    'country' => $user_data['country_name'],
                    'region' => $user_data['region_name'],
                    'city' => $user_data['city']
                ];
            }
            else{
                $usershortdata = [
                    'ip' => $user_ip,
                    'country' => 'unknown',
                    'region' => 'unknown',
                    'city' => 'unknown'
                ];                
            }
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "insert into `".$tblname."` (`user_id`,`loggedin`,`ipaddr`,`country`,`region`,`city`)
                    values ('".$user_id."', NOW(), '". $usershortdata['ip']."', '". $usershortdata['country']."',
                    '". $usershortdata['region']."', '". $usershortdata['city']."')";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $mysqli->query($sql);
                    $sql = "select max(id) from `".$tblname."`";
                    $res = $mysqli->query($sql);
                    $rec_id = $res->fetch_row();
                    $res->close();
                    $mysqli->close();
                    return intval($rec_id[0]);
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getUserRemData($ip_addr){        
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://freegeoip.app/json/".$ip_addr,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    "accept: application/json",
                    "content-type: application/json"
                ),
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                return null;
            } else {
                return $response;
            }
        }

        public static function logoutrecord($rec_id){
            $db = self::dbconn();
            $tblname = "usershistory";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "update `".$tblname."` set `loggedout` =  now() where `".$tblname."`.`id` = ".$rec_id;
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

        public static function getUserHistory(){
            $db = self::dbconn();
            $tblname = "usershistory";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select `".$tblname."`.`id` as id,
                    `".$tblname."`.`loggedin` as loggedin,
                    `".$tblname."`.`loggedout` as loggedout,
                    `".$tblname."`.`ipaddr` as ipaddr,
                    `".$tblname."`.`country` as country,
                    `".$tblname."`.`region` as region,
                    `".$tblname."`.`city` as city,                                        
                    `users`.`login` as login,
                    `users`.`enctrl` as enctrl
                from `".$tblname."`
                inner join `users` on `".$tblname."`.`user_id` = `users`.`id`
                order by `".$tblname."`.`id` desc limit 500";
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